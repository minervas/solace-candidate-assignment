import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";

// Mock Next.js navigation hooks
const mockPush = vi.fn();
const mockGet = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock fetch
global.fetch = vi.fn();

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue(null); // Default: no page parameter
  });

  const createMockApiResponse = (page: number, total: number = 50) => {
    const advocates = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1 + (page - 1) * 10,
      firstName: `First${i + 1}`,
      lastName: `Last${i + 1}`,
      city: "Test City",
      degree: "MD",
      specialties: ["Specialty 1", "Specialty 2"],
      yearsOfExperience: 5,
      phoneNumber: 5551234567 + i,
      createdAt: new Date("2024-01-01"),
    }));

    return {
      data: advocates,
      pagination: {
        page,
        limit: 10,
        total,
        totalPages: Math.ceil(total / 10),
        hasNextPage: page < Math.ceil(total / 10),
        hasPreviousPage: page > 1,
      },
    };
  };

  describe("Initial Render", () => {
    it("renders the page title", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      expect(screen.getByText("Solace Advocates")).toBeInTheDocument();
    });

    it("renders search bar", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      expect(screen.getByLabelText("Search")).toBeInTheDocument();
    });

    it("fetches advocates on mount", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/advocates?page=1&limit=10");
      });
    });

    it("displays fetched advocates in table", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("First1")).toBeInTheDocument();
        expect(screen.getByText("Last1")).toBeInTheDocument();
      });
    });
  });

  describe("URL Parameter Handling", () => {
    it("starts at page 1 when no page parameter is provided", async () => {
      mockGet.mockReturnValue(null);
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/advocates?page=1&limit=10");
      });
    });

    it("starts at specified page when valid page parameter is provided", async () => {
      mockGet.mockReturnValue("3");
      const mockResponse = createMockApiResponse(3);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/advocates?page=3&limit=10");
      });
    });

    it("defaults to page 1 when page parameter is invalid (NaN)", async () => {
      mockGet.mockReturnValue("abc");
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/advocates?page=1&limit=10");
      });
    });

    it("defaults to page 1 when page parameter is negative", async () => {
      mockGet.mockReturnValue("-5");
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/advocates?page=1&limit=10");
      });
    });

    it("defaults to page 1 when page parameter is zero", async () => {
      mockGet.mockReturnValue("0");
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/advocates?page=1&limit=10");
      });
    });
  });

  describe("Search Functionality", () => {
    it("filters advocates by first name", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getAllByText("First1")[0]).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search advocates...");
      await user.type(searchInput, "First1");

      expect(screen.getAllByText("First1").length).toBeGreaterThan(0);
      expect(screen.queryByText("First2")).not.toBeInTheDocument();
    });

    it("filters advocates by last name", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getAllByText("Last1")[0]).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search advocates...");
      await user.type(searchInput, "Last2");

      expect(screen.queryByText("Last1")).not.toBeInTheDocument();
      expect(screen.getAllByText("Last2").length).toBeGreaterThan(0);
    });

    it("performs case-insensitive search", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("First1")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search advocates...");
      await user.type(searchInput, "first1");

      expect(screen.getByText("First1")).toBeInTheDocument();
    });

    it("hides pagination when searching", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByLabelText("Next page")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search advocates...");
      await user.type(searchInput, "First1");

      expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
    });

    it("resets search and shows all advocates", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("First1")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search advocates...");
      await user.type(searchInput, "First1");

      expect(screen.queryByText("First2")).not.toBeInTheDocument();

      const resetButton = screen.getByRole("button", { name: /reset/i });
      await user.click(resetButton);

      expect(screen.getByText("First1")).toBeInTheDocument();
      expect(screen.getByText("First2")).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("renders pagination component", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByLabelText("Next page")).toBeInTheDocument();
      });
    });

    it("fetches new page when pagination button is clicked", async () => {
      const mockResponse1 = createMockApiResponse(1);
      const mockResponse2 = createMockApiResponse(2);
      (global.fetch as any)
        .mockResolvedValueOnce({ json: async () => mockResponse1 })
        .mockResolvedValueOnce({ json: async () => mockResponse2 });
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("First1")).toBeInTheDocument();
      });

      const nextButton = screen.getByLabelText("Next page");
      await user.click(nextButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/advocates?page=2&limit=10");
      });
    });

    it("updates URL when page changes", async () => {
      const mockResponse1 = createMockApiResponse(1);
      const mockResponse2 = createMockApiResponse(2);
      (global.fetch as any)
        .mockResolvedValueOnce({ json: async () => mockResponse1 })
        .mockResolvedValueOnce({ json: async () => mockResponse2 });
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("First1")).toBeInTheDocument();
      });

      const nextButton = screen.getByLabelText("Next page");
      await user.click(nextButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/?page=2", { scroll: false });
      });
    });
  });

  describe("Data Table", () => {
    it("renders all column headers", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("First Name")).toBeInTheDocument();
      });

      expect(screen.getByText("Last Name")).toBeInTheDocument();
      expect(screen.getByText("City")).toBeInTheDocument();
      expect(screen.getByText("Degree")).toBeInTheDocument();
      expect(screen.getByText("Specialties")).toBeInTheDocument();
      expect(screen.getByText("Years of Experience")).toBeInTheDocument();
      expect(screen.getByText("Phone Number")).toBeInTheDocument();
    });

    it("renders advocate data in table rows", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getAllByText("First1")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Last1")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Test City").length).toBeGreaterThan(0);
        expect(screen.getAllByText("MD").length).toBeGreaterThan(0);
      });
    });

    it("formats phone numbers correctly", async () => {
      const mockResponse = createMockApiResponse(1);
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("(555) 123-4567")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty response", async () => {
      const mockResponse = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });

      render(<Home />);

      await waitFor(() => {
        expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
      });
    });

    it("filters across all searchable fields", async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            city: "Boston",
            degree: "PhD",
            specialties: ["Cardiology", "Surgery"],
            yearsOfExperience: 10,
            phoneNumber: 5551234567,
            createdAt: new Date("2024-01-01"),
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => mockResponse,
      });
      const user = userEvent.setup();

      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText("John")).toBeInTheDocument();
      });

      // Search by specialty
      const searchInput = screen.getByPlaceholderText("Search advocates...");
      await user.clear(searchInput);
      await user.type(searchInput, "Cardiology");
      expect(screen.getByText("John")).toBeInTheDocument();

      // Search by city
      await user.clear(searchInput);
      await user.type(searchInput, "Boston");
      expect(screen.getByText("John")).toBeInTheDocument();

      // Search by degree
      await user.clear(searchInput);
      await user.type(searchInput, "PhD");
      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });
});
