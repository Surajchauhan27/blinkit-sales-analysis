"""
Blinkit Sales Analysis - Dataset Generator
==========================================
Generates a realistic 10,000+ row grocery sales dataset
mimicking Blinkit's quick-commerce model in India.
"""

import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os

# ─── Reproducibility ───────────────────────────────────────────────────────────
np.random.seed(42)
random.seed(42)

# ─── Reference Data ────────────────────────────────────────────────────────────
CATEGORIES = {
    "Fruits & Vegetables": ["Fresh Fruits", "Fresh Vegetables", "Exotic Produce"],
    "Dairy & Breakfast":   ["Milk & Curd", "Bread & Eggs", "Butter & Cheese"],
    "Snacks & Munchies":   ["Chips & Crisps", "Cookies & Biscuits", "Namkeen"],
    "Beverages":           ["Cold Drinks", "Juices", "Water & Soda", "Tea & Coffee"],
    "Personal Care":       ["Skin Care", "Hair Care", "Oral Care"],
    "Household":           ["Cleaning Supplies", "Laundry", "Kitchen Essentials"],
    "Baby Care":           ["Baby Food", "Diapers", "Baby Hygiene"],
    "Meat & Seafood":      ["Chicken", "Fish & Seafood", "Eggs"],
    "Frozen Foods":        ["Frozen Snacks", "Ice Cream", "Frozen Meals"],
    "Staples":             ["Rice & Dal", "Atta & Flour", "Oils & Ghee"],
}

