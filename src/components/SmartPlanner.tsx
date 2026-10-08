import React, { useState } from 'react';
import { TrainingLog, MealType, SurplusItem, UserProfile } from '../types';
import { generatePrepRecommendation } from '../utils/predictor';
import {
  BrainCircuit,
  Users,
  Sliders,
  Sparkles,
  CheckCircle2,
  Send,
  TrendingDown,
  DollarSign,
} from 'lucide-react';

interface SmartPlannerProps {
  logs: TrainingLog[];
  currentUser: UserProfile | null;
  onPostSurplus: (item: SurplusItem) => void;
}

export const SmartPlanner: React.FC<SmartPlannerProps> = ({
  logs,
  currentUser,
  onPostSurplus,
}) => {
  const [mealType, setMealType] = useState<MealType>('Lunch');
  const [expectedHeadcount, setExpectedHeadcount] = useState<number>(120);
  const [safetyBufferPct, setSafetyBufferPct] = useState<number>(8);
  const [postSuccessMessage, setPostSuccessMessage] = useState<string | null>(null);

  const plan = generatePrepRecommendation(
    logs,
    mealType,
    expectedHeadcount,
    safetyBufferPct
  );

  const handlePostRemainingToNgo = (dishName: string, estimatedSavedQty: number, unit: any) => {
    const newItem: SurplusItem = {
      id: `surplus_${Date.now()}`,
      messId: currentUser?.id || 'user_1',
      messName: currentUser?.messName || 'Sunrise Hostel Mess',
      location: currentUser?.location || 'Sector 4, Campus Hub',
      dishName: `${dishName} (Surplus Batch)`,
      quantity: estimatedSavedQty,
      unit,
      servings: Math.round(estimatedSavedQty * (unit === 'pieces' ? 0.5 : 3)),
      dietaryType: 'Veg',
      preparedAt: new Date().toISOString().slice(0, 16),
      bestBeforeHours: 4,
      status: 'AVAILABLE',
      pickupContact: '+91 98765 43210',
      lat: 12.9716,
      lng: 77.5946,
    };

    onPostSurplus(newItem);
    setPostSuccessMessage(`Posted ${estimatedSavedQty} ${unit} of ${dishName} to the NGO Portal!`);
    setTimeout(() => setPostSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-emerald-600" /> Step 2: Predictive Meal Calculator
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Trained on {logs.length} historical meal records
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recommended Cooking Quantities per Dish
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
              Enter the expected number of students. FoodSense calculates the exact required cooking quantities for each dish based on your 1-month training data.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <div className="text-[10px] text-emerald-800 font-extrabold uppercase">Estimated Food Saved</div>
              <div className="text-xl font-extrabold text-emerald-700">
                {plan.totalFoodSavedKg} kg
              </div>
            </div>
            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <div className="text-[10px] text-amber-800 font-extrabold uppercase">Estimated Budget Saved</div>
              <div className="text-xl font-extrabold text-amber-700">
                ₹{plan.totalCostSaved}
              </div>
            </div>
          </div>
        </div>
      </div>

      {postSuccessMessage && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {postSuccessMessage}
        </div>
      )}

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Meal Session Selection */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
            1. Select Meal Session
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Breakfast', 'Lunch', 'Dinner'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all ${
                  mealType === type
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {type === 'Breakfast' ? 'Morning' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Expected Number of Students */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
            2. Enter Number of Students
          </label>
          <div className="relative">
            <Users className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-600" />
            <input
              type="number"
              min={10}
              max={5000}
              value={expectedHeadcount}
              onChange={(e) => setExpectedHeadcount(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              placeholder="e.g. 120"
            />
          </div>
        </div>

        {/* Safety Buffer Slider */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Safety Buffer: <span className="text-emerald-600 font-extrabold">{safetyBufferPct}%</span>
            </label>
            <Sliders className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="range"
            min={2}
            max={25}
            value={safetyBufferPct}
            onChange={(e) => setSafetyBufferPct(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
            <span>2% (Zero Waste)</span>
            <span>8% (Optimal)</span>
            <span>25% (High Safety)</span>
          </div>
        </div>
      </div>

      {/* Generated Recommendation Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              FoodSense Prep Recommendations for {expectedHeadcount} Students ({mealType})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Calculated from your 1-month mess training averages + {safetyBufferPct}% buffer
          </span>
        </div>

        {plan.dishes.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No historical training data found for {mealType}. Please log training meals in the Training Logger tab.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Dish Name</th>
                  <th className="py-3.5 px-4">Per-Student Rate</th>
                  <th className="py-3.5 px-4">Old Unplanned Prep</th>
                  <th className="py-3.5 px-4">FoodSense Recommended Prep</th>
                  <th className="py-3.5 px-4">Estimated Saved</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {plan.dishes.map((dish, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                      {dish.dishName}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {dish.perPersonRate} {dish.unit} / student
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-400 line-through whitespace-nowrap">
                      {dish.traditionalOvercookQty} {dish.unit}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300 text-sm">
                        {dish.recommendedQty} {dish.unit}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-amber-700">
                        +{dish.estimatedSavedQty} {dish.unit}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        (₹{dish.estimatedMoneySaved} saved)
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() =>
                          handlePostRemainingToNgo(
                            dish.dishName,
                            dish.estimatedSavedQty,
                            dish.unit
                          )
                        }
                        className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all flex items-center gap-1.5 ml-auto"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Post Surplus to NGO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
