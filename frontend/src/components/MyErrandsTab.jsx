import React, { useState } from 'react';
import {
  Check,
  X,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Send,
  CheckCircle,
} from 'lucide-react';

export default function MyErrandsTab({
  requests,
  setRequests,
  offers,
  setOffers,
  receivedRequests,
  setReceivedRequests,
  sentRequests,
  setSentRequests,
}) {
  const [subTab, setSubTab] = useState('my-requests');
  const [feedback, setFeedback] = useState(null);

  const myRequests = requests.filter((r) => r.isMine);
  const myOffers = offers.filter((o) => o.isMine);

  const handleCancelRequest = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setFeedback('Request cancelled successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCancelOffer = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    setFeedback('Offer cancelled successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAcceptReceived = (id) => {
    setReceivedRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Accepted' } : r))
    );
    setFeedback('Request accepted! (Demo status updated).');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRejectReceived = (id) => {
    setReceivedRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    setFeedback('Request rejected (Demo update).');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleMarkCompleted = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Completed' } : r))
    );
    setFeedback('Errand marked as completed! (Demo interaction)');
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

      {/* 5 Sub-Tabs Navigation */}
      <div className="flex border-b border-[#D5D1C9] space-x-4 sm:space-x-8 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'my-requests', label: `My Requests (${myRequests.length})` },
          { key: 'my-offers', label: `My Offers (${myOffers.length})` },
          { key: 'received', label: `Requests Received (${receivedRequests.length})` },
          { key: 'sent', label: `Requests Sent (${sentRequests.length})` },
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
              <p className="text-sm text-[#555555]">You haven't posted any item requests yet.</p>
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
                  <h4 className="text-base font-bold text-[#171717] mt-1.5">{req.itemName}</h4>
                  <p className="text-xs text-[#555555] mt-1">Shop: {req.preferredShop} • Est: ₹{req.estimatedBudget} (+₹{req.deliveryTip} Tip)</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleMarkCompleted(req.id)}
                    className="flex-1 sm:flex-none h-9 px-3.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                  >
                    Mark Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancelRequest(req.id)}
                    className="flex-1 sm:flex-none h-9 px-3.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
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
              <p className="text-sm text-[#555555]">You haven't posted any travel offers yet.</p>
            </div>
          ) : (
            myOffers.map((off) => (
              <div
                key={off.id}
                className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] font-bold text-white bg-[#171717] px-2.5 py-0.5 rounded-full">
                    {off.destinationCategory}
                  </span>
                  <h4 className="text-base font-bold text-[#171717] mt-1.5">Trip to {off.destination}</h4>
                  <p className="text-xs text-[#555555] mt-1">{off.date} at {off.departureTime} • {off.maxRequests - off.currentBookings} slots free</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCancelOffer(off.id)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                >
                  Cancel Trip
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab 3: Requests Received (Incoming peer requests with Accept/Reject) */}
      {subTab === 'received' && (
        <div className="space-y-4">
          {receivedRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <img src={req.requester.avatar} alt={req.requester.name} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#171717]">{req.requester.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#171717] mt-1">Item: {req.itemName}</p>
                  <p className="text-xs text-[#555555]">Est Budget: ₹{req.estimatedBudget} + ₹{req.tip} Tip</p>
                  <p className="text-[11px] text-[#777777] mt-0.5">Drop at: {req.requester.pickupSpot}</p>
                </div>
              </div>

              {req.status === 'Pending' && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleAcceptReceived(req.id)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold bg-[#171717] text-white hover:bg-[#333333] cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectReceived(req.id)}
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

      {/* Subtab 4: Requests Sent */}
      {subTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.map((sent) => (
            <div
              key={sent.id}
              className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex items-center justify-between"
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  sent.status === 'Accepted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {sent.status}
                </span>
                <h4 className="text-sm font-bold text-[#171717] mt-1.5">{sent.itemName}</h4>
                <p className="text-xs text-[#555555]">Helper: {sent.travelerName} • Heading to {sent.travelerDestination}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#171717]">₹{sent.estimatedBudget}</span>
                <span className="text-[11px] text-emerald-700 block">+ ₹{sent.tip} Tip</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 5: Completed */}
      {subTab === 'completed' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171717]">Scientific Calculator Delivery</h4>
                <p className="text-xs text-[#555555]">Brought by Aman Deep from Central Market</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              Delivered
            </span>
          </div>
        </div>
      )}

    </div>
  );
}