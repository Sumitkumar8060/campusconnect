import React, { useState } from 'react';
import { X, UploadCloud, Check } from 'lucide-react';
import { STORAGE_CATEGORIES, STORAGE_LOCATIONS } from '../data/storageData';

export default function CreateStorageOfferModal({ isOpen, onClose, onPublish }) {
  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    category: 'Luggage & Bags',
    description: '',
    capacity: '',
    location: 'Hostel Block 1–4 Area',
    pricePerDay: '',
    pricePerWeek: '',
    startDate: '',
    endDate: '',
    rules: '',
    features: ['Locked Room', 'Dry & Clean'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const toggleFeature = (feat) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feat);
      return {
        ...prev,
        features: exists ? prev.features.filter((f) => f !== feat) : [...prev.features, feat],
      };
    });
  };

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = 'Title is required.';
    if (!formData.description.trim()) err.description = 'Please describe the space.';
    if (!formData.capacity.trim()) err.capacity = 'Capacity details are required.';
    if (!formData.pricePerDay || Number(formData.pricePerDay) <= 0) {
      err.pricePerDay = 'Price per day is required.';
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

    const newOffer = {
      id: `s-off-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      capacity: formData.capacity,
      location: formData.location,
      pricePerDay: Number(formData.pricePerDay),
      pricePerWeek: formData.pricePerWeek ? Number(formData.pricePerWeek) : Number(formData.pricePerDay) * 6,
      startDate: formData.startDate,
      endDate: formData.endDate,
      features: formData.features,
      rules: formData.rules || 'No perishable or liquid items.',
      image: formData.image,
      provider: {
        name: 'Alex Johnson (You)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        course: '3rd Year Student',
        verified: true,
      },
      status: 'Available',
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    onPublish(newOffer);
    onClose();
  };

  const featureOptions = [
    'Locked Room',
    'Dry & Clean',
    'CCTV in Corridor',
    'Ground Floor Access',
    'Wardrobe Space',
    '24/7 Access',
    'Rain Protection',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#D5D1C9] shadow-2xl p-6 sm:p-8 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D5D1C9]/70">
          <div>
            <h3 className="text-xl font-bold text-[#171717]">Offer Storage Space</h3>
            <p className="text-xs text-[#666666]">Help a peer keep their luggage or items temporarily.</p>
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
              Storage Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Clean closet space for 1 suitcase & duffle bag"
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
                Available Capacity *
              </label>
              <input
                type="text"
                placeholder="e.g. 1 Large Suitcase or 2 Cartons"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.capacity ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.capacity && <p className="text-xs text-red-600 mt-1">{errors.capacity}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              General Location *
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
            >
              {STORAGE_LOCATIONS.filter((l) => l !== 'All Locations').map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Price Per Day (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g. 35"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.pricePerDay ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.pricePerDay && <p className="text-xs text-red-600 mt-1">{errors.pricePerDay}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Optional Weekly Price (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 200"
                value={formData.pricePerWeek}
                onChange={(e) => setFormData({ ...formData, pricePerWeek: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Available From *
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
                Available Until *
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

          {/* Storage Features Checklist */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
              Storage Features
            </label>
            <div className="flex flex-wrap gap-2">
              {featureOptions.map((feat) => {
                const checked = formData.features.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      checked
                        ? 'bg-[#171717] text-white shadow-xs'
                        : 'bg-white text-[#292929] border border-[#D5D1C9] hover:bg-[#EDEBE6]'
                    }`}
                  >
                    {checked ? '✓ ' : '+ '}
                    {feat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Upload Preview UI */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Storage Photo (Frontend Preview)
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#D5D1C9] bg-[#EDEBE6]/30">
              <img
                src={formData.image}
                alt="Storage Preview"
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="text-xs text-[#555555]">
                <p className="font-semibold text-[#171717]">Default Storage Image selected</p>
                <p className="text-[11px] text-[#777777]">Photo uploaded successfully for demo display.</p>
              </div>
            </div>
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
              Publish Offer
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}