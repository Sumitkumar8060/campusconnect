// backend/src/controllers/companionsController.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const pool = require('../config/db');

// ─── Category image defaults ───────────────────────────────────────────────────
const CATEGORY_IMAGES = {
  'Food & Dining':
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  Shopping:
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  Movies:
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
  Gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  Sports:
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
  Study:
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  'Travel & Outings':
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
  Other:
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
};

// ─── Helper: format DB row → frontend shape ───────────────────────────────────
function formatActivity(row, currentUserId = null, userRequestRow = null) {
  const totalSlots = row.total_slots || 4;
  // available_slots is maintained by DB; currentParticipants = accepted requests
  const acceptedCount = Number(row.accepted_count || 0);
  const currentParticipants = 1 + acceptedCount; // host + accepted members
  const availableSlots = row.available_slots != null ? Number(row.available_slots) : totalSlots - 1;

  const statusMap = { open: 'Open', full: 'Full', cancelled: 'Cancelled', completed: 'Completed' };
  const status = statusMap[row.status] || 'Open';

  const host = {
    id: row.host_id,
    name: row.host_name || 'Unknown',
    avatar:
      row.host_avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(row.host_name || 'U')}&background=171717&color=fff`,
    course: row.host_course || 'Student',
    verified: true,
  };

  const isCreatedByMe = currentUserId != null && row.host_id === currentUserId;

  let hasRequested = false;
  let userRequestStatus = null;
  if (userRequestRow) {
    hasRequested = true;
    const reqStatusMap = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      cancelled: 'Cancelled',
    };
    userRequestStatus = reqStatusMap[userRequestRow.status] || userRequestRow.status;
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    category: row.category || 'Other',
    date: row.activity_date
      ? new Date(row.activity_date).toISOString().split('T')[0]
      : row.date || '',
    time: row.activity_time || '',
    location: row.location || '',
    maxParticipants: totalSlots,
    currentParticipants,
    availableSlots,
    status,
    requirements: row.requirements || 'No specific requirements.',
    image: row.image || CATEGORY_IMAGES[row.category] || CATEGORY_IMAGES['Other'],
    host,
    participants: [], // populated separately for detail view
    isCreatedByMe,
    hasRequested,
    userRequestStatus,
    createdAt: row.created_at,
  };
}

// ─── GET /api/companions ──────────────────────────────────────────────────────
// Query params: category, search, slotFilter (all|open), sortBy (upcoming|newest)
exports.getActivities = async (req, res) => {
  try {
    const userId = req.session?.user?.id || null;
    const { category, search, slotFilter, sortBy } = req.query;

    let sql = `
      SELECT
        a.*,
        u.name AS host_name,
        up.profile_picture AS host_avatar,
        up.course AS host_course,
        (
          SELECT COUNT(*) FROM activity_requests ar
          WHERE ar.activity_id = a.id AND ar.status = 'accepted'
        ) AS accepted_count
        ${
          userId
            ? `, (
          SELECT JSON_OBJECT('status', ar2.status, 'id', ar2.id)
          FROM activity_requests ar2
          WHERE ar2.activity_id = a.id AND ar2.requester_id = ? AND ar2.status != 'cancelled'
          LIMIT 1
        ) AS user_request`
            : ", NULL AS user_request"
        }
      FROM activities a
      JOIN users u ON u.id = a.host_id
      LEFT JOIN user_profiles up ON up.user_id = a.host_id
      WHERE a.status IN ('open','full')
    `;

    const params = userId ? [userId] : [];

    if (category && category !== 'All Activities') {
      sql += ` AND a.category = ?`;
      params.push(category);
    }

    if (search && search.trim()) {
      sql += ` AND (a.title LIKE ? OR a.description LIKE ? OR a.location LIKE ? OR u.name LIKE ?)`;
      const q = `%${search.trim()}%`;
      params.push(q, q, q, q);
    }

    if (slotFilter === 'open') {
      sql += ` AND a.available_slots > 0 AND a.status = 'open'`;
    }

    if (sortBy === 'newest') {
      sql += ` ORDER BY a.created_at DESC`;
    } else {
      sql += ` ORDER BY a.activity_date ASC, a.created_at DESC`;
    }

    const [rows] = await pool.query(sql, params);

    const activities = rows.map((row) => {
      let userRequestRow = null;
      if (row.user_request) {
        try {
          userRequestRow =
            typeof row.user_request === 'string'
              ? JSON.parse(row.user_request)
              : row.user_request;
        } catch (_) {}
      }
      return formatActivity(row, userId, userRequestRow);
    });

    return res.json({ success: true, activities });
  } catch (err) {
    console.error('getActivities error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch activities.' });
  }
};

// ─── GET /api/companions/:id ──────────────────────────────────────────────────
exports.getActivityById = async (req, res) => {
  try {
    const userId = req.session?.user?.id || null;
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        a.*,
        u.name AS host_name,
        up.profile_picture AS host_avatar,
        up.course AS host_course,
        (
          SELECT COUNT(*) FROM activity_requests ar
          WHERE ar.activity_id = a.id AND ar.status = 'accepted'
        ) AS accepted_count
      FROM activities a
      JOIN users u ON u.id = a.host_id
      LEFT JOIN user_profiles up ON up.user_id = a.host_id
      WHERE a.id = ?
    `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }

    const row = rows[0];

    // Fetch user's own request if logged in
    let userRequestRow = null;
    if (userId) {
      const [reqRows] = await pool.query(
        `SELECT id, status FROM activity_requests WHERE activity_id = ? AND requester_id = ? AND status != 'cancelled' LIMIT 1`,
        [id, userId]
      );
      if (reqRows.length) userRequestRow = reqRows[0];
    }

    const activity = formatActivity(row, userId, userRequestRow);

    // Fetch confirmed participants (host + accepted requesters)
    const [accepted] = await pool.query(
      `
      SELECT u.name, up.profile_picture AS avatar, up.course, 'Member' AS role
      FROM activity_requests ar
      JOIN users u ON u.id = ar.requester_id
      LEFT JOIN user_profiles up ON up.user_id = ar.requester_id
      WHERE ar.activity_id = ? AND ar.status = 'accepted'
    `,
      [id]
    );

    // Build participants: host first, then accepted members
    activity.participants = [
      {
        id: row.host_id,
        name: row.host_name,
        avatar:
          row.host_avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(row.host_name || 'H')}&background=171717&color=fff`,
        role: 'Host',
      },
      ...accepted.map((p) => ({
        name: p.name,
        avatar:
          p.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'U')}&background=555555&color=fff`,
        role: 'Member',
      })),
    ];

    return res.json({ success: true, activity });
  } catch (err) {
    console.error('getActivityById error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch activity.' });
  }
};

