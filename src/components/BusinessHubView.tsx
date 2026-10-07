import React, { useState } from 'react';
import { 
  Building2, 
  Star, 
  MapPin, 
  MessageSquare, 
  ShoppingBag, 
  CheckCircle2, 
  Send, 
  Phone,
  Sparkles
} from 'lucide-react';
import { BusinessPage, ProductItem } from '../types';
import { playPopSound } from '../utils/audio';

interface BusinessHubViewProps {
  businesses: BusinessPage[];
  onOpenChat: (contactName: string) => void;
  onToggleFollowBusiness: (businessId: string) => void;
}

export const BusinessHubView: React.FC<BusinessHubViewProps> = ({
  businesses,
  onOpenChat,
  onToggleFollowBusiness,
}) => {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessPage>(businesses[0]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-red-950 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span>MIZIZI Business & Creator Pages</span>
          <Building2 className="w-6 h-6 text-red-500" />
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          PRD §38–§41: Discover verified African enterprises, browse product catalogs & message directly
        </p>
      </div>

      {/* Business Selector Carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {businesses.map((biz) => {
          const isSelected = selectedBusiness.id === biz.id;

          return (
            <div
              key={biz.id}
              onClick={() => setSelectedBusiness(biz)}
              className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-[#14141d] border-red-500 shadow-xl shadow-red-950/40 ring-1 ring-red-500'
                  : 'bg-[#0e0e13] border-red-950 hover:border-red-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={biz.logoUrl}
                  alt={biz.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-red-950"
                />
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1">
                    <span>{biz.name}</span>
                    {biz.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 fill-red-950 inline" />
                    )}
                  </h3>
                  <p className="text-[11px] text-red-400 font-semibold">{biz.category}</p>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {biz.rating}
                    </span>
                    <span>·</span>
                    <span>{biz.followersCount.toLocaleString()} Followers</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playPopSound();
                  onToggleFollowBusiness(biz.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors border ${
                  biz.isFollowing
                    ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    : 'bg-red-600 text-white border-red-500'
                }`}
              >
                {biz.isFollowing ? 'Following ✓' : '+ Follow'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Business Showcase & Product Catalog */}
      {selectedBusiness && (
        <div className="bg-[#0e0e13] border border-red-950/80 rounded-3xl overflow-hidden shadow-2xl space-y-6">
          {/* Banner */}
          <div className="relative h-44 sm:h-56 bg-black">
            <img
              src={selectedBusiness.bannerUrl}
              alt={selectedBusiness.name}
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e13] via-transparent to-transparent" />

            <div className="absolute bottom-4 left-6 flex items-end gap-3 z-10">
              <img
                src={selectedBusiness.logoUrl}
                alt={selectedBusiness.name}
                className="w-18 h-18 rounded-2xl object-cover border-2 border-red-500 shadow-2xl bg-black"
              />
              <div className="text-white">
                <h2 className="text-xl font-black">{selectedBusiness.name}</h2>
                <p className="text-xs text-red-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedBusiness.location}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 space-y-5">
            {/* Description & Action Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                {selectedBusiness.description}
              </p>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onOpenChat(selectedBusiness.name)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold cursor-pointer shadow-lg shadow-red-950"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message Business</span>
                </button>

                {selectedBusiness.whatsappContact && (
                  <button
                    onClick={() => {
                      const waUrl = `https://api.whatsapp.com/send?phone=${selectedBusiness.whatsappContact}&text=Hello%20${encodeURIComponent(selectedBusiness.name)}%2C%20I%20found%20your%20page%20on%20MIZIZI!`;
                      window.open(waUrl, '_blank');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                )}
              </div>
            </div>

            {/* Product / Services Catalog */}
            <div className="space-y-3 pt-4 border-t border-red-950/60">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Product & Service Offerings</span>
                </h3>
                <span className="text-xs text-zinc-500">
                  {selectedBusiness.products.length} Items Listed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedBusiness.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#14141c] border border-red-950 rounded-2xl p-3.5 space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black mb-2">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-bold text-xs text-white leading-snug">{prod.name}</h4>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-red-950/60 flex items-center justify-between">
                      <span className="text-xs font-black text-red-400 font-mono">
                        {prod.price}
                      </span>
                      <button
                        onClick={() => onOpenChat(selectedBusiness.name)}
                        className="text-[11px] font-bold text-white bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg cursor-pointer"
                      >
                        Inquire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
