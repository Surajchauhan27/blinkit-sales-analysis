# Power BI Dashboard — Step-by-Step Build Guide
# Blinkit Sales Analysis Dashboard

## 🎨 Design Theme

| Element | Specification |
|---|---|
| **Background** | Dark: #0D1117 / Light panels: #161B22 |
| **Primary Accent** | Blinkit Yellow: #F7D118 |
| **Secondary** | Soft Green: #00C49F |
| **Text** | White: #FFFFFF, Muted: #8B949E |
| **Font** | Segoe UI (headers), Segoe UI Light (values) |
| **Canvas Size** | 1920 × 1080 px (widescreen) |

---

## STEP 1 — Load & Transform Data

1. Open **Power BI Desktop** → **Get Data** → **Text/CSV**
2. Load: `data/blinkit_cleaned_data.csv`
3. In **Power Query Editor**:
   - Verify `Order_Date` is Date type
   - Verify `Revenue`, `Price`, `Discount` are Decimal
   - Verify `Quantity`, `Delivery_Time_Min` are Whole Number
   - Click **Close & Apply**

---

## STEP 2 — Create Calculated Columns (DAX)

In the Data view, add these columns:

```dax
// Revenue Formatted
Revenue_K = [Revenue] / 1000

// Discount Percentage Label
Discount_Label = FORMAT([Discount] * 100, "0.0") & "%"

// Delivery Speed Category
Speed_Category =
SWITCH(
    TRUE(),
    [Delivery_Time_Min] <= 15, "⚡ Express",
    [Delivery_Time_Min] <= 25, "✅ Standard",
    [Delivery_Time_Min] <= 35, "🕐 Moderate",
    "⚠️ Delayed"
)

// Month-Year Label
Month_Year = FORMAT([Order_Date], "MMM YYYY")

// Is Weekend
Is_Weekend = IF(WEEKDAY([Order_Date], 2) >= 6, "Weekend", "Weekday")
```

---

## STEP 3 — Create Measures (DAX)

Create a dedicated `_Measures` table:

```dax
// Core KPIs
Total Revenue = SUM(blinkit_cleaned_data[Revenue])
Total Orders  = COUNTROWS(blinkit_cleaned_data)
Avg Rating    = AVERAGE(blinkit_cleaned_data[Customer_Rating])
Avg Delivery  = AVERAGE(blinkit_cleaned_data[Delivery_Time_Min])
Avg Order Val = DIVIDE([Total Revenue], [Total Orders])

// Time Intelligence
Revenue LY = CALCULATE([Total Revenue], SAMEPERIODLASTYEAR(blinkit_cleaned_data[Order_Date]))
YoY Growth  = DIVIDE([Total Revenue] - [Revenue LY], [Revenue LY])
YoY Growth % = FORMAT([YoY Growth], "0.0%")

// Running Total
Running Revenue =
CALCULATE(
    [Total Revenue],
    FILTER(
        ALL(blinkit_cleaned_data[Order_Date]),
        blinkit_cleaned_data[Order_Date] <= MAX(blinkit_cleaned_data[Order_Date])
    )
)
```

---

## STEP 4 — Dashboard Layout

### Page 1: Overview Dashboard (Main)

```
┌─────────────────────────────────────────────────────────────────┐
│  🛒 BLINKIT SALES ANALYSIS          [City ▼] [Category ▼] [Date]│
├──────────┬──────────┬──────────┬──────────────────────────────  │
│ ₹35.67L  │ 10,500   │ ⭐ 3.97  │ 🚚 25.8 min                    │
│ Revenue  │ Orders   │  Rating  │  Avg Delivery                  │
├──────────┴──────────┴──────────┴────────────────────────────────│
│                                         │                        │
│   📈 Monthly Revenue Trend (Line)       │ 🍩 Category Revenue   │
│       Jan─────────────────────Dec       │   (Donut Chart)        │
│                                         │                        │
├─────────────────────────────────────────┤                        │
│                                         │                        │
│   🏙️  Revenue by City (Bar - Horizontal)│ 💳 Payment Methods    │
│                                         │   (Donut Chart)        │
│                                         │                        │
├─────────────────────────────────────────┴────────────────────────│
│   📦 Top 10 Products by Revenue (Bar - Horizontal)              │
└─────────────────────────────────────────────────────────────────┘
```

### Page 2: Deep Dive Analysis

```
┌──────────────────────────────────────────────────────────────────┐
│  DEEP DIVE ANALYSIS                    [Customer Type ▼]         │
├───────────────────────────┬──────────────────────────────────────│
│ 📊 Revenue by Sub-Cat     │  👥 Customer Type Comparison         │
│    (Stacked Bar)          │     (Clustered Bar: Orders + Revenue)│
├───────────────────────────┼──────────────────────────────────────│
│ 💹 Discount Impact        │  📅 Quarterly Trend (2023 vs 2024)  │
│    (Scatter: Disc vs Rev) │     (Line Chart, dual year)          │
└───────────────────────────┴──────────────────────────────────────┘
```