PRODUCTS = {
    "Fresh Fruits":       ["Bananas (dozen)", "Apples (1kg)", "Mangoes (1kg)", "Pomegranate (500g)", "Grapes (500g)"],
    "Fresh Vegetables":   ["Tomatoes (1kg)", "Onions (1kg)", "Potatoes (1kg)", "Spinach (250g)", "Capsicum (500g)"],
    "Exotic Produce":     ["Avocado (2pcs)", "Kiwi (4pcs)", "Broccoli (500g)", "Zucchini (500g)", "Cherry Tomatoes (250g)"],
    "Milk & Curd":        ["Amul Milk (1L)", "Mother Dairy Curd (400g)", "Amul Buttermilk (200ml)", "Nestle A+ Milk (500ml)", "Epigamia Greek Yogurt (90g)"],
    "Bread & Eggs":       ["Britannia Brown Bread", "Harvest Gold White Bread", "Farm Eggs (6pcs)", "Farm Eggs (12pcs)", "English Muffins"],
    "Butter & Cheese":    ["Amul Butter (100g)", "Amul Cheese Slices (200g)", "Britannia Cheese Spread", "Naturals Paneer (200g)", "Amul Ghee (500ml)"],
    "Chips & Crisps":     ["Lays Classic Salted (26g)", "Doritos Nacho Cheese (45g)", "Bingo Mad Angles (38g)", "Haldirams Aloo Bhujia (150g)", "Pringles Original (107g)"],
    "Cookies & Biscuits": ["Oreo Original (120g)", "Parle-G (250g)", "Good Day Cashew (150g)", "Marie Gold (250g)", "Hide & Seek (150g)"],
    "Namkeen":            ["Haldirams Mixture (150g)", "Too Yumm Multigrain (50g)", "Cornitos Nachos (55g)", "Bikaji Bhujia (200g)", "Lay's Masal Munch (73g)"],
    "Cold Drinks":        ["Coca Cola 500ml", "Pepsi 600ml", "Sprite 500ml", "Thums Up 500ml", "Mountain Dew 600ml"],
    "Juices":             ["Real Mango Juice (1L)", "Tropicana Orange (1L)", "Paper Boat Jaljeera (250ml)", "B Natural Mixed Fruit (1L)", "Minute Maid Guava (400ml)"],
    "Water & Soda":       ["Bisleri Water (1L)", "Aquafina 1L", "Bailey Water (2L)", "Schweppes Tonic (300ml)", "Appy Fizz (250ml)"],
    "Tea & Coffee":       ["Tata Tea Gold (250g)", "Nescafe Classic (50g)", "Red Label Tea (500g)", "Bru Gold Coffee (50g)", "Green Tea (25 bags)"],
    "Skin Care":          ["Nivea Body Lotion (200ml)", "Dove Soap (100g)", "Cetaphil Face Wash (250ml)", "Neutrogena Sunscreen SPF50", "Vaseline Intensive Care (400ml)"],
    "Hair Care":          ["Head & Shoulders Shampoo (340ml)", "Pantene Conditioner (180ml)", "Dove Shampoo (650ml)", "Parachute Hair Oil (500ml)", "Tresemme Shampoo (450ml)"],
    "Oral Care":          ["Colgate MaxFresh (150g)", "Oral-B Toothbrush Medium", "Listerine Mouthwash (250ml)", "Sensodyne Toothpaste (70g)", "Colgate Total (150g)"],
    "Cleaning Supplies":  ["Vim Dishwash Liquid (750ml)", "Harpic Toilet Cleaner (500ml)", "Colin Glass Cleaner (500ml)", "Lizol Floor Cleaner (500ml)", "Scotch-Brite Scrubber"],
    "Laundry":            ["Ariel Matic (1kg)", "Surf Excel Liquid (1kg)", "Comfort Fabric Softener (860ml)", "Tide Plus (1.5kg)", "Vanish Stain Remover (250g)"],
    "Kitchen Essentials": ["Foil & Wrap (10m)", "Glad Zip Bags (25pcs)", "Steel Wool Pad (Pack of 3)", "Disposable Plates (25pcs)", "Cling Film Roll"],
    "Baby Food":          ["Nestle Cerelac (300g)", "Farex Baby Cereal (300g)", "Heinz Strained Carrots (110g)", "Horlicks Junior (200g)", "Nan Pro Infant Formula"],
    "Diapers":            ["Pampers S Diapers (20pcs)", "Huggies M Diapers (16pcs)", "MamyPoko Pants XL (20pcs)", "Pampers Premium M (20pcs)", "Huggies Ultra Soft NB (24pcs)"],
    "Baby Hygiene":       ["Johnson's Baby Powder (200g)", "Himalaya Baby Soap", "Sebamed Baby Lotion (200ml)", "WaterWipes Baby Wipes (60pcs)", "Chicco Baby Oil (200ml)"],
    "Chicken":            ["Fresh Chicken Curry Cut (500g)", "Boneless Chicken Breast (500g)", "Chicken Keema (500g)", "Chicken Wings (500g)", "Dressed Chicken Whole (1kg)"],
    "Fish & Seafood":     ["Rohu Fish (500g)", "Prawns Medium (250g)", "Surmai Fish (500g)", "Tilapia Fillet (500g)", "Crab Masala (250g)"],
    "Eggs":               ["Farm Fresh Eggs (6pcs)", "Farm Fresh Eggs (12pcs)", "Brown Eggs (6pcs)", "Omega-3 Eggs (6pcs)", "Duck Eggs (6pcs)"],
    "Frozen Snacks":      ["McCain Smiles (420g)", "Haldirams Frozen Samosa (400g)", "Godrej Yummiez Nuggets (250g)", "ITC Master Chef Chicken (250g)", "Amul Corn Pizza (200g)"],
    "Ice Cream":          ["Amul Vanilla Tub (1L)", "Kwality Walls Mango Bar (2pcs)", "Baskin Robbins Choco (500ml)", "Naturals Sitaphal (500g)", "Magnum Almond (80ml)"],
    "Frozen Meals":       ["Haldirams Dal Makhni (300g)", "Godrej Real Good Meal", "MTR Frozen Upma (200g)", "ITC Kitchens Biryani (250g)", "Swiggy Bites Momos (250g)"],
    "Rice & Dal":         ["India Gate Basmati (1kg)", "Fortune Toor Dal (500g)", "Daawat Extra Long (1kg)", "Moong Dal (500g)", "Rajma (500g)"],
    "Atta & Flour":       ["Aashirvaad Atta (5kg)", "Pillsbury Atta (5kg)", "Besan Flour (500g)", "Maida (1kg)", "Sooji Rawa (500g)"],
    "Oils & Ghee":        ["Fortune Sunflower Oil (1L)", "Saffola Gold (1L)", "Amul Pure Ghee (500ml)", "Patanjali Cow Ghee (500ml)", "Figaro Olive Oil (500ml)"],
}

CITIES_STATES = {
    "Mumbai": "Maharashtra", "Delhi": "Delhi", "Bengaluru": "Karnataka",
    "Hyderabad": "Telangana", "Chennai": "Tamil Nadu", "Kolkata": "West Bengal",
    "Pune": "Maharashtra", "Ahmedabad": "Gujarat", "Jaipur": "Rajasthan",
    "Lucknow": "Uttar Pradesh", "Surat": "Gujarat", "Chandigarh": "Punjab",
    "Noida": "Uttar Pradesh", "Gurugram": "Haryana", "Indore": "Madhya Pradesh",
}

PAYMENT_METHODS = ["UPI", "Credit Card", "Debit Card", "Cash on Delivery", "Blinkit Wallet"]
CUSTOMER_TYPES  = ["New", "Regular", "Premium"]

