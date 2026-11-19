import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { DESTINATIONS } from '../data/errandsData';

export default function CreateOfferModal({ isOpen, onClose, onPublish }) {
  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    destination: 'Town Central Market',
    destinationCategory: 'General Market',
    date: '',
    departureTime: '',
    estimatedReturnTime: '',
    maxRequests: 3,
    vehicle: 'Scooter (Two Wheeler)',
    itemsWillingToBring: ['Groceries', 'Stationery'],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const toggleCategory = (cat) => {
    setFormData((prev) => {
      const exists = prev.itemsWillingToBring.includes(cat);
      return {
        ...prev,
        itemsWillingToBring: exists
          ? prev.itemsWillingToBring.filter((c) => c !== cat)
          : [...prev.itemsWillingToBring, cat],
      };
    });
  };

  const validate = () => {
    const err = {};
    if (!formData.destination.trim()) err.destination = 'Destination is required.';
    if (!formData.date) {
      err.date = 'Date is required.';
    } else if (formData.date < todayString) {
      err.date = 'Date cannot be in the past.';
    }
    if (!formData.departureTime) err.departureTime = 'Departure time is required.';
    if (!formData.estimatedReturnTime) err.estimatedReturnTime = 'Return time is required.';
    if (formData.itemsWillingToBring.length === 0) {
      err.items = 'Please select at least one item category.';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newOffer = {
      id: `off-${Date.now()}`,
      destination: formData.destination,
      destinationCategory: formData.destinationCategory,
      date: formData.date,
      departureTime: formData.departureTime,
      estimatedReturnTime: formData.estimatedReturnTime,
      itemsWillingToBring: formData.itemsWillingToBring,
      maxRequests: Number(formData.maxRequests),
      currentBookings: 0,
      traveler: {
        name: 'Alex Johnson (You)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        course: '3rd Year Student',
        verified: true,
      },
      vehicle: formData.vehicle,
      notes: formData.notes || 'Happy to bring small to medium parcels.',
      status: 'Available',
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    onPublish(newOffer);
    onClose();
  };

  const availableCategories = [
    'Groceries',
    'Food & Snacks',
    'Stationery',
    'Personal Care',
    'Medicines',
    'Electronics & Accessories',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#D5D1C9] shadow-2xl p-6 sm:p-8 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D5D1C9]/70">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#EDEBE6] text-[#171717] flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#171717]">Offer to Bring Items</h3>
              <p className="text-xs text-[#666666]">Going outside campus? Help fellow students.</p>
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
              Where are you heading? *
            </label>
            <select
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
            >
              {DESTINATIONS.filter((d) => d !== 'All Destinations').map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Travel Date *
              </label>
              <input
                type="date"
                min={todayString}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.date ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Max Requests Allowed *
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.maxRequests}
                onChange={(e) => setFormData({ ...formData, maxRequests: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Expected Departure Time *
              </label>
              <input
                type="time"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.departureTime ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.departureTime && <p className="text-xs text-red-600 mt-1">{errors.departureTime}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Estimated Return Time *
              </label>
              <input
                type="time"
                value={formData.estimatedReturnTime}
                onChange={(e) => setFormData({ ...formData, estimatedReturnTime: e.target.value })}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.estimatedReturnTime ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.estimatedReturnTime && <p className="text-xs text-red-600 mt-1">{errors.estimatedReturnTime}</p>}
            </div>
          </div>

          {/* Categories willing to carry */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
              Items You Are Willing to Bring *
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => {
                const selected = formData.itemsWillingToBring.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#171717] text-white shadow-xs'
                        : 'bg-white text-[#292929] border border-[#D5D1C9] hover:bg-[#EDEBE6]'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {cat}
                  </button>
                );
              })}
            </div>
            {errors.items && <p className="text-xs text-red-600 mt-1">{errors.items}</p>}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Vehicle & Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. On scooter, can carry 2 bags. Will meet at hostel gate."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
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
              Publish Offer
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}