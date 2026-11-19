import React, { useState } from 'react';
import {
  Check,
  X,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export default function MyListingsTab({
  rooms,
  setRooms,
  flatmates,
  setFlatmates,
  receivedEnquiries,
  setReceivedEnquiries,
  sentEnquiries,
}) {
  const [subTab, setSubTab] = useState('rooms');
  const [feedback, setFeedback] = useState(null);

  const myRooms = rooms.filter((r) => r.isMine);
  const myFlatmatePosts = flatmates.filter((f) => f.isMine);

  const handleDeleteRoom = (id) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    setFeedback('Room listing removed.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteFlatmatePost = (id) => {
    setFlatmates((prev) => prev.filter((f) => f.id !== id));
    setFeedback('Flatmate requirement removed.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAcceptEnquiry = (id) => {
    setReceivedEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Accepted' } : e))
    );
    setFeedback('Enquiry accepted! (Demo status updated).');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleRejectEnquiry = (id) => {
    setReceivedEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Rejected' } : e))
    );
    setFeedback('Enquiry declined.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          {feedback}
        </div>
      )}

      {/* 4 Sub-Tabs */}
      <div className="flex border-b border-[#D5D1C9] space-x-6 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'rooms', label: `My Room Listings (${myRooms.length})` },
          { key: 'flatmates', label: `My Flatmate Posts (${myFlatmatePosts.length})` },
          { key: 'received', label: `Enquiries Received (${receivedEnquiries.length})` },
          { key: 'sent', label: `Enquiries Sent (${sentEnquiries.length})` },
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

      {/* 1. My Room Listings */}
      {subTab === 'rooms' && (
        <div className="space-y-4">
          {myRooms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#D5D1C9]">
              <p className="text-sm text-[#555555]">You haven't listed any rooms yet.</p>
            </div>
          ) : (
            myRooms.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-white bg-[#171717] px-2.5 py-0.5 rounded-full">
                      {r.roomType}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {r.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#171717] mt-1.5">{r.title}</h4>
                  <p className="text-xs text-[#555555] mt-1">₹{r.monthlyRent}/mo • {r.location}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteRoom(r.id)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                >
                  Delete Listing
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. My Flatmate Posts */}
      {subTab === 'flatmates' && (
        <div className="space-y-4">
          {myFlatmatePosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#D5D1C9]">
              <p className="text-sm text-[#555555]">You haven't posted any flatmate requirements yet.</p>
            </div>
          ) : (
            myFlatmatePosts.map((f) => (
              <div
                key={f.id}
                className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] font-bold text-[#171717] bg-[#EDEBE6] px-2.5 py-0.5 rounded-full">
                    Seeking {f.roommatesNeeded} Roommate{f.roommatesNeeded > 1 ? 's' : ''}
                  </span>
                  <h4 className="text-base font-bold text-[#171717] mt-1.5">{f.title}</h4>
                  <p className="text-xs text-[#555555] mt-1">Budget: ₹{f.monthlyBudget}/mo • {f.preferredLocation}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteFlatmatePost(f.id)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                >
                  Remove Post
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Enquiries Received */}
      {subTab === 'received' && (
        <div className="space-y-4">
          {receivedEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <img src={enq.sender.avatar} alt={enq.sender.name} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#171717]">{enq.sender.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      enq.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#171717] mt-1">For: {enq.roomTitle}</p>
                  <p className="text-xs text-[#555555] mt-0.5 italic">"{enq.message}"</p>
                </div>
              </div>

              {enq.status === 'Pending' && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleAcceptEnquiry(enq.id)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold bg-[#171717] text-white hover:bg-[#333333] cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectEnquiry(enq.id)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. Enquiries Sent */}
      {subTab === 'sent' && (
        <div className="space-y-4">
          {sentEnquiries.map((sent) => (
            <div
              key={sent.id}
              className="p-5 rounded-2xl bg-white border border-[#D5D1C9] shadow-sm flex items-center justify-between"
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  sent.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {sent.status}
                </span>
                <h4 className="text-sm font-bold text-[#171717] mt-1">{sent.roomTitle}</h4>
                <p className="text-xs text-[#555555]">Owner: {sent.ownerName} • {sent.location}</p>
              </div>

              <span className="text-sm font-bold text-[#171717]">₹{sent.monthlyRent}/mo</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}