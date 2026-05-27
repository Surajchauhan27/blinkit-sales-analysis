"""
Blinkit Sales Analysis — EDA Visualisations
============================================
Generates 12 professional charts saved to screenshots/
Uses Blinkit's brand palette: Yellow #F7D118, Dark #0D1117

Run from project root:  python notebooks/04_eda_visualizations.py
Or via master runner:   python run_all.py
"""

import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.gridspec import GridSpec
import os
import warnings
warnings.filterwarnings("ignore")

# ── Config ────────────────────────────────────────────────────────────────────
ROOT    = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
CLEANED = os.path.join(ROOT, "data", "blinkit_cleaned_data.csv")
SHOTS   = os.path.join(ROOT, "screenshots")
os.makedirs(SHOTS, exist_ok=True)

df = pd.read_csv(CLEANED, parse_dates=["Order_Date"])

# ── Brand Palette ─────────────────────────────────────────────────────────────
YELLOW   = "#F7D118"
DARK     = "#0D1117"
PANEL    = "#161B22"
CARD     = "#1C2332"
GREEN    = "#00C49F"
BLUE     = "#4FC3F7"
PINK     = "#FF6B9D"
ORANGE   = "#FF8A65"
PURPLE   = "#AB47BC"
RED      = "#FF5252"
WHITE    = "#FFFFFF"
MUTED    = "#8B949E"
CAT_COLORS = [YELLOW, GREEN, BLUE, PINK, ORANGE, PURPLE, RED,
              "#66BB6A", "#26C6DA", "#EC407A"]

plt.rcParams.update({
    "figure.facecolor":  DARK,
    "axes.facecolor":    PANEL,
    "axes.edgecolor":    "#2D3748",
    "axes.labelcolor":   MUTED,
    "xtick.color":       MUTED,
    "ytick.color":       MUTED,
    "text.color":        WHITE,
    "grid.color":        "#2D3748",
    "grid.linewidth":    0.6,
    "font.family":       "DejaVu Sans",
    "font.size":         11,
    "axes.titlesize":    14,
    "axes.titleweight":  "bold",
    "axes.titlecolor":   WHITE,
})


def save_fig(filename: str):
    path = os.path.join(SHOTS, filename)
    plt.savefig(path, dpi=150, bbox_inches="tight", facecolor=DARK)
    plt.close()
    print(f"  ✅  Saved → screenshots/{filename}")


def styled_ax(ax, title="", xlabel="", ylabel=""):
    ax.set_facecolor(PANEL)
    ax.spines[["top", "right"]].set_visible(False)
    ax.spines[["left", "bottom"]].set_color("#2D3748")
    if title:
        ax.set_title(title, color=WHITE, fontsize=13, fontweight="bold", pad=10)
    if xlabel:
        ax.set_xlabel(xlabel, color=MUTED, fontsize=10)
    if ylabel:
        ax.set_ylabel(ylabel, color=MUTED, fontsize=10)
    return ax


print("🎨  Generating Blinkit EDA Visualisations...")
print("=" * 60)

# ══════════════════════════════════════════════════════════════════════════════
# CHART 1 — Revenue by Category (Horizontal Bar)
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(12, 7))
fig.patch.set_facecolor(DARK)
cat_rev = df.groupby("Category")["Revenue"].sum().sort_values()
colors = [YELLOW if c == cat_rev.index[-1] else BLUE for c in cat_rev.index]
bars = ax.barh(cat_rev.index, cat_rev.values / 1e5, color=colors, height=0.65,
               edgecolor="#2D3748", linewidth=0.5)
for bar, val in zip(bars, cat_rev.values):
    ax.text(bar.get_width() + 0.02, bar.get_y() + bar.get_height() / 2,
            f"₹{val/1e5:.1f}L", va="center", ha="left", color=WHITE, fontsize=9)
styled_ax(ax, "Revenue by Category", "Revenue (₹ Lakhs)", "")
ax.grid(axis="x", alpha=0.3)
ax.set_axisbelow(True)
save_fig("01_revenue_by_category.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 2 — Monthly Revenue Trend (2023 vs 2024)
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(14, 6))
fig.patch.set_facecolor(DARK)
monthly = df.groupby(["Year", "Month"])["Revenue"].sum().reset_index()
for year, color, style in [(2023, MUTED, "--"), (2024, YELLOW, "-")]:
    d = monthly[monthly["Year"] == year].sort_values("Month")
    ax.plot(d["Month"], d["Revenue"] / 1e5, color=color, linewidth=2.5,
            linestyle=style, marker="o", markersize=6, label=str(year))
    ax.fill_between(d["Month"], d["Revenue"] / 1e5, alpha=0.08, color=color)