---

## STEP 5 — Build Each Visual

### KPI Card 1: Total Revenue
- Visual: **Card**
- Field: `[Total Revenue]`
- Format: ₹0.00,,\L (shows in Lakhs)
- Font size: 32pt | Color: #F7D118
- Label: "Total Revenue"

### KPI Card 2: Total Orders
- Visual: **Card**
- Field: `[Total Orders]`
- Format: #,##0
- Font size: 32pt | Color: #FFFFFF

### KPI Card 3: Avg Rating
- Visual: **Card**
- Field: `[Avg Rating]`
- Format: 0.00
- Font size: 32pt | Color: #00C49F
- Label: "Avg Customer Rating ⭐"

### KPI Card 4: Avg Delivery
- Visual: **Card**
- Field: `[Avg Delivery]`
- Format: 0.0" min"
- Font size: 32pt | Color: #FF7F7F

---

### Monthly Revenue Trend (Line Chart)
- X-Axis: `Order_Date` (Month hierarchy)
- Y-Axis: `[Total Revenue]`
- Legend: `Year` (to compare 2023 vs 2024)
- Line color: 2023=#8B949E, 2024=#F7D118
- Enable markers | Smooth line
- Add reference line at average revenue
- Title: "Monthly Revenue Trend"

---

### Revenue by Category (Donut Chart)
- Values: `[Total Revenue]`
- Legend: `Category`
- Colors: use the 10-color palette below
- Inner radius: 60%
- Data labels: show % value
- Title: "Revenue by Category"

**Color Palette:**
```
Baby Care          #F7D118
Staples            #00C49F
Personal Care      #FF6B6B
Frozen Foods       #4FC3F7
Meat & Seafood     #AB47BC
Household          #FF8A65
Fruits & Veg       #66BB6A
Beverages          #26C6DA
Dairy & Breakfast  #FFA726
Snacks & Munchies  #EC407A
```

---

### Revenue by City (Horizontal Bar Chart)
- Y-Axis: `City`
- X-Axis: `[Total Revenue]`
- Sort: Descending
- Color: Conditional — Top 3 in #F7D118, rest in #4A5568
- Data labels: enabled, format ₹0.0K
- Title: "Top Cities by Revenue"

---

### Top 10 Products (Horizontal Bar Chart)
- Y-Axis: `Product_Name` (top 10 filter)
- X-Axis: `[Total Revenue]`
- Visual-level filter: Top N = 10 by Revenue
- Bar color: gradient #F7D118 → #FF8A65
- Title: "Top 10 Revenue Products"

---

### Payment Method Distribution (Donut)
- Values: `[Total Orders]`
- Legend: `Payment_Method`
- Title: "Payment Method Share"

---

## STEP 6 — Slicers

### Slicer 1: City
- Style: Dropdown (saves space)
- Select all enabled
- Place: top-right header area

### Slicer 2: Category
- Style: Vertical list with checkboxes
- Place: left side panel

### Slicer 3: Customer Type
- Style: Horizontal buttons (New | Regular | Premium)
- Format: Fill buttons in Blinkit yellow when selected

### Slicer 4: Date Range
- Style: Between (shows date picker)
- Default: Jan 2023 – Dec 2024

---

## STEP 7 — Formatting Tips

1. **Background**: Set all visual backgrounds to #161B22 with 90% transparency
2. **Borders**: Add subtle border #2D3748, radius 8px
3. **Grid lines**: Disable grid lines on all charts
4. **Tooltips**: Enable all tooltips, show Revenue + Orders
5. **Interactions**: Set all slicers to filter all visuals
6. **Bookmarks**: Create 2 bookmarks — "Overview" and "Deep Dive"
7. **Mobile Layout**: Enable mobile layout, stack KPIs 2×2

---

## STEP 8 — Publish & Share

1. **File** → **Save As** → `Blinkit_Dashboard.pbix`
2. Take screenshots: `Print Screen` or Windows Snipping Tool
3. Export as PDF: **File** → **Export** → **Export to PDF**
4. Publish to Power BI Service: **Home** → **Publish** (needs free account)

---

## 📋 Checklist Before Submitting

- [ ] All 4 KPI cards showing correct values
- [ ] Slicers filter all visuals correctly
- [ ] Monthly trend shows 2023 vs 2024
- [ ] No blank/empty pages
- [ ] Mobile layout configured
- [ ] Dashboard saved as .pbix
- [ ] Screenshots taken and added to /screenshots folder
