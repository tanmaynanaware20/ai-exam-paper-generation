import db from '../config/db.js';

export async function registerUser(req, res) {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      passkey,
      course = 'B.E.',
      branch = 'Computer Engineering',
      year = 'BE - Final Year',
      college = 'COEP Technological University',
      university = 'SPPU',
      mobile_number = '',
      avatar_url = ''
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRole = (role === 'teacher' || role === 'admin') ? 'teacher' : 'student';

    // Teacher Secret Passkey Requirement
    if (userRole === 'teacher') {
      const validPasskeys = ['TEACHER2026', 'TEACHER123', 'EXAMAI2026', 'ADMIN', 'TEACHER'];
      if (!passkey || !validPasskeys.includes(passkey.trim().toUpperCase())) {
        return res.status(403).json({
          error: 'Invalid Teacher Passkey. Please enter the valid secret key (Hint: TEACHER2026) to register as a Teacher.'
        });
      }
    }

    // Check if user already exists
    const check = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists. Please login instead.' });
    }

    const id = 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    await db.query(
      `INSERT INTO users (id, firebase_uid, name, email, password_hash, mobile_number, college, university, branch, course, year, role, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        id,
        id,
        name || 'User',
        email.toLowerCase().trim(),
        password,
        mobile_number,
        college,
        university,
        branch,
        course,
        year,
        userRole,
        avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`
      ]
    );

    const newUserRes = await db.query('SELECT id, name, email, role, course, branch, year, college, university, avatar_url, created_at FROM users WHERE id = $1', [id]);
    const user = newUserRes.rows[0];

    res.status(201).json({
      message: 'Registration successful!',
      token: id,
      user
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password, token } = req.body;

    // Handle Demo Shortcuts
    if (email === 'teacher@exam.ai' || token === 'demo-teacher') {
      return res.json({
        token: 'demo-teacher-token',
        user: {
          id: 'u_demo_teacher',
          name: 'Dr. Tanmay Nanaware',
          email: 'teacher@exam.ai',
          role: 'teacher',
          course: 'M.E.',
          branch: 'Computer Engineering',
          college: 'COEP Technological University',
          university: 'SPPU',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherTanmay'
        }
      });
    }

    if (email === 'student@exam.ai' || token === 'demo-student') {
      return res.json({
        token: 'demo-student-token',
        user: {
          id: 'u_demo_student',
          name: 'Rahul Sharma',
          email: 'student@exam.ai',
          role: 'student',
          course: 'B.E.',
          branch: 'Computer Engineering',
          year: 'TE - Third Year',
          college: 'COEP Technological University',
          university: 'SPPU',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StudentRahul'
        }
      });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Account not found. Please sign up first.' });
    }

    const user = result.rows[0];

    // Verify Password if provided
    if (password && user.password_hash && password !== user.password_hash) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    res.json({
      token: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course || 'B.E.',
        branch: user.branch || 'Computer Engineering',
        year: user.year || 'BE - Final Year',
        college: user.college,
        university: user.university,
        avatar_url: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCurrentUser(req, res) {
  res.json({ user: req.user });
}

export async function updateProfile(req, res) {
  try {
    const { name, mobile_number, college, university, branch, course, year, avatar_url } = req.body;
    const userId = req.user ? req.user.id : 'u_demo_user';

    await db.query(
      `UPDATE users SET name=$1, mobile_number=$2, college=$3, university=$4, branch=$5, course=$6, year=$7, avatar_url=$8 WHERE id=$9`,
      [name, mobile_number, college, university, branch, course, year, avatar_url, userId]
    );

    const updated = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    res.json({ message: 'Profile updated successfully', user: updated.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getUserProfileActivity(req, res) {
  try {
    const userId = req.user ? req.user.id : 'u_demo_student';

    // 1. Fetch User Info
    const userRes = await db.query('SELECT * FROM users WHERE id = $1 OR email = $2', [userId, req.user?.email || 'student@exam.ai']);
    const user = userRes.rows[0] || req.user || {
      id: 'u_demo_student',
      name: 'Rahul Sharma',
      email: 'student@exam.ai',
      role: 'student',
      course: 'B.E.',
      branch: 'Computer Engineering',
      year: 'TE - Third Year',
      college: 'COEP Technological University'
    };

    // 2. Fetch Test Attempts & History
    const attemptsRes = await db.query(
      `SELECT ta.*, t.title as test_title, s.title as subject_title 
       FROM test_attempts ta
       LEFT JOIN tests t ON ta.test_id = t.id
       LEFT JOIN subjects s ON t.subject_id = s.id
       WHERE ta.student_id = $1 OR ta.student_name = $2
       ORDER BY ta.submitted_at DESC`,
      [userId, user.name]
    );

    // 3. Fetch Created Generated Papers & Subjects
    const subjectsRes = await db.query('SELECT * FROM subjects ORDER BY created_at DESC');
    const generatedPapersRes = await db.query('SELECT * FROM generated_papers ORDER BY created_at DESC LIMIT 5');

    res.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course || 'B.E.',
        branch: user.branch || 'Computer Engineering',
        year: user.year || 'TE - Third Year',
        college: user.college || 'COEP Technological University',
        university: user.university || 'SPPU',
        avatar_url: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
      },
      testHistory: attemptsRes.rows.map(att => ({
        id: att.id,
        testCode: att.test_code,
        testTitle: att.test_title || 'Engineering Assessment',
        subjectTitle: att.subject_title || 'Computer Engineering',
        score: att.score,
        totalMarks: att.total_marks,
        percentage: att.percentage,
        status: att.status,
        date: att.submitted_at || att.started_at
      })),
      studyHistory: {
        subjects: subjectsRes.rows,
        generatedPapersCount: generatedPapersRes.rows.length,
        recentGeneratedPapers: generatedPapersRes.rows
      }
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
}
