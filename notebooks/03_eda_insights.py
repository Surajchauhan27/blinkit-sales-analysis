"""
Blinkit Sales Analysis — EDA & Business Insights
=================================================
Deep exploratory analysis — prints all business insights to console
and saves summary reports to reports/

Run from project root:  python notebooks/03_eda_insights.py
Or via master runner:   python run_all.py
"""

import pandas as pd
import numpy as np
import os

ROOT    = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
CLEANED = os.path.join(ROOT, "data", "blinkit_cleaned_data.csv")
REPORTS = os.path.join(ROOT, "reports")
os.makedirs(REPORTS, exist_ok=True)

df = pd.read_csv(CLEANED, parse_dates=["Order_Date"])

SEP = "─" * 60

# ══════════════════════════════════════════════════════════════
# INSIGHT 1 — Business KPI Overview
# ══════════════════════════════════════════════════════════════
print(SEP)
print("INSIGHT 1: Business KPI Overview")
print(SEP)
print(f"  Total Orders       : {len(df):,}")
print(f"  Total Revenue      : ₹{df['Revenue'].sum():,.2f}")
print(f"  Avg Order Value    : ₹{df['Revenue'].mean():.2f}")
print(f"  Avg Customer Rating: {df['Customer_Rating'].mean():.2f} / 5.0")
print(f"  Avg Delivery Time  : {df['Delivery_Time_Min'].mean():.1f} minutes")
print(f"  Unique Products    : {df['Product_Name'].nunique()}")
print(f"  Cities Covered     : {df['City'].nunique()}")
print(f"  Date Range         : {df['Order_Date'].min().date()} → {df['Order_Date'].max().date()}")

# ══════════════════════════════════════════════════════════════
# INSIGHT 2 — Revenue by Category
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 2: Revenue by Category")
print(SEP)
cat = df.groupby("Category")["Revenue"].agg(["sum","count","mean"]).round(2)
cat.columns = ["Total_Revenue","Orders","Avg_Order"]
cat = cat.sort_values("Total_Revenue", ascending=False)
cat["Share%"] = (cat["Total_Revenue"] / cat["Total_Revenue"].sum() * 100).round(1)
print(cat.to_string())
print(f"\n  ➡ TOP CATEGORY: {cat.index[0]} (₹{cat['Total_Revenue'].iloc[0]:,.0f})")
cat.to_csv(os.path.join(REPORTS, "category_revenue.csv"))

# ══════════════════════════════════════════════════════════════
# INSIGHT 3 — Monthly Revenue Trend
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 3: Monthly Revenue Trend")
print(SEP)
monthly = df.groupby(["Year","Month","Month_Name"])["Revenue"].sum().reset_index()
monthly = monthly.sort_values(["Year","Month"])
peak_row = monthly.loc[monthly["Revenue"].idxmax()]
print(monthly[["Year","Month_Name","Revenue"]].to_string(index=False))
print(f"\n  ➡ PEAK MONTH: {peak_row['Month_Name']} {peak_row['Year']} (₹{peak_row['Revenue']:,.0f})")
monthly.to_csv(os.path.join(REPORTS, "monthly_revenue.csv"), index=False)

# ══════════════════════════════════════════════════════════════
# INSIGHT 4 — City Performance
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 4: City Performance")
print(SEP)
city = df.groupby("City")["Revenue"].sum().sort_values(ascending=False)
print(city.apply(lambda x: f"₹{x:,.0f}").to_string())
print(f"\n  ➡ TOP CITY: {city.index[0]} (₹{city.iloc[0]:,.0f})")
city.to_csv(os.path.join(REPORTS, "city_revenue.csv"))

# ══════════════════════════════════════════════════════════════
# INSIGHT 5 — Discount Impact
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 5: Discount Impact on Revenue")
print(SEP)
df["Discount_Band"] = pd.cut(
    df["Discount"],
    bins=[-0.01, 0.00001, 0.05, 0.10, 0.15, 1.0],
    labels=["No Discount","1-5%","6-10%","11-15%","16%+"]
)
disc = df.groupby("Discount_Band", observed=True).agg(
    Orders=("Revenue","count"),
    Revenue=("Revenue","sum"),
    Avg_Rev=("Revenue","mean"),
    Avg_Qty=("Quantity","mean")
).round(2)
print(disc.to_string())
corr = df["Discount"].corr(df["Revenue"])
print(f"\n  ➡ Discount ↔ Revenue correlation: {corr:.3f}")
disc.to_csv(os.path.join(REPORTS, "discount_analysis.csv"))

