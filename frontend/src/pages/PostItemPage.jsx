// src/pages/PostItemPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  MapPin, 
  Tag, 
  AlertCircle 
} from 'lucide-react';
import { MARKETPLACE_CATEGORIES } from '../data/marketplaceData';

export default function PostItemPage() {
  const navigate = useNavigate();

  // Form State
  const [listingType, setListingType] = useState('sale'); // 'sale' | 'rent'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('books');
  const [condition, setCondition] = useState('Like New');
  const [price, setPrice] = useState('');
  const [rentalRate, setRentalRate] = useState('');
  const [rentalPeriod, setRentalPeriod] = useState('month');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle local image upload preview
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      setErrorMsg('You can upload a maximum of 5 photos.');
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    setErrorMsg('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Please enter an item title.');
      return;
    }
    if (listingType === 'sale' && (!price || Number(price) <= 0)) {
      setErrorMsg('Please specify a valid sale price.');
      return;
    }
    if (listingType === 'rent' && (!rentalRate || Number(rentalRate) <= 0)) {
      setErrorMsg('Please specify a valid rental rate.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please specify a campus pickup location.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a brief description of the item.');
      return;
    }

    // Success simulation
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/marketplace/my-listings');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#EDEBE6] py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/marketplace')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>

        {/* Card Form Wrapper */}
        <div className="bg-white rounded-3xl border border-[#D5D1C9] p-6 sm:p-10 shadow-sm">
          
          {/* Header */}
          <div className="border-b border-stone-200 pb-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#171717] tracking-tight">
              Post an Item
            </h1>
            <p className="mt-1 text-xs md:text-sm text-stone-500">
              List textbooks, cycles, appliances, and study gear for students on campus.
            </p>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="block text-sm font-bold">Listing Published!</strong>
                <span className="text-xs">Your item is now visible to students across campus. Redirecting to My Listings...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Listing Type Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Listing Type *
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                <button
                  type="button"
                  onClick={() => setListingType('sale')}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold border transition text-center ${
                    listingType === 'sale'
                      ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Sell this Item
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('rent')}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold border transition text-center ${
                    listingType === 'rent'
                      ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  Rent this Item
                </button>
              </div>
            </div>

            {/* Item Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hero Kyoto 26T Mountain Cycle / Thomas Calculus 14th Ed"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717] focus:bg-white"
                required
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                >
                  {MARKETPLACE_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                >
                  <option value="New">New (Unopened / Tagged)</option>
                  <option value="Like New">Like New (Mint condition)</option>
                  <option value="Good">Good (Minor cosmetic wear)</option>
                  <option value="Fair">Fair (Fully functional with signs of use)</option>
                </select>
              </div>
            </div>

            {/* Pricing Section */}
            {listingType === 'sale' ? (
              <div className="max-w-xs">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Sale Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 850"
                    className="w-full pl-8 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Rental Rate (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={rentalRate}
                      onChange={(e) => setRentalRate(e.target.value)}
                      placeholder="e.g. 350"
                      className="w-full pl-8 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Per Period *
                  </label>
                  <select
                    value={rentalPeriod}
                    onChange={(e) => setRentalPeriod(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                  >
                    <option value="day">Per Day</option>
                    <option value="week">Per Week</option>
                    <option value="month">Per Month</option>
                    <option value="semester">Per Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                    Refundable Deposit (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full pl-8 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Campus Pickup Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                General Campus Location *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hostel Block 4 / Central Library / North Gate"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]"
                  required
                />
              </div>
              <p className="mt-1 text-[11px] text-stone-400">
                For your safety, list a public campus landmark rather than your private room number.
              </p>
            </div>

            {/* Multi-Photo Upload Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Item Photos (Max 5)
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative w-full h-28 rounded-xl border border-stone-200 overflow-hidden group">
                    <img src={imgUrl} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-white rounded-full hover:bg-black transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="w-full h-28 rounded-xl border-2 border-dashed border-stone-300 hover:border-stone-500 bg-stone-50 flex flex-col items-center justify-center cursor-pointer transition text-stone-500 hover:text-stone-800">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[11px] font-semibold">Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                Clear real photos get 3x more campus enquiries.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Item Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include specifications, edition, reason for selling, working status, or any accessories included..."
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#171717] focus:bg-white"
                required
              />
            </div>

            {/* Submit & Cancel Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                className="px-5 py-2.5 text-sm font-semibold text-stone-600 hover:text-stone-900 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSuccess}
                className="px-7 py-3 bg-[#171717] hover:bg-[#333333] text-white text-sm font-bold rounded-xl shadow transition active:scale-[0.98] disabled:opacity-50"
              >
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}