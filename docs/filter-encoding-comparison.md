# Filter Encoding Comparison: JSON vs Base64

## Example Filter Data

```typescript
const filters = [
  { field: "name", operator: "contains", value: "Store" },
  { field: "createdAt", operator: "greater_than", value: "2024-01-01" },
];
```

## JSON Stringification (Current Approach)

**Encoded:**

```
filters=[{"field":"name","operator":"contains","value":"Store"},{"field":"createdAt","operator":"greater_than","value":"2024-01-01"}]
```

**URL (after URLSearchParams encoding):**

```
?filters=%5B%7B%22field%22%3A%22name%22%2C%22operator%22%3A%22contains%22%2C%22value%22%3A%22Store%22%7D%2C%7B%22field%22%3A%22createdAt%22%2C%22operator%22%3A%22greater_than%22%2C%22value%22%3A%222024-01-01%22%7D%5D
```

**Pros:**

- ✅ Human-readable in browser dev tools (can decode easily)
- ✅ Standard practice for query parameters
- ✅ Direct JSON.parse() on server
- ✅ Works with URLSearchParams automatically
- ✅ Easy to debug and test

**Cons:**

- ⚠️ Slightly longer URLs (but URLSearchParams handles encoding)
- ⚠️ Special characters need URL encoding (automatic)

## Base64 Encoding (Alternative)

**Encoded:**

```
filters=W3siZmllbGQiOiJuYW1lIiwib3BlcmF0b3IiOiJjb250YWlucyIsInZhbHVlIjoiU3RvcmUifSx7ImZpZWxkIjoiY3JlYXRlZEF0Iiwib3BlcmF0b3IiOiJncmVhdGVyX3RoYW4iLCJ2YWx1ZSI6IjIwMjQtMDEtMDEifV0=
```

**URL:**

```
?filters=W3siZmllbGQiOiJuYW1lIiwib3BlcmF0b3IiOiJjb250YWlucyIsInZhbHVlIjoiU3RvcmUifSx7ImZpZWxkIjoiY3JlYXRlZEF0Iiwib3BlcmF0b3IiOiJncmVhdGVyX3RoYW4iLCJ2YWx1ZSI6IjIwMjQtMDEtMDEifV0%3D
```

**Pros:**

- ✅ No special character issues
- ✅ Slightly more compact for certain data

**Cons:**

- ❌ Not human-readable (harder to debug)
- ❌ Additional encoding/decoding step
- ❌ Base64 padding (`=`) needs URL encoding
- ❌ Not standard for query parameters
- ❌ Can actually be LONGER for simple JSON data
- ❌ More complex error handling

## Recommendation: **JSON Stringification**

For query parameters with structured data like filters, **JSON stringification is the industry standard** and best practice because:

1. **Debuggability**: You can see and understand the filters directly in the URL
2. **Simplicity**: No additional encoding/decoding layer
3. **Standard Practice**: Used by major APIs (GitHub, Stripe, etc.)
4. **Tooling Support**: Works seamlessly with browser dev tools, Postman, etc.
5. **URL Safety**: URLSearchParams handles all necessary encoding automatically

## When to Use Base64

Base64 should only be considered for:

- Binary data in query parameters (rare)
- When you need to avoid ALL special characters (edge cases)
- Very large payloads (but query params aren't ideal for large data anyway)

## Current Implementation

The current implementation uses JSON stringification, which is the correct choice. The `URLSearchParams` API automatically handles URL encoding, so special characters are properly encoded without any issues.
