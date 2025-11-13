#!/bin/bash

# API Testing Script for Knostic Inventory Manager
# Server should be running on port 3000

BASE_URL="http://localhost:3000"
API_BASE="${BASE_URL}/api/v1"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
ISSUES=()

# Helper function to print test results
test_result() {
    local test_name="$1"
    local status_code="$2"
    local expected_code="$3"
    local response="$4"
    
    if [ "$status_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC}: $test_name (Status: $status_code)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $test_name (Expected: $expected_code, Got: $status_code)"
        echo -e "  Response: $response"
        ((FAILED++))
        ISSUES+=("$test_name - Expected status $expected_code, got $status_code")
    fi
}

# Helper function to check response content
test_response_content() {
    local test_name="$1"
    local response="$2"
    local expected_pattern="$3"
    
    if echo "$response" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}✓ PASS${NC}: $test_name (Response contains expected content)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $test_name (Response missing expected content: $expected_pattern)"
        echo -e "  Response: $response"
        ((FAILED++))
        ISSUES+=("$test_name - Missing expected content: $expected_pattern")
    fi
}

echo "=========================================="
echo "API Test Suite - Knostic Inventory Manager"
echo "=========================================="
echo ""

# ============================================
# ROOT ENDPOINT
# ============================================
echo "=== Testing Root Endpoint ==="
RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /" "$HTTP_CODE" 200 "$BODY"
echo ""

# ============================================
# STORES ENDPOINTS
# ============================================
echo "=== Testing Stores Endpoints ==="

# GET /api/v1/stores - Basic
echo "--- GET /api/v1/stores (basic) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores" "$HTTP_CODE" 200 "$BODY"
echo ""

# GET /api/v1/stores - With pagination
echo "--- GET /api/v1/stores (with pagination) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores?page=1&pageSize=10")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores?page=1&pageSize=10" "$HTTP_CODE" 200 "$BODY"
echo ""

# GET /api/v1/stores - Invalid page (should fail)
echo "--- GET /api/v1/stores (invalid page) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores?page=0")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores?page=0 (invalid)" "$HTTP_CODE" 400 "$BODY"
echo ""

# GET /api/v1/stores - Invalid pageSize (too large)
echo "--- GET /api/v1/stores (invalid pageSize) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores?pageSize=2000")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores?pageSize=2000 (invalid)" "$HTTP_CODE" 400 "$BODY"
echo ""

# GET /api/v1/stores - With search
echo "--- GET /api/v1/stores (with search) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores?search=test")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores?search=test" "$HTTP_CODE" 200 "$BODY"
echo ""

