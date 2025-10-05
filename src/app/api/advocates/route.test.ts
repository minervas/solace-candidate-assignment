import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, SqlAdvocateWithCount } from "./route";
import db from "../../../db";

// Mock the database
vi.mock("../../../db", () => ({
  default: {
    execute: vi.fn(),
  },
}));

describe("GET /api/advocates", () => {
  const mockExecute = vi.mocked(db.execute);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockSqlAdvocates = (count: number, totalCount: number = count): SqlAdvocateWithCount[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      first_name: `First${i + 1}`,
      last_name: `Last${i + 1}`,
      city: "Test City",
      degree: "JD",
      payload: `["Law"]`,
      years_of_experience: 5,
      phone_number: 1234567890 + i,
      created_at: new Date("2024-01-01"),
      total_count: BigInt(totalCount),
    }));
  };

  describe("Default pagination", () => {
    it("returns first page with default limit of 10", async () => {
      const mockData = createMockSqlAdvocates(10, 50);
      mockExecute.mockResolvedValueOnce(mockData as any);

      const request = new Request("http://localhost:3000/api/advocates");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(10);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 50,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });
  });

  describe("Custom pagination parameters", () => {
    it("returns second page with custom limit", async () => {
      const mockData = createMockSqlAdvocates(5, 25);
      mockExecute.mockResolvedValueOnce(mockData as any);

      const request = new Request("http://localhost:3000/api/advocates?page=2&limit=5");
      const response = await GET(request);
      const data = await response.json();

      expect(data.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 25,
        totalPages: 5,
        hasNextPage: true,
        hasPreviousPage: true,
      });
    });

    it("handles last page correctly", async () => {
      const mockData = createMockSqlAdvocates(5, 25);
      mockExecute.mockResolvedValueOnce(mockData as any);

      const request = new Request("http://localhost:3000/api/advocates?page=5&limit=5");
      const response = await GET(request);
      const data = await response.json();

      expect(data.pagination).toEqual({
        page: 5,
        limit: 5,
        total: 25,
        totalPages: 5,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });

    it("handles page with less than limit items", async () => {
      const mockData = createMockSqlAdvocates(3, 23);
      mockExecute.mockResolvedValueOnce(mockData as any);

      const request = new Request("http://localhost:3000/api/advocates?page=3&limit=10");
      const response = await GET(request);
      const data = await response.json();

      expect(data.data).toHaveLength(3);
      expect(data.pagination).toEqual({
        page: 3,
        limit: 10,
        total: 23,
        totalPages: 3,
        hasNextPage: false,
        hasPreviousPage: true,
      });
    });
  });

  describe("Empty results", () => {
    it("handles empty database results", async () => {
      mockExecute.mockResolvedValueOnce([] as any);

      const request = new Request("http://localhost:3000/api/advocates");
      const response = await GET(request);
      const data = await response.json();

      expect(data.data).toEqual([]);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it("handles page beyond available data", async () => {
      mockExecute.mockResolvedValueOnce([] as any);

      const request = new Request("http://localhost:3000/api/advocates?page=10");
      const response = await GET(request);
      const data = await response.json();

      expect(data.data).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });
  });

  describe("Parameter validation", () => {
    it("rejects invalid page parameter (negative)", async () => {
      const request = new Request("http://localhost:3000/api/advocates?page=-1");
      const response = await GET(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid page parameter");
    });

    it("rejects invalid page parameter (zero)", async () => {
      const request = new Request("http://localhost:3000/api/advocates?page=0");
      const response = await GET(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid page parameter");
    });

    it("rejects invalid page parameter (NaN)", async () => {
      const request = new Request("http://localhost:3000/api/advocates?page=abc");
      const response = await GET(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid page parameter");
    });

    it("rejects invalid limit parameter (negative)", async () => {
      const request = new Request("http://localhost:3000/api/advocates?limit=-5");
      const response = await GET(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid limit parameter");
    });

    it("rejects invalid limit parameter (zero)", async () => {
      const request = new Request("http://localhost:3000/api/advocates?limit=0");
      const response = await GET(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid limit parameter");
    });

    it("rejects limit parameter above 100", async () => {
      const request = new Request("http://localhost:3000/api/advocates?limit=101");
      const response = await GET(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid limit parameter");
    });

    it("rejects invalid limit parameter (NaN)", async () => {
      const request = new Request("http://localhost:3000/api/advocates?limit=xyz");
      const response = await GET(request);

      expect(response.status).toBe(400);
      expect(await response.text()).toBe("Invalid limit parameter");
    });

    it("accepts limit of 1", async () => {
      const mockData = createMockSqlAdvocates(1, 10);
      mockExecute.mockResolvedValueOnce(mockData as any);

      const request = new Request("http://localhost:3000/api/advocates?limit=1");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.pagination.limit).toBe(1);
    });

    it("accepts limit of 100", async () => {
      const mockData = createMockSqlAdvocates(10, 100);
      mockExecute.mockResolvedValueOnce(mockData as any);

      const request = new Request("http://localhost:3000/api/advocates?limit=100");
      const response = await GET(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.pagination.limit).toBe(100);
    });
  });

  describe("Data transformation", () => {
    it("maps SQL advocates to Advocate interface", async () => {
      const mockData = createMockSqlAdvocates(2, 2);
      mockExecute.mockResolvedValueOnce(mockData as any);

      const request = new Request("http://localhost:3000/api/advocates");
      const response = await GET(request);
      const data = await response.json();
      data.data.forEach((advocate: any, index: number) => {
        expect(advocate).toEqual({
          id: index + 1,
          firstName: `First${index + 1}`,
          lastName: `Last${index + 1}`,
          city: "Test City",
          degree: "JD",
          specialties: ["Law"],
          yearsOfExperience: 5,
          phoneNumber: 1234567890 + index,
          createdAt: new Date("2024-01-01").toISOString(),
        });
      });
    });
  });
});
