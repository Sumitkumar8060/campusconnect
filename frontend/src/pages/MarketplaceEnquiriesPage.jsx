// src/pages/MarketplaceEnquiriesPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Inbox, 
  Send, 
  Check, 
  X, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { INITIAL_DEMO_ENQUIRIES } from '../data/marketplaceData';

export default function MarketplaceEnquiriesPage() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState(INITIAL_DEMO_ENQUIRIES);
  const [directionTab, setDirectionTab] = useState('received'); // 'received' | 'sent'

  const handleUpdateStatus = (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((enq) => (enq.id === id ? { ...enq, status: newStatus } : enq))
    );
  };

  const displayedEnquiries = enquiries.filter((e) => e.direction === directionTab);

  return (
    <div className="min-h-screen bg-[#EDEBE6] py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/marketplace')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight">
            Marketplace Enquiries
          </h1>
          <p className="text-xs md:text-sm text-stone-500 mt-1">
            Track inquiries, agree on meetup points, and coordinate safe item handoffs.
          </p>
        </div>

        {/* Direction Switcher Tabs */}
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-[#D5D1C9] max-w-sm">
          <button
            onClick={() => setDirectionTab('received')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              directionTab === 'received'
                ? 'bg-[#171717] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Received ({enquiries.filter((e) => e.direction === 'received').length})</span>
          </button>
          <button
            onClick={() => setDirectionTab('sent')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              directionTab === 'sent'
                ? 'bg-[#171717] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sent ({enquiries.filter((e) => e.direction === 'sent').length})</span>
          </button>
        </div>

        {/* Enquiries List */}
        {displayedEnquiries.length > 0 ? (
          <div className="space-y-4">
            {displayedEnquiries.map((enq) => {
              const isReceived = enq.direction === 'received';
              const name = isReceived ? enq.senderName : enq.recipientName;
              const dept = isReceived ? enq.senderDept : enq.recipientDept;
              const avatar = isReceived ? enq.senderAvatar : enq.recipientAvatar;

              return (
                <div
                  key={enq.id}
                  className="bg-white border border-[#D5D1C9] rounded-2xl p-5 shadow-sm space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatar}
                        alt={name}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900 text-sm">{name}</span>
                          <span className="text-[10px] text-stone-400 font-medium">({dept})</span>
                        </div>
                        <span className="text-[11px] text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {enq.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        enq.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : enq.status === 'declined'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  {/* Item Preview Card */}
                  <div className="flex items-center gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl">
                    <img
                      src={enq.itemImage}
                      alt={enq.itemTitle}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-stone-400 font-semibold uppercase">Listing</span>
                      <h4 className="text-xs font-bold text-stone-900 truncate">{enq.itemTitle}</h4>
                      <p className="text-xs font-semibold text-emerald-700">{enq.itemPrice}</p>
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 leading-relaxed border border-stone-100">
                    "{enq.message}"
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-stone-400">
                      {isReceived ? 'Respond to student directly' : 'Awaiting seller confirmation'}
                    </span>

                    {isReceived && enq.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(enq.id, 'declined')}
                          className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(enq.id, 'accepted')}
                          className="px-4 py-1.5 bg-[#171717] hover:bg-[#333333] text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept & Schedule Meetup
                        </button>
                      </div>
                    )}

                    {enq.status === 'accepted' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Meetup arranged
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#D5D1C9] rounded-3xl p-12 text-center max-w-md mx-auto">
            <Inbox className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-bold text-stone-800 text-base">No {directionTab} enquiries</h3>
            <p className="text-xs text-stone-500 mt-1">
              {directionTab === 'received'
                ? 'When students express interest in your items, their messages will show up here.'
                : "You haven't enquired about any items yet. Explore the marketplace to find textbooks, electronics, and gear!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}