# GET /api/v1/stores - With filters (valid JSON)
echo "--- GET /api/v1/stores (with filters) ---"
FILTERS='[{"field":"name","operator":"contains","value":"test"}]'
RESPONSE=$(curl -s -w "\n%{http_code}" -G "${API_BASE}/stores" --data-urlencode "filters=${FILTERS}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores (with filters)" "$HTTP_CODE" 200 "$BODY"
echo ""

# GET /api/v1/stores - With invalid filters (invalid JSON)
echo "--- GET /api/v1/stores (invalid filters) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -G "${API_BASE}/stores" --data-urlencode "filters=invalid-json")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores (invalid filters JSON)" "$HTTP_CODE" 400 "$BODY"
echo ""

# GET /api/v1/stores - With sort
echo "--- GET /api/v1/stores (with sort) ---"
SORT='[{"id":"name","direction":"asc"}]'
RESPONSE=$(curl -s -w "\n%{http_code}" -G "${API_BASE}/stores" --data-urlencode "sort=${SORT}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores (with sort)" "$HTTP_CODE" 200 "$BODY"
echo ""

# GET /api/v1/stores - With invalid sort (invalid direction)
echo "--- GET /api/v1/stores (invalid sort direction) ---"
SORT='[{"id":"name","direction":"invalid"}]'
RESPONSE=$(curl -s -w "\n%{http_code}" -G "${API_BASE}/stores" --data-urlencode "sort=${SORT}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores (invalid sort direction)" "$HTTP_CODE" 400 "$BODY"
echo ""

# POST /api/v1/stores - Valid
echo "--- POST /api/v1/stores (valid) ---"
STORE_NAME="Test Store $(date +%s)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/stores" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"${STORE_NAME}\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "POST /api/v1/stores (valid)" "$HTTP_CODE" 201 "$BODY"

# Extract store ID for subsequent tests
STORE_ID=$(echo "$BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "  Created store ID: $STORE_ID"
echo ""

# POST /api/v1/stores - Missing name
echo "--- POST /api/v1/stores (missing name) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/stores" \
    -H "Content-Type: application/json" \
    -d "{}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "POST /api/v1/stores (missing name)" "$HTTP_CODE" 400 "$BODY"
test_response_content "POST /api/v1/stores (missing name) - error check" "$BODY" "errors"
echo ""

# POST /api/v1/stores - Empty name
echo "--- POST /api/v1/stores (empty name) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/stores" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "POST /api/v1/stores (empty name)" "$HTTP_CODE" 400 "$BODY"
echo ""

# POST /api/v1/stores - Name with only whitespace
echo "--- POST /api/v1/stores (whitespace name) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/stores" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"   \"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "POST /api/v1/stores (whitespace name)" "$HTTP_CODE" 400 "$BODY"
echo ""

# POST /api/v1/stores - Invalid type (number instead of string)
echo "--- POST /api/v1/stores (invalid type) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/stores" \
    -H "Content-Type: application/json" \
    -d "{\"name\":123}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "POST /api/v1/stores (invalid type)" "$HTTP_CODE" 400 "$BODY"
echo ""

# GET /api/v1/stores/:id - Valid
if [ -n "$STORE_ID" ]; then
    echo "--- GET /api/v1/stores/:id (valid) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores/${STORE_ID}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "GET /api/v1/stores/${STORE_ID}" "$HTTP_CODE" 200 "$BODY"
    echo ""
fi

# GET /api/v1/stores/:id - Not found
echo "--- GET /api/v1/stores/:id (not found) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores/nonexistent-id-12345")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores/:id (not found)" "$HTTP_CODE" 404 "$BODY"
echo ""

# GET /api/v1/stores/:id/details - Valid
if [ -n "$STORE_ID" ]; then
    echo "--- GET /api/v1/stores/:id/details (valid) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores/${STORE_ID}/details")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "GET /api/v1/stores/${STORE_ID}/details" "$HTTP_CODE" 200 "$BODY"
    echo ""
fi

# GET /api/v1/stores/:id/details - Not found
echo "--- GET /api/v1/stores/:id/details (not found) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores/nonexistent-id-12345/details")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/stores/:id/details (not found)" "$HTTP_CODE" 404 "$BODY"
echo ""

# PUT /api/v1/stores/:id - Valid
if [ -n "$STORE_ID" ]; then
    echo "--- PUT /api/v1/stores/:id (valid) ---"
    UPDATED_NAME="Updated Store $(date +%s)"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE}/stores/${STORE_ID}" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"${UPDATED_NAME}\"}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "PUT /api/v1/stores/${STORE_ID}" "$HTTP_CODE" 200 "$BODY"
    echo ""
fi

# PUT /api/v1/stores/:id - Empty name
if [ -n "$STORE_ID" ]; then
    echo "--- PUT /api/v1/stores/:id (empty name) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE}/stores/${STORE_ID}" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"\"}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "PUT /api/v1/stores/:id (empty name)" "$HTTP_CODE" 400 "$BODY"
    echo ""
fi

# PUT /api/v1/stores/:id - Empty body (should be valid - all optional)
if [ -n "$STORE_ID" ]; then
    echo "--- PUT /api/v1/stores/:id (empty body) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE}/stores/${STORE_ID}" \
        -H "Content-Type: application/json" \
        -d "{}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "PUT /api/v1/stores/:id (empty body)" "$HTTP_CODE" 200 "$BODY"
    echo ""
