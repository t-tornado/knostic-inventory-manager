import { mount } from "@cypress/react";
import { DashboardPage } from "@/features/dashboard/pages/Dashboard";
import type { DashboardData, ActivityItem } from "@/features/dashboard/types";
import { TestWrapper } from "cypress/support/component-helpers";

const mockDashboardData: DashboardData = {
  stats: {
    totalStores: 5,
    totalProducts: 25,
    totalInventoryValue: 150000,
    lowStockCount: 3,
  },
  categories: [
    { category: "Electronics", count: 10 },
    { category: "Clothing", count: 8 },
    { category: "Food", count: 7 },
  ],
  stores: [
    {
      storeId: "store-1",
      storeName: "Main Store",
      productCount: 15,
      inventoryValue: 75000,
    },
    {
      storeId: "store-2",
      storeName: "Branch Store",
      productCount: 10,
      inventoryValue: 75000,
    },
  ],
  stockLevels: [
    { date: "2024-01-01", totalStock: 100 },
    { date: "2024-01-02", totalStock: 105 },
    { date: "2024-01-03", totalStock: 98 },
  ],
  inventoryValue: [
    { date: "2024-01-01", totalValue: 140000 },
    { date: "2024-01-02", totalValue: 145000 },
    { date: "2024-01-03", totalValue: 150000 },
  ],
  alerts: [
    {
      productId: "prod-1",
      productName: "Product A",
      storeId: "store-1",
      storeName: "Main Store",
      category: "Electronics",
      stockQuantity: 2,
    },
  ],
  activity: [],
};

const mockActivitiesData: ActivityItem[] = [
  {
    type: "add",
    text: "Product added",
    timestamp: "2024-01-01T10:00:00Z",
  },
  {
    type: "update",
    text: "Product updated",
    timestamp: "2024-01-01T11:00:00Z",
  },
];

describe("Dashboard Page Component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/v1/dashboard", {
      statusCode: 200,
      body: {
        data: mockDashboardData,
      },
    }).as("getDashboard");

    cy.intercept("GET", "/api/v1/dashboard/activity", {
      statusCode: 200,
      body: {
        data: mockActivitiesData,
      },
    }).as("getActivities");
  });

  it("should render loading state initially", () => {
    cy.intercept("GET", "/api/v1/dashboard", {
      statusCode: 200,
      delay: 1000,
      body: {
        data: mockDashboardData,
      },
    }).as("getDashboardSlow");

    mount(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    cy.get('[data-testid="page-loader"]').should("be.visible");
    cy.get('[data-testid="page-loader-message"]').should(
      "contain",
      "Loading dashboard data"
    );
  });

  it("should render error state when API fails", () => {
    cy.intercept("GET", "/api/v1/dashboard", {
      statusCode: 500,
      body: {
        errors: [
          {
            type: "ServerError",
            field: "server",
            code: "INTERNAL_ERROR",
            message: "Internal server error",
          },
        ],
      },
    }).as("getDashboardError");

    mount(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    cy.wait("@getDashboardError", { timeout: 10000 });

    cy.get('[data-testid="page-error"]', { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get('[data-testid="page-error-title"]').should(
      "contain",
      "Failed to load dashboard"
    );
    cy.get('[data-testid="page-error-message"]').should(
      "contain",
      "Internal server error"
    );
  });

  it("should render with theme applied", () => {
    mount(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    cy.wait(["@getDashboard", "@getActivities"]);

    cy.get('[data-testid="dashboard-content"]').should("be.visible");

    cy.get('[data-testid="stats-grid"]').should("be.visible");

    cy.get('[data-testid="charts-grid"]').should("be.visible");

    cy.get('[data-testid="stat-total-stores"]').should("be.visible");
  });
});
