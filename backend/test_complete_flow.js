// backend/test_complete_flow.js

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
    console.log('====================================================');
    console.log('   CAMPUSCONNECT COMPLETE END-TO-END FLOW TESTS     ');
    console.log('====================================================\n');

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
    console.log(`Test server running at ${baseUrl}\n`);

    let passed = 0;
    let failed = 0;

    function assert(condition, testName, extra = '') {
        if (condition) {
            console.log(`[PASS] ${testName}`);
            passed++;
        } else {
            console.error(`[FAIL] ${testName} ${extra}`);
            failed++;
        }
    }

    const testTimestamp = Date.now();
    const uniqueEmail = `student_${testTimestamp}@campus.edu`;
    const userPassword = 'TestPassword123!';
    let createdUserId = null;
    let authCookie = null;

    try {
        // ==========================================
        // SECTION A: REGISTRATION TESTS
        // ==========================================
        console.log('\n--- SECTION A: REGISTRATION TESTS ---');

        // 1. Missing required fields
        const regMissing = await makeRequest('POST', '/api/auth/register', {
            name: '',
            email: uniqueEmail,
            password: userPassword,
            confirmPassword: userPassword
        });
        assert(regMissing.status === 400, 'Register with empty name returns 400');

        // 2. Mismatched passwords
        const regMismatch = await makeRequest('POST', '/api/auth/register', {
            name: 'John Doe',
            email: uniqueEmail,
            password: userPassword,
            confirmPassword: 'DifferentPassword123!'
        });
        assert(regMismatch.status === 400, 'Register with mismatched passwords returns 400');

        // 3. Invalid email format
        const regInvalidEmail = await makeRequest('POST', '/api/auth/register', {
            name: 'John Doe',
            email: 'not-an-email',
            password: userPassword,
            confirmPassword: userPassword
        });
        assert(regInvalidEmail.status === 400, 'Register with invalid email format returns 400');

        // 4. Password shorter than 8 characters
        const regShortPw = await makeRequest('POST', '/api/auth/register', {
            name: 'John Doe',
            email: uniqueEmail,
            password: 'short',
            confirmPassword: 'short'
        });
        assert(regShortPw.status === 400, 'Register with password < 8 chars returns 400');

        // 5. Successful registration
        const regSuccess = await makeRequest('POST', '/api/auth/register', {
            name: 'Priya Sharma',
            email: uniqueEmail,
            password: userPassword,
            confirmPassword: userPassword
        });
        assert(regSuccess.status === 201, 'Successful registration returns 201');
        assert(regSuccess.body.user && regSuccess.body.user.email === uniqueEmail, 'Registration response includes user object');
        
        // Check session cookie from registration (auto-authentication)
        const regSetCookie = regSuccess.headers['set-cookie'];
        assert(!!regSetCookie, 'Registration establishes session cookie for auto-login');
        if (regSetCookie) {
            authCookie = Array.isArray(regSetCookie) ? regSetCookie[0].split(';')[0] : regSetCookie.split(';')[0];
        }

        // 6. Verify user in MySQL
        const [userInDb] = await pool.query('SELECT * FROM users WHERE email = ?', [uniqueEmail]);
        assert(userInDb.length === 1, 'User record created in users table');
        createdUserId = userInDb[0].id;

        // 7. Verify password hashed with bcrypt in MySQL
        assert(userInDb[0].password !== userPassword, 'Password is not stored as plain text');
        const pwMatchBcrypt = await bcrypt.compare(userPassword, userInDb[0].password);
        assert(pwMatchBcrypt, 'Stored password is a valid bcrypt hash matching user password');

        // 8. Verify user_profiles record created in MySQL
        const [profileInDb] = await pool.query('SELECT * FROM user_profiles WHERE user_id = ?', [createdUserId]);
        assert(profileInDb.length === 1, 'Corresponding user_profiles record automatically created');

        // 9. Duplicate email registration rejected
        const regDuplicate = await makeRequest('POST', '/api/auth/register', {
            name: 'Another User',
            email: uniqueEmail,
            password: userPassword,
            confirmPassword: userPassword
        });
        assert(regDuplicate.status === 409, 'Duplicate email registration returns 409 Conflict');

        // ==========================================
        // SECTION B: LOGIN & SESSION TESTS
        // ==========================================
        console.log('\n--- SECTION B: LOGIN & SESSION TESTS ---');

        // 1. Missing credentials
        const loginEmpty = await makeRequest('POST', '/api/auth/login', {});
        assert(loginEmpty.status === 400, 'Login with missing fields returns 400');

        // 2. Unregistered email
        const loginUnregistered = await makeRequest('POST', '/api/auth/login', {
            email: 'nonexistent_student_999@campus.edu',
            password: userPassword
        });
        assert(loginUnregistered.status === 401, 'Login with unregistered email returns 401');

        // 3. Incorrect password
        const loginWrongPw = await makeRequest('POST', '/api/auth/login', {
            email: uniqueEmail,
            password: 'WrongPassword999!'
        });
        assert(loginWrongPw.status === 401, 'Login with incorrect password returns 401');

        // 4. Successful login
        const loginSuccess = await makeRequest('POST', '/api/auth/login', {
            email: uniqueEmail,
            password: userPassword
        });
        assert(loginSuccess.status === 200, 'Login with valid credentials returns 200');
        assert(loginSuccess.body.user && loginSuccess.body.user.id === createdUserId, 'Login returns correct user info');
        
        const loginSetCookie = loginSuccess.headers['set-cookie'];
        assert(!!loginSetCookie, 'Login responds with Set-Cookie header');
        authCookie = Array.isArray(loginSetCookie) ? loginSetCookie[0].split(';')[0] : loginSetCookie.split(';')[0];
        assert(authCookie.startsWith('sid='), 'Session cookie name is sid');

        const authHeaders = { Cookie: authCookie };

        // 5. Test GET /api/auth/me (Simulating page refresh / App launch auth verification)
        const meRes = await makeRequest('GET', '/api/auth/me', null, authHeaders);
        assert(meRes.status === 200, 'GET /api/auth/me with session cookie returns 200');
        assert(meRes.body.user && meRes.body.user.email === uniqueEmail, 'GET /api/auth/me returns authenticated user data');

        // 6. Test GET /api/auth/me with invalid/missing cookie
        const meUnauth = await makeRequest('GET', '/api/auth/me');
        assert(meUnauth.status === 401, 'GET /api/auth/me without session cookie returns 401 Unauthorized');

        // ==========================================
        // SECTION C: PROFILE ROUTES TESTS
        // ==========================================
        console.log('\n--- SECTION C: PROFILE ROUTES TESTS ---');

        // 1. Unauthenticated access to /api/profile/me
        const unauthProfileMe = await makeRequest('GET', '/api/profile/me');
        assert(unauthProfileMe.status === 401, 'Unauthenticated GET /api/profile/me is blocked with 401');

        // 2. Authenticated GET /api/profile/me
        const authProfileMe = await makeRequest('GET', '/api/profile/me', null, authHeaders);
        assert(authProfileMe.status === 200, 'Authenticated GET /api/profile/me returns 200');
        assert(authProfileMe.body.profile.name === 'Priya Sharma', 'Profile contains student name from users table');
        assert(authProfileMe.body.profile.email === uniqueEmail, 'Profile contains email from users table');
        assert(Array.isArray(authProfileMe.body.activities), 'Profile contains activities array');
        assert(Array.isArray(authProfileMe.body.listings), 'Profile contains listings array');
        assert(Array.isArray(authProfileMe.body.reviews), 'Profile contains reviews array');
        assert(authProfileMe.body.profile.stats !== undefined, 'Profile contains computed stats');

        // 3. Update student profile (PUT /api/profile/me)
        const updateRes = await makeRequest('PUT', '/api/profile/me', {
            name: 'Priya S. Iyer',
            university: 'Apex Institute of Technology',
            course: 'B.Tech Computer Science',
            year_of_study: '3rd Year (Semester 5/6)',
            location: 'Hostel Block B',
            bio: 'Passionate full-stack developer and campus badminton player.',
            interests: ['Robotics', 'Web Dev', 'Badminton']
        }, authHeaders);
        assert(updateRes.status === 200, 'PUT /api/profile/me returns 200');
        assert(updateRes.body.profile.name === 'Priya S. Iyer', 'Updated profile contains new name');
        assert(updateRes.body.profile.university === 'Apex Institute of Technology', 'Updated profile contains new university');
        assert(updateRes.body.profile.bio.includes('badminton'), 'Updated profile contains new bio');

        // Verify update in MySQL
        const [updatedUserDb] = await pool.query('SELECT name FROM users WHERE id = ?', [createdUserId]);
        assert(updatedUserDb[0].name === 'Priya S. Iyer', 'Student name updated in MySQL users table');

        const [updatedProfileDb] = await pool.query('SELECT university, bio FROM user_profiles WHERE user_id = ?', [createdUserId]);
        assert(updatedProfileDb[0].university === 'Apex Institute of Technology', 'Profile fields updated in MySQL user_profiles table');

        // 4. Update settings (PUT /api/profile/me/settings)
        const settingsRes = await makeRequest('PUT', '/api/profile/me/settings', {
            campus_visibility: 0,
            show_online_status: 1,
            notify_messages: 1,
            notify_errands: 0
        }, authHeaders);
        assert(settingsRes.status === 200, 'PUT /api/profile/me/settings returns 200');

        const [settingsDb] = await pool.query(
            'SELECT campus_visibility, notify_errands FROM user_profiles WHERE user_id = ?',
            [createdUserId]
        );
        assert(settingsDb[0].campus_visibility === 0 && settingsDb[0].notify_errands === 0, 'Preferences successfully saved to MySQL');

        // 5. Change Password (PUT /api/profile/me/password)
        const newPassword = 'NewSecretPassword456!';
        
        // Test wrong current password
        const wrongPwChange = await makeRequest('PUT', '/api/profile/me/password', {
            currentPassword: 'IncorrectPassword!',
            newPassword: newPassword
        }, authHeaders);
        assert(wrongPwChange.status === 400, 'Password change with wrong current password returns 400');

        // Test valid password change
        const validPwChange = await makeRequest('PUT', '/api/profile/me/password', {
            currentPassword: userPassword,
            newPassword: newPassword
        }, authHeaders);
        assert(validPwChange.status === 200, 'Password change with correct current password returns 200');

        // Verify login with new password works
        const loginNewPw = await makeRequest('POST', '/api/auth/login', {
            email: uniqueEmail,
            password: newPassword
        });
        assert(loginNewPw.status === 200, 'Login succeeds with newly changed password');

        // 6. Public Profile (GET /api/profile/:userId)
        // Invalid ID
        const pubInvalid = await makeRequest('GET', '/api/profile/invalid_id');
        assert(pubInvalid.status === 400, 'GET /api/profile/invalid_id returns 400');

        // Non-existent ID
        const pubNotFound = await makeRequest('GET', '/api/profile/888888');
        assert(pubNotFound.status === 404, 'GET /api/profile/888888 returns 404');

        // Real public profile for our created student
        const pubValid = await makeRequest('GET', `/api/profile/${createdUserId}`);
        assert(pubValid.status === 200, 'GET /api/profile/:userId returns 200 for valid student');
        assert(pubValid.body.profile.name === 'Priya S. Iyer', 'Public profile shows correct student name');
        assert(pubValid.body.profile.password === undefined, 'Public profile strictly hides password');
        assert(pubValid.body.profile.email === undefined, 'Public profile strictly hides email');
        assert(pubValid.body.profile.google_id === undefined, 'Public profile strictly hides google_id');
        assert(Array.isArray(pubValid.body.activities), 'Public profile includes public activities');

        // ==========================================
        // SECTION D: LOGOUT & POST-LOGOUT ROUTE PROTECTION
        // ==========================================
        console.log('\n--- SECTION D: LOGOUT & ROUTE PROTECTION ---');

        const logoutRes = await makeRequest('POST', '/api/auth/logout', null, authHeaders);
        assert(logoutRes.status === 200, 'POST /api/auth/logout returns 200');

        const logoutSetCookie = logoutRes.headers['set-cookie'];
        assert(!!logoutSetCookie, 'Logout response clears session cookie');

        // Verification: Requests with previous cookie are now rejected
        const postLogoutMe = await makeRequest('GET', '/api/auth/me', null, authHeaders);
        assert(postLogoutMe.status === 401, 'After logout, GET /api/auth/me returns 401 Unauthorized');

        const postLogoutProfile = await makeRequest('GET', '/api/profile/me', null, authHeaders);
        assert(postLogoutProfile.status === 401, 'After logout, GET /api/profile/me returns 401 Unauthorized');

        // Clean up created student from DB
        await pool.query('DELETE FROM users WHERE id = ?', [createdUserId]);
        console.log('\nCleaned up test student record.');

    } catch (err) {
        console.error('Test execution error:', err);
        failed++;
    } finally {
        server.close();
        console.log('\n====================================================');
        console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
        console.log('====================================================\n');
        process.exit(failed > 0 ? 1 : 0);
    }
}

runTests();
