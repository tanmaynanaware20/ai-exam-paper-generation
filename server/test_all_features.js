import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
let authToken = 'demo-teacher-token';
let createdTestCode = 'CC2026A01';
let createdSubjectId = 'sub_demo_cloud';

async function runAllTests() {
  console.log('🚀 STARTING COMPREHENSIVE END-TO-END TEST SUITE FOR EXAM-AI...\n');

  let passed = 0;
  let failed = 0;

  async function testCase(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}:`, err.response?.data?.error || err.message);
      failed++;
    }
  }

  // 1. Health Check
  await testCase('Backend Server Health Check', async () => {
    const res = await axios.get(`${API_BASE}/health`);
    if (res.data.status !== 'online') throw new Error('Health check failed');
  });

  // 2. Auth & Passkey Validation
  await testCase('Teacher Registration with Invalid Passkey (Must Reject 403)', async () => {
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        name: 'Unverified Teacher',
        email: 'invalid_teacher@exam.ai',
        password: 'pass',
        role: 'teacher',
        passkey: 'WRONGKEY'
      });
      throw new Error('Should have rejected invalid passkey');
    } catch (e) {
      if (e.response?.status !== 403) throw e;
    }
  });

  await testCase('Teacher Registration with Valid Secret Passkey (TEACHER2026)', async () => {
    const testEmail = `prof_${Date.now()}@exam.ai`;
    const res = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Prof. Aniket Joshi',
      email: testEmail,
      password: 'password123',
      role: 'teacher',
      passkey: 'TEACHER2026',
      course: 'M.E.',
      branch: 'Computer Engineering',
      year: 'Faculty / Professor'
    });
    if (!res.data.token) throw new Error('No token returned');
    authToken = res.data.token;
  });

  await testCase('Student Registration (Email + Course + Branch)', async () => {
    const testEmail = `stud_${Date.now()}@exam.ai`;
    const res = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Priya Sharma',
      email: testEmail,
      password: 'password123',
      role: 'student',
      course: 'B.E.',
      branch: 'Computer Engineering',
      year: 'TE - Third Year'
    });
    if (!res.data.token) throw new Error('Student token missing');
  });

  await testCase('User Profile Activity API (/api/auth/profile/activity)', async () => {
    const res = await axios.get(`${API_BASE}/auth/profile/activity`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.data.profile) throw new Error('Profile details missing');
  });

  // 3. Subject Libraries
  await testCase('Fetch All Subjects (/api/subjects)', async () => {
    const res = await axios.get(`${API_BASE}/subjects`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!Array.isArray(res.data.subjects)) throw new Error('Subjects array missing');
    if (res.data.subjects.length > 0) createdSubjectId = res.data.subjects[0].id;
  });

  await testCase('Create Custom Subject (/api/subjects)', async () => {
    const res = await axios.post(`${API_BASE}/subjects`, {
      title: 'Artificial Intelligence & Neural Networks',
      code: 'AI-501'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.data.subject) throw new Error('Subject creation failed');
  });

  // 4. PYQ Question Intelligence
  await testCase('Fetch PYQ Intelligence & Frequency Clustering (/api/analysis/:subjectId)', async () => {
    const res = await axios.get(`${API_BASE}/analysis/${createdSubjectId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.data.groupedQuestions) throw new Error('Grouped questions missing');
    // Ensure no 2026 in years
    const has2026 = res.data.groupedQuestions.some(g => (g.years || []).includes(2026));
    if (has2026) throw new Error('Year 2026 detected in historical paper appearance list');
  });

  // 5. Paper Generator
  await testCase('Generate 30-Mark Model Question Paper with OpenRouter AI', async () => {
    const res = await axios.post(`${API_BASE}/papers-gen/generate`, {
      subjectId: createdSubjectId,
      subjectTitle: 'Cloud Computing & Distributed Systems',
      totalMarks: 30,
      difficulty: 'Same as PYQs',
      selectedUnits: [1, 2, 3, 4],
      pattern: 'Standard University'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.data.paper) throw new Error('Paper generation output missing');
    if (res.data.paper.calculatedTotalMarks !== 30) throw new Error(`Marks sum error: calculated ${res.data.paper.calculatedTotalMarks} instead of 30`);
  });

  // 6. Online Test Engine
  await testCase('Fetch Online Test by Code (/api/tests/code/CC2026A01)', async () => {
    const res = await axios.get(`${API_BASE}/tests/code/${createdTestCode}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.data.test_code) throw new Error('Test not found by code');
  });

  await testCase('Submit Student Answer & Run OpenRouter AI Evaluation', async () => {
    const res = await axios.post(`${API_BASE}/tests/submit`, {
      testCode: createdTestCode,
      answers: {
        'Q1_a': 'Virtualization is a technology that allows creating multiple simulated environments or dedicated resources from a single physical hardware system using a hypervisor.',
        'Q1_b': 'IaaS provides raw infrastructure like virtual machines and storage. PaaS provides platform environments for developers to build apps. SaaS delivers full software applications over web.'
      }
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.data.attemptId) throw new Error('Attempt submission failed');
    if (typeof res.data.score !== 'number') throw new Error('Score evaluation failed');
  });

  // 7. Results & Analytics
  await testCase('Teacher Analytics (/api/analytics/teacher)', async () => {
    const res = await axios.get(`${API_BASE}/analytics/teacher`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.data.stats) throw new Error('Teacher stats missing');
  });

  await testCase('Student Analytics (/api/analytics/student)', async () => {
    const res = await axios.get(`${API_BASE}/analytics/student`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.data.stats) throw new Error('Student stats missing');
  });

  await testCase('AI Study Assistant Question Answering', async () => {
    const res = await axios.post(`${API_BASE}/analytics/ai-assistant`, {
      prompt: 'Explain Type 1 vs Type 2 hypervisors for exam revision',
      subjectTitle: 'Cloud Computing'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (!res.data.answer) throw new Error('AI Assistant response missing');
  });

  console.log(`\n==================================================`);
  console.log(`📊 FINAL TEST RESULT SUMMARY:`);
  console.log(`   TOTAL PASSED : ${passed}`);
  console.log(`   TOTAL FAILED : ${failed}`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
