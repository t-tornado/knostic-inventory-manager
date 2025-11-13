import { createDashboardService } from "@/features/dashboard/service";
import type { IApiClient } from "@/infrastructure/apiClient";
import type { DashboardData, ActivityItem } from "@/features/dashboard/types";
import type { ApiResponse } from "@/shared/api";

describe("DashboardService", () => {
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
    ],
    stockLevels: [
      { date: "2024-01-01", totalStock: 100 },
      { date: "2024-01-02", totalStock: 105 },
    ],
    inventoryValue: [
      { date: "2024-01-01", totalValue: 140000 },
      { date: "2024-01-02", totalValue: 145000 },
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
      text: "Product added: New Product",
      timestamp: "2024-01-01T10:00:00Z",
    },
    {
      type: "update",
      text: "Product updated: Existing Product",
      timestamp: "2024-01-01T11:00:00Z",
    },
  ];

  let mockApiClient: IApiClient;
  let dashboardService: ReturnType<typeof createDashboardService>;

  beforeEach(() => {
    const mockGet = cy.stub();
    mockApiClient = {
      get: mockGet,
      post: cy.stub(),
      put: cy.stub(),
      delete: cy.stub(),
    } as unknown as IApiClient;

    dashboardService = createDashboardService(mockApiClient);
  });

  describe("getDashboard", () => {
    it("should fetch dashboard data successfully", async () => {
      (mockApiClient.get as ReturnType<typeof cy.stub>).resolves({
        data: { data: mockDashboardData } as ApiResponse<DashboardData>,
      });

      const result = await dashboardService.getDashboard();

      expect(result).to.deep.equal(mockDashboardData);
      expect(mockApiClient.get).to.have.been.calledWith("/dashboard");
    });

    it("should throw error when API returns errors", async () => {
      (mockApiClient.get as ReturnType<typeof cy.stub>).resolves({
        data: {
          errors: [
            {
              type: "ServerError",
              field: "server",
              code: "INTERNAL_ERROR",
              message: "Failed to fetch dashboard data",
            },
          ],
        } as ApiResponse<DashboardData>,
      });

      try {
        await dashboardService.getDashboard();
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal(
          "Failed to fetch dashboard data"
        );
        expect(mockApiClient.get).to.have.been.calledWith("/dashboard");
      }
    });

    it("should throw default error message when no data returned", async () => {
      (mockApiClient.get as ReturnType<typeof cy.stub>).resolves({
        data: { data: undefined } as ApiResponse<DashboardData>,
      });

      try {
        await dashboardService.getDashboard();
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal(
          "No data returned from dashboard API"
        );
      }
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network request failed");
      (mockApiClient.get as ReturnType<typeof cy.stub>).rejects(networkError);

      try {
        await dashboardService.getDashboard();
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal("Network request failed");
      }
    });

    it("should handle empty dashboard data", async () => {
      const emptyDashboardData: DashboardData = {
        stats: {
          totalStores: 0,
          totalProducts: 0,
          totalInventoryValue: 0,
          lowStockCount: 0,
        },
        categories: [],
        stores: [],
        stockLevels: [],
        inventoryValue: [],
        alerts: [],
        activity: [],
      };

      (mockApiClient.get as ReturnType<typeof cy.stub>).resolves({
        data: { data: emptyDashboardData } as ApiResponse<DashboardData>,
      });

      const result = await dashboardService.getDashboard();

      expect(result).to.deep.equal(emptyDashboardData);
      expect(result.stats.totalStores).to.equal(0);
      expect(result.stats.totalProducts).to.equal(0);
    });
  });

  describe("getActivities", () => {
    it("should fetch activities successfully", async () => {
      (mockApiClient.get as ReturnType<typeof cy.stub>).resolves({
        data: { data: mockActivitiesData } as ApiResponse<ActivityItem[]>,
      });

      const result = await dashboardService.getActivities();

      expect(result).to.deep.equal(mockActivitiesData);
      expect(mockApiClient.get).to.have.been.calledWith("/dashboard/activity");
    });

    it("should return empty array when no activities", async () => {
      (mockApiClient.get as ReturnType<typeof cy.stub>).resolves({
        data: { data: [] } as ApiResponse<ActivityItem[]>,
      });

      const result = await dashboardService.getActivities();

      expect(result).to.deep.equal([]);
    });

    it("should throw error when API returns errors", async () => {
      (mockApiClient.get as ReturnType<typeof cy.stub>).resolves({
        data: {
          errors: [
            {
              type: "ServerError",
              field: "server",
              code: "INTERNAL_ERROR",
              message: "Failed to fetch activities",
            },
          ],
        } as ApiResponse<ActivityItem[]>,
      });

      try {
        await dashboardService.getActivities();
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal("Failed to fetch activities");
        expect(mockApiClient.get).to.have.been.calledWith(
          "/dashboard/activity"
        );
      }
    });

    it("should throw default error message when no data returned", async () => {
      (mockApiClient.get as ReturnType<typeof cy.stub>).resolves({
        data: { data: undefined } as ApiResponse<ActivityItem[]>,
      });

      try {
        await dashboardService.getActivities();
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal(
          "No data returned from activities API"
        );
      }
    });

    it("should handle different activity types", async () => {
      const activitiesWithAllTypes: ActivityItem[] = [
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
        {
          type: "store",
          text: "Store created",
          timestamp: "2024-01-01T12:00:00Z",
        },
      ];

      (mockApiClient.get as ReturnType<typeof cy.stub>).resolves({
        data: { data: activitiesWithAllTypes } as ApiResponse<ActivityItem[]>,
      });

      const result = await dashboardService.getActivities();

      expect(result).to.have.length(3);
      expect(result[0].type).to.equal("add");
      expect(result[1].type).to.equal("update");
      expect(result[2].type).to.equal("store");
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network request failed");
      (mockApiClient.get as ReturnType<typeof cy.stub>).rejects(networkError);

      try {
        await dashboardService.getActivities();
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal("Network request failed");
      }
    });
  });
});
