# Dashboard SQL Queries

This document lists all SQL queries used by the Dashboard API endpoints.

## Stats Queries

### Total Stores Count

```sql
SELECT COUNT(*) as count FROM stores
```

### Total Products Count

```sql
SELECT COUNT(*) as count FROM products
```

### Total Inventory Value

```sql
SELECT SUM(price * stock_quantity) as totalValue FROM products
```

### Low Stock Count

```sql
SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10
```

## Category Data Query

### Products by Category

```sql
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
ORDER BY count DESC
```

## Store Data Query

### Top Stores by Product Count and Inventory Value

```sql
SELECT
  s.id as store_id,
  s.name as store_name,
  COUNT(p.id) as product_count,
  COALESCE(SUM(p.price * p.stock_quantity), 0) as inventory_value
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
GROUP BY s.id, s.name
ORDER BY product_count DESC
LIMIT 10
```

## Stock Level Data Query

### Stock Levels Over Time (by period: 7d, 30d, 90d)

```sql
SELECT
  date(created_at) as date,
  SUM(stock_quantity) as total_stock
FROM products
WHERE created_at >= datetime('now', '-' || ? || ' days')
GROUP BY date(created_at)
ORDER BY date ASC
```

**Parameters:**

- `?` = number of days (7, 30, or 90)

## Inventory Value Data Query

### Inventory Value Trend (by period: 7d, 30d, 90d)

```sql
SELECT
  date(created_at) as date,
  SUM(price * stock_quantity) as total_value
FROM products
WHERE created_at >= datetime('now', '-' || ? || ' days')
GROUP BY date(created_at)
ORDER BY date ASC
```

**Parameters:**

- `?` = number of days (7, 30, or 90)

## Low Stock Alerts Query

### Low Stock Products with Store Information

```sql
SELECT
  p.id as product_id,
  p.name as product_name,
  s.id as store_id,
  s.name as store_name,
  p.category,
  p.stock_quantity
FROM products p
INNER JOIN stores s ON p.store_id = s.id
WHERE p.stock_quantity < 10
ORDER BY p.stock_quantity ASC
LIMIT ?
```

**Parameters:**

- `?` = limit (default: 10)

## Activity Queries

### Recent Product Updates

```sql
SELECT
  'update' as type,
  'Product "' || name || '" updated' as text,
  updated_at as timestamp
FROM products
ORDER BY updated_at DESC
LIMIT ?
```

**Parameters:**

- `?` = limit (default: 10)

### Recent Product Creations

```sql
SELECT
  'add' as type,
  'New product "' || p.name || '" added to ' || s.name as text,
  p.created_at as timestamp
FROM products p
INNER JOIN stores s ON p.store_id = s.id
ORDER BY p.created_at DESC
LIMIT ?
```

**Parameters:**

- `?` = limit (default: 10)

### Recent Store Creations

```sql
SELECT
  'store' as type,
  'New store "' || name || '" created' as text,
  created_at as timestamp
FROM stores
ORDER BY created_at DESC
LIMIT ?
```

**Parameters:**

- `?` = limit (default: 10)

## API Endpoints

All endpoints return data in the RESTful API response format:

### Recommended: Single Combined Endpoint

**`GET /api/dashboard`** - Get all dashboard data in one optimized call (RECOMMENDED)

This is the most efficient approach - fetches all data in parallel with a single HTTP request.

**Query Parameters (all optional):**

- `stats=false` - Exclude stats
- `categories=false` - Exclude categories
- `stores=false` - Exclude stores
- `stockLevels=false` - Exclude stock levels
- `inventoryValue=false` - Exclude inventory value
- `alerts=false` - Exclude alerts
- `activity=false` - Exclude activity
- `stockPeriod=7d|30d|90d` - Period for stock levels (default: 7d)
- `valuePeriod=7d|30d|90d` - Period for inventory value (default: 7d)
- `alertsLimit=10` - Limit for alerts (default: 10)
- `activityLimit=10` - Limit for activity (default: 10)

**Example:**

```
GET /api/dashboard?stockPeriod=30d&valuePeriod=30d&alertsLimit=20
```

**Response:**

```json
{
  "data": {
    "stats": { ... },
    "categories": [ ... ],
    "stores": [ ... ],
    "stockLevels": [ ... ],
    "inventoryValue": [ ... ],
    "alerts": [ ... ],
    "activity": [ ... ]
  },
  "meta": { ... }
}
```

### Individual Endpoints (for granular control)

- `GET /api/dashboard/stats` - Get statistics only
- `GET /api/dashboard/categories` - Get category distribution only
- `GET /api/dashboard/stores?view=count|value` - Get store data only
- `GET /api/dashboard/stock-levels?period=7d|30d|90d` - Get stock levels only
- `GET /api/dashboard/inventory-value?period=7d|30d|90d` - Get inventory value only
- `GET /api/dashboard/alerts?limit=10` - Get low stock alerts only
- `GET /api/dashboard/activity?limit=10` - Get recent activity only

## Performance Optimization

### Optimized Stats Query

The `getStats()` method uses a single query with subqueries instead of 4 separate queries:

```sql
SELECT
  (SELECT COUNT(*) FROM stores) as total_stores,
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COALESCE(SUM(price * stock_quantity), 0) FROM products) as total_inventory_value,
  (SELECT COUNT(*) FROM products WHERE stock_quantity < 10) as low_stock_count
```

This reduces database round trips from 4 to 1.

### Parallel Execution

The `getAllDashboardData()` method uses `Promise.all()` to execute all queries in parallel, maximizing performance even when fetching all dashboard data at once.
