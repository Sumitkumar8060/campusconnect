// backend/test_companions_flow.js
// Comprehensive test for all Companions API endpoints
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./src/config/db');
const app = require('./src/app');
const http = require('http');

const PORT = 3099;
let server;
let cookie = '';

// Two test users
const USER_A = { email: `testa_${Date.now()}@test.com`, password: 'Test1234!', name: 'Test Host' };
const USER_B = { email: `testb_${Date.now()}@test.com`, password: 'Test1234!', name: 'Test Joiner' };

let userAId, userBId;
let activityId;
let requestId;

// ─── HTTP helper ──────────────────────────────────────────────────────────────
function req(method, urlPath, body = null, useCookie = '') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path: urlPath,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(useCookie ? { Cookie: useCookie } : {}),
      },
    };
    const r = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const setCookie = res.headers['set-cookie'];
        let parsedCookie = useCookie;
        if (setCookie) {
          const sid = setCookie.find((c) => c.startsWith('sid='));
          if (sid) parsedCookie = sid.split(';')[0];
        }
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), cookie: parsedCookie });
        } catch {
          resolve({ status: res.statusCode, body: data, cookie: parsedCookie });
        }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

// ─── Test runner ──────────────────────────────────────────────────────────────
let passed = 0, failed = 0, total = 0;
function assert(label, condition, detail = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.log(`  ❌ ${label}${detail ? ' — ' + detail : ''}`);
  }
}