ax.set_xticks(range(1, 13))
ax.set_xticklabels(["Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"], color=MUTED)
styled_ax(ax, "Monthly Revenue Trend — 2023 vs 2024", "Month", "Revenue (₹ Lakhs)")
ax.legend(facecolor=CARD, edgecolor="#2D3748", labelcolor=WHITE, fontsize=11)
ax.grid(True, alpha=0.3)
ax.set_axisbelow(True)
save_fig("02_monthly_revenue_trend.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 3 — Top 10 Cities by Revenue
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(12, 7))
fig.patch.set_facecolor(DARK)
city_rev = df.groupby("City")["Revenue"].sum().nlargest(10).sort_values()
bar_colors = [YELLOW, YELLOW, YELLOW] + [BLUE] * 7
bar_colors.reverse()
bars = ax.barh(city_rev.index, city_rev.values / 1e5, color=bar_colors[::-1],
               height=0.65, edgecolor="#2D3748", linewidth=0.5)
for bar, val in zip(bars, city_rev.values):
    ax.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height() / 2,
            f"₹{val/1e5:.2f}L", va="center", ha="left", color=WHITE, fontsize=9)
styled_ax(ax, "Top 10 Cities by Revenue", "Revenue (₹ Lakhs)", "")
ax.grid(axis="x", alpha=0.3)
ax.set_axisbelow(True)
save_fig("03_top_cities_revenue.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 4 — Customer Type Comparison (Grouped Bar)
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor(DARK)
cust = df.groupby("Customer_Type").agg(
    Orders=("Revenue", "count"),
    Revenue=("Revenue", "sum"),
    Avg_Disc=("Discount", "mean")
).reset_index()
x = np.arange(len(cust))
w = 0.35
b1 = ax.bar(x - w / 2, cust["Orders"], w, color=BLUE, label="Orders", alpha=0.9)
ax2 = ax.twinx()
b2 = ax2.bar(x + w / 2, cust["Revenue"] / 1e5, w, color=YELLOW, label="Revenue (₹L)", alpha=0.9)
ax.set_xticks(x)
ax.set_xticklabels(cust["Customer_Type"], color=WHITE)
styled_ax(ax, "Customer Type — Orders vs Revenue", "", "Order Count")
ax2.set_ylabel("Revenue (₹ Lakhs)", color=YELLOW, fontsize=10)
ax2.tick_params(axis="y", colors=YELLOW)
ax2.spines[["top", "right"]].set_color("#2D3748")
ax2.set_facecolor(PANEL)
lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax.legend(lines1 + lines2, labels1 + labels2,
          facecolor=CARD, edgecolor="#2D3748", labelcolor=WHITE)
ax.grid(axis="y", alpha=0.3)
save_fig("04_customer_type_comparison.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 5 — Discount Impact on Revenue
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(11, 6))
fig.patch.set_facecolor(DARK)
df["Discount_Band"] = pd.cut(
    df["Discount"],
    bins=[-0.001, 0.00001, 0.05, 0.10, 0.15, 1.0],
    labels=["No Disc", "1–5%", "6–10%", "11–15%", "16%+"]
)
disc = df.groupby("Discount_Band", observed=True).agg(
    Orders=("Revenue", "count"),
    Avg_Rev=("Revenue", "mean"),
).reset_index()
bar_col = [GREEN if v == disc["Orders"].max() else ORANGE for v in disc["Orders"]]
bars = ax.bar(disc["Discount_Band"].astype(str), disc["Orders"],
              color=bar_col, edgecolor="#2D3748", linewidth=0.5)
ax3 = ax.twinx()
ax3.plot(disc["Discount_Band"].astype(str), disc["Avg_Rev"],
         color=YELLOW, marker="D", linewidth=2.5, markersize=8, label="Avg Revenue")
for bar in bars:
    ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 20,
            f"{int(bar.get_height()):,}", ha="center", va="bottom", color=WHITE, fontsize=9)
