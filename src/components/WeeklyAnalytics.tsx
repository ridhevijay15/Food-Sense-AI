import React from 'react';
import { TrainingLog } from '../types';
import { calculateWeeklyAnalytics } from '../utils/predictor';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar as ChartBar, Line as ChartLine } from 'react-chartjs-2';
import { TrendingDown, AlertCircle, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyAnalyticsProps {
  logs: TrainingLog[];
}

export const WeeklyAnalytics: React.FC<WeeklyAnalyticsProps> = ({ logs }) => {
  const { weeks, topWastedDishes } = calculateWeeklyAnalytics(logs);

  const weekLabels = weeks.map((w) => w.weekLabel);
  const wastePctData = weeks.map((w) => w.wastePct);
  const cookedKgData = weeks.map((w) => w.totalCookedKg);
  const wastedKgData = weeks.map((w) => w.totalWastedKg);

  // Line Chart Config for Waste % Trend
  const lineChartData = {
    labels: weekLabels,
    datasets: [
      {
        label: 'Food Waste Rate (%)',
        data: wastePctData,
        borderColor: '#059669',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#059669',
        pointBorderColor: '#ffffff',
        pointRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#334155', font: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' as const } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#10b981',
        borderColor: '#e2e8f0',
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' }, min: 0 },
    },
  };

  // Bar Chart Config for Prepared vs Leftover Weight
  const barChartData = {
    labels: weekLabels,
    datasets: [
      {
        label: 'Total Prepared (kg)',
        data: cookedKgData,
        backgroundColor: '#2563eb',
        borderRadius: 8,
      },
      {
        label: 'Leftover Wasted (kg)',
        data: wastedKgData,
        backgroundColor: '#d97706',
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#334155', font: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' as const } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        borderColor: '#e2e8f0',
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
    },
  };

  const week1Waste = weeks[0]?.wastePct || 0;
  const week4Waste = weeks[3]?.wastePct || 0;
  const wasteImprovementPct = Math.max(0, Math.round((week1Waste - week4Waste) * 10) / 10);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md">
              Week-Wise Analytics
            </span>
            <span className="text-xs text-slate-500 font-semibold">4-Week Training Period Comparison</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Mess Waste & Consumption Trends
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            As FoodSense learns from your 1-month daily logs, notice how waste percentages drop significantly between Week 1 and Week 4!
          </p>
        </div>

        {wasteImprovementPct > 0 && (
          <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500">
                Model Efficiency Gain
              </div>
              <div className="text-lg font-extrabold text-emerald-700">
                -{wasteImprovementPct}% Waste Reduction
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Week Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {weeks.map((w, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden"
          >
            <div className="text-xs font-bold text-slate-500 mb-1">{w.weekLabel}</div>
            <div className="text-2xl font-extrabold text-slate-900 mb-2">{w.wastePct}% <span className="text-xs text-slate-400 font-normal">waste rate</span></div>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Total Cooked:</span>
                <span className="font-extrabold text-slate-900">{w.totalCookedKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Leftover:</span>
                <span className="font-extrabold text-amber-700">{w.totalWastedKg} kg</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste % Line Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Weekly Waste Percentage Trend (%)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Shows progressive drop in leftover food percentage
              </p>
            </div>
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </span>
          </div>
          <div className="h-64">
            <ChartLine data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Prepared vs Leftover Weight Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Prepared vs. Leftover Quantity (kg)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Comparing total food prepared against leftover waste per week
              </p>
            </div>
            <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <PieChart className="w-5 h-5" />
            </span>
          </div>
          <div className="h-64">
            <ChartBar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Top Excess / Wasted Dishes Leaderboard */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Top Overcooked Dishes (Require Precision Planning)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Dishes with the highest historical leftover accumulation in your mess
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {topWastedDishes.map((dish, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 font-extrabold">#{idx + 1}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                  Excess
                </span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 mb-1">{dish.dishName}</div>
              <div className="text-lg font-extrabold text-amber-700">
                {dish.totalWastedKg} kg <span className="text-[10px] text-slate-500 font-normal">wasted</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
