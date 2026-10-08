import { TrainingLog, MealType, RecommendationPlan, RecommendedDish, DishUnit } from '../types';

// Estimated cost per unit in INR
const EST_COST_PER_UNIT: Record<string, number> = {
  Chapathi: 5, // ₹5 per piece
  Idli: 6, // ₹6 per piece
  Sambhar: 35, // ₹35 per litre
  Chutney: 80, // ₹80 per kg
  Rice: 40, // ₹40 per kg
  'Dal Tadka': 50, // ₹50 per litre
  'Paneer Butter Masala': 180, // ₹180 per kg
  Curd: 45, // ₹45 per litre
  'Vegetable Biryani': 120, // ₹120 per kg
  'Mix Veg Curry': 90, // ₹90 per kg
  Raita: 40, // ₹40 per litre
};

export function generatePrepRecommendation(
  logs: TrainingLog[],
  mealType: MealType,
  expectedHeadcount: number,
  safetyBufferPct: number = 8 // Default 8% buffer
): RecommendationPlan {
  // Filter logs for this meal type
  const mealLogs = logs.filter((l) => l.mealType === mealType);

  if (mealLogs.length === 0) {
    return {
      mealType,
      expectedHeadcount,
      safetyBufferPct,
      dishes: [],
      totalFoodSavedKg: 0,
      totalCostSaved: 0,
    };
  }

  // Aggregate dish-level statistics
  const dishStats: Record<
    string,
    { totalConsumed: number; totalHeadcount: number; unit: DishUnit }
  > = {};

  mealLogs.forEach((log) => {
    log.dishes.forEach((d) => {
      if (!dishStats[d.dishName]) {
        dishStats[d.dishName] = {
          totalConsumed: 0,
          totalHeadcount: 0,
          unit: d.unit,
        };
      }
      const consumed = Math.max(0, d.quantityCooked - d.quantityRemaining);
      dishStats[d.dishName].totalConsumed += consumed;
      dishStats[d.dishName].totalHeadcount += log.headcount;
    });
  });

  const recommendedDishes: RecommendedDish[] = [];
  let totalSavedKg = 0;
  let totalCostSaved = 0;

  Object.entries(dishStats).forEach(([dishName, stat]) => {
    const perPersonRate = stat.totalHeadcount > 0 
      ? stat.totalConsumed / stat.totalHeadcount 
      : 0;

    // Ideal required quantity with safety buffer
    const bufferMultiplier = 1 + safetyBufferPct / 100;
    const rawRecommended = expectedHeadcount * perPersonRate * bufferMultiplier;
    const recommendedQty = Math.ceil(rawRecommended * 10) / 10;

    // Traditional overcooking usually adds 25% blind overcook
    const traditionalOvercookQty = Math.ceil(expectedHeadcount * perPersonRate * 1.25 * 10) / 10;
    const estimatedSavedQty = Math.max(0, Math.round((traditionalOvercookQty - recommendedQty) * 10) / 10);

    const unitCost = EST_COST_PER_UNIT[dishName] || 40;
    const estimatedMoneySaved = Math.round(estimatedSavedQty * unitCost);

    // Approximate weight conversion for saving metrics
    let savedInKg = estimatedSavedQty;
    if (stat.unit === 'pieces') {
      savedInKg = estimatedSavedQty * 0.06; // ~60g per chapathi/idli
    } else if (stat.unit === 'litres') {
      savedInKg = estimatedSavedQty * 1.0;
    }

    totalSavedKg += savedInKg;
    totalCostSaved += estimatedMoneySaved;

    recommendedDishes.push({
      dishName,
      unit: stat.unit,
      perPersonRate: Math.round(perPersonRate * 1000) / 1000,
      recommendedQty,
      traditionalOvercookQty,
      estimatedSavedQty,
      estimatedMoneySaved,
    });
  });

  return {
    mealType,
    expectedHeadcount,
    safetyBufferPct,
    dishes: recommendedDishes,
    totalFoodSavedKg: Math.round(totalSavedKg * 10) / 10,
    totalCostSaved,
  };
}

// Calculate week-wise analytics from logs
export function calculateWeeklyAnalytics(logs: TrainingLog[]) {
  // Sort logs by date ascending
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  
  if (sorted.length === 0) return { weeks: [], topWastedDishes: [] };

  // Group into 4 weekly buckets
  const weeks: { weekLabel: string; totalCookedKg: number; totalWastedKg: number; wastePct: number }[] = [];
  const chunkSize = Math.ceil(sorted.length / 4);

  for (let i = 0; i < 4; i++) {
    const chunk = sorted.slice(i * chunkSize, (i + 1) * chunkSize);
    let weekCookedKg = 0;
    let weekWastedKg = 0;

    chunk.forEach(log => {
      log.dishes.forEach(d => {
        let cookedKg = d.quantityCooked;
        let wastedKg = d.quantityRemaining;
        if (d.unit === 'pieces') {
          cookedKg *= 0.06;
          wastedKg *= 0.06;
        }
        weekCookedKg += cookedKg;
        weekWastedKg += wastedKg;
      });
    });

    const wastePct = weekCookedKg > 0 ? (weekWastedKg / weekCookedKg) * 100 : 0;

    weeks.push({
      weekLabel: `Week ${i + 1}`,
      totalCookedKg: Math.round(weekCookedKg),
      totalWastedKg: Math.round(weekWastedKg),
      wastePct: Math.round(wastePct * 10) / 10,
    });
  }

  // Calculate top wasted dishes
  const dishWasteMap: Record<string, { totalWastedKg: number; unit: DishUnit; count: number }> = {};
  logs.forEach(log => {
    log.dishes.forEach(d => {
      if (!dishWasteMap[d.dishName]) {
        dishWasteMap[d.dishName] = { totalWastedKg: 0, unit: d.unit, count: 0 };
      }
      let wastedKg = d.quantityRemaining;
      if (d.unit === 'pieces') wastedKg *= 0.06;
      dishWasteMap[d.dishName].totalWastedKg += wastedKg;
      dishWasteMap[d.dishName].count += 1;
    });
  });

  const topWastedDishes = Object.entries(dishWasteMap)
    .map(([dishName, data]) => ({
      dishName,
      totalWastedKg: Math.round(data.totalWastedKg * 10) / 10,
    }))
    .sort((a, b) => b.totalWastedKg - a.totalWastedKg)
    .slice(0, 5);

  return { weeks, topWastedDishes };
}
