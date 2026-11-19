// src/pages/MarketplaceDetailsPage.jsx
import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bookmark, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  Share2, 
  Flag, 
  ShieldAlert, 
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import MarketplaceEnquiryModal from '../components/MarketplaceEnquiryModal';

export default function MarketplaceDetailsPage({ item, onClose, onToggleSave }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [reported, setReported] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isRent = item.type === 'rent';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReport = () => {
    if (window.confirm('Report this listing for review by campus moderators?')) {
      setReported(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-[#D5D1C9] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Sticky Modal Top Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
              isRent ? 'bg-amber-100 text-amber-800' : 'bg-stone-900 text-white'
            }`}>
              {isRent ? 'For Rent' : 'For Sale'}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share listing"
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition text-xs flex items-center gap-1"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
            </button>
            <button
              onClick={() => onToggleSave(item.id)}
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition"
              title={item.isSaved ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${item.isSaved ? 'fill-current text-amber-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Photo Gallery */}
            <div className="space-y-3">
              {/* Main Photo */}
              <div className="w-full h-72 sm:h-80 rounded-2xl bg-stone-100 overflow-hidden border border-stone-200 relative">
                <img
                  src={item.images[activeImageIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-[10px] font-semibold rounded-md backdrop-blur-md">
                  {activeImageIndex + 1} / {item.images.length}
                </span>
              </div>

              {/* Thumbnails */}
              {item.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                        activeImageIndex === idx ? 'border-[#171717]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Item Condition & Specs */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500">Condition</span>
                  <span className="font-semibold text-stone-800">{item.condition}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500">Location</span>
                  <span className="font-semibold text-stone-800">{item.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500">Posted</span>
                  <span className="font-semibold text-stone-800">{item.postedDate}</span>
                </div>
                {isRent && item.securityDeposit && (
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">Refundable Security Deposit</span>
                    <span className="font-semibold text-stone-800">₹{item.securityDeposit}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Title, Pricing & Seller Card */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Title & Price Header */}
                <div>
                  <h2 className="text-2xl font-bold text-[#171717] tracking-tight leading-snug">
                    {item.title}
                  </h2>
                  <div className="mt-2 text-2xl md:text-3xl font-extrabold text-[#171717]">
                    {isRent ? (
                      <>
                        ₹{item.rentalRate}
                        <span className="text-sm font-normal text-stone-500"> / {item.rentalPeriod}</span>
                      </>
                    ) : (
                      <>₹{item.price}</>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                    Description
                  </h4>
                  <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>

                {/* Seller Profile Box */}
                <div className="p-4 bg-stone-50 border border-[#D5D1C9] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.seller.avatar}
                      alt={item.seller.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900 text-sm">{item.seller.name}</span>
                        {item.seller.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" /> Verified Student
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 truncate">{item.seller.department}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-200 grid grid-cols-2 gap-2 text-[11px] text-stone-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Replies in {item.seller.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{item.seller.salesCount} campus listings</span>
                    </div>
                  </div>
                </div>

                {/* Campus Safety Notice */}
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Campus Community Safety:</strong> Meet in common areas (e.g. library lobby or student union). Inspect all items thoroughly before completing transactions.
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEnquiryModal(true)}
                  className="w-full py-3 bg-[#171717] hover:bg-[#333333] text-white font-semibold text-sm rounded-xl shadow transition flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>I'm Interested / Send Enquiry</span>
                </button>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <button
                    type="button"
                    onClick={handleReport}
                    className="hover:text-rose-600 flex items-center gap-1 text-[11px]"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{reported ? 'Reported (Under Review)' : 'Report this listing'}</span>
                  </button>
                  <span className="text-[11px]">Protected by CampusConnect</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Message Modal */}
      {showEnquiryModal && (
        <MarketplaceEnquiryModal
          item={item}
          onClose={() => setShowEnquiryModal(false)}
          onSubmitSuccess={(data) => {
            console.log('Enquiry logged:', data);
          }}
        />
      )}
    </div>
  );
}