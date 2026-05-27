-- ============================================================
-- Blinkit Sales Analysis — SQL Queries
-- ============================================================
-- Database: SQLite / PostgreSQL / MySQL compatible
-- Table   : blinkit_sales
-- Author  : [Your Name]
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 0. CREATE TABLE (run once to load CSV into SQL environment)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blinkit_sales (
    Order_ID           TEXT    PRIMARY KEY,
    Order_Date         DATE,
    Product_Name       TEXT,
    Category           TEXT,
    Sub_Category       TEXT,
    Price              REAL,
    Quantity           INTEGER,
    Discount           REAL,
    Revenue            REAL,
    Customer_Rating    REAL,
    City               TEXT,
    State              TEXT,
    Payment_Method     TEXT,
    Delivery_Time_Min  INTEGER,
    Customer_Type      TEXT,
    Year               INTEGER,
    Month              INTEGER,
    Month_Name         TEXT,
    Quarter            TEXT,
    Day_of_Week        TEXT,
    Discount_Amount    REAL,
    Gross_Amount       REAL
);

-- ============================================================
-- Q1. BUSINESS OVERVIEW — Total KPIs
-- ============================================================
SELECT
    COUNT(*)                            AS Total_Orders,
    ROUND(SUM(Revenue), 2)              AS Total_Revenue,
    ROUND(AVG(Revenue), 2)              AS Avg_Order_Value,
    ROUND(AVG(Customer_Rating), 2)      AS Avg_Customer_Rating,
    ROUND(AVG(Delivery_Time_Min), 1)    AS Avg_Delivery_Time_Min,
    COUNT(DISTINCT Product_Name)        AS Unique_Products,
    COUNT(DISTINCT City)                AS Cities_Served
FROM blinkit_sales;

-- ============================================================
-- Q2. REVENUE BY CATEGORY (Best Performing Categories)
-- ============================================================
SELECT
    Category,
    COUNT(*)                                   AS Total_Orders,
    ROUND(SUM(Revenue), 2)                     AS Total_Revenue,
    ROUND(AVG(Revenue), 2)                     AS Avg_Order_Value,
    ROUND(SUM(Revenue) * 100.0 /
          SUM(SUM(Revenue)) OVER (), 2)        AS Revenue_Share_Pct
FROM blinkit_sales
GROUP BY Category
ORDER BY Total_Revenue DESC;

-- ============================================================
-- Q3. TOP 15 SELLING PRODUCTS BY REVENUE
-- ============================================================
SELECT
    Product_Name,
    Category,
    Sub_Category,
    SUM(Quantity)                   AS Units_Sold,
    ROUND(SUM(Revenue), 2)          AS Total_Revenue,
    ROUND(AVG(Customer_Rating), 2)  AS Avg_Rating,
    COUNT(*)                        AS Order_Count
FROM blinkit_sales
GROUP BY Product_Name, Category, Sub_Category
ORDER BY Total_Revenue DESC
LIMIT 15;

-- ============================================================
-- Q4. MONTHLY SALES TREND
-- ============================================================
SELECT
    Year,
    Month,
    Month_Name,
    COUNT(*)                        AS Total_Orders,
    ROUND(SUM(Revenue), 2)          AS Monthly_Revenue,
    ROUND(AVG(Revenue), 2)          AS Avg_Order_Value,
    ROUND(
        (SUM(Revenue) - LAG(SUM(Revenue)) OVER (ORDER BY Year, Month))
        * 100.0
        / NULLIF(LAG(SUM(Revenue)) OVER (ORDER BY Year, Month), 0)
    , 2)                            AS MoM_Growth_Pct
FROM blinkit_sales
GROUP BY Year, Month, Month_Name
ORDER BY Year, Month;

-- ============================================================
-- Q5. QUARTERLY REVENUE COMPARISON
-- ============================================================
SELECT
    Year,
    Quarter,
    COUNT(*)                        AS Total_Orders,
    ROUND(SUM(Revenue), 2)          AS Quarterly_Revenue,
    ROUND(AVG(Customer_Rating), 2)  AS Avg_Rating
