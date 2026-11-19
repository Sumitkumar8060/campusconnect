import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { ERRAND_CATEGORIES, DESTINATIONS } from '../data/errandsData';

export default function CreateRequestModal({ isOpen, onClose, onPublish }) {
  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Groceries',
    description: '',
    quantity: 1,
    preferredShop: 'City Supermarket',
    estimatedBudget: '',
    deliveryTip: '30',
    preferredDate: '',
    preferredTime: '',
    pickupSpot: '',
    additionalInstructions: '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const err = {};
    if (!formData.itemName.trim()) err.itemName = 'Item name is required.';
    if (!formData.description.trim()) err.description = 'Please describe the item.';
    if (!formData.estimatedBudget || Number(formData.estimatedBudget) <= 0) {
      err.estimatedBudget = 'Please enter a valid budget.';
    }
    if (!formData.preferredDate) {
      err.preferredDate = 'Date is required.';
    } else if (formData.preferredDate < todayString) {
      err.preferredDate = 'Date cannot be in the past.';
    }
    if (!formData.preferredTime) err.preferredTime = 'Time is required.';
    if (!formData.pickupSpot.trim()) err.pickupSpot = 'Please enter a public campus pickup spot.';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newReq = {
      id: `req-${Date.now()}`,
      itemName: formData.itemName,
      category: formData.category,
      description: formData.description,
      quantity: Number(formData.quantity),
      preferredShop: formData.preferredShop,
      estimatedBudget: Number(formData.estimatedBudget),
      deliveryTip: Number(formData.deliveryTip || 0),
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      requester: {
        name: 'Alex Johnson (You)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        course: '3rd Year Student',
        verified: true,
        pickupSpot: formData.pickupSpot,
      },
      additionalInstructions: formData.additionalInstructions || 'Standard packaging.',
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
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#171717]">Request an Item</h3>
              <p className="text-xs text-[#666666]">Connect with a student heading outside campus.</p>
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
              Item Name *
            </label>
            <input
              type="text"
              placeholder="e.g. 1L Water Bottle, Cough Syrup, Drawing Sheets"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                errors.itemName ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
              }`}
            />
            {errors.itemName && <p className="text-xs text-red-600 mt-1">{errors.itemName}</p>}
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
                {ERRAND_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              />
            </div>
          </div>

          {/* Shop / Location */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Preferred Shop or Destination *
            </label>
            <select
              value={formData.preferredShop}
              onChange={(e) => setFormData({ ...formData, preferredShop: e.target.value })}
              className="w-full h-11 px-3 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
            >
              {DESTINATIONS.filter((d) => d !== 'All Destinations').map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Budget & Tip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Estimated Item Budget (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g. 250"
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.estimatedBudget ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.estimatedBudget && <p className="text-xs text-red-600 mt-1">{errors.estimatedBudget}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Delivery Tip / Contribution (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 30"
                value={formData.deliveryTip}
                onChange={(e) => setFormData({ ...formData, deliveryTip: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D5D1C9] text-sm text-[#171717] outline-none focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/10"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Preferred Date *
              </label>
              <input
                type="date"
                min={todayString}
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.preferredDate ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.preferredDate && <p className="text-xs text-red-600 mt-1">{errors.preferredDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
                Preferred Time *
              </label>
              <input
                type="time"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className={`w-full h-11 px-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                  errors.preferredTime ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
                }`}
              />
              {errors.preferredTime && <p className="text-xs text-red-600 mt-1">{errors.preferredTime}</p>}
            </div>
          </div>

          {/* Safe Campus Pickup Point */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Campus Meeting / Pickup Spot *
            </label>
            <input
              type="text"
              placeholder="e.g. Hostel 3 Reception, Library Entrance, Student Plaza"
              value={formData.pickupSpot}
              onChange={(e) => setFormData({ ...formData, pickupSpot: e.target.value })}
              className={`w-full h-11 px-3.5 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                errors.pickupSpot ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
              }`}
            />
            {errors.pickupSpot && <p className="text-xs text-red-600 mt-1">{errors.pickupSpot}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1">
              Description & Specifications *
            </label>
            <textarea
              rows={2}
              placeholder="Brand preference, size, color, or special details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full p-3 rounded-xl bg-white border text-sm text-[#171717] outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-200' : 'border-[#D5D1C9] focus:ring-[#171717]/10 focus:border-[#171717]'
              }`}
            />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
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