// ─── POST /api/companions ─────────────────────────────────────────────────────
exports.createActivity = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { title, description, category, date, time, location, maxParticipants, requirements } =
      req.body;

    // Validation
    if (!title || !description || !category || !date || !time || !location || !maxParticipants) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }
    const totalSlots = Number(maxParticipants);
    if (isNaN(totalSlots) || totalSlots < 2) {
      return res
        .status(400)
        .json({ success: false, message: 'Total capacity must be at least 2.' });
    }

    const availableSlots = totalSlots - 1; // host occupies 1 slot
    const image = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Other'];

    const [result] = await pool.query(
      `INSERT INTO activities
        (host_id, user_id, title, description, category, activity_date, activity_time, location,
         total_slots, available_slots, requirements, image, status, companions_count, date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, NOW(), NOW())`,
      [
        userId,
        userId,
        title,
        description,
        category,
        date,
        time,
        location,
        totalSlots,
        availableSlots,
        requirements || null,
        image,
        availableSlots,
        date,
      ]
    );

    const [newRows] = await pool.query(
      `
      SELECT a.*, u.name AS host_name, up.profile_picture AS host_avatar, up.course AS host_course,
             0 AS accepted_count
      FROM activities a
      JOIN users u ON u.id = a.host_id
      LEFT JOIN user_profiles up ON up.user_id = a.host_id
      WHERE a.id = ?
    `,
      [result.insertId]
    );

    const activity = formatActivity(newRows[0], userId, null);
    activity.isCreatedByMe = true;
    activity.participants = [
      {
        id: userId,
        name: newRows[0].host_name,
        avatar:
          newRows[0].host_avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(newRows[0].host_name || 'H')}&background=171717&color=fff`,
        role: 'Host',
      },
    ];

    return res.status(201).json({ success: true, activity });
  } catch (err) {
    console.error('createActivity error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create activity.' });
  }
};

// ─── PATCH /api/companions/:id/cancel ─────────────────────────────────────────
exports.cancelActivity = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { id } = req.params;

    const [rows] = await pool.query(`SELECT host_id, status FROM activities WHERE id = ?`, [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Activity not found.' });
    if (rows[0].host_id !== userId)
      return res.status(403).json({ success: false, message: 'Only the host can cancel this activity.' });
    if (rows[0].status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Activity is already cancelled.' });

    await pool.query(
      `UPDATE activities SET status = 'cancelled', updated_at = NOW() WHERE id = ?`,
      [id]
    );

    // Also cancel all pending requests
    await pool.query(
      `UPDATE activity_requests SET status = 'cancelled', updated_at = NOW()
       WHERE activity_id = ? AND status = 'pending'`,
      [id]
    );

    return res.json({ success: true, message: 'Activity cancelled.' });
  } catch (err) {
    console.error('cancelActivity error:', err);
    return res.status(500).json({ success: false, message: 'Failed to cancel activity.' });
  }
};

// ─── GET /api/companions/my ───────────────────────────────────────────────────
exports.getMyActivities = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Activities I created
    const [created] = await pool.query(
      `
      SELECT a.*, u.name AS host_name, up.profile_picture AS host_avatar, up.course AS host_course,
             (SELECT COUNT(*) FROM activity_requests ar WHERE ar.activity_id = a.id AND ar.status = 'accepted') AS accepted_count
      FROM activities a
      JOIN users u ON u.id = a.host_id
      LEFT JOIN user_profiles up ON up.user_id = a.host_id
      WHERE a.host_id = ?
      ORDER BY a.created_at DESC
    `,
      [userId]
    );

    // Activities I've joined (accepted requests, not my own)
    const [joined] = await pool.query(
      `
      SELECT a.*, u.name AS host_name, up.profile_picture AS host_avatar, up.course AS host_course,
             (SELECT COUNT(*) FROM activity_requests ar2 WHERE ar2.activity_id = a.id AND ar2.status = 'accepted') AS accepted_count,
             ar.id AS my_request_id, ar.status AS my_request_status
      FROM activity_requests ar
      JOIN activities a ON a.id = ar.activity_id
      JOIN users u ON u.id = a.host_id
      LEFT JOIN user_profiles up ON up.user_id = a.host_id
      WHERE ar.requester_id = ? AND ar.status = 'accepted'
      ORDER BY a.activity_date ASC
    `,
      [userId]
    );

    // Incoming requests for my activities
    const [incoming] = await pool.query(
      `
      SELECT ar.*, u.name AS requester_name, up.profile_picture AS requester_avatar,
             a.title AS activity_title, a.id AS activity_id, a.host_id
      FROM activity_requests ar
      JOIN users u ON u.id = ar.requester_id
      LEFT JOIN user_profiles up ON up.user_id = ar.requester_id
      JOIN activities a ON a.id = ar.activity_id
      WHERE a.host_id = ? AND ar.status IN ('pending', 'accepted', 'rejected')
      ORDER BY ar.created_at DESC
    `,
      [userId]
    );

    // Outgoing requests I sent
    const [outgoing] = await pool.query(
      `
      SELECT ar.*, a.title AS activity_title, a.id AS activity_id,
             u.name AS host_name, up.profile_picture AS host_avatar
      FROM activity_requests ar
      JOIN activities a ON a.id = ar.activity_id
      JOIN users u ON u.id = a.host_id
      LEFT JOIN user_profiles up ON up.user_id = a.host_id
      WHERE ar.requester_id = ? AND ar.status != 'cancelled'
      ORDER BY ar.created_at DESC
    `,
      [userId]
    );

    return res.json({
      success: true,
      created: created.map((r) => formatActivity(r, userId, null)),
      joined: joined.map((r) => ({
        ...formatActivity(r, userId, { status: r.my_request_status, id: r.my_request_id }),
        myRequestId: r.my_request_id,
      })),
      incoming: incoming.map((r) => ({
        id: r.id,
        activityId: r.activity_id,
        activityTitle: r.activity_title,
        type: 'received',
        requester: {
          id: r.requester_id,
          name: r.requester_name,
          avatar:
            r.requester_avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(r.requester_name || 'U')}&background=555555&color=fff`,
        },
        note: r.note,
        status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
        date: new Date(r.created_at).toISOString().split('T')[0],
      })),
      outgoing: outgoing.map((r) => ({
        id: r.id,
        activityId: r.activity_id,
        activityTitle: r.activity_title,
        type: 'sent',
        host: {
          id: r.host_id,
          name: r.host_name,
          avatar:
            r.host_avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(r.host_name || 'H')}&background=171717&color=fff`,
        },
        note: r.note,
        status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
        date: new Date(r.created_at).toISOString().split('T')[0],
      })),
    });
  } catch (err) {
    console.error('getMyActivities error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch your activities.' });
  }
};

// ─── POST /api/companions/:id/request ────────────────────────────────────────
exports.requestToJoin = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { id } = req.params;
    const { note } = req.body;

    const [rows] = await pool.query(
      `SELECT id, host_id, status, available_slots FROM activities WHERE id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Activity not found.' });

    const activity = rows[0];
    if (activity.host_id === userId)
      return res.status(400).json({ success: false, message: "You can't join your own activity." });
    if (activity.status !== 'open')
      return res
        .status(400)
        .json({ success: false, message: 'This activity is not open for requests.' });
    if (activity.available_slots <= 0)
      return res.status(400).json({ success: false, message: 'No slots available.' });

    // Check for duplicate active request
    const [existing] = await pool.query(
      `SELECT id FROM activity_requests WHERE activity_id = ? AND requester_id = ? AND status IN ('pending','accepted')`,
      [id, userId]
    );
    if (existing.length)
      return res
        .status(400)
        .json({ success: false, message: 'You already have an active request for this activity.' });

    const [result] = await pool.query(
      `INSERT INTO activity_requests (activity_id, requester_id, note, status, created_at, updated_at)
       VALUES (?, ?, ?, 'pending', NOW(), NOW())`,
      [id, userId, note || null]
    );

    return res
      .status(201)
      .json({ success: true, message: 'Request sent!', requestId: result.insertId });
  } catch (err) {
    console.error('requestToJoin error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send join request.' });
  }
};

