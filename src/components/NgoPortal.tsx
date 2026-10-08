import React, { useState, useEffect } from 'react';
import { SurplusItem, NgoPartner, SurplusStatus } from '../types';
import {
  HeartHandshake,
  MapPin,
  Clock,
  Truck,
  Building2,
  CheckCheck,
  ShieldCheck,
} from 'lucide-react';
import L from 'leaflet';

interface NgoPortalProps {
  surplusListings: SurplusItem[];
  ngos: NgoPartner[];
  onClaimItem: (id: string, ngoName: string) => void;
  onUpdateStatus: (id: string, status: SurplusStatus) => void;
}

export const NgoPortal: React.FC<NgoPortalProps> = ({
  surplusListings,
  ngos,
  onClaimItem,
  onUpdateStatus,
}) => {
  const [selectedNgoId, setSelectedNgoId] = useState<string>(ngos[0]?.id || 'ngo_1');
  const activeNgo = ngos.find((n) => n.id === selectedNgoId) || ngos[0];

  useEffect(() => {
    const mapContainer = document.getElementById('ngo-portal-map');
    if (!mapContainer) return;

    (mapContainer as any)._leaflet_id = null;

    const map = L.map('ngo-portal-map').setView([12.9716, 77.5946], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const createCustomIcon = (color: string, label: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 8px; font-weight: bold; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); border: 2px solid white; white-space: nowrap;">${label}</div>`,
        iconSize: [90, 30],
        iconAnchor: [45, 15],
      });
    };

    // Mess Surplus Markers
    surplusListings.forEach((item) => {
      const color = item.status === 'AVAILABLE' ? '#10b981' : item.status === 'CLAIMED' ? '#f59e0b' : '#3b82f6';
      const marker = L.marker([item.lat, item.lng], {
        icon: createCustomIcon(color, `🍴 ${item.dishName.slice(0, 10)}`),
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
          <b style="color: #10b981;">${item.messName}</b><br/>
          <b>Food:</b> ${item.dishName} (${item.quantity} ${item.unit})<br/>
          <b>Servings:</b> ${item.servings} people<br/>
          <b>Status:</b> <span style="color: ${color}; font-weight: bold;">${item.status}</span>
        </div>
      `);
    });

    // 2 NGO Markers
    ngos.forEach((ngo) => {
      const marker = L.marker([ngo.lat, ngo.lng], {
        icon: createCustomIcon('#2563eb', `🏢 ${ngo.name.slice(0, 12)}`),
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
          <b style="color: #2563eb;">${ngo.name}</b><br/>
          <b>Contact:</b> ${ngo.contactPerson} (${ngo.phone})<br/>
          <b>Capacity:</b> ${ngo.capacityServings} servings/day
        </div>
      `);
    });

    return () => {
      map.remove();
    };
  }, [surplusListings, ngos, selectedNgoId]);

  return (
    <div className="space-y-6">
      {/* Top NGO Portal Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-emerald-600/15 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white rounded-lg backdrop-blur-md flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4" /> Dedicated NGO Partner Portal
              </span>
              <span className="text-xs text-emerald-100 font-medium">
                Real-Time Food Claims
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Surplus Food Recovery Network
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mt-1">
              Hostel messes post untouched surplus meals after dinner/lunch. Verified NGOs claim available batches and dispatch pickup drivers.
            </p>
          </div>

          {/* NGO Selector */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl w-full md:w-auto">
            <div className="text-[10px] uppercase font-bold text-emerald-100 mb-1.5">
              Select Active NGO Partner Account:
            </div>
            <div className="flex gap-2">
              {ngos.map((ngo) => (
                <button
                  key={ngo.id}
                  onClick={() => setSelectedNgoId(ngo.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedNgoId === ngo.id
                      ? 'bg-white text-emerald-800 shadow-md'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {ngo.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active NGO Badge Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-lg border border-blue-200">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">
                {activeNgo.name}
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" /> Verified Partner
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact: {activeNgo.contactPerson} ({activeNgo.phone}) • {activeNgo.address}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-center sm:text-right">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Daily Distribution Capacity</div>
          <div className="text-base font-extrabold text-slate-900">
            {activeNgo.capacityServings} meals/day
          </div>
        </div>
      </div>

      {/* Map & Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spatial Leaflet Map */}
        <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Live Mess $\rightarrow$ NGO Spatial Map
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Claimed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> NGO Center
              </span>
            </div>
          </div>
          <div id="ngo-portal-map" className="w-full flex-1 rounded-xl"></div>
        </div>

        {/* Live Claim Feed */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            Available Mess Food Listings ({surplusListings.length})
          </h3>

          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {surplusListings.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.status === 'AVAILABLE'
                    ? 'bg-white border-emerald-300 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                    : item.status === 'CLAIMED'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">{item.dishName}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          item.dietaryType === 'Veg'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {item.dietaryType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {item.messName} • {item.location}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                      item.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : item.status === 'CLAIMED'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-200/80 my-3 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Quantity</div>
                    <div className="font-extrabold text-slate-800">
                      {item.quantity} {item.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Servings</div>
                    <div className="font-extrabold text-slate-800">
                      ~{item.servings} students/people
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Safe Window</div>
                    <div className="font-extrabold text-amber-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.bestBeforeHours} hrs left
                    </div>
                  </div>
                </div>

                {/* Claim Buttons & Status Timeline */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-500 font-medium">
                    {item.claimedByNgo ? (
                      <span className="text-amber-700 font-bold">
                        Claimed by {item.claimedByNgo}
                      </span>
                    ) : (
                      <span>Pickup Contact: {item.pickupContact}</span>
                    )}
                  </div>

                  <div>
                    {item.status === 'AVAILABLE' && (
                      <button
                        onClick={() => onClaimItem(item.id, activeNgo.name)}
                        className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 transition-all"
                      >
                        Claim for {activeNgo.name.split(' ')[0]}
                      </button>
                    )}

                    {item.status === 'CLAIMED' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'EN_ROUTE')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-amber-800 bg-amber-100 border border-amber-300 hover:bg-amber-200 transition-all flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" /> Dispatch Pickup Vehicle
                      </button>
                    )}

                    {item.status === 'EN_ROUTE' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'COMPLETED')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-blue-800 bg-blue-100 border border-blue-300 hover:bg-blue-200 transition-all flex items-center gap-1.5"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Confirm Distributed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
