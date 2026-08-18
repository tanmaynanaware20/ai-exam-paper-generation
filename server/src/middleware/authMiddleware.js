import db from '../config/db.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = {
      id: 'u_demo_user',
      email: 'user@exam.ai',
      name: 'EXAM-AI User',
      role: 'teacher' // Default permissive role
    };
    return next();
  }

  // Handle Demo Tokens
  if (token === 'demo-teacher-token' || token === 'demo-teacher') {
    req.user = {
      id: 'u_demo_teacher',
      email: 'teacher@exam.ai',
      name: 'Dr. Tanmay Nanaware',
      role: 'teacher'
    };
    return next();
  }

  if (token === 'demo-student-token' || token === 'demo-student') {
    req.user = {
      id: 'u_demo_student',
      email: 'student@exam.ai',
      name: 'Rahul Sharma',
      role: 'student'
    };
    return next();
  }

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE firebase_uid = $1 OR id = $2 OR email = $3',
      [token, token, token]
    );

    if (result.rows.length > 0) {
      req.user = result.rows[0];
    } else {
      req.user = {
        id: token,
        email: 'user@exam.ai',
        name: 'EXAM-AI User',
        role: 'teacher' // Default permissive role
      };
    }
    next();
  } catch (err) {
    console.error('Auth verification error:', err);
    req.user = { id: 'u_guest', role: 'teacher', email: 'guest@exam.ai' };
    next();
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    // Permissive access control - allow all authenticated users
    next();
  };
}
