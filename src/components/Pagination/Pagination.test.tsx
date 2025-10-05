import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  describe("Rendering", () => {
    it("renders pagination controls", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
      expect(screen.getByLabelText("Next page")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 2")).toBeInTheDocument();
    });

    it("does not render when totalPages is 1", () => {
      const mockOnPageChange = vi.fn();

      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
          hasNextPage={false}
          hasPreviousPage={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("does not render when totalPages is 0", () => {
      const mockOnPageChange = vi.fn();

      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={0}
          onPageChange={mockOnPageChange}
          hasNextPage={false}
          hasPreviousPage={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Page Numbers Display", () => {
    it("shows all pages when total pages is 4 or less", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={3}
          totalPages={4}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 2")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 3")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 4")).toBeInTheDocument();
    });

    it("shows ellipsis for large page counts", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={5}
          totalPages={20}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      const ellipsisElements = screen.getAllByText("...");
      expect(ellipsisElements.length).toBeGreaterThan(0);
    });

    it("highlights current page", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      const currentPageButton = screen.getByLabelText("Go to page 3");
      expect(currentPageButton).toHaveClass("bg-blue-500", "text-white");
      expect(currentPageButton).toHaveAttribute("aria-current", "page");
    });

    it("shows first and last page in large pagination", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={10}
          totalPages={20}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 20")).toBeInTheDocument();
    });
  });

  describe("Previous Button", () => {
    it("calls onPageChange with previous page when clicked", async () => {
      const mockOnPageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      const previousButton = screen.getByLabelText("Previous page");
      await user.click(previousButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it("is disabled when on first page", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={false}
        />
      );

      const previousButton = screen.getByLabelText("Previous page");
      expect(previousButton).toBeDisabled();
      expect(previousButton).toHaveClass("bg-gray-200", "cursor-not-allowed");
    });

    it("does not call onPageChange when disabled", async () => {
      const mockOnPageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={false}
        />
      );

      const previousButton = screen.getByLabelText("Previous page");
      await user.click(previousButton);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe("Next Button", () => {
    it("calls onPageChange with next page when clicked", async () => {
      const mockOnPageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      const nextButton = screen.getByLabelText("Next page");
      await user.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });

    it("is disabled when on last page", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={false}
          hasPreviousPage={true}
        />
      );

      const nextButton = screen.getByLabelText("Next page");
      expect(nextButton).toBeDisabled();
      expect(nextButton).toHaveClass("bg-gray-200", "cursor-not-allowed");
    });

    it("does not call onPageChange when disabled", async () => {
      const mockOnPageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={false}
          hasPreviousPage={true}
        />
      );

      const nextButton = screen.getByLabelText("Next page");
      await user.click(nextButton);

      expect(mockOnPageChange).not.toHaveBeenCalled();
    });
  });

  describe("Page Number Buttons", () => {
    it("calls onPageChange with clicked page number", async () => {
      const mockOnPageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={false}
        />
      );

      const pageButton = screen.getByLabelText("Go to page 2");
      await user.click(pageButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it("can navigate to any visible page", async () => {
      const mockOnPageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      const page1Button = screen.getByLabelText("Go to page 1");
      await user.click(page1Button);
      expect(mockOnPageChange).toHaveBeenCalledWith(1);

      const page5Button = screen.getByLabelText("Go to page 5");
      await user.click(page5Button);
      expect(mockOnPageChange).toHaveBeenCalledWith(5);
    });
  });

  describe("Styling", () => {
    it("applies correct CSS classes to pagination container", () => {
      const mockOnPageChange = vi.fn();

      const { container } = render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      const paginationContainer = container.firstChild as HTMLElement;
      expect(paginationContainer).toHaveClass("flex", "items-center", "justify-center", "gap-2", "mt-6");
    });

    it("applies active styling to current page", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      const currentPageButton = screen.getByLabelText("Go to page 2");
      expect(currentPageButton).toHaveClass("bg-blue-500", "text-white");
    });

    it("applies inactive styling to non-current pages", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={true}
        />
      );

      const otherPageButton = screen.getByLabelText("Go to page 3");
      expect(otherPageButton).toHaveClass("bg-white", "text-gray-700", "border");
    });
  });

  describe("Edge Cases", () => {
    it("handles two pages correctly", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={1}
          totalPages={2}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={false}
        />
      );

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 2")).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("handles current page at start with many pages", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={1}
          totalPages={20}
          onPageChange={mockOnPageChange}
          hasNextPage={true}
          hasPreviousPage={false}
        />
      );

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 20")).toBeInTheDocument();
    });

    it("handles current page at end with many pages", () => {
      const mockOnPageChange = vi.fn();

      render(
        <Pagination
          currentPage={20}
          totalPages={20}
          onPageChange={mockOnPageChange}
          hasNextPage={false}
          hasPreviousPage={true}
        />
      );

      expect(screen.getByLabelText("Go to page 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to page 20")).toBeInTheDocument();
    });
  });
});
