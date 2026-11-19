// backend/test_profile_routes.js

const http = require('http');
require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');
const bcrypt = require('bcrypt');

let server;
let baseUrl;

function makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, baseUrl);
        const reqOptions = {
            method,
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            headers: {
                ...headers,
            },
        };

        if (body && !headers['Content-Type']) {
            reqOptions.headers['Content-Type'] = 'application/json';
        }

        const req = http.request(reqOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                let json = null;
                try {
                    json = JSON.parse(data);
                } catch {
                    json = data;
                }
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: json,
                });
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(typeof body === 'string' ? body : JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('--- STARTING PROFILE ROUTE TESTS ---');

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    console.log(`Test server running on ${baseUrl}`);

    let passed = 0;
    let failed = 0;

    function assert(condition, testName) {
        if (condition) {
            console.log(`[PASS] ${testName}`);
            passed++;
        } else {
            console.error(`[FAIL] ${testName}`);
            failed++;
        }
    }

    try {
        // Test 1: Unauthenticated access to /api/profile/me
        const res1 = await makeRequest('GET', '/api/profile/me');
        assert(res1.status === 401, 'Unauthenticated GET /api/profile/me returns 401');

        // Test 2: Unauthenticated update to /api/profile/me
        const res2 = await makeRequest('PUT', '/api/profile/me', { bio: 'test' });
        assert(res2.status === 401, 'Unauthenticated PUT /api/profile/me returns 401');

        // Test 3: Unauthenticated password change
        const res3 = await makeRequest('PUT', '/api/profile/me/password', {
            currentPassword: 'abc',
            newPassword: '123',
        });
        assert(res3.status === 401, 'Unauthenticated PUT /api/profile/me/password returns 401');

        // Test 4: Public profile invalid user ID
        const res4 = await makeRequest('GET', '/api/profile/abc');
        assert(res4.status === 400, 'GET /api/profile/abc returns 400 invalid ID');

        // Test 5: Public profile non-existent user
        const res5 = await makeRequest('GET', '/api/profile/999999');
        assert(res5.status === 404, 'GET /api/profile/999999 returns 404 not found');

        // Test 6: Public profile for existing user 4
        const res6 = await makeRequest('GET', '/api/profile/4');
        assert(res6.status === 200, 'GET /api/profile/4 returns 200');
        assert(res6.body.profile && res6.body.profile.id === 4, 'Public profile returned user 4 data');
        assert(res6.body.profile.password === undefined, 'Public profile does NOT leak password');
        assert(res6.body.profile.email === undefined, 'Public profile does NOT leak email');
        assert(Array.isArray(res6.body.activities), 'Public profile includes activities array');
        assert(Array.isArray(res6.body.listings), 'Public profile includes listings array');
        assert(Array.isArray(res6.body.reviews), 'Public profile includes reviews array');

        // Setup test user in DB for authenticated session testing
        const testEmail = `testprofile_${Date.now()}@campus.edu`;
        const testPassword = 'Password123!';
        const hashedPw = await bcrypt.hash(testPassword, 12);

        const [userResult] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            ['Test Student', testEmail, hashedPw]
        );
        const testUserId = userResult.insertId;

        await pool.query(
            'INSERT INTO user_profiles (user_id, bio, university, course, year_of_study, interests, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                testUserId,
                'Initial bio',
                'Test University',
                'CS',
                '1st Year',
                JSON.stringify(['Coding']),
                'Campus',
            ]
        );

        // Login with test user to obtain session cookie
        const loginRes = await makeRequest('POST', '/api/auth/login', {
            email: testEmail,
            password: testPassword,
        });
        assert(loginRes.status === 200, 'Login test user succeeded');
        const rawCookie = loginRes.headers['set-cookie'];
        const cookie = Array.isArray(rawCookie) ? rawCookie[0].split(';')[0] : rawCookie.split(';')[0];
        const authHeaders = { Cookie: cookie };

        // Test 7: Authenticated GET /api/profile/me
        const meRes = await makeRequest('GET', '/api/profile/me', null, authHeaders);
        assert(meRes.status === 200, 'Authenticated GET /api/profile/me returns 200');
        assert(meRes.body.profile.name === 'Test Student', 'Profile name matches');
        assert(meRes.body.profile.email === testEmail, 'Profile email matches');
        assert(meRes.body.profile.bio === 'Initial bio', 'Profile bio matches');
        assert(Array.isArray(meRes.body.profile.interests), 'Profile interests is parsed array');

        // Test 8: Authenticated PUT /api/profile/me (update name and bio)
        const updateRes = await makeRequest(
            'PUT',
            '/api/profile/me',
            {
                name: 'Updated Student Name',
                bio: 'Updated bio information',
                course: 'M.Tech CSE',
                interests: ['Robotics', 'AI'],
            },
            authHeaders
        );
        assert(updateRes.status === 200, 'PUT /api/profile/me returns 200');
        assert(updateRes.body.profile.name === 'Updated Student Name', 'Response contains updated name');
        assert(updateRes.body.profile.bio === 'Updated bio information', 'Response contains updated bio');
        assert(updateRes.body.profile.course === 'M.Tech CSE', 'Response contains updated course');

        // Verify changes directly in MySQL
        const [dbUsers] = await pool.query('SELECT name FROM users WHERE id = ?', [testUserId]);
        assert(dbUsers[0].name === 'Updated Student Name', 'MySQL users table has updated name');

        const [dbProfiles] = await pool.query('SELECT bio, course FROM user_profiles WHERE user_id = ?', [testUserId]);
        assert(dbProfiles[0].bio === 'Updated bio information', 'MySQL user_profiles has updated bio');

        // Test 9: PUT /api/profile/me/password
        // Wrong current password
        const wrongPwRes = await makeRequest(
            'PUT',
            '/api/profile/me/password',
            {
                currentPassword: 'WrongPassword123!',
                newPassword: 'NewPassword123!',
            },
            authHeaders
        );
        assert(wrongPwRes.status === 400, 'Wrong current password rejected with 400');

        // Successful password change
        const rightPwRes = await makeRequest(
            'PUT',
            '/api/profile/me/password',
            {
                currentPassword: testPassword,
                newPassword: 'NewPassword123!',
            },
            authHeaders
        );
        assert(rightPwRes.status === 200, 'PUT /api/profile/me/password succeeds with 200');

        // Verify login with new password
        const newLoginRes = await makeRequest('POST', '/api/auth/login', {
            email: testEmail,
            password: 'NewPassword123!',
        });
        assert(newLoginRes.status === 200, 'Can log in with new password');

        // Test 10: PUT /api/profile/me/settings
        const settingsRes = await makeRequest(
            'PUT',
            '/api/profile/me/settings',
            {
                campus_visibility: false,
                notify_messages: true,
            },
            authHeaders
        );
        assert(settingsRes.status === 200, 'PUT /api/profile/me/settings returns 200');

        const [dbSettings] = await pool.query(
            'SELECT campus_visibility, notify_messages FROM user_profiles WHERE user_id = ?',
            [testUserId]
        );
        assert(dbSettings[0].campus_visibility === 0, 'Settings persisted to MySQL');

        // Test 11: Logout
        const logoutRes = await makeRequest('POST', '/api/auth/logout', null, authHeaders);
        assert(logoutRes.status === 200, 'POST /api/auth/logout returns 200');

        // Clean up test user
        await pool.query('DELETE FROM users WHERE id = ?', [testUserId]);
        console.log('Cleaned up test user.');
    } catch (err) {
        console.error('Test error:', err);
        failed++;
    } finally {
        server.close();
        console.log(`\nTESTS COMPLETE: ${passed} passed, ${failed} failed.`);
        process.exit(failed > 0 ? 1 : 0);
    }
}

runTests();
