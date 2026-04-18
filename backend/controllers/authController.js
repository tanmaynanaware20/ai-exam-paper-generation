import db from '../db.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    await db.query(
      'INSERT INTO users(name,email,password) VALUES($1,$2,$3)',
      [name, email, password]
    );

    res.json({
      message: 'Signup successful'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      'SELECT * FROM users WHERE email=$1 AND password=$2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid credentials'
      });
    }

    res.json({
      message: 'Login successful',
      user: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    await db.query(
      'UPDATE users SET password=$1 WHERE email=$2',
      [password, email]
    );

    res.json({
      message: 'Password updated'
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};