fi

# PUT /api/v1/stores/:id - Not found
echo "--- PUT /api/v1/stores/:id (not found) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE}/stores/nonexistent-id-12345" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "PUT /api/v1/stores/:id (not found)" "$HTTP_CODE" 404 "$BODY"
echo ""

# DELETE /api/v1/stores/:id - Not found
echo "--- DELETE /api/v1/stores/:id (not found) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "${API_BASE}/stores/nonexistent-id-12345")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "DELETE /api/v1/stores/:id (not found)" "$HTTP_CODE" 404 "$BODY"
echo ""

# DELETE /api/v1/stores/:id - Valid (delete the store we created)
if [ -n "$STORE_ID" ]; then
    echo "--- DELETE /api/v1/stores/:id (valid) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "${API_BASE}/stores/${STORE_ID}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "DELETE /api/v1/stores/${STORE_ID}" "$HTTP_CODE" 204 "$BODY"
    echo ""
fi

# ============================================
# PRODUCTS ENDPOINTS
# ============================================
echo "=== Testing Products Endpoints ==="

# First, create a store for products
echo "--- Creating store for product tests ---"
STORE_NAME="Product Test Store $(date +%s)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/stores" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"${STORE_NAME}\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
PRODUCT_STORE_ID=$(echo "$BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "  Created store ID: $PRODUCT_STORE_ID"
echo ""

# GET /api/v1/products - Basic
echo "--- GET /api/v1/products (basic) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/products")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/products" "$HTTP_CODE" 200 "$BODY"
echo ""

# GET /api/v1/products - With pagination
echo "--- GET /api/v1/products (with pagination) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/products?page=1&pageSize=5")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/products?page=1&pageSize=5" "$HTTP_CODE" 200 "$BODY"
echo ""

# POST /api/v1/products - Valid
if [ -n "$PRODUCT_STORE_ID" ]; then
    echo "--- POST /api/v1/products (valid) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/products" \
        -H "Content-Type: application/json" \
        -d "{
            \"storeId\":\"${PRODUCT_STORE_ID}\",
            \"name\":\"Test Product\",
            \"category\":\"Electronics\",
            \"stockQuantity\":100,
            \"price\":29.99
        }")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "POST /api/v1/products (valid)" "$HTTP_CODE" 201 "$BODY"
    
    PRODUCT_ID=$(echo "$BODY" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "  Created product ID: $PRODUCT_ID"
    echo ""
fi

# POST /api/v1/products - Missing required fields
echo "--- POST /api/v1/products (missing fields) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/products" \
    -H "Content-Type: application/json" \
    -d "{}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "POST /api/v1/products (missing fields)" "$HTTP_CODE" 400 "$BODY"
echo ""

# POST /api/v1/products - Missing storeId
echo "--- POST /api/v1/products (missing storeId) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/products" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\":\"Test Product\",
        \"category\":\"Electronics\",
        \"stockQuantity\":100,
        \"price\":29.99
    }")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "POST /api/v1/products (missing storeId)" "$HTTP_CODE" 400 "$BODY"
echo ""

# POST /api/v1/products - Empty name
echo "--- POST /api/v1/products (empty name) ---"
if [ -n "$PRODUCT_STORE_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/products" \
        -H "Content-Type: application/json" \
        -d "{
            \"storeId\":\"${PRODUCT_STORE_ID}\",
            \"name\":\"\",
            \"category\":\"Electronics\",
            \"stockQuantity\":100,
            \"price\":29.99
        }")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "POST /api/v1/products (empty name)" "$HTTP_CODE" 400 "$BODY"
    echo ""
fi

