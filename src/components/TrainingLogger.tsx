import React, { useState } from 'react';
import { TrainingLog, MealType, DishUnit, DishRecord } from '../types';
import {
  Plus,
  Calendar,
  Users,
  Search,
  Filter,
  Trash2,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react';

interface TrainingLoggerProps {
  logs: TrainingLog[];
  onAddLog: (newLog: TrainingLog) => void;
  onDeleteLog: (id: string) => void;
  onResetLogs: () => void;
  onLoadSampleLogs: () => void;
}

export const TrainingLogger: React.FC<TrainingLoggerProps> = ({
  logs,
  onAddLog,
  onDeleteLog,
  onResetLogs,
  onLoadSampleLogs,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterMealType, setFilterMealType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State for logging meal data
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState<MealType>('Lunch');
  const [headcount, setHeadcount] = useState<number>(120);
  const [dishes, setDishes] = useState<Omit<DishRecord, 'id'>[]>([
    { dishName: 'Chapathi', quantityCooked: 250, quantityRemaining: 23, unit: 'pieces' },
    { dishName: 'Steamed Rice', quantityCooked: 30, quantityRemaining: 4, unit: 'kg' },
    { dishName: 'Dal Tadka', quantityCooked: 20, quantityRemaining: 2.5, unit: 'litres' },
  ]);

  const handleAddDishRow = () => {
    setDishes([
      ...dishes,
      { dishName: '', quantityCooked: 0, quantityRemaining: 0, unit: 'kg' },
    ]);
  };

  const handleRemoveDishRow = (index: number) => {
    if (dishes.length === 1) return;
    setDishes(dishes.filter((_, idx) => idx !== index));
  };

  const handleDishChange = (
    index: number,
    field: keyof Omit<DishRecord, 'id'>,
    value: any
  ) => {
    const updated = [...dishes];
    updated[index] = { ...updated[index], [field]: value };
    setDishes(updated);
  };

  const handleSubmitNewLog = (e: React.FormEvent) => {
    e.preventDefault();
    const validDishes: DishRecord[] = dishes
      .filter((d) => d.dishName.trim().length > 0)
      .map((d, idx) => ({
        id: `dish_${Date.now()}_${idx}`,
        dishName: d.dishName.trim(),
        quantityCooked: Number(d.quantityCooked) || 0,
        quantityRemaining: Number(d.quantityRemaining) || 0,
        unit: d.unit,
      }));

    if (validDishes.length === 0) return;

    const newLog: TrainingLog = {
      id: `log_${Date.now()}`,
      date: logDate,
      mealType,
      headcount: Number(headcount) || 1,
      dishes: validDishes,
      loggedBy: 'Mess Manager',
      createdAt: new Date().toISOString(),
    };

    onAddLog(newLog);
    setShowAddModal(false);
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesMeal = filterMealType === 'ALL' || log.mealType === filterMealType;
    const matchesSearch =
      searchTerm.trim() === '' ||
      log.date.includes(searchTerm) ||
      log.dishes.some((d) => d.dishName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesMeal && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md">
              Training Period Data Logger
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {logs.length} Meal Records Logged
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            1-Month Mess Training Database
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Log daily meal food details (Morning / Breakfast, Lunch, Dinner with student headcount, food cooked, and leftover remaining) to train your mess model.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {logs.length === 0 ? (
            <button
              onClick={onLoadSampleLogs}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Auto-Fill 30-Day Sample Data
            </button>
          ) : (
            <button
              onClick={onResetLogs}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 transition-all"
            >
              Clear My Logs
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Daily Meal Record
          </button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search date (YYYY-MM-DD) or dish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Meal Session:
          </span>
          {['ALL', 'Breakfast', 'Lunch', 'Dinner'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterMealType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterMealType === type
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              {type === 'ALL' ? 'All Meals' : type === 'Breakfast' ? 'Morning / Breakfast' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Historical Training Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-800">
              Training Meal Records ({filteredLogs.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Per-head consumption rates automatically updated
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              No Training Records Logged Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Your account starts fresh! Click "Add Daily Meal Record" to log your daily student headcount and dish quantities, or click "Auto-Fill 30-Day Sample Data" to quickly test.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
              >
                Add First Meal Record
              </button>
              <button
                onClick={onLoadSampleLogs}
                className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300"
              >
                Auto-Fill Sample Data
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Meal Session</th>
                  <th className="py-3.5 px-4">Students (Head Count)</th>
                  <th className="py-3.5 px-4">Food Logged (Cooked vs Remaining)</th>
                  <th className="py-3.5 px-4 text-right">Leftover %</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLogs.map((log) => {
                  let totalCooked = 0;
                  let totalWasted = 0;

                  log.dishes.forEach((d) => {
                    let c = d.quantityCooked;
                    let w = d.quantityRemaining;
                    if (d.unit === 'pieces') {
                      c *= 0.06;
                      w *= 0.06;
                    }
                    totalCooked += c;
                    totalWasted += w;
                  });

                  const wastePct =
                    totalCooked > 0 ? Math.round((totalWasted / totalCooked) * 1000) / 10 : 0;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {log.date}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${
                            log.mealType === 'Breakfast'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : log.mealType === 'Lunch'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                          }`}
                        >
                          {log.mealType === 'Breakfast' ? 'Morning' : log.mealType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          {log.headcount} students
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-xl">
                          {log.dishes.map((dish) => {
                            const consumed = Math.max(0, dish.quantityCooked - dish.quantityRemaining);
                            const perHead = log.headcount > 0 ? (consumed / log.headcount).toFixed(2) : '0';

                            return (
                              <div
                                key={dish.id}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] flex items-center gap-2"
                              >
                                <span className="font-bold text-slate-900">{dish.dishName}:</span>
                                <span className="text-slate-600">{dish.quantityCooked} {dish.unit}</span>
                                {dish.quantityRemaining > 0 ? (
                                  <span className="text-amber-700 font-bold bg-amber-100 px-1 rounded">
                                    {dish.quantityRemaining} rem
                                  </span>
                                ) : (
                                  <span className="text-emerald-700 font-bold bg-emerald-100 px-1 rounded">
                                    0 rem
                                  </span>
                                )}
                                <span className="text-slate-400 border-l border-slate-300 pl-1.5">
                                  ({perHead} /head)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap">
                        <span
                          className={
                            wastePct > 15
                              ? 'text-red-600'
                              : wastePct > 8
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }
                        >
                          {wastePct}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onDeleteLog(log.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Training Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 text-slate-900 relative shadow-2xl border border-slate-200 animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              Add Meal Training Entry
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Log daily headcount and dish quantities cooked vs leftover remaining.
            </p>

            <form onSubmit={handleSubmitNewLog} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meal Session
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as MealType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  >
                    <option value="Breakfast">Morning / Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Number of Students (Headcount)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={headcount}
                    onChange={(e) => setHeadcount(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                    placeholder="e.g. 120"
                  />
                </div>
              </div>

              {/* Dish Breakdown Inputs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    Dishes Breakdown (Cooked vs Leftover Remaining)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddDishRow}
                    className="text-xs text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Dish
                  </button>
                </div>

                <div className="space-y-3">
                  {dishes.map((dish, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200"
                    >
                      <div className="col-span-4">
                        <input
                          type="text"
                          required
                          placeholder="Dish Name (e.g. Chapathi)"
                          value={dish.dishName}
                          onChange={(e) =>
                            handleDishChange(idx, 'dishName', e.target.value)
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold placeholder-slate-400"
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          required
                          min={0}
                          step="any"
                          placeholder="Food Cooked"
                          value={dish.quantityCooked}
                          onChange={(e) =>
                            handleDishChange(idx, 'quantityCooked', e.target.value)
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400"
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          required
                          min={0}
                          step="any"
                          placeholder="Remaining Leftover"
                          value={dish.quantityRemaining}
                          onChange={(e) =>
                            handleDishChange(idx, 'quantityRemaining', e.target.value)
                          }
                          className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-amber-800 font-bold placeholder-slate-400"
                        />
                      </div>

                      <div className="col-span-2 flex items-center gap-1">
                        <select
                          value={dish.unit}
                          onChange={(e) =>
                            handleDishChange(idx, 'unit', e.target.value as DishUnit)
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-1.5 py-1.5 text-[11px] text-slate-800 font-bold"
                        >
                          <option value="pieces">pcs</option>
                          <option value="kg">kg</option>
                          <option value="litres">L</option>
                        </select>

                        {dishes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDishRow(idx)}
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20"
                >
                  Save Meal Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
