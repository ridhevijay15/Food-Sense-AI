# FoodSense - Smart Mess Planner & Surplus Donation

FoodSense is an AI-powered hostel/restaurant mess planner and surplus food recovery platform. It eliminates kitchen overcooking by logging daily meal data (headcount, dish-level cooked vs leftover quantities) during a 1-month training period to learn per-person consumption rates. Mess staff enter today's expected headcount to receive exact prep recommendations with customizable safety buffers. Unavoidable leftover food is published to a live NGO claim portal.

---

## 🌟 Key Features

1. **Mess Staff Authentication & Profile**: Register and manage hostel/canteen profiles with headcount capacities.
2. **1-Month Training Period Data Logger**:
   - Log daily meals (Morning / Breakfast, Lunch, Dinner).
   - Enter Dish Name (e.g. Chapathi, Rice, Sambar, Paneer), Headcount (e.g. 100), Quantity Cooked, and Quantity Remaining (e.g. 23 pcs).
   - Includes 30 days of realistic pre-populated hostel mess records for instant demo.
3. **Week-Wise Analytics Graphs**:
   - Track waste reduction trends across Week 1, Week 2, Week 3, and Week 4.
   - Leaderboard of top overcooked dishes needing precision planning.
4. **Smart Recommender Engine**:
   - Calculates per-person consumption rates ($Q_{\text{consumed}} / \text{headcount}$).
   - Generates exact prep numbers for expected headcount with adjustable safety buffer sliders (2% - 25%).
5. **Surplus Donation & NGO Claim Hub**:
   - 1-click surplus food posting with shelf-life countdown and dietary tags.
   - Interactive Leaflet map showing Messes and NGO locations with real-time claim status (AVAILABLE → CLAIMED → EN ROUTE → COMPLETED).
6. **Impact & ESG Dashboard**:
   - Quantifies total food saved (kg), meals provided, cost savings (₹), and greenhouse gas ($\text{CO}_2\text{e}$) offset.

---

## 🚀 How to Run in VS Code

### 1. Install Dependencies & Start Frontend
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 2. MySQL Database Setup (Optional Backend Integration)
1. Open VS Code and connect to your MySQL Server using the **MySQL** extension or MySQL Workbench.
2. Run the provided script in `server/schema.sql`:
   ```sql
   SOURCE server/schema.sql;
   ```
3. This creates tables for `users`, `meal_training_sessions`, `dish_training_records`, `ngo_partners`, and `surplus_listings`.