FROM blinkit_sales
GROUP BY Year, Quarter
ORDER BY Year, Quarter;

-- ============================================================
-- Q6. REGIONAL SALES ANALYSIS — STATE LEVEL
-- ============================================================
SELECT
    State,
    COUNT(DISTINCT City)            AS Cities_Count,
    COUNT(*)                        AS Total_Orders,
    ROUND(SUM(Revenue), 2)          AS Total_Revenue,
    ROUND(AVG(Revenue), 2)          AS Avg_Order_Value,
    ROUND(AVG(Delivery_Time_Min),1) AS Avg_Delivery_Min
FROM blinkit_sales
GROUP BY State
ORDER BY Total_Revenue DESC;

-- ============================================================
-- Q7. TOP CITIES BY REVENUE
-- ============================================================
SELECT
    City,
    State,
    COUNT(*)                        AS Total_Orders,
    ROUND(SUM(Revenue), 2)          AS Total_Revenue,
    ROUND(SUM(Revenue) * 100.0 /
          SUM(SUM(Revenue)) OVER (), 2)  AS Revenue_Share_Pct,
    ROUND(AVG(Delivery_Time_Min),1) AS Avg_Delivery_Min,
    ROUND(AVG(Customer_Rating), 2)  AS Avg_Rating
FROM blinkit_sales
GROUP BY City, State
ORDER BY Total_Revenue DESC
LIMIT 10;

-- ============================================================
-- Q8. CUSTOMER TYPE ANALYSIS
-- ============================================================
SELECT
    Customer_Type,
    COUNT(*)                        AS Total_Orders,
    ROUND(SUM(Revenue), 2)          AS Total_Revenue,
    ROUND(AVG(Revenue), 2)          AS Avg_Order_Value,
    ROUND(AVG(Discount), 3)         AS Avg_Discount_Rate,
    ROUND(AVG(Customer_Rating), 2)  AS Avg_Rating,
    ROUND(AVG(Delivery_Time_Min),1) AS Avg_Delivery_Min
FROM blinkit_sales
GROUP BY Customer_Type
ORDER BY Total_Revenue DESC;

-- ============================================================
-- Q9. AVERAGE CUSTOMER RATINGS BY CATEGORY
-- ============================================================
SELECT
    Category,
    ROUND(AVG(Customer_Rating), 2)       AS Avg_Rating,
    COUNT(*) FILTER (WHERE Customer_Rating >= 4) AS High_Ratings,
    COUNT(*) FILTER (WHERE Customer_Rating <= 2) AS Low_Ratings,
    COUNT(*)                              AS Total_Reviews
FROM blinkit_sales
GROUP BY Category
ORDER BY Avg_Rating DESC;

-- ============================================================
-- Q10. DISCOUNT IMPACT ANALYSIS
-- ============================================================
SELECT
    CASE
        WHEN Discount = 0         THEN 'No Discount'
        WHEN Discount <= 0.05     THEN '1–5%'
        WHEN Discount <= 0.10     THEN '6–10%'
        WHEN Discount <= 0.15     THEN '11–15%'
        ELSE                           '16%+'
    END                             AS Discount_Band,
    COUNT(*)                        AS Order_Count,
    ROUND(SUM(Revenue), 2)          AS Total_Revenue,
    ROUND(AVG(Revenue), 2)          AS Avg_Revenue_Per_Order,
    ROUND(AVG(Quantity), 2)         AS Avg_Quantity,
    ROUND(AVG(Customer_Rating), 2)  AS Avg_Rating
FROM blinkit_sales
GROUP BY Discount_Band
ORDER BY
    CASE Discount_Band
        WHEN 'No Discount' THEN 1
        WHEN '1–5%'        THEN 2
        WHEN '6–10%'       THEN 3
        WHEN '11–15%'      THEN 4
        ELSE 5
    END;

-- ============================================================
-- Q11. PAYMENT METHOD DISTRIBUTION
-- ============================================================
SELECT
    Payment_Method,
    COUNT(*)                        AS Order_Count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS Share_Pct,
    ROUND(SUM(Revenue), 2)          AS Total_Revenue,
    ROUND(AVG(Revenue), 2)          AS Avg_Order_Value
