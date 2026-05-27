# Excel Analysis Guide
# Blinkit Sales Analysis — Pivot Tables & Charts

## Setup
1. Open Excel → Data → From Text/CSV
2. Import: `data/blinkit_cleaned_data.csv`
3. Load to a sheet named "Raw Data"

---

## PIVOT TABLE 1 — Revenue by Category (Sheet: Category Analysis)

### Setup:
- Insert → PivotTable → New Sheet → Rename: "Category Analysis"
- Rows: Category
- Values: Revenue (Sum), Revenue (% of total), Order_ID (Count)
- Sort: Revenue descending

### Conditional Formatting:
- Select Revenue column → Conditional Formatting → Data Bars → Yellow gradient
- Select % column → Icon Set → 3 Arrows (up/flat/down)

### Chart:
- Select PivotTable → Insert → Clustered Bar Chart
- Title: "Revenue by Category"
- Colors: Yellow (#F7D118) for top bar, grey for rest

---

## PIVOT TABLE 2 — Monthly Sales Trend (Sheet: Monthly Trend)

### Setup:
- Rows: Year, Month_Name
- Values: Revenue (Sum), Order_ID (Count)
- Slicer: Year (filter to see individual years)

### Calculated Column in PivotTable:
- Add field: Avg Order Value = Revenue / Count of Order_ID

### Chart:
- Line chart with markers
- X: Month_Name, Y: Revenue
- Two series: 2023 (grey) and 2024 (yellow)
- Add trendline: Linear

---

## PIVOT TABLE 3 — City & State Performance (Sheet: Regional Analysis)

### Setup:
- Rows: State, City
- Values: Revenue (Sum), Order_ID (Count), Customer_Rating (Average), Delivery_Time_Min (Average)
- Collapse State level by default

### Conditional Formatting:
- Revenue column: Top 10 items → Green fill
- Delivery_Time_Min: Color scale → Green (fast) to Red (slow)

---

## PIVOT TABLE 4 — Customer Type Analysis (Sheet: Customer Segments)

### Setup:
- Rows: Customer_Type
- Columns: Year
- Values: Revenue (Sum), Discount (Average), Customer_Rating (Average)

### Chart:
- Clustered column chart
- Compare 2023 vs 2024 per Customer Type

---

## PIVOT TABLE 5 — Payment Methods (Sheet: Payments)

### Setup:
- Rows: Payment_Method
- Values: Order_ID (Count), Revenue (Sum)
- Sort: Count descending

### Chart:
- Pie/Donut chart showing order share by payment method
- Explode the largest slice (UPI)

---

## PIVOT TABLE 6 — Product Performance (Sheet: Top Products)

### Setup:
- Rows: Category, Product_Name
- Values: Revenue (Sum), Quantity (Sum), Customer_Rating (Average)
- Filter: Top 20 products by Revenue (Value Filters → Top 10)

---

## KPI SUMMARY SHEET

Create a new sheet "KPI Dashboard" with this layout:

| KPI | Value | Format |
|---|---|---|
| Total Revenue | =SUMIF formula | ₹#,##0.00 |
| Total Orders | =COUNTA | #,##0 |
| Avg Order Value | =AVERAGE | ₹#,##0.00 |
| Avg Rating | =AVERAGEIF | 0.00 "★" |
| Avg Delivery | =AVERAGE | 0.0 "min" |
| Top Category | =INDEX/MATCH | Text |
| Top City | =INDEX/MATCH | Text |
| Peak Month | =INDEX/MATCH | Text |

### Sparklines (for trend in one cell):
- Select cell → Insert → Sparklines → Line
- Data Range: Monthly revenue row
- Sparkline color: Yellow

---

## PRO TIPS

1. **Freeze Panes**: View → Freeze Panes on Row 1 of Raw Data sheet
2. **Named Ranges**: Define named ranges for Revenue, Category, City columns
3. **XLOOKUP**: Use `=XLOOKUP(A2, Products, Revenue, 0)` for quick product lookups
4. **Slicer Styling**: Format → Slicer → use Blinkit yellow theme
5. **Data Validation**: Add dropdown lists for Category and City in a helper sheet
6. **Print Area**: Set print area on KPI sheet for clean PDF exports
