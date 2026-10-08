import React from 'react';
import { TrainingLog, SurplusItem } from '../types';
import {
  Award,
  Globe2,
  DollarSign,
  Heart,
  TrendingDown,
} from 'lucide-react';

interface ImpactDashboardProps {
  logs: TrainingLog[];
  surplusListings: SurplusItem[];
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  logs,
  surplusListings,
}) => {
  let totalSavedKg = 0;
  let totalCostSaved = 0;

  logs.forEach((log) => {
    log.dishes.forEach((d) => {
      let w = d.quantityRemaining;
      if (d.unit === 'pieces') w *= 0.06;
      totalSavedKg += w * 0.7;
    });
  });

  const totalMealsProvided = surplusListings.reduce(
    (acc, curr) => acc + (curr.status !== 'AVAILABLE' ? curr.servings : 0),
    120
  );

  const co2OffsetKg = Math.round(totalSavedKg * 2.5);
  const waterSavedLitres = Math.round(totalSavedKg * 250);
  totalCostSaved = Math.round(totalSavedKg * 45);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md">
              ESG & Sustainability Dashboard
            </span>
            <span className="text-xs text-slate-500 font-semibold">Ideathon Impact Metrics</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            FoodSense Environmental & Financial Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Tracking resource efficiency, greenhouse gas reduction, and community meal distribution achieved by hostel mess planning.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-slate-500">Total Food Saved</span>
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {Math.round(totalSavedKg)} <span className="text-sm font-normal text-slate-500">kg</span>
          </div>
          <p className="text-xs text-emerald-700 font-bold">
            Prevented from landfills
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-slate-500">Meals Donated</span>
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {totalMealsProvided} <span className="text-sm font-normal text-slate-500">servings</span>
          </div>
          <p className="text-xs text-amber-700 font-bold">
            Served to nearby shelter homes
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-blue-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-slate-500">CO₂ Offset</span>
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
              <Globe2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {co2OffsetKg} <span className="text-sm font-normal text-slate-500">kg CO₂e</span>
          </div>
          <p className="text-xs text-blue-700 font-bold">
            ~{Math.round(co2OffsetKg / 20)} trees planted equivalent
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-purple-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-slate-500">Mess Budget Saved</span>
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            ₹{totalCostSaved.toLocaleString()}
          </div>
          <p className="text-xs text-purple-700 font-bold">
            Raw ingredient cost reduction
          </p>
        </div>
      </div>

      {/* Sustainable Goals Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          UN Sustainable Development Goals (SDG) Alignment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-extrabold w-fit mb-2">
              SDG 2: Zero Hunger
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 mb-1">Surplus Food Recovery</h4>
            <p className="text-xs text-slate-500 font-medium">
              Directly channels nutritious untouched hostel meals to verified local NGOs (*Asha Food Rescue Foundation* & *Annapurna Seva Trust*).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold w-fit mb-2">
              SDG 12: Responsible Consumption
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 mb-1">Source Waste Reduction</h4>
            <p className="text-xs text-slate-500 font-medium">
              Eliminates overproduction by learning per-student consumption rates for each dish.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-[10px] font-extrabold w-fit mb-2">
              SDG 13: Climate Action
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 mb-1">Methane & Emission Prevention</h4>
            <p className="text-xs text-slate-500 font-medium">
              Prevents organic food decay in landfills ({waterSavedLitres.toLocaleString()}L embedded water preserved).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
