import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import { LOCATIONS, ROOM_TYPES } from '../data/roomsData';

export default function CreateFlatmateModal({ isOpen, onClose, onPublish }) {
  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    intro: '',
    preferredLocation: 'North Campus Gate Area',
    monthlyBudget: '',
    preferredRoomType: 'Private Room',
    moveInDate: '',
    roommatesNeeded: 1,
    lifestyle: ['Clean and organized', 'Quiet and study-focused'],
    requirements: '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const toggleHabit = (habit) => {
    setFormData((prev) => {
      const exists = prev.lifestyle.includes(habit);
      return {
        ...prev,
        lifestyle: exists ? prev.lifestyle.filter((h) => h !== habit) : [...prev.lifestyle, habit],
      };
    });
  };

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = 'Title is required.';
    if (!formData.intro.trim()) err.intro = 'Please introduce yourself.';
    if (!formData.monthlyBudget || Number(formData.monthlyBudget) <= 0) {
      err.monthlyBudget = 'Budget is required.';
    }
    if (!formData.moveInDate) {
      err.moveInDate = 'Move-in date is required.';
    } else if (formData.moveInDate < todayString) {
      err.moveInDate = 'Date cannot be in the past.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newFlatmate = {
      id: `flat-${Date.now()}`,
      name: 'Alex Johnson (You)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      course: '3rd Year Student',
      verified: true,
      title: formData.title,
      intro: formData.intro,
      preferredLocation: formData.preferredLocation,
      monthlyBudget: Number(formData.monthlyBudget),
      preferredRoomType: formData.preferredRoomType,
      moveInDate: formData.moveInDate,
      roommatesNeeded: Number(formData.roommatesNeeded),
      lifestyle: formData.lifestyle,
      requirements: formData.requirements || 'Regular rent payment.',
      isMine: true,
    };

    onPublish(newFlatmate);
    onClose();
  };

  const habitsList = [
    'Clean and organized',
    'Quiet and study-focused',
    'Social and friendly',
    'Non-smoker',
    'Flexible daily routine',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#D5D1C9] shadow-2xl p-6 sm:p-8 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D5D1C9]/70">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#EDEBE6] text-[#171717] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#171717]">Post Flatmate Requirement</h3>
              <p className="text-xs text-[#666666]">Find students to share accommodation with.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#666666] hover:text-[#171717] hover:bg-black/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Short Requirement Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Looking for a quiet, organized flatmate for 2BHK"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                errors.title ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
              }`}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Preferred Area *
              </label>
              <select
                value={formData.preferredLocation}
                onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              >
                {LOCATIONS.filter((l) => l !== 'All Locations').map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Monthly Rent Budget (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g. 7000"
                value={formData.monthlyBudget}
                onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.monthlyBudget ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.monthlyBudget && <p className="text-xs text-red-600 mt-1">{errors.monthlyBudget}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Preferred Room Type
              </label>
              <select
                value={formData.preferredRoomType}
                onChange={(e) => setFormData({ ...formData, preferredRoomType: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              >
                {ROOM_TYPES.filter((t) => t !== 'All Types').map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Target Move-In Date *
              </label>
              <input
                type="date"
                min={todayString}
                value={formData.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.moveInDate ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.moveInDate && <p className="text-xs text-red-600 mt-1">{errors.moveInDate}</p>}
            </div>
          </div>

          {/* Lifestyle Habits */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
              Lifestyle & Habits
            </label>
            <div className="flex flex-wrap gap-2">
              {habitsList.map((habit) => {
                const checked = formData.lifestyle.includes(habit);
                return (
                  <button
                    key={habit}
                    type="button"
                    onClick={() => toggleHabit(habit)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      checked
                        ? 'bg-[#171717] text-white shadow-xs'
                        : 'bg-white text-[#292929] border border-[#D5D1C9] hover:bg-[#EDEBE6]'
                    }`}
                  >
                    {checked ? '✓ ' : '+ '}
                    {habit}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intro */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              About Yourself *
            </label>
            <textarea
              rows={2}
              placeholder="Your course, daily routine, hobbies, and what you are looking for in a flatmate..."
              value={formData.intro}
              onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
              className={`w-full p-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                errors.intro ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
              }`}
            />
            {errors.intro && <p className="text-xs text-red-600 mt-1">{errors.intro}</p>}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#D5D1C9]/70 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl text-xs sm:text-sm font-semibold text-[#292929] bg-white border border-[#D5D1C9] hover:bg-[#EDEBE6] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#171717] hover:bg-[#333333] transition-all duration-200 shadow-sm cursor-pointer"
            >
              Publish Requirement
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}