FROM blinkit_sales
GROUP BY Payment_Method
ORDER BY Order_Count DESC;

-- ============================================================
-- Q12. DAY OF WEEK SALES PATTERN
-- ============================================================
SELECT
    Day_of_Week,
    COUNT(*)                        AS Total_Orders,
    ROUND(SUM(Revenue), 2)          AS Total_Revenue,
    ROUND(AVG(Revenue), 2)          AS Avg_Order_Value
FROM blinkit_sales
GROUP BY Day_of_Week
ORDER BY Total_Revenue DESC;

-- ============================================================
-- Q13. PEAK HOURS / DELIVERY PERFORMANCE BUCKETS
-- ============================================================
SELECT
    CASE
        WHEN Delivery_Time_Min <= 15 THEN 'Express (<15 min)'
        WHEN Delivery_Time_Min <= 25 THEN 'Standard (15–25 min)'
        WHEN Delivery_Time_Min <= 35 THEN 'Moderate (26–35 min)'
        ELSE                              'Delayed (35+ min)'
    END                             AS Delivery_Speed,
    COUNT(*)                        AS Order_Count,
    ROUND(AVG(Customer_Rating), 2)  AS Avg_Rating,
    ROUND(SUM(Revenue), 2)          AS Total_Revenue
FROM blinkit_sales
GROUP BY Delivery_Speed
ORDER BY
    CASE Delivery_Speed
        WHEN 'Express (<15 min)'      THEN 1
        WHEN 'Standard (15–25 min)'   THEN 2
        WHEN 'Moderate (26–35 min)'   THEN 3
        ELSE 4
    END;

-- ============================================================
-- Q14. SUB-CATEGORY DEEP DIVE
-- ============================================================
SELECT
    Category,
    Sub_Category,
    COUNT(*)                        AS Orders,
    ROUND(SUM(Revenue), 2)          AS Revenue,
    ROUND(AVG(Price), 2)            AS Avg_Price,
    ROUND(AVG(Customer_Rating), 2)  AS Avg_Rating
FROM blinkit_sales
GROUP BY Category, Sub_Category
ORDER BY Category, Revenue DESC;

-- ============================================================
-- Q15. YoY REVENUE COMPARISON (2023 vs 2024)
-- ============================================================
SELECT
    Month_Name,
    ROUND(SUM(CASE WHEN Year = 2023 THEN Revenue ELSE 0 END), 2) AS Revenue_2023,
    ROUND(SUM(CASE WHEN Year = 2024 THEN Revenue ELSE 0 END), 2) AS Revenue_2024,
    ROUND(
        (SUM(CASE WHEN Year = 2024 THEN Revenue ELSE 0 END)
         - SUM(CASE WHEN Year = 2023 THEN Revenue ELSE 0 END))
        * 100.0
        / NULLIF(SUM(CASE WHEN Year = 2023 THEN Revenue ELSE 0 END), 0)
    , 2) AS YoY_Growth_Pct
FROM blinkit_sales
GROUP BY Month_Name,
         CASE Month_Name
             WHEN 'Jan' THEN 1 WHEN 'Feb' THEN 2 WHEN 'Mar' THEN 3
             WHEN 'Apr' THEN 4 WHEN 'May' THEN 5 WHEN 'Jun' THEN 6
             WHEN 'Jul' THEN 7 WHEN 'Aug' THEN 8 WHEN 'Sep' THEN 9
             WHEN 'Oct' THEN 10 WHEN 'Nov' THEN 11 ELSE 12
         END
ORDER BY
    CASE Month_Name
        WHEN 'Jan' THEN 1 WHEN 'Feb' THEN 2 WHEN 'Mar' THEN 3
        WHEN 'Apr' THEN 4 WHEN 'May' THEN 5 WHEN 'Jun' THEN 6
        WHEN 'Jul' THEN 7 WHEN 'Aug' THEN 8 WHEN 'Sep' THEN 9
        WHEN 'Oct' THEN 10 WHEN 'Nov' THEN 11 ELSE 12
    END;
