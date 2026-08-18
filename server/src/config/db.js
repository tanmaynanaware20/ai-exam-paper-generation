import pg from 'pg';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let dbAdapter = null;
let isPostgres = false;

export async function initDb() {
  const dbUrl = process.env.DATABASE_URL;

  if (dbUrl && dbUrl.startsWith('postgres')) {
    try {
      const pool = new pg.Pool({
        connectionString: dbUrl,
        ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false }
      });
      // Test connection
      await pool.query('SELECT 1');
      console.log('⚡ Connected to PostgreSQL Database');
      isPostgres = true;

      await runPgMigrations(pool);

      dbAdapter = {
        query: async (text, params = []) => {
          const res = await pool.query(text, params);
          return { rows: res.rows, rowCount: res.rowCount };
        }
      };
      return dbAdapter;
    } catch (pgErr) {
      console.log('📦 Using Zero-Config Local Embedded Database (PostgreSQL URL not set or unreachable)');
    }
  } else {
    console.log('📦 Using Zero-Config Local Embedded Database (SQLite)');
  }

  // SQLite Fallback
  const dataDir = path.resolve('data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'exam_ai.db');
  const sqliteDb = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  console.log(`📦 Connected to Local Embedded DB (${dbPath})`);

  dbAdapter = {
    query: async (text, params = []) => {
      let sqliteText = text;
      sqliteText = sqliteText.replace(/\$(\d+)/g, () => '?');

      const isSelect = sqliteText.trim().toUpperCase().startsWith('SELECT');

      if (isSelect) {
        const rows = await sqliteDb.all(sqliteText, params);
        return { rows, rowCount: rows.length };
      } else {
        const result = await sqliteDb.run(sqliteText, params);
        return { rows: [], rowCount: result.changes, lastID: result.lastID };
      }
    }
  };

  await runSqliteMigrations(sqliteDb);
  return dbAdapter;
}

async function runPgMigrations(pool) {
  // Check if legacy 'questions' table has integer ID type
  try {
    const colRes = await pool.query(`
      SELECT data_type FROM information_schema.columns 
      WHERE table_name = 'questions' AND column_name = 'id'
    `);
    
    if (colRes.rows.length > 0 && colRes.rows[0].data_type === 'integer') {
      console.log('🔄 Converting legacy integer database tables to string ID schema...');
      await pool.query(`
        DROP TABLE IF EXISTS student_answers CASCADE;
        DROP TABLE IF EXISTS test_attempts CASCADE;
        DROP TABLE IF EXISTS evaluations CASCADE;
        DROP TABLE IF EXISTS tests CASCADE;
        DROP TABLE IF EXISTS generated_papers CASCADE;
        DROP TABLE IF EXISTS question_groups CASCADE;
        DROP TABLE IF EXISTS questions CASCADE;
        DROP TABLE IF EXISTS papers CASCADE;
        DROP TABLE IF EXISTS subjects CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
      `);
    } else {
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile_number TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS college TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS university TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS branch TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS course TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS year TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS semester TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
      `);
    }
  } catch (e) {
    console.warn('Migration check note:', e.message);
  }

  const schemaPath = path.resolve('../database/migrations/001_initial_schema.sql');
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    try {
      await pool.query(sql);
    } catch (e) {
      console.warn('PG initial schema note:', e.message);
    }
  }

  console.log('✅ PostgreSQL Schema & Types Initialized');
}

async function runSqliteMigrations(sqliteDb) {
  const schemaPath = path.resolve('../database/migrations/001_initial_schema.sql');
  if (fs.existsSync(schemaPath)) {
    let sql = fs.readFileSync(schemaPath, 'utf8');
    sql = sql
      .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'TEXT DEFAULT CURRENT_TIMESTAMP')
      .replace(/REAL DEFAULT 0/gi, 'REAL DEFAULT 0')
      .replace(/BOOLEAN DEFAULT FALSE/gi, 'INTEGER DEFAULT 0')
      .replace(/BOOLEAN DEFAULT TRUE/gi, 'INTEGER DEFAULT 1');

    await sqliteDb.exec(sql);
    console.log('✅ SQLite Schema Initialized');
  }
}

export function getDb() {
  if (!dbAdapter) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return dbAdapter;
}

export default {
  query: (text, params) => getDb().query(text, params)
};
