import { TrainingLog, SurplusItem, NgoPartner, UserProfile } from '../types';

export const defaultUser: UserProfile = {
  id: 'user_1',
  name: 'Rajesh Kumar',
  email: 'rajesh@hostelmess.edu',
  messName: 'Sunrise Hostel Mess',
  messType: 'Hostel Mess',
  capacity: 350,
  location: 'Block-B, Campus Tech Hub, Sector 4',
};

// Seed 30 days of realistic training logs for Morning, Lunch, Dinner
export const initialTrainingLogs: TrainingLog[] = (function generateMonthLogs() {
  const logs: TrainingLog[] = [];
  const today = new Date('2026-08-03');
  
  const commonDishes = {
    Breakfast: [
      { name: 'Chapathi', unit: 'pieces' as const, basePerHead: 2.2, wasteVariance: 0.25 },
      { name: 'Idli', unit: 'pieces' as const, basePerHead: 3.1, wasteVariance: 0.35 },
      { name: 'Sambhar', unit: 'litres' as const, basePerHead: 0.12, wasteVariance: 0.02 },
    ],
    Lunch: [
      { name: 'Steamed Rice', unit: 'kg' as const, basePerHead: 0.25, wasteVariance: 0.04 },
      { name: 'Dal Tadka', unit: 'litres' as const, basePerHead: 0.18, wasteVariance: 0.03 },
      { name: 'Chapathi', unit: 'pieces' as const, basePerHead: 1.8, wasteVariance: 0.2 },
      { name: 'Paneer Butter Masala', unit: 'kg' as const, basePerHead: 0.15, wasteVariance: 0.02 },
    ],
    Dinner: [
      { name: 'Chapathi', unit: 'pieces' as const, basePerHead: 2.5, wasteVariance: 0.3 },
      { name: 'Vegetable Biryani', unit: 'kg' as const, basePerHead: 0.28, wasteVariance: 0.05 },
      { name: 'Mix Veg Curry', unit: 'kg' as const, basePerHead: 0.16, wasteVariance: 0.03 },
    ],
  };

  let idCounter = 1;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    (['Breakfast', 'Lunch', 'Dinner'] as const).forEach((mealType) => {
      const baseHeadcount = isWeekend ? 190 : 280;
      const headcount = Math.floor(baseHeadcount + (Math.sin(i + (mealType === 'Breakfast' ? 1 : 2)) * 25));

      const dishes = commonDishes[mealType].map((item, idx) => {
        const consumedPerHead = item.basePerHead + (Math.sin(i * 0.5 + idx) * item.wasteVariance * 0.4);
        const actualConsumed = Math.round(consumedPerHead * headcount * 10) / 10;
        
        const overcookFactor = 1.15 + (Math.random() * 0.15);
        const quantityCooked = Math.round(actualConsumed * overcookFactor * 10) / 10;
        const quantityRemaining = Math.max(0, Math.round((quantityCooked - actualConsumed) * 10) / 10);

        return {
          id: `dish_${idCounter++}`,
          dishName: item.name,
          quantityCooked,
          quantityRemaining,
          unit: item.unit,
        };
      });

      logs.push({
        id: `log_${idCounter++}`,
        date: dateStr,
        mealType,
        headcount,
        dishes,
        loggedBy: 'Mess Staff',
        createdAt: `${dateStr}T10:00:00Z`,
      });
    });
  }

  return logs;
})();

export const initialSurplusListings: SurplusItem[] = [
  {
    id: 'surplus_101',
    messId: 'user_1',
    messName: 'Sunrise Hostel Mess',
    location: 'Block-B Campus Hub, Sector 4',
    dishName: 'Chapathi & Paneer Butter Masala',
    quantity: 45,
    unit: 'pieces',
    servings: 30,
    dietaryType: 'Veg',
    preparedAt: '2026-08-03T09:30:00',
    bestBeforeHours: 4,
    status: 'AVAILABLE',
    pickupContact: '+91 98765 43210',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 'surplus_102',
    messId: 'user_1',
    messName: 'Sunrise Hostel Mess',
    location: 'Block-B Campus Hub, Sector 4',
    dishName: 'Vegetable Biryani & Dal',
    quantity: 12,
    unit: 'kg',
    servings: 40,
    dietaryType: 'Veg',
    preparedAt: '2026-08-02T21:00:00',
    bestBeforeHours: 3,
    status: 'CLAIMED',
    claimedByNgo: 'Asha Food Rescue Foundation',
    claimedAt: '2026-08-03T08:15:00',
    pickupContact: '+91 98765 43210',
    lat: 12.9725,
    lng: 77.5980,
  },
];

// Exactly 2 Demo NGOs as requested by the user
export const initialNgos: NgoPartner[] = [
  {
    id: 'ngo_1',
    name: 'Asha Food Rescue Foundation',
    contactPerson: 'Sunita Sharma',
    phone: '+91 98123 45678',
    address: 'Community Center 4, Sector 3, Tech City',
    lat: 12.9780,
    lng: 77.5910,
    capacityServings: 150,
  },
  {
    id: 'ngo_2',
    name: 'Annapurna Seva Trust',
    contactPerson: 'Sister Mary',
    phone: '+91 99001 12233',
    address: 'Shelter Home, Railway Station Road',
    lat: 12.9600,
    lng: 77.5890,
    capacityServings: 200,
  },
];