async function run() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  COMPANIONS FEATURE — FULL API TEST SUITE');
  console.log('═══════════════════════════════════════════════════════\n');

  // Start server
  server = http.createServer(app);
  await new Promise((r) => server.listen(PORT, r));
  console.log(`Test server on port ${PORT}\n`);

  // ── 1. Register User A (host) ──
  console.log('── Register & Login ──');
  let res = await req('POST', '/api/auth/register', {
    name: USER_A.name,
    email: USER_A.email,
    password: USER_A.password,
    confirmPassword: USER_A.password,
  });
  assert('Register User A', res.status === 201 || res.status === 200, `status=${res.status} ${JSON.stringify(res.body)}`);

  // Login User A
  res = await req('POST', '/api/auth/login', {
    email: USER_A.email,
    password: USER_A.password,
  });
  const cookieA = res.cookie;
  assert('Login User A', res.status === 200 && cookieA, `status=${res.status}`);
  userAId = res.body?.user?.id;

  // Register & login User B
  res = await req('POST', '/api/auth/register', {
    name: USER_B.name,
    email: USER_B.email,
    password: USER_B.password,
    confirmPassword: USER_B.password,
  });
  assert('Register User B', res.status === 201 || res.status === 200, `status=${res.status}`);

  res = await req('POST', '/api/auth/login', {
    email: USER_B.email,
    password: USER_B.password,
  });
  const cookieB = res.cookie;
  assert('Login User B', res.status === 200 && cookieB, `status=${res.status}`);
  userBId = res.body?.user?.id;

  // ── 2. Create Activity (User A) ──
  console.log('\n── Create Activity ──');
  res = await req('POST', '/api/companions', {
    title: 'Test Food Run',
    description: 'Going out for lunch near campus',
    category: 'Food & Dining',
    date: '2026-12-25',
    time: '12:30',
    location: 'Campus Gate 1',
    maxParticipants: 4,
    requirements: 'Split the bill',
  }, cookieA);
  assert('Create activity returns 201', res.status === 201, `status=${res.status}`);
  assert('Activity has correct title', res.body?.activity?.title === 'Test Food Run');
  assert('Activity status is Open', res.body?.activity?.status === 'Open');
  assert('Host counts as 1 participant', res.body?.activity?.currentParticipants === 1);
  assert('Available slots = total - 1', res.body?.activity?.availableSlots === 3);
  activityId = res.body?.activity?.id;

  // ── 3. Create without auth (should fail) ──
  console.log('\n── Authorization Checks ──');
  res = await req('POST', '/api/companions', {
    title: 'No Auth', description: 'x', category: 'Other',
    date: '2026-12-25', time: '10:00', location: 'x', maxParticipants: 2,
  });
  assert('Create without auth returns 401', res.status === 401);

  // ── 4. Fetch all activities ──
  console.log('\n── List Activities ──');
  res = await req('GET', '/api/companions', null, cookieB);
  assert('GET /companions returns activities array', Array.isArray(res.body?.activities));
  const found = res.body?.activities?.find((a) => a.id === activityId);
  assert('Created activity appears in list', !!found);
  assert('Activity has host info', !!found?.host?.name);

  // ── 5. Fetch with category filter ──
  res = await req('GET', '/api/companions?category=Food%20%26%20Dining', null, cookieB);
  assert('Category filter works', res.body?.activities?.some((a) => a.id === activityId));

  res = await req('GET', '/api/companions?category=Sports', null, cookieB);
  assert('Category filter excludes wrong category', !res.body?.activities?.some((a) => a.id === activityId));

  // ── 6. Fetch with search filter ──
  res = await req('GET', '/api/companions?search=Food%20Run', null, cookieB);
  assert('Search filter finds activity', res.body?.activities?.some((a) => a.id === activityId));

  // ── 7. Fetch single activity ──
  console.log('\n── Activity Detail ──');
  res = await req('GET', `/api/companions/${activityId}`, null, cookieB);
  assert('GET /companions/:id returns activity', res.body?.success && res.body?.activity?.id === activityId);
  assert('Has participants array with host', res.body?.activity?.participants?.length >= 1);
  assert('User B has not requested yet', !res.body?.activity?.hasRequested);

  // ── 8. Host cannot join own activity ──
  console.log('\n── Join Request Logic ──');
  res = await req('POST', `/api/companions/${activityId}/request`, { note: 'self join' }, cookieA);
  assert('Host cannot join own activity', res.status === 400);

  // ── 9. User B sends join request ──
  res = await req('POST', `/api/companions/${activityId}/request`, { note: 'Want to join!' }, cookieB);
  assert('User B join request succeeds', res.status === 201 && res.body?.success);
  requestId = res.body?.requestId;

  // ── 10. Duplicate request blocked ──
  res = await req('POST', `/api/companions/${activityId}/request`, { note: 'Dup' }, cookieB);
  assert('Duplicate active request blocked', res.status === 400);

  // ── 11. User B sees request on detail page ──
  res = await req('GET', `/api/companions/${activityId}`, null, cookieB);
  assert('Detail shows hasRequested for User B', res.body?.activity?.hasRequested === true);
  assert('Detail shows Pending status', res.body?.activity?.userRequestStatus === 'Pending');

  // ── 12. My Activities shows incoming for host ──
  console.log('\n── My Activities ──');
  res = await req('GET', '/api/companions/my', null, cookieA);
  assert('Host sees created activity', res.body?.created?.some((a) => a.id === activityId));
  assert('Host sees incoming request', res.body?.incoming?.some((r) => r.activityId === activityId));
  const incomingReq = res.body?.incoming?.find((r) => r.activityId === activityId);
  assert('Incoming request is Pending', incomingReq?.status === 'Pending');

  // User B sees outgoing
  res = await req('GET', '/api/companions/my', null, cookieB);
  assert('Joiner sees outgoing request', res.body?.outgoing?.some((r) => r.activityId === activityId));

  // ── 13. Host accepts request ──
  console.log('\n── Accept / Reject ──');
  res = await req('PATCH', `/api/companions/request/${requestId}`, { action: 'accepted' }, cookieA);
  assert('Host accepts request', res.status === 200 && res.body?.success);

  // Check slots decreased
  res = await req('GET', `/api/companions/${activityId}`, null, cookieA);
  assert('Available slots decreased after accept', res.body?.activity?.availableSlots === 2);
  assert('Participant count increased', res.body?.activity?.currentParticipants === 2);
  assert('Accepted user appears in participants', res.body?.activity?.participants?.length === 2);

  // ── 14. User B leaves (cancel accepted request) ──
  console.log('\n── Leave Activity ──');
  res = await req('DELETE', `/api/companions/request/${requestId}`, null, cookieB);
  assert('User B leaves activity (cancels accepted request)', res.status === 200 && res.body?.success);

  // Check slots restored
  res = await req('GET', `/api/companions/${activityId}`, null, cookieA);
  assert('Slot restored after leave', res.body?.activity?.availableSlots === 3);
  assert('Participant count back to 1', res.body?.activity?.currentParticipants === 1);

  // ── 15. User B re-joins ──
  console.log('\n── Re-join after leaving ──');
  res = await req('POST', `/api/companions/${activityId}/request`, { note: 'Rejoining' }, cookieB);
  assert('User B can re-join after leaving', res.status === 201 && res.body?.success);
  const newRequestId = res.body?.requestId;

  // ── 16. Host rejects this time ──
  res = await req('PATCH', `/api/companions/request/${newRequestId}`, { action: 'rejected' }, cookieA);
  assert('Host rejects request', res.status === 200 && res.body?.success);

  // Slots should not change on rejection
  res = await req('GET', `/api/companions/${activityId}`, null, cookieA);
  assert('Slots unchanged after rejection', res.body?.activity?.availableSlots === 3);

  // ── 17. Cancel Activity ──
  console.log('\n── Cancel Activity ──');
  // User B should not be able to cancel
  res = await req('PATCH', `/api/companions/${activityId}/cancel`, null, cookieB);
  assert('Non-host cannot cancel activity', res.status === 403);

  // Host cancels
  res = await req('PATCH', `/api/companions/${activityId}/cancel`, null, cookieA);
  assert('Host cancels activity', res.status === 200 && res.body?.success);

  // Verify status
  res = await req('GET', `/api/companions/${activityId}`, null, cookieA);
  assert('Activity status is Cancelled', res.body?.activity?.status === 'Cancelled');

  // ── 18. Cannot join cancelled activity ──
  res = await req('POST', `/api/companions/${activityId}/request`, { note: 'too late' }, cookieB);
  assert('Cannot join cancelled activity', res.status === 400);

  // ── 19. Slot capacity full scenario ──
  console.log('\n── Full Capacity Test ──');
  // Create a 2-person activity (host + 1 slot)
  res = await req('POST', '/api/companions', {
    title: 'Tight activity', description: 'Only 2 spots', category: 'Study',
    date: '2026-12-30', time: '14:00', location: 'Library', maxParticipants: 2,
  }, cookieA);
  const tightId = res.body?.activity?.id;
  assert('Created 2-person activity', !!tightId && res.body?.activity?.availableSlots === 1);

  // User B requests and gets accepted
  res = await req('POST', `/api/companions/${tightId}/request`, { note: 'fill it' }, cookieB);
  const fillReqId = res.body?.requestId;
  res = await req('PATCH', `/api/companions/request/${fillReqId}`, { action: 'accepted' }, cookieA);
  assert('Accept fills last slot', res.status === 200);

  res = await req('GET', `/api/companions/${tightId}`, null, cookieA);
  assert('Activity status becomes Full', res.body?.activity?.status === 'Full');
  assert('Available slots = 0', res.body?.activity?.availableSlots === 0);

  // ── 20. Slot filter ──
  console.log('\n── Slot Filter ──');
  res = await req('GET', '/api/companions?slotFilter=open', null, cookieA);
  assert('Slot filter excludes full activities', !res.body?.activities?.some((a) => a.id === tightId));

  // ═════════ CLEANUP ═════════
  console.log('\n── Cleanup ──');
  await pool.query('DELETE FROM activity_requests WHERE requester_id IN (?, ?)', [userAId, userBId]);
  await pool.query('DELETE FROM activities WHERE host_id IN (?, ?)', [userAId, userBId]);
  await pool.query('DELETE FROM user_profiles WHERE user_id IN (?, ?)', [userAId, userBId]);
  await pool.query('DELETE FROM users WHERE id IN (?, ?)', [userAId, userBId]);
  console.log('  Cleaned up test data.\n');

  // ═════════ RESULTS ═════════
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  RESULTS: ${passed}/${total} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════════\n');

  server.close();
  await pool.end();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Test suite crashed:', err);
  if (server) server.close();
  pool.end();
  process.exit(1);
});
