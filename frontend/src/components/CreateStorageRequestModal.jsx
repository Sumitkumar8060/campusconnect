import React, { useState } from 'react';
import { X, Box } from 'lucide-react';
import { STORAGE_CATEGORIES, STORAGE_LOCATIONS } from '../data/storageData';

export default function CreateStorageRequestModal({ isOpen, onClose, onPublish }) {
  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    category: 'Luggage & Bags',
    description: '',
    belongingsSize: '',
    preferredLocation: 'Hostel Block 1–4 Area',
    startDate: '',
    endDate: '',
    estimatedBudget: '',
    specialRequirements: '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = 'Title is required.';
    if (!formData.description.trim()) err.description = 'Please describe your belongings.';
    if (!formData.belongingsSize.trim()) err.belongingsSize = 'Please specify quantity/dimensions.';
    if (!formData.estimatedBudget || Number(formData.estimatedBudget) <= 0) {
      err.estimatedBudget = 'Please enter a valid budget.';
    }
    if (!formData.startDate) {
      err.startDate = 'Start date is required.';
    } else if (formData.startDate < todayString) {
      err.startDate = 'Start date cannot be in the past.';
    }
    if (!formData.endDate) {
      err.endDate = 'End date is required.';
    } else if (formData.endDate <= formData.startDate) {
      err.endDate = 'End date must be after the start date.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newReq = {
      id: `s-req-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      belongingsSize: formData.belongingsSize,
      preferredLocation: formData.preferredLocation,
      startDate: formData.startDate,
      endDate: formData.endDate,
      estimatedBudget: Number(formData.estimatedBudget),
      specialRequirements: formData.specialRequirements || 'Dry indoor space.',
      requester: {
        name: 'Alex Johnson (You)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        course: '3rd Year Student',
        verified: true,
      },
      status: 'Open',
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    onPublish(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#D5D1C9] shadow-2xl p-6 sm:p-8 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D5D1C9]/70">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#EDEBE6] text-[#171717] flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#171717]">Request Storage Space</h3>
              <p className="text-xs text-[#666666]">Find a student with space to store your belongings.</p>
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
              Request Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Need storage for one large suitcase for 10 days"
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
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              >
                {STORAGE_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Quantity / Size *
              </label>
              <input
                type="text"
                placeholder="e.g. 1 Large Suitcase, 2 Cartons"
                value={formData.belongingsSize}
                onChange={(e) => setFormData({ ...formData, belongingsSize: e.target.value })}
                className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.belongingsSize ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.belongingsSize && <p className="text-xs text-red-600 mt-1">{errors.belongingsSize}</p>}
            </div>
          </div>

          {/* Location & Budget */}
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
                {STORAGE_LOCATIONS.filter((l) => l !== 'All Locations').map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Estimated Total Budget (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g. 350"
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.estimatedBudget ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.estimatedBudget && <p className="text-xs text-red-600 mt-1">{errors.estimatedBudget}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Start Date *
              </label>
              <input
                type="date"
                min={todayString}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.startDate ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.startDate && <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                End Date *
              </label>
              <input
                type="date"
                min={formData.startDate || todayString}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.endDate ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.endDate && <p className="text-xs text-red-600 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Description of Belongings *
            </label>
            <textarea
              rows={2}
              placeholder="Provide details about the bags, boxes, or items you plan to store..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full p-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
              }`}
            />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Special Requirements (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Ground floor access, locked room, dry moisture-free space"
              value={formData.specialRequirements}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
            />
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
              Publish Request
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}