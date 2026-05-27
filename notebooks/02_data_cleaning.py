"""
Blinkit Sales Analysis — Data Cleaning Pipeline
================================================
Handles: duplicates, missing values, data type corrections,
         derived columns, outlier detection, and validation assertions.

Run from project root:  python notebooks/02_data_cleaning.py
Or via master runner:   python run_all.py
"""

import pandas as pd
import numpy as np
import os

# ── Resolve paths relative to project root ───────────────────────────────────
ROOT    = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
RAW     = os.path.join(ROOT, "data", "blinkit_raw_data.csv")
CLEANED = os.path.join(ROOT, "data", "blinkit_cleaned_data.csv")

# ══════════════════════════════════════════════════════════════════════════════
# STEP 1 — Load Data
# ══════════════════════════════════════════════════════════════════════════════
print("=" * 60)
print("BLINKIT DATA CLEANING PIPELINE")
print("=" * 60)
print("\nSTEP 1: Loading raw dataset")
print("-" * 40)

df = pd.read_csv(RAW)
print(f"📥 Raw dataset shape : {df.shape[0]:,} rows × {df.shape[1]} columns")
print(f"   Columns: {list(df.columns)}")

# ══════════════════════════════════════════════════════════════════════════════
# STEP 2 — Initial Exploration
# ══════════════════════════════════════════════════════════════════════════════
print("\nSTEP 2: Initial exploration")
print("-" * 40)
print(f"\n--- Missing values ---")
print(df.isnull().sum()[df.isnull().sum() > 0].to_string())
print(f"\n--- Duplicate count: {df.duplicated().sum()} ---")

# ══════════════════════════════════════════════════════════════════════════════
# STEP 3 — Remove Duplicates
# ══════════════════════════════════════════════════════════════════════════════
print("\nSTEP 3: Removing duplicates")
print("-" * 40)
before = len(df)
df.drop_duplicates(inplace=True)
after  = len(df)
print(f"🗑  Removed {before - after} duplicate rows → {after:,} rows remain")

# ══════════════════════════════════════════════════════════════════════════════
# STEP 4 — Handle Missing Values
# ══════════════════════════════════════════════════════════════════════════════
print("\nSTEP 4: Handling missing values")
print("-" * 40)

# Customer_Rating — fill with median per Category
df["Customer_Rating"] = df["Customer_Rating"].fillna(
    df.groupby("Category")["Customer_Rating"].transform("median")
)
df["Customer_Rating"] = df["Customer_Rating"].fillna(df["Customer_Rating"].median())
print("✅  Customer_Rating   → category-wise median imputation")

# Delivery_Time_Min — fill with median per City
df["Delivery_Time_Min"] = df["Delivery_Time_Min"].fillna(
    df.groupby("City")["Delivery_Time_Min"].transform("median")
)
df["Delivery_Time_Min"] = df["Delivery_Time_Min"].fillna(df["Delivery_Time_Min"].median())
print("✅  Delivery_Time_Min → city-wise median imputation")

# Discount — fill with 0 (no discount applied)
df["Discount"] = df["Discount"].fillna(0)
print("✅  Discount          → filled with 0 (no discount)")

print(f"\nMissing values after cleaning: {df.isnull().sum().sum()} ✅")

# ══════════════════════════════════════════════════════════════════════════════
# STEP 5 — Data Type Corrections
# ══════════════════════════════════════════════════════════════════════════════
print("\nSTEP 5: Fixing data types")
print("-" * 40)

df["Order_Date"]        = pd.to_datetime(df["Order_Date"])
df["Price"]             = df["Price"].astype(float)
df["Quantity"]          = df["Quantity"].astype(int)
df["Discount"]          = df["Discount"].astype(float)
df["Revenue"]           = df["Revenue"].astype(float)
df["Customer_Rating"]   = df["Customer_Rating"].astype(float).round(1)
df["Delivery_Time_Min"] = df["Delivery_Time_Min"].round().astype("Int64")

