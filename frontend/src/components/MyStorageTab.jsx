import React, { useState } from 'react';
import {
  Check,
  X,
  Box,
  Calendar,
  MapPin,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export default function MyStorageTab({
  requests,
  setRequests,
  offers,
  setOffers,
  receivedBookings,
  setReceivedBookings,
  sentBookings,
  setSentBookings,
}) {
  const [subTab, setSubTab] = useState('my-requests');
  const [feedback, setFeedback] = useState(null);

  const myRequests = requests.filter((r) => r.isMine);
  const myOffers = offers.filter((o) => o.isMine);

  const handleCancelRequest = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setFeedback('Storage request cancelled.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCancelOffer = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    setFeedback('Storage offer removed.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAcceptBooking = (id) => {
    setReceivedBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Accepted' } : b))
    );
    setFeedback('Booking request accepted! Space reserved (Demo state updated).');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRejectBooking = (id) => {
    setReceivedBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Rejected' } : b))
    );
    setFeedback('Booking request declined.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* 6 Sub-Tabs Navigation */}
      <div className="flex border-b border-[#D5D1C9] space-x-4 sm:space-x-6 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'my-requests', label: `My Requests (${myRequests.length})` },
          { key: 'my-offers', label: `My Offers (${myOffers.length})` },
          { key: 'received', label: `Bookings Received (${receivedBookings.length})` },
          { key: 'sent', label: `Bookings Sent (${sentBookings.length})` },
          { key: 'active', label: 'Active Storage' },
          { key: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSubTab(tab.key)}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap cursor-pointer transition-colors ${
              subTab === tab.key
                ? 'text-[#171717] border-b-2 border-[#171717]'
                : 'text-[#666666] hover:text-[#171717]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subtab 1: My Requests */}
      {subTab === 'my-requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#D5D1C9]">
              <p className="text-sm text-[#555555]">You haven't posted any storage requests yet.</p>
            </div>
          ) : (
            myRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-white bg-[#171717] px-2.5 py-0.5 rounded-full">
                      {req.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {req.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#171717] mt-1.5">{req.title}</h4>
                  <p className="text-xs text-[#555555] mt-1">{req.startDate} → {req.endDate} • Budget: ₹{req.estimatedBudget}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCancelRequest(req.id)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                >
                  Cancel Request
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab 2: My Offers */}
      {subTab === 'my-offers' && (
        <div className="space-y-4">
          {myOffers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#D5D1C9]">
              <p className="text-sm text-[#555555]">You haven't posted any storage spaces yet.</p>
            </div>
          ) : (
            myOffers.map((off) => (
              <div
                key={off.id}
                className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] font-bold text-white bg-[#171717] px-2.5 py-0.5 rounded-full">
                    {off.category}
                  </span>
                  <h4 className="text-base font-bold text-[#171717] mt-1.5">{off.title}</h4>
                  <p className="text-xs text-[#555555] mt-1">₹{off.pricePerDay}/day • {off.location}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCancelOffer(off.id)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                >
                  Remove Offer
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab 3: Booking Requests Received (with working Accept/Reject) */}
      {subTab === 'received' && (
        <div className="space-y-4">
          {receivedBookings.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <img src={b.requester.avatar} alt={b.requester.name} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#171717]">{b.requester.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#171717] mt-1">Belongings: {b.belongings}</p>
                  <p className="text-xs text-[#555555]">Dates: {b.startDate} → {b.endDate} • Total: ₹{b.totalPrice}</p>
                </div>
              </div>

              {b.status === 'Pending' && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleAcceptBooking(b.id)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold bg-[#171717] text-white hover:bg-[#333333] cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectBooking(b.id)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Subtab 4: Booking Requests Sent */}
      {subTab === 'sent' && (
        <div className="space-y-4">
          {sentBookings.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex items-center justify-between"
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  b.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {b.status}
                </span>
                <h4 className="text-sm font-bold text-[#171717] mt-1">{b.offerTitle}</h4>
                <p className="text-xs text-[#555555]">Host: {b.providerName} • {b.location}</p>
                <p className="text-[11px] text-[#777777]">{b.startDate} → {b.endDate}</p>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-[#171717]">₹{b.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 5: Active Storage */}
      {subTab === 'active' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171717]">2 Duffle Bags currently stored</h4>
                <p className="text-xs text-[#555555]">Host: Ritu Sen (South Gate Apartments) • Pick-up on Nov 15</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Active Storage
            </span>
          </div>
        </div>
      )}

      {/* Subtab 6: Completed */}
      {subTab === 'completed' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171717]">Suitcase Storage (Summer Term)</h4>
                <p className="text-xs text-[#555555]">Returned successfully to owner on Oct 28</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              Completed
            </span>
          </div>
        </div>
      )}

    </div>
  );
}