// ─── DELETE /api/companions/request/:requestId ────────────────────────────────
exports.cancelJoinRequest = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { requestId } = req.params;

    const [rows] = await pool.query(
      `SELECT ar.*, a.available_slots, a.status AS activity_status
       FROM activity_requests ar
       JOIN activities a ON a.id = ar.activity_id
       WHERE ar.id = ?`,
      [requestId]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Request not found.' });

    const request = rows[0];
    if (request.requester_id !== userId)
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    if (request.status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Request already cancelled.' });

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `UPDATE activity_requests SET status = 'cancelled', updated_at = NOW() WHERE id = ?`,
        [requestId]
      );

      // If accepted, restore a slot
      if (request.status === 'accepted') {
        await conn.query(
          `UPDATE activities
           SET available_slots = available_slots + 1,
               status = CASE WHEN status = 'full' THEN 'open' ELSE status END,
               updated_at = NOW()
           WHERE id = ?`,
          [request.activity_id]
        );
      }

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    return res.json({ success: true, message: 'Request cancelled.' });
  } catch (err) {
    console.error('cancelJoinRequest error:', err);
    return res.status(500).json({ success: false, message: 'Failed to cancel request.' });
  }
};

// ─── PATCH /api/companions/request/:requestId ─────────────────────────────────
// action: 'accepted' | 'rejected'
exports.handleRequestAction = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { requestId } = req.params;
    const { action } = req.body;

    if (!['accepted', 'rejected'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action.' });
    }

    const [rows] = await pool.query(
      `SELECT ar.*, a.host_id, a.available_slots, a.status AS activity_status, a.id AS activity_id
       FROM activity_requests ar
       JOIN activities a ON a.id = ar.activity_id
       WHERE ar.id = ?`,
      [requestId]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Request not found.' });

    const request = rows[0];
    if (request.host_id !== userId)
      return res
        .status(403)
        .json({ success: false, message: 'Only the host can respond to requests.' });
    if (request.status !== 'pending')
      return res.status(400).json({ success: false, message: 'Request is no longer pending.' });

    if (action === 'accepted') {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();

        // Lock the row to prevent race conditions
        const [locked] = await conn.query(
          `SELECT available_slots, status FROM activities WHERE id = ? FOR UPDATE`,
          [request.activity_id]
        );

        if (locked[0].available_slots <= 0) {
          await conn.rollback();
          return res
            .status(400)
            .json({ success: false, message: 'No slots available anymore.' });
        }

        await conn.query(
          `UPDATE activity_requests SET status = 'accepted', updated_at = NOW() WHERE id = ?`,
          [requestId]
        );

        const newSlots = locked[0].available_slots - 1;
        const newStatus = newSlots <= 0 ? 'full' : 'open';

        await conn.query(
          `UPDATE activities SET available_slots = ?, status = ?, updated_at = NOW() WHERE id = ?`,
          [newSlots, newStatus, request.activity_id]
        );

        await conn.commit();
      } catch (e) {
        await conn.rollback();
        throw e;
      } finally {
        conn.release();
      }
    } else {
      // rejected
      await pool.query(
        `UPDATE activity_requests SET status = 'rejected', updated_at = NOW() WHERE id = ?`,
        [requestId]
      );
    }

    return res.json({
      success: true,
      message: action === 'accepted' ? 'Request accepted.' : 'Request rejected.',
    });
  } catch (err) {
    console.error('handleRequestAction error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process request.' });
  }
};
