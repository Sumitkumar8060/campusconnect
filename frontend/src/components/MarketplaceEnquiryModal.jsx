// src/components/MarketplaceEnquiryModal.jsx
import React, { useState } from 'react';
import { X, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function MarketplaceEnquiryModal({ item, onClose, onSubmitSuccess }) {
  const [message, setMessage] = useState(
    item.type === 'rent'
      ? `Hi ${item.seller.name}, I am interested in renting your "${item.title}". Is it available to inspect this week?`
      : `Hi ${item.seller.name}, I am interested in buying your "${item.title}". Can we meet on campus to check it out?`
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmitSuccess?.({
        itemId: item.id,
        itemTitle: item.title,
        message,
        recipient: item.seller.name,
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#D5D1C9] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-bold text-lg text-[#171717]">Send Enquiry to Seller</h3>
            <p className="text-xs text-stone-500">Connected through verified CampusConnect messaging</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-900 text-lg">Enquiry Sent Successfully!</h4>
            <p className="text-sm text-stone-600 mt-1 max-w-xs">
              {item.seller.name} will be notified and usually replies within {item.seller.responseTime}. Check your <strong>Enquiries</strong> tab for updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Item Quick Summary */}
            <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-14 h-14 rounded-lg object-cover border"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-stone-500 uppercase">
                  {item.type === 'rent' ? 'Rental Request' : 'Purchase Request'}
                </span>
                <h4 className="text-sm font-semibold text-[#171717] truncate">{item.title}</h4>
                <p className="text-xs font-bold text-emerald-700">
                  {item.type === 'rent' ? `₹${item.rentalRate}/${item.rentalPeriod}` : `₹${item.price}`}
                </p>
              </div>
            </div>

            {/* Message Box */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Your Message
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask questions about the condition, schedule a campus meetup, etc."
                className="w-full text-sm p-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717]"
                required
              />
            </div>

            {/* Campus Safety Reminder */}
            <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Campus Safe Trade Reminder:</strong> Never share OTPs or advance payments. Agree to inspect and exchange items at public campus spots (library, student center, or canteen).
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#171717] text-white text-sm font-semibold rounded-xl hover:bg-[#333333] transition flex items-center gap-2 active:scale-[0.98]"
              >
                <Send className="w-4 h-4" /> Send Enquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}