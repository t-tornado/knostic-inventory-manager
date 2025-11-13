# Knostic Inventory Management System

A full-stack inventory management application for tracking stores and their products, built with a focus on frontend architecture, performance, and user experience.

Github Project URL: `https://github.com/users/t-tornado/projects/5/views/1`

## Run Instructions

### Quick Start

```bash
docker compose up --build
```

This will:

- Build and start the server (Node.js/Express API on port 3000)
- Build and start the web client (React app on port 80)
- Seed the database with sample data automatically

### Access the Application

- **Web Application:** http://localhost
- **API Server:** http://localhost:3000

### Stop Services

```bash
docker compose down
```

To remove database data:

```bash
docker compose down -v
```

## API Overview

RESTful API versioned at `/api/v1` with endpoints for stores, products, and dashboard metrics. All list endpoints support filtering, sorting, search, and pagination via query parameters. CRUD operations available for stores and products. Dashboard endpoints provide aggregated statistics, category breakdowns, stock levels, inventory values, low-stock alerts, and activity logs. Responses follow a consistent structure with `data`, `errors`, and `meta` fields.

## Decisions & Trade-offs

### Architecture

**Frontend: Feature-Sliced Design (FSD-inspired)**

- **Decision:** Feature-based organization with clear boundaries (features, core, infrastructure, shared)
- **Rationale:** Scales well with team growth, prevents coupling, enables parallel development
- **Trade-off:** Slightly more boilerplate than flat structure, but better long-term maintainability

**Backend: Domain-Driven Design (DDD) / Clean Architecture**

- **Decision:** Layered architecture (Domain → Application → Data → Infrastructure → Presentation)
- **Rationale:** Clear separation of concerns, testable, allows swapping implementations
- **Trade-off:** More files/abstractions than simple MVC, but better for complex business logic

### Technology Choices

**State Management: TanStack Query + React Context**

- **Decision:** Server state via TanStack Query, UI state via Context
- **Rationale:** TanStack Query handles caching, refetching, optimistic updates automatically
- **Trade-off:** Learning curve vs. manual state management, but significantly less boilerplate

**UI Library: Material-UI (MUI)**

- **Decision:** MUI with custom theming instead of building from scratch
- **Rationale:** Faster development, consistent design system, built-in accessibility
- **Trade-off:** Bundle size (~200KB) vs. custom solution, but saves weeks of development

**Database: SQLite**

- **Decision:** SQLite over PostgreSQL/MySQL for this assignment
- **Rationale:** Zero configuration, file-based, perfect for demo/development
- **Trade-off:** Not suitable for high-concurrency production, but sufficient for assignment scope

**Dependency Injection Pattern**

- **Decision:** Services accept API client as parameter (factory functions)
- **Rationale:** Easy to test, swap implementations, maintain single responsibility
- **Trade-off:** Slightly more verbose than direct imports, but much better testability

### Performance Optimizations

**Optimistic Updates**

- **Decision:** Update UI immediately, rollback on error
- **Rationale:** Perceived performance improvement, better UX
- **Trade-off:** More complex error handling, but users see instant feedback

**URL State Persistence**

- **Decision:** Store table state (filters, sort, pagination) in URL
- **Rationale:** Shareable links, browser back/forward works, state survives refresh
- **Trade-off:** Slightly more complex state management, but significantly better UX

**Debounced Search**

- **Decision:** 300ms debounce on search input
- **Rationale:** Reduces API calls, improves performance
- **Trade-off:** Slight delay in results, but prevents excessive requests

## Improvements

### Additional Features

1. **Bulk Operations:** Select multiple products/stores and perform batch updates or deletions
2. **Export Functionality:** Export filtered product lists to CSV/Excel
3. **Product Images:** Add image upload and display for products
4. **Audit Log:** Track all changes with user attribution and timestamps
5. **Advanced Analytics:** Time-series analysis, trend charts, forecasting
6. **Application Observability:** There is a logger already defined that can show detailed information relevant for debugging

### Performance Enhancements

1. **Virtual Scrolling:** Implement virtual scrolling for large product lists (10,000+ items).
2. **Code Splitting:** Lazy load routes and heavy components to reduce initial bundle size
3. **Request Batching:** Batch multiple API calls into single requests where possible

### UX Improvements

1. **Keyboard Shortcuts:** Add keyboard navigation and shortcuts for power users
2. **Drag-and-Drop:** Reorder table columns via drag-and-drop
3. **Saved Filters:** Allow users to save and name frequently used filter combinations
4. **Bulk Edit Modal:** Edit multiple products at once in a single modal
5. **Toast Notifications:** More granular success/error messages with action buttons

### Technical Debt

1. **Testing Coverage:** Increase unit test coverage (currently ~30%, target 80%+)
2. **Error Handling:** Standardize error handling patterns across all features
3. **Type Safety:** Remove remaining `any` types and add stricter TypeScript config
4. **Documentation:** Add JSDoc comments for public APIs and complex functions
5. **Bundle Analysis:** Set up bundle size monitoring and implement code splitting strategy
6. **Per-Request Observability:** Add request ID tracking, correlation IDs, and enhanced logging for better debugging and monitoring of individual requests across the application stack