print("✅  All data types corrected")

# ══════════════════════════════════════════════════════════════════════════════
# STEP 6 — Derived Columns
# ══════════════════════════════════════════════════════════════════════════════
print("\nSTEP 6: Adding derived columns")
print("-" * 40)

df["Year"]          = df["Order_Date"].dt.year
df["Month"]         = df["Order_Date"].dt.month
df["Month_Name"]    = df["Order_Date"].dt.strftime("%b")
df["Quarter"]       = df["Order_Date"].dt.quarter.map({1:"Q1",2:"Q2",3:"Q3",4:"Q4"})
df["Day_of_Week"]   = df["Order_Date"].dt.day_name()
df["Week_Number"]   = df["Order_Date"].dt.isocalendar().week.astype(int)
df["Discount_Amount"] = (df["Price"] * df["Quantity"] * df["Discount"]).round(2)
df["Gross_Amount"]    = (df["Price"] * df["Quantity"]).round(2)
df["Is_Weekend"]      = df["Day_of_Week"].isin(["Saturday", "Sunday"]).map({True:"Weekend", False:"Weekday"})

print("✅  Added: Year, Month, Quarter, Day_of_Week, Week_Number")
print("✅  Added: Discount_Amount, Gross_Amount, Is_Weekend")

# ══════════════════════════════════════════════════════════════════════════════
# STEP 7 — Standardise Text Columns
# ══════════════════════════════════════════════════════════════════════════════
print("\nSTEP 7: Standardising text columns")
print("-" * 40)

for col in ["Category", "Sub_Category", "City", "State", "Payment_Method", "Customer_Type"]:
    df[col] = df[col].str.strip().str.title()
print("✅  Text columns stripped and title-cased")

# ══════════════════════════════════════════════════════════════════════════════
# STEP 8 — Outlier Detection (IQR method — report only, not removed)
# ══════════════════════════════════════════════════════════════════════════════
print("\nSTEP 8: Outlier detection (IQR)")
print("-" * 40)

for col in ["Price", "Revenue", "Delivery_Time_Min"]:
    Q1, Q3 = df[col].quantile(0.25), df[col].quantile(0.75)
    IQR = Q3 - Q1
    outliers = df[(df[col] < Q1 - 1.5 * IQR) | (df[col] > Q3 + 1.5 * IQR)]
    print(f"  {col:<20}: {len(outliers):>4} outliers detected (retained — valid business data)")

# ══════════════════════════════════════════════════════════════════════════════
# STEP 9 — Data Quality Assertions
# ══════════════════════════════════════════════════════════════════════════════
print("\nSTEP 9: Final validation assertions")
print("-" * 40)

assert df["Revenue"].min() > 0,         "❌ Negative revenue detected!"
assert df["Quantity"].min() > 0,        "❌ Zero/negative quantity!"
assert df.isnull().sum().sum() == 0,    "❌ Missing values remain!"
assert df["Customer_Rating"].max() <= 5, "❌ Rating exceeds 5!"

print(f"✅  All assertions passed")
print(f"\n📊 Final cleaned dataset:")
print(f"   Shape          : {df.shape[0]:,} rows × {df.shape[1]} columns")
print(f"   Date range     : {df['Order_Date'].min().date()} → {df['Order_Date'].max().date()}")
print(f"   Total Revenue  : ₹{df['Revenue'].sum():,.0f}")
print(f"   Avg Rating     : {df['Customer_Rating'].mean():.2f} / 5.0")
print(f"   Unique Products: {df['Product_Name'].nunique()}")
print(f"   Unique Cities  : {df['City'].nunique()}")

# ══════════════════════════════════════════════════════════════════════════════
# STEP 10 — Save Cleaned Data
# ══════════════════════════════════════════════════════════════════════════════
df.to_csv(CLEANED, index=False)
print(f"\n💾  Cleaned dataset saved → {CLEANED}")
print("=" * 60)
