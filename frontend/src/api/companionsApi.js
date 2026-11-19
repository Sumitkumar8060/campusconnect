// frontend/src/api/companionsApi.js
import axios from './axios';

// ─── Activities ───────────────────────────────────────────────────────────────

/** Fetch all activities with optional filters */
export const getActivities = (params = {}) =>
  axios.get('/companions', { params }).then((r) => r.data);

/** Fetch a single activity detail */
export const getActivityById = (id) =>
  axios.get(`/companions/${id}`).then((r) => r.data);

/** Create a new activity */
export const createActivity = (data) =>
  axios.post('/companions', data).then((r) => r.data);

/** Cancel my own activity */
export const cancelActivity = (id) =>
  axios.patch(`/companions/${id}/cancel`).then((r) => r.data);

// ─── My Activities ────────────────────────────────────────────────────────────

/** Get created, joined, incoming, outgoing for the logged-in user */
export const getMyActivities = () =>
  axios.get('/companions/my').then((r) => r.data);

// ─── Join Requests ────────────────────────────────────────────────────────────

/** Send a join request to an activity */
export const requestToJoin = (activityId, note = '') =>
  axios.post(`/companions/${activityId}/request`, { note }).then((r) => r.data);

/** Cancel a join request or leave an activity */
export const cancelJoinRequest = (requestId) =>
  axios.delete(`/companions/request/${requestId}`).then((r) => r.data);

/** Accept or reject a request (action: 'accepted' | 'rejected') */
export const handleRequestAction = (requestId, action) =>
  axios.patch(`/companions/request/${requestId}`, { action }).then((r) => r.data);