# Price ranges per sub-category (min, max)
PRICE_RANGES = {
    "Fresh Fruits": (20, 120), "Fresh Vegetables": (15, 80), "Exotic Produce": (80, 350),
    "Milk & Curd": (25, 120), "Bread & Eggs": (20, 100), "Butter & Cheese": (40, 250),
    "Chips & Crisps": (10, 150), "Cookies & Biscuits": (10, 120), "Namkeen": (15, 180),
    "Cold Drinks": (20, 100), "Juices": (30, 180), "Water & Soda": (15, 80), "Tea & Coffee": (40, 350),
    "Skin Care": (80, 600), "Hair Care": (60, 450), "Oral Care": (30, 250),
    "Cleaning Supplies": (40, 250), "Laundry": (80, 450), "Kitchen Essentials": (30, 150),
    "Baby Food": (80, 600), "Diapers": (150, 700), "Baby Hygiene": (60, 400),
    "Chicken": (120, 350), "Fish & Seafood": (150, 450), "Eggs": (30, 120),
    "Frozen Snacks": (80, 300), "Ice Cream": (60, 500), "Frozen Meals": (80, 280),
    "Rice & Dal": (50, 400), "Atta & Flour": (60, 450), "Oils & Ghee": (100, 700),
}

def generate_dataset(n=10500):
    rows = []
    start_date = datetime(2023, 1, 1)
    end_date   = datetime(2024, 12, 31)
    date_range = (end_date - start_date).days

    # Seasonal weights — Q4 & festive months (Oct-Dec) peak
    def get_seasonal_weight(d):
        m = d.month
        weights = {1:0.75, 2:0.70, 3:0.80, 4:0.85, 5:0.90, 6:0.85,
                   7:0.88, 8:0.92, 9:0.95, 10:1.10, 11:1.20, 12:1.15}
        return weights.get(m, 1.0)

    for i in range(n):
        # Random date biased toward weekends
        rand_day    = random.randint(0, date_range)
        order_date  = start_date + timedelta(days=rand_day)
        seasonal_w  = get_seasonal_weight(order_date)

        city        = random.choice(list(CITIES_STATES.keys()))
        state       = CITIES_STATES[city]

        category    = random.choice(list(CATEGORIES.keys()))
        sub_cat     = random.choice(CATEGORIES[category])
        product     = random.choice(PRODUCTS.get(sub_cat, ["Generic Product"]))

        pmin, pmax  = PRICE_RANGES.get(sub_cat, (30, 300))
        price       = round(random.uniform(pmin, pmax), 2)

        quantity    = np.random.choice([1,2,3,4,5,6], p=[0.40,0.28,0.15,0.10,0.05,0.02])

        # Discounts — premium customers get better deals
        cust_type   = random.choices(CUSTOMER_TYPES, weights=[30, 50, 20])[0]
        disc_map    = {"New": (0, 0.10), "Regular": (0, 0.15), "Premium": (0.05, 0.25)}
        dmin, dmax  = disc_map[cust_type]
        discount    = round(random.uniform(dmin, dmax), 2)

        revenue     = round(price * quantity * (1 - discount) * seasonal_w, 2)

        # Ratings — slightly skewed positive
        rating      = round(np.random.choice([1,2,3,4,5], p=[0.03,0.07,0.15,0.40,0.35]), 1)

        # Delivery time — faster in metro cities
        metro_cities = {"Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Kolkata"}
        if city in metro_cities:
            delivery_time = random.randint(8, 30)
        else:
            delivery_time = random.randint(15, 45)

        payment     = random.choices(
            PAYMENT_METHODS,
            weights=[40, 20, 18, 12, 10]
        )[0]

        rows.append({
            "Order_ID":        f"BLK{100000 + i}",
            "Order_Date":      order_date.strftime("%Y-%m-%d"),
            "Product_Name":    product,
            "Category":        category,
            "Sub_Category":    sub_cat,
            "Price":           price,
            "Quantity":        quantity,
            "Discount":        discount,
            "Revenue":         revenue,
            "Customer_Rating": rating,
            "City":            city,
            "State":           state,
            "Payment_Method":  payment,
            "Delivery_Time_Min": delivery_time,
            "Customer_Type":   cust_type,
        })

    df = pd.DataFrame(rows)

    # Inject ~3% missing values for cleaning exercise
    for col in ["Customer_Rating", "Delivery_Time_Min", "Discount"]:
        mask = np.random.rand(len(df)) < 0.03
        df.loc[mask, col] = np.nan

    # Inject ~1% duplicates
    dup_idx  = df.sample(frac=0.01, random_state=1).index
    df       = pd.concat([df, df.loc[dup_idx]], ignore_index=True)

    return df


if __name__ == "__main__":
    print("🔄  Generating Blinkit Sales Dataset...")
    df = generate_dataset(10500)
    ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
    out = os.path.join(ROOT, "data", "blinkit_raw_data.csv")
    df.to_csv(out, index=False)
    print(f"✅  Raw dataset saved → {out}")
    print(f"    Rows : {len(df):,}")
    print(f"    Cols : {len(df.columns)}")
    print(df.head(3).to_string())