styled_ax(ax, "Discount Impact — Order Volume vs Avg Revenue", "Discount Band", "Order Count")
ax3.set_ylabel("Avg Revenue per Order (₹)", color=YELLOW, fontsize=10)
ax3.tick_params(axis="y", colors=YELLOW)
ax3.spines[["top", "right"]].set_color("#2D3748")
ax3.set_facecolor(PANEL)
ax.grid(axis="y", alpha=0.3)
ax.set_axisbelow(True)
save_fig("05_discount_impact.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 6 — Payment Method Distribution (Donut)
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(9, 8))
fig.patch.set_facecolor(DARK)
ax.set_facecolor(DARK)
pay = df["Payment_Method"].value_counts()
wedge_colors = [YELLOW, GREEN, BLUE, ORANGE, PURPLE]
wedges, texts, autotexts = ax.pie(
    pay.values,
    labels=pay.index,
    colors=wedge_colors,
    autopct="%1.1f%%",
    startangle=90,
    wedgeprops=dict(width=0.55, edgecolor=DARK, linewidth=2),
    textprops={"color": WHITE, "fontsize": 10},
    pctdistance=0.82,
)
for at in autotexts:
    at.set_color(DARK)
    at.set_fontweight("bold")
    at.set_fontsize(9)
ax.set_title("Payment Method Distribution", color=WHITE, fontsize=14,
             fontweight="bold", pad=20)
save_fig("06_payment_methods_donut.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 7 — Top 15 Products by Revenue
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(13, 8))
fig.patch.set_facecolor(DARK)
top_prods = df.groupby("Product_Name")["Revenue"].sum().nlargest(15).sort_values()
bar_col = [YELLOW if i >= 12 else BLUE for i in range(len(top_prods))]
bars = ax.barh(top_prods.index, top_prods.values / 1000, color=bar_col,
               height=0.7, edgecolor="#2D3748", linewidth=0.5)
for bar, val in zip(bars, top_prods.values):
    ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height() / 2,
            f"₹{val/1000:.1f}K", va="center", ha="left", color=WHITE, fontsize=8.5)
styled_ax(ax, "Top 15 Products by Revenue", "Revenue (₹ Thousands)", "")
ax.grid(axis="x", alpha=0.3)
ax.set_axisbelow(True)
save_fig("07_top_products_revenue.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 8 — Quarterly Revenue (Grouped Bar: 2023 vs 2024)
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor(DARK)
qtr = df.groupby(["Year", "Quarter"])["Revenue"].sum().reset_index()
quarters = ["Q1", "Q2", "Q3", "Q4"]
x = np.arange(len(quarters))
w = 0.35
for i, (year, color) in enumerate([(2023, MUTED), (2024, YELLOW)]):
    vals = []
    for q in quarters:
        row = qtr[(qtr["Year"] == year) & (qtr["Quarter"] == q)]
        vals.append(row["Revenue"].values[0] / 1e5 if len(row) > 0 else 0)
    bars = ax.bar(x + (i - 0.5) * w, vals, w, color=color, label=str(year),
                  alpha=0.9, edgecolor="#2D3748", linewidth=0.5)
    for bar, val in zip(bars, vals):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.02,
                f"₹{val:.1f}L", ha="center", va="bottom", color=WHITE, fontsize=8.5)
ax.set_xticks(x)
ax.set_xticklabels(quarters, color=WHITE)
styled_ax(ax, "Quarterly Revenue — 2023 vs 2024", "Quarter", "Revenue (₹ Lakhs)")
ax.legend(facecolor=CARD, edgecolor="#2D3748", labelcolor=WHITE)
ax.grid(axis="y", alpha=0.3)
ax.set_axisbelow(True)
save_fig("08_quarterly_revenue_comparison.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 9 — Customer Rating Distribution
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(10, 6))
fig.patch.set_facecolor(DARK)
rating_counts = df["Customer_Rating"].value_counts().sort_index()
bar_col = [RED, ORANGE, YELLOW, GREEN, "#00E676"]
bars = ax.bar(rating_counts.index, rating_counts.values,
              color=bar_col, edgecolor="#2D3748", linewidth=0.5, width=0.6)
for bar, val in zip(bars, rating_counts.values):
    ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 20,
            f"{val:,}\n({val/len(df)*100:.1f}%)", ha="center", va="bottom",
            color=WHITE, fontsize=10)