# POST /api/v1/products - Negative stockQuantity
echo "--- POST /api/v1/products (negative stockQuantity) ---"
if [ -n "$PRODUCT_STORE_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/products" \
        -H "Content-Type: application/json" \
        -d "{
            \"storeId\":\"${PRODUCT_STORE_ID}\",
            \"name\":\"Test Product\",
            \"category\":\"Electronics\",
            \"stockQuantity\":-10,
            \"price\":29.99
        }")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "POST /api/v1/products (negative stockQuantity)" "$HTTP_CODE" 400 "$BODY"
    echo ""
fi

# POST /api/v1/products - Non-integer stockQuantity
echo "--- POST /api/v1/products (non-integer stockQuantity) ---"
if [ -n "$PRODUCT_STORE_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/products" \
        -H "Content-Type: application/json" \
        -d "{
            \"storeId\":\"${PRODUCT_STORE_ID}\",
            \"name\":\"Test Product\",
            \"category\":\"Electronics\",
            \"stockQuantity\":10.5,
            \"price\":29.99
        }")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "POST /api/v1/products (non-integer stockQuantity)" "$HTTP_CODE" 400 "$BODY"
    echo ""
fi

# POST /api/v1/products - Negative price
echo "--- POST /api/v1/products (negative price) ---"
if [ -n "$PRODUCT_STORE_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/products" \
        -H "Content-Type: application/json" \
        -d "{
            \"storeId\":\"${PRODUCT_STORE_ID}\",
            \"name\":\"Test Product\",
            \"category\":\"Electronics\",
            \"stockQuantity\":100,
            \"price\":-10.99
        }")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "POST /api/v1/products (negative price)" "$HTTP_CODE" 400 "$BODY"
    echo ""
fi

# POST /api/v1/products - Zero price (should be valid)
echo "--- POST /api/v1/products (zero price) ---"
if [ -n "$PRODUCT_STORE_ID" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE}/products" \
        -H "Content-Type: application/json" \
        -d "{
            \"storeId\":\"${PRODUCT_STORE_ID}\",
            \"name\":\"Free Product\",
            \"category\":\"Electronics\",
            \"stockQuantity\":100,
            \"price\":0
        }")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "POST /api/v1/products (zero price)" "$HTTP_CODE" 201 "$BODY"
    echo ""
fi

# GET /api/v1/products/:id - Valid
if [ -n "$PRODUCT_ID" ]; then
    echo "--- GET /api/v1/products/:id (valid) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/products/${PRODUCT_ID}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "GET /api/v1/products/${PRODUCT_ID}" "$HTTP_CODE" 200 "$BODY"
    echo ""
fi

# GET /api/v1/products/:id - Not found
echo "--- GET /api/v1/products/:id (not found) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/products/nonexistent-id-12345")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/products/:id (not found)" "$HTTP_CODE" 404 "$BODY"
echo ""

# GET /api/v1/stores/:storeId/products - Valid
if [ -n "$PRODUCT_STORE_ID" ]; then
    echo "--- GET /api/v1/stores/:storeId/products (valid) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores/${PRODUCT_STORE_ID}/products")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "GET /api/v1/stores/${PRODUCT_STORE_ID}/products" "$HTTP_CODE" 200 "$BODY"
    echo ""
fi

# GET /api/v1/stores/:storeId/products - With pagination
if [ -n "$PRODUCT_STORE_ID" ]; then
    echo "--- GET /api/v1/stores/:storeId/products (with pagination) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/stores/${PRODUCT_STORE_ID}/products?page=1&pageSize=5")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "GET /api/v1/stores/${PRODUCT_STORE_ID}/products?page=1&pageSize=5" "$HTTP_CODE" 200 "$BODY"
    echo ""
fi

# PUT /api/v1/products/:id - Valid (update name)
if [ -n "$PRODUCT_ID" ]; then
    echo "--- PUT /api/v1/products/:id (valid - update name) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE}/products/${PRODUCT_ID}" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"Updated Product Name\"}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "PUT /api/v1/products/${PRODUCT_ID} (update name)" "$HTTP_CODE" 200 "$BODY"
    echo ""
fi

