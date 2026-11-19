// backend/src/routes/companionsRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/companionsController');

// Public-ish (auth optional for user-specific fields; still requires session for modifications)
router.get('/', ctrl.getActivities);
router.get('/my', requireAuth, ctrl.getMyActivities);
router.get('/:id', ctrl.getActivityById);

// Mutations — all require auth
router.post('/', requireAuth, ctrl.createActivity);
router.patch('/:id/cancel', requireAuth, ctrl.cancelActivity);

// Join request actions
router.post('/:id/request', requireAuth, ctrl.requestToJoin);
router.delete('/request/:requestId', requireAuth, ctrl.cancelJoinRequest);
router.patch('/request/:requestId', requireAuth, ctrl.handleRequestAction);

module.exports = router;