ax.set_xticks([1, 2, 3, 4, 5])
ax.set_xticklabels(["⭐ 1", "⭐⭐ 2", "⭐⭐⭐ 3", "⭐⭐⭐⭐ 4", "⭐⭐⭐⭐⭐ 5"], color=WHITE)
styled_ax(ax, "Customer Rating Distribution", "Star Rating", "Number of Orders")
ax.grid(axis="y", alpha=0.3)
ax.set_axisbelow(True)
save_fig("09_customer_rating_distribution.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 10 — Delivery Speed vs Customer Rating
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(11, 6))
fig.patch.set_facecolor(DARK)
df["Speed_Band"] = pd.cut(
    df["Delivery_Time_Min"],
    bins=[0, 15, 25, 35, 100],
    labels=["Express\n(<15 min)", "Standard\n(15–25 min)",
            "Moderate\n(26–35 min)", "Delayed\n(35+ min)"]
)
speed = df.groupby("Speed_Band", observed=True).agg(
    Orders=("Revenue", "count"),
    Avg_Rating=("Customer_Rating", "mean")
).reset_index()
speed_col = [GREEN, YELLOW, ORANGE, RED]
bars = ax.bar(speed["Speed_Band"].astype(str), speed["Orders"],
              color=speed_col, edgecolor="#2D3748", linewidth=0.5)
ax_r = ax.twinx()
ax_r.plot(speed["Speed_Band"].astype(str), speed["Avg_Rating"],
          color=WHITE, marker="D", linewidth=2.5, markersize=8, zorder=5, label="Avg Rating")
for bar, rating in zip(bars, speed["Avg_Rating"]):
    ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 15,
            f"{int(bar.get_height()):,}", ha="center", va="bottom", color=WHITE, fontsize=9)
styled_ax(ax, "Delivery Speed vs Customer Rating", "Delivery Speed", "Order Count")
ax_r.set_ylabel("Avg Customer Rating", color=WHITE, fontsize=10)
ax_r.set_ylim(3.5, 4.5)
ax_r.tick_params(axis="y", colors=WHITE)
ax_r.spines[["top", "right"]].set_color("#2D3748")
ax_r.set_facecolor(PANEL)
corr = df["Delivery_Time_Min"].corr(df["Customer_Rating"])
ax.text(0.02, 0.97, f"Pearson r = {corr:.3f}",
        transform=ax.transAxes, color=MUTED, fontsize=10, va="top")
