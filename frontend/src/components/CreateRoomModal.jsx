import React, { useState } from 'react';
import { X, Home, UploadCloud, Check } from 'lucide-react';
import { ROOM_TYPES, FURNISHING_TYPES, LOCATIONS } from '../data/roomsData';

export default function CreateRoomModal({ isOpen, onClose, onPublish }) {
  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'Flat',
    roomType: 'Single',
    monthlyRent: '',
    securityDeposit: '',
    location: 'North Campus Gate Area',
    description: '',
    availableSpaces: 1,
    furnishing: 'Furnished',
    bathroom: 'Attached',
    availableFrom: '',
    rules: '',
    amenities: ['Wi-Fi', 'Study table', 'Wardrobe', 'Kitchen'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const toggleAmenity = (item) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== item) : [...prev.amenities, item],
      };
    });
  };

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = 'Title is required.';
    if (!formData.description.trim()) err.description = 'Description is required.';
    if (!formData.monthlyRent || Number(formData.monthlyRent) <= 0) {
      err.monthlyRent = 'Valid monthly rent is required.';
    }
    if (!formData.availableFrom) {
      err.availableFrom = 'Availability date is required.';
    } else if (formData.availableFrom < todayString) {
      err.availableFrom = 'Date cannot be in the past.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newRoom = {
      id: `room-${Date.now()}`,
      title: formData.title,
      propertyType: formData.propertyType,
      roomType: formData.roomType,
      monthlyRent: Number(formData.monthlyRent),
      securityDeposit: formData.securityDeposit ? Number(formData.securityDeposit) : Number(formData.monthlyRent),
      location: formData.location,
      description: formData.description,
      availableSpaces: Number(formData.availableSpaces),
      furnishing: formData.furnishing,
      bathroom: formData.bathroom,
      availableFrom: formData.availableFrom,
      amenities: formData.amenities,
      rules: formData.rules || 'Standard student residence rules.',
      image: formData.image,
      owner: {
        name: 'Alex Johnson (You)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        course: '3rd Year Student',
        verified: true,
      },
      status: 'Available',
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    onPublish(newRoom);
    onClose();
  };

  const amenitiesList = [
    'Wi-Fi',
    'Kitchen',
    'Washing machine',
    'Study table',
    'Wardrobe',
    'Air conditioning',
    'Parking',
    'Attached bathroom',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#D5D1C9] shadow-2xl p-6 sm:p-8 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D5D1C9]/70">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#EDEBE6] text-[#171717] flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#171717]">Post a Room Listing</h3>
              <p className="text-xs text-[#666666]">Connect with students looking for rooms.</p>
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
              Listing Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Furnished Single Room in 3BHK flat near North Gate"
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
                Room Type *
              </label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              >
                {ROOM_TYPES.filter((t) => t !== 'All Types').map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Furnishing *
              </label>
              <select
                value={formData.furnishing}
                onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                className="w-full h-11 px-3 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              >
                {FURNISHING_TYPES.filter((f) => f !== 'All Furnishing').map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
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
              {LOCATIONS.filter((l) => l !== 'All Locations').map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Rent & Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Monthly Rent (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g. 7500"
                value={formData.monthlyRent}
                onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.monthlyRent ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.monthlyRent && <p className="text-xs text-red-600 mt-1">{errors.monthlyRent}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 7500"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              />
            </div>
          </div>

          {/* Available From & Spaces */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Available From *
              </label>
              <input
                type="date"
                min={todayString}
                value={formData.availableFrom}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.availableFrom ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.availableFrom && <p className="text-xs text-red-600 mt-1">{errors.availableFrom}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Available Spaces *
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.availableSpaces}
                onChange={(e) => setFormData({ ...formData, availableSpaces: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              />
            </div>
          </div>

          {/* Facilities / Amenities */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
              Facilities & Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((item) => {
                const checked = formData.amenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      checked
                        ? 'bg-[#171717] text-white shadow-xs'
                        : 'bg-white text-[#292929] border border-[#D5D1C9] hover:bg-[#EDEBE6]'
                    }`}
                  >
                    {checked ? '✓ ' : '+ '}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Description & Details *
            </label>
            <textarea
              rows={2}
              placeholder="Describe room features, sunlight, flat environment..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full p-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
              }`}
            />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Image Preview UI */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Property Photo (Preview)
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#D5D1C9] bg-[#EDEBE6]/30">
              <img
                src={formData.image}
                alt="Room Preview"
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="text-xs text-[#555555]">
                <p className="font-semibold text-[#171717]">Default High-Res Room Photo</p>
                <p className="text-[11px] text-[#777777]">Included for demo listing presentation.</p>
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
              Publish Listing
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}