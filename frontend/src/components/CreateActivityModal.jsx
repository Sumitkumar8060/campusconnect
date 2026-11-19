import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../data/companionsData';
import { createActivity } from '../api/companionsApi';

export default function CreateActivityModal({ isOpen, onClose, onPublish }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Food & Dining',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 4,
    requirements: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (!isOpen) return null;

  const todayString = new Date().toISOString().split('T')[0];

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (formData.date < todayString) {
      newErrors.date = 'Date cannot be in the past';
    }
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (Number(formData.maxParticipants) < 2) newErrors.maxParticipants = 'Minimum 2 participants';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        maxParticipants: Number(formData.maxParticipants),
        requirements: formData.requirements || null,
      };

      const data = await createActivity(payload);

      if (data.success) {
        onPublish(data.activity);
        // Reset form
        setFormData({
          title: '', category: 'Food & Dining', description: '',
          date: '', time: '', location: '', maxParticipants: 4, requirements: '',
        });
        setErrors({});
        onClose();
      } else {
        setSubmitError(data.message || 'Failed to create activity.');
      }
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Failed to create activity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#D5D1C9] shadow-2xl p-6 sm:p-8 my-8">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D5D1C9]/70">
          <div>
            <h3 className="text-xl font-bold text-[#171717]">Create New Activity</h3>
            <p className="text-xs text-[#666666] mt-0.5">Find companions to join your plan.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#666666] hover:text-[#171717] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitError && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {submitError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Looking for companions for badminton doubles"
              value={formData.title}
              onChange={(e) => field('title', e.target.value)}
              className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                errors.title ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
              }`}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Category & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => field('category', e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              >
                {CATEGORIES.filter((c) => c !== 'All Activities').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Total Capacity (People) *
              </label>
              <input
                type="number"
                min="2"
                max="50"
                value={formData.maxParticipants}
                onChange={(e) => field('maxParticipants', e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              />
              {errors.maxParticipants && <p className="text-xs text-red-600 mt-1">{errors.maxParticipants}</p>}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">Date *</label>
              <input
                type="date"
                min={todayString}
                value={formData.date}
                onChange={(e) => field('date', e.target.value)}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.date ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => field('time', e.target.value)}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.time ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.time && <p className="text-xs text-red-600 mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Location / Meetup Point *
            </label>
            <input
              type="text"
              placeholder="e.g. Campus Indoor Badminton Court, Gate 1, or Cafe"
              value={formData.location}
              onChange={(e) => field('location', e.target.value)}
              className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                errors.location ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
              }`}
            />
            {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="Describe your plan, agenda, and what you are looking for..."
              value={formData.description}
              onChange={(e) => field('description', e.target.value)}
              className={`w-full p-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
              }`}
            />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Optional Requirements / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Bring badminton racket, split cab fare, quiet study"
              value={formData.requirements}
              onChange={(e) => field('requirements', e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#D5D1C9]/70 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-10 px-5 rounded-xl text-sm font-semibold text-[#292929] bg-white border border-[#D5D1C9] hover:bg-[#EDEBE6] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 px-6 rounded-xl text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-60 inline-flex items-center gap-2"
            >
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Publishing...</>
              ) : (
                'Publish Activity'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