# ══════════════════════════════════════════════════════════════
# INSIGHT 6 — Customer Type Behaviour
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 6: Customer Type Behaviour")
print(SEP)
cust = df.groupby("Customer_Type").agg(
    Orders   = ("Revenue","count"),
    Revenue  = ("Revenue","sum"),
    Avg_Rev  = ("Revenue","mean"),
    Avg_Disc = ("Discount","mean"),
    Avg_Rat  = ("Customer_Rating","mean")
).round(2)
print(cust.to_string())
cust.to_csv(os.path.join(REPORTS, "customer_type_analysis.csv"))

# ══════════════════════════════════════════════════════════════
# INSIGHT 7 — Top 10 Products by Revenue
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 7: Top 10 Products by Revenue")
print(SEP)
prods = df.groupby("Product_Name")["Revenue"].sum().nlargest(10)
print(prods.apply(lambda x: f"₹{x:,.0f}").to_string())
prods.to_csv(os.path.join(REPORTS, "top_products.csv"))

# ══════════════════════════════════════════════════════════════
# INSIGHT 8 — Payment Methods
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 8: Payment Method Distribution")
print(SEP)
pay = df["Payment_Method"].value_counts()
pay_pct = (pay / pay.sum() * 100).round(1)
for method in pay.index:
    print(f"  {method:<20} {pay[method]:>5,} orders  ({pay_pct[method]:>5.1f}%)")

# ══════════════════════════════════════════════════════════════
# INSIGHT 9 — Delivery Speed vs Rating
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 9: Delivery Speed vs Customer Rating")
print(SEP)
df["Speed_Band"] = pd.cut(
    df["Delivery_Time_Min"],
    bins=[0, 15, 25, 35, 100],
    labels=["Express (<15min)","Standard (15-25)","Moderate (26-35)","Delayed (35+)"]
)
speed = df.groupby("Speed_Band", observed=True).agg(
    Orders=("Revenue","count"),
    Avg_Rating=("Customer_Rating","mean")
).round(2)
print(speed.to_string())
corr2 = df["Delivery_Time_Min"].corr(df["Customer_Rating"])
print(f"\n  ➡ Delivery Time ↔ Rating correlation: {corr2:.3f}")
speed.to_csv(os.path.join(REPORTS, "delivery_analysis.csv"))

# ══════════════════════════════════════════════════════════════
# INSIGHT 10 — Weekday vs Weekend
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 10: Weekday vs Weekend Orders")
print(SEP)
wk = df.groupby("Is_Weekend")["Revenue"].agg(["count","sum","mean"]).round(2)
wk.columns = ["Orders","Revenue","Avg_Order"]
print(wk.to_string())

# ══════════════════════════════════════════════════════════════
# INSIGHT 11 — Quarterly Comparison
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 11: Quarterly Revenue Comparison (YoY)")
print(SEP)
qtr = df.groupby(["Year","Quarter"]).agg(
    Orders=("Revenue","count"),
    Revenue=("Revenue","sum"),
    Avg_Rating=("Customer_Rating","mean")
).round(2)
print(qtr.to_string())
qtr.to_csv(os.path.join(REPORTS, "quarterly_revenue.csv"))

# ══════════════════════════════════════════════════════════════
# INSIGHT 12 — Sub-Category Revenue Deep Dive
# ══════════════════════════════════════════════════════════════
print(f"\n{SEP}")
print("INSIGHT 12: Sub-Category Revenue (Top 10)")
print(SEP)
subcat = df.groupby(["Category","Sub_Category"])["Revenue"].sum().reset_index()
subcat = subcat.sort_values("Revenue", ascending=False).head(10)
print(subcat.to_string(index=False))
subcat.to_csv(os.path.join(REPORTS, "subcategory_revenue.csv"), index=False)

print(f"\n{'='*60}")
print("✅  All 12 insights generated successfully!")
print(f"    Reports saved → reports/")
print("=" * 60)