# PUT /api/v1/products/:id - Valid (update price)
if [ -n "$PRODUCT_ID" ]; then
    echo "--- PUT /api/v1/products/:id (valid - update price) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE}/products/${PRODUCT_ID}" \
        -H "Content-Type: application/json" \
        -d "{\"price\":39.99}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "PUT /api/v1/products/${PRODUCT_ID} (update price)" "$HTTP_CODE" 200 "$BODY"
    echo ""
fi

# PUT /api/v1/products/:id - Empty body (should be valid - all optional)
if [ -n "$PRODUCT_ID" ]; then
    echo "--- PUT /api/v1/products/:id (empty body) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE}/products/${PRODUCT_ID}" \
        -H "Content-Type: application/json" \
        -d "{}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "PUT /api/v1/products/${PRODUCT_ID} (empty body)" "$HTTP_CODE" 200 "$BODY"
    echo ""
fi

# PUT /api/v1/products/:id - Empty name (should fail)
if [ -n "$PRODUCT_ID" ]; then
    echo "--- PUT /api/v1/products/:id (empty name) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE}/products/${PRODUCT_ID}" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"\"}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "PUT /api/v1/products/:id (empty name)" "$HTTP_CODE" 400 "$BODY"
    echo ""
fi

# PUT /api/v1/products/:id - Negative stockQuantity
if [ -n "$PRODUCT_ID" ]; then
    echo "--- PUT /api/v1/products/:id (negative stockQuantity) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE}/products/${PRODUCT_ID}" \
        -H "Content-Type: application/json" \
        -d "{\"stockQuantity\":-5}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "PUT /api/v1/products/:id (negative stockQuantity)" "$HTTP_CODE" 400 "$BODY"
    echo ""
fi

# PUT /api/v1/products/:id - Not found
echo "--- PUT /api/v1/products/:id (not found) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE}/products/nonexistent-id-12345" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test\"}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "PUT /api/v1/products/:id (not found)" "$HTTP_CODE" 404 "$BODY"
echo ""

# DELETE /api/v1/products/:id - Not found
echo "--- DELETE /api/v1/products/:id (not found) ---"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "${API_BASE}/products/nonexistent-id-12345")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "DELETE /api/v1/products/:id (not found)" "$HTTP_CODE" 404 "$BODY"
echo ""

# DELETE /api/v1/products/:id - Valid
if [ -n "$PRODUCT_ID" ]; then
    echo "--- DELETE /api/v1/products/:id (valid) ---"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "${API_BASE}/products/${PRODUCT_ID}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    test_result "DELETE /api/v1/products/${PRODUCT_ID}" "$HTTP_CODE" 204 "$BODY"
    echo ""
fi

# Clean up - delete the test store
if [ -n "$PRODUCT_STORE_ID" ]; then
    echo "--- Cleaning up test store ---"
    curl -s -X DELETE "${API_BASE}/stores/${PRODUCT_STORE_ID}" > /dev/null
    echo "  Deleted store ID: $PRODUCT_STORE_ID"
    echo ""
fi

# ============================================
# DASHBOARD ENDPOINTS
# ============================================
echo "=== Testing Dashboard Endpoints ==="

# GET /api/v1/dashboard
echo "--- GET /api/v1/dashboard ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/dashboard")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/dashboard" "$HTTP_CODE" 200 "$BODY"
echo ""

# GET /api/v1/dashboard/activity
echo "--- GET /api/v1/dashboard/activity ---"
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_BASE}/dashboard/activity")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
test_result "GET /api/v1/dashboard/activity" "$HTTP_CODE" 200 "$BODY"
echo ""

# ============================================
# SUMMARY
# ============================================
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"
echo ""

if [ ${#ISSUES[@]} -gt 0 ]; then
    echo -e "${YELLOW}Issues Found:${NC}"
    for issue in "${ISSUES[@]}"; do
        echo "  - $issue"
    done
    echo ""
fi

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review the issues above.${NC}"
    exit 1
fi