ax.grid(axis="y", alpha=0.3)
ax.set_axisbelow(True)
save_fig("10_delivery_speed_vs_rating.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 11 — Category Revenue Heatmap (Sub-Category)
# ══════════════════════════════════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(14, 9))
fig.patch.set_facecolor(DARK)
heat = df.groupby(["Category", "Sub_Category"])["Revenue"].sum().reset_index()
pivot = heat.pivot(index="Category", columns="Sub_Category", values="Revenue").fillna(0)
pivot_norm = pivot.div(pivot.max(axis=1), axis=0)
im = ax.imshow(pivot_norm.values, aspect="auto", cmap="YlOrRd", vmin=0, vmax=1)
ax.set_xticks(range(len(pivot.columns)))
ax.set_xticklabels(pivot.columns, rotation=45, ha="right", color=WHITE, fontsize=8)
ax.set_yticks(range(len(pivot.index)))
ax.set_yticklabels(pivot.index, color=WHITE, fontsize=9)
ax.set_facecolor(DARK)
for i in range(len(pivot.index)):
    for j in range(len(pivot.columns)):
        val = pivot.values[i, j]
        if val > 0:
            ax.text(j, i, f"₹{val/1000:.0f}K", ha="center", va="center",
                    color=DARK if pivot_norm.values[i, j] > 0.5 else WHITE,
                    fontsize=7, fontweight="bold")
cbar = plt.colorbar(im, ax=ax, shrink=0.8)
cbar.set_label("Relative Revenue (within category)", color=WHITE, fontsize=9)
cbar.ax.yaxis.set_tick_params(color=WHITE)
plt.setp(cbar.ax.yaxis.get_ticklabels(), color=WHITE)
ax.set_title("Revenue Heatmap — Category × Sub-Category",
             color=WHITE, fontsize=14, fontweight="bold", pad=15)
save_fig("11_category_subcategory_heatmap.png")

# ══════════════════════════════════════════════════════════════════════════════
# CHART 12 — SUMMARY DASHBOARD (Multi-panel)
# ══════════════════════════════════════════════════════════════════════════════
fig = plt.figure(figsize=(20, 12))
fig.patch.set_facecolor(DARK)
gs = GridSpec(2, 3, figure=fig, hspace=0.4, wspace=0.35)

# KPI panel (top-left)
kpi_ax = fig.add_subplot(gs[0, 0])
kpi_ax.set_facecolor(CARD)
kpi_ax.set_xticks([])
kpi_ax.set_yticks([])
kpi_ax.spines[:].set_color("#2D3748")
kpis = [
    ("Total Revenue",   f"₹{df['Revenue'].sum()/1e5:.1f}L",  YELLOW),
    ("Total Orders",    f"{len(df):,}",                       WHITE),
    ("Avg Rating",      f"{df['Customer_Rating'].mean():.2f}⭐", GREEN),
    ("Avg Delivery",    f"{df['Delivery_Time_Min'].mean():.0f} min", ORANGE),
]
for i, (label, val, color) in enumerate(kpis):
    y = 0.82 - i * 0.22
    kpi_ax.text(0.5, y, val, ha="center", fontsize=20, fontweight="bold",
                color=color, transform=kpi_ax.transAxes)
    kpi_ax.text(0.5, y - 0.08, label, ha="center", fontsize=9, color=MUTED,
                transform=kpi_ax.transAxes)
kpi_ax.set_title("Key Metrics", color=WHITE, fontsize=12, pad=10)

# Top Categories bar (top-center + right)
ax_cat = fig.add_subplot(gs[0, 1:])
ax_cat.set_facecolor(PANEL)
top5_cat = df.groupby("Category")["Revenue"].sum().nlargest(5)
bars = ax_cat.barh(top5_cat.index[::-1], top5_cat.values[::-1] / 1e5,
                   color=CAT_COLORS[:5], height=0.6)
for bar, val in zip(bars, top5_cat.values[::-1]):
    ax_cat.text(bar.get_width() + 0.01, bar.get_y() + bar.get_height() / 2,
                f"₹{val/1e5:.1f}L", va="center", color=WHITE, fontsize=9)
styled_ax(ax_cat, "Top 5 Revenue Categories", "₹ Lakhs", "")
ax_cat.grid(axis="x", alpha=0.3)

# Monthly trend (bottom-left + center)
ax_trend = fig.add_subplot(gs[1, :2])
ax_trend.set_facecolor(PANEL)
m2024 = df[df["Year"] == 2024].groupby("Month")["Revenue"].sum()
m2023 = df[df["Year"] == 2023].groupby("Month")["Revenue"].sum()
ax_trend.fill_between(m2024.index, m2024.values / 1e5, alpha=0.15, color=YELLOW)
ax_trend.plot(m2024.index, m2024.values / 1e5, color=YELLOW, lw=2.5,
              marker="o", markersize=5, label="2024")
ax_trend.fill_between(m2023.index, m2023.values / 1e5, alpha=0.1, color=MUTED)
ax_trend.plot(m2023.index, m2023.values / 1e5, color=MUTED, lw=2,
              linestyle="--", label="2023")
ax_trend.set_xticks(range(1, 13))
ax_trend.set_xticklabels(["J","F","M","A","M","J","J","A","S","O","N","D"],
                          color=MUTED, fontsize=9)
styled_ax(ax_trend, "Monthly Revenue Trend (₹ Lakhs)", "Month", "₹ Lakhs")
ax_trend.legend(facecolor=CARD, edgecolor="#2D3748", labelcolor=WHITE, fontsize=9)
ax_trend.grid(True, alpha=0.3)

# Rating donut (bottom-right)
ax_donut = fig.add_subplot(gs[1, 2])
ax_donut.set_facecolor(DARK)
rating_c = df["Customer_Rating"].value_counts().sort_index()
donut_colors = [RED, ORANGE, YELLOW, GREEN, "#00E676"]
ax_donut.pie(rating_c.values, labels=[f"⭐{i}" for i in rating_c.index],
             colors=donut_colors,
             wedgeprops=dict(width=0.5, edgecolor=DARK),
             textprops={"color": WHITE, "fontsize": 9},
             autopct="%1.0f%%", startangle=90)
ax_donut.set_title("Rating Distribution", color=WHITE, fontsize=12, pad=10)

# Main title
fig.suptitle("🛒  BLINKIT SALES ANALYSIS — EXECUTIVE SUMMARY DASHBOARD",
             color=YELLOW, fontsize=16, fontweight="bold", y=0.98)

save_fig("12_summary_dashboard.png")

print("\n" + "=" * 60)
print(f"✅  All 12 charts generated → screenshots/")
print("=" * 60)
