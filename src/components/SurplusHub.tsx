import React, { useState, useEffect } from 'react';
import { SurplusItem, NgoPartner, SurplusStatus } from '../types';
import {
  HeartHandshake,
  MapPin,
  Clock,
  CheckCircle,
  Plus,
  Truck,
  Phone,
  AlertCircle,
  Navigation,
  CheckCheck,
} from 'lucide-react';
import L from 'leaflet';

interface SurplusHubProps {
  surplusListings: SurplusItem[];
  ngos: NgoPartner[];
  onClaimItem: (id: string, ngoName: string) => void;
  onUpdateStatus: (id: string, status: SurplusStatus) => void;
  onAddSurplus: (item: SurplusItem) => void;
}

export const SurplusHub: React.FC<SurplusHubProps> = ({
  surplusListings,
  ngos,
  onClaimItem,
  onUpdateStatus,
  onAddSurplus,
}) => {
  const [selectedNgo, setSelectedNgo] = useState<string>(ngos[0]?.name || 'Asha Food Rescue Network');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State for manual surplus post
  const [dishName, setDishName] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState<'pieces' | 'kg' | 'litres'>('kg');
  const [servings, setServings] = useState<number>(30);
  const [dietaryType, setDietaryType] = useState<'Veg' | 'Non-Veg' | 'Jain'>('Veg');
  const [bestBeforeHours, setBestBeforeHours] = useState<number>(4);

  useEffect(() => {
    // Initialize Leaflet Map safely
    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer) return;

    // Clear any existing map instance on re-render
    (mapContainer as any)._leaflet_id = null;

    const map = L.map('leaflet-map').setView([12.9716, 77.5946], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Custom Icon helper
    const createCustomIcon = (color: string, label: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: ${color}; color: white; padding: 4px 8px; border-radius: 8px; font-weight: bold; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 2px solid white; white-space: nowrap;">${label}</div>`,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });
    };

    // Add Surplus Mess Markers
    surplusListings.forEach((item) => {
      const color = item.status === 'AVAILABLE' ? '#10b981' : item.status === 'CLAIMED' ? '#f59e0b' : '#64748b';
      const marker = L.marker([item.lat, item.lng], {
        icon: createCustomIcon(color, `🍴 ${item.dishName.slice(0, 12)}`),
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px;">
          <b style="color: #10b981;">${item.messName}</b><br/>
          <b>Food:</b> ${item.dishName} (${item.quantity} ${item.unit})<br/>
          <b>Servings:</b> ${item.servings} people<br/>
          <b>Status:</b> ${item.status}
        </div>
      `);
    });

    // Add NGO Markers
    ngos.forEach((ngo) => {
      const marker = L.marker([ngo.lat, ngo.lng], {
        icon: createCustomIcon('#3b82f6', `🏢 ${ngo.name.slice(0, 12)}`),
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px;">
          <b style="color: #3b82f6;">${ngo.name}</b><br/>
          <b>Contact:</b> ${ngo.contactPerson} (${ngo.phone})<br/>
          <b>Capacity:</b> ${ngo.capacityServings} servings/day
        </div>
      `);
    });

    return () => {
      map.remove();
    };
  }, [surplusListings, ngos]);

  const handleManualPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName) return;

    const newItem: SurplusItem = {
      id: `surplus_${Date.now()}`,
      messId: 'user_1',
      messName: 'Sunrise Hostel Mess',
      location: 'Block-B Campus Hub',
      dishName,
      quantity,
      unit,
      servings,
      dietaryType,
      preparedAt: new Date().toISOString().slice(0, 16),
      bestBeforeHours,
      status: 'AVAILABLE',
      pickupContact: '+91 98765 43210',
      lat: 12.9716 + (Math.random() * 0.01 - 0.005),
      lng: 77.5946 + (Math.random() * 0.01 - 0.005),
    };

    onAddSurplus(newItem);
    setShowAddForm(false);
    setDishName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
              Zero-Waste Dispatch
            </span>
            <span className="text-xs text-slate-400">
              Live NGO Food Recovery Pipeline
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Surplus Food Donation Hub
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            When unavoidable leftover food remains, mess staff publish surplus listings. Nearby verified NGOs claim and dispatch pickup teams in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-semibold">Log in as NGO:</span>
            <select
              value={selectedNgo}
              onChange={(e) => setSelectedNgo(e.target.value)}
              className="bg-transparent text-emerald-400 font-bold focus:outline-none"
            >
              {ngos.map((ngo) => (
                <option key={ngo.id} value={ngo.name} className="bg-slate-900 text-white">
                  {ngo.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> Post Surplus
          </button>
        </div>
      </div>

      {/* Interactive Map & Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Map Preview */}
        <div className="lg:col-span-6 glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Live Mess & NGO Spatial Map
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Claimed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> NGO Center
              </span>
            </div>
          </div>
          <div id="leaflet-map" className="w-full flex-1 rounded-xl"></div>
        </div>

        {/* Live Surplus Listings Feed */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            Active Food Claim Feed ({surplusListings.length})
          </h3>

          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {surplusListings.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.status === 'AVAILABLE'
                    ? 'glass-panel-glow border-emerald-500/30'
                    : item.status === 'CLAIMED'
                    ? 'glass-panel border-amber-500/30'
                    : 'glass-panel border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{item.dishName}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          item.dietaryType === 'Veg'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {item.dietaryType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {item.messName} • {item.location}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                      item.status === 'AVAILABLE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : item.status === 'CLAIMED'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 my-2 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">Quantity</div>
                    <div className="font-bold text-slate-200">
                      {item.quantity} {item.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Servings</div>
                    <div className="font-bold text-slate-200">
                      ~{item.servings} people
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Safe Window</div>
                    <div className="font-bold text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.bestBeforeHours} hrs left
                    </div>
                  </div>
                </div>

                {/* Actions & Status Updates */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-400">
                    {item.claimedByNgo ? (
                      <span className="text-amber-300 font-semibold">
                        Claimed by {item.claimedByNgo}
                      </span>
                    ) : (
                      <span>Contact: {item.pickupContact}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {item.status === 'AVAILABLE' && (
                      <button
                        onClick={() => onClaimItem(item.id, selectedNgo)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                      >
                        Claim for {selectedNgo.split(' ')[0]}
                      </button>
                    )}

                    {item.status === 'CLAIMED' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'EN_ROUTE')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1"
                      >
                        <Truck className="w-3 h-3" /> Dispatch Pickup
                      </button>
                    )}

                    {item.status === 'EN_ROUTE' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'COMPLETED')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-300 bg-blue-500/20 border border-blue-500/40 hover:bg-blue-500/30 flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" /> Confirm Distributed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Surplus Post Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="glass-panel-glow w-full max-w-md rounded-2xl p-6 text-slate-100 relative shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Post Unavoidable Surplus Food
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Make leftover food visible on the live NGO map.
            </p>

            <form onSubmit={handleManualPost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dish Details
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapathi & Dal Tadka"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Quantity & Unit
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      required
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      className="w-2/3 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white"
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as any)}
                      className="w-1/3 bg-slate-900 border border-slate-700 rounded-xl px-1 py-2 text-xs text-white"
                    >
                      <option value="kg">kg</option>
                      <option value="pieces">pcs</option>
                      <option value="litres">L</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estimated Servings
                  </label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Dietary Category
                  </label>
                  <select
                    value={dietaryType}
                    onChange={(e) => setDietaryType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Veg">Vegetarian</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Jain">Jain Veg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Best Before (Hours)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={12}
                    value={bestBeforeHours}
                    onChange={(e) => setBestBeforeHours(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
