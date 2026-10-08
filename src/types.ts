export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';

export type DishUnit = 'pieces' | 'kg' | 'litres';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  messName: string;
  messType: 'Hostel Mess' | 'College Canteen' | 'Restaurant Kitchen' | 'Corporate Mess';
  capacity: number;
  location: string;
}

export interface DishRecord {
  id: string;
  dishName: string;
  quantityCooked: number;
  quantityRemaining: number;
  unit: DishUnit;
}

export interface TrainingLog {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  headcount: number;
  dishes: DishRecord[];
  loggedBy: string;
  createdAt: string;
}

export interface RecommendedDish {
  dishName: string;
  unit: DishUnit;
  perPersonRate: number; // rate per student headcount
  recommendedQty: number;
  traditionalOvercookQty: number;
  estimatedSavedQty: number;
  estimatedMoneySaved: number;
}

export interface RecommendationPlan {
  mealType: MealType;
  expectedHeadcount: number;
  safetyBufferPct: number;
  dishes: RecommendedDish[];
  totalFoodSavedKg: number;
  totalCostSaved: number;
}

export type SurplusStatus = 'AVAILABLE' | 'CLAIMED' | 'EN_ROUTE' | 'COMPLETED';

export interface SurplusItem {
  id: string;
  messId: string;
  messName: string;
  location: string;
  dishName: string;
  quantity: number;
  unit: DishUnit;
  servings: number;
  dietaryType: 'Veg' | 'Non-Veg' | 'Jain';
  preparedAt: string;
  bestBeforeHours: number;
  status: SurplusStatus;
  claimedByNgo?: string;
  claimedAt?: string;
  pickupContact: string;
  lat: number;
  lng: number;
}

export interface NgoPartner {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  capacityServings: number;
}
