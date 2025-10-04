import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("renders search input and reset button", () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    expect(screen.getByLabelText("Search")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search advocates...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });

  it("calls onSearch when user types in the input", async () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    const input = screen.getByPlaceholderText("Search advocates...");
    await user.type(input, "test");

    expect(mockOnSearch).toHaveBeenCalledTimes(4); // Called for each character
    expect(mockOnSearch).toHaveBeenLastCalledWith("test");
  });

  it("displays the search term when user types", async () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    const input = screen.getByPlaceholderText("Search advocates...");
    await user.type(input, "John");

    expect(screen.getByText("Searching for:")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  it("does not display search term text when input is empty", () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    expect(screen.queryByText("Searching for:")).not.toBeInTheDocument();
  });

  it("calls onReset when reset button is clicked", async () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it("clears the input when reset button is clicked", async () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    const input = screen.getByPlaceholderText("Search advocates...");
    await user.type(input, "test search");
    
    expect(input).toHaveValue("test search");

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    expect(input).toHaveValue("");
  });

  it("hides search term display after reset", async () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    const input = screen.getByPlaceholderText("Search advocates...");
    await user.type(input, "search");

    expect(screen.getByText("Searching for:")).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    expect(screen.queryByText("Searching for:")).not.toBeInTheDocument();
  });

  it("calls onSearch with empty string after reset", async () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    const input = screen.getByPlaceholderText("Search advocates...");
    await user.type(input, "test");
    
    mockOnSearch.mockClear();

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    expect(mockOnSearch).toHaveBeenCalledWith("");
  });

  it("maintains controlled input value", async () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    const input = screen.getByPlaceholderText("Search advocates...") as HTMLInputElement;
    
    await user.type(input, "abc");
    expect(input.value).toBe("abc");

    await user.clear(input);
    await user.type(input, "xyz");
    expect(input.value).toBe("xyz");
  });

  it("handles multiple search and reset cycles", async () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    const input = screen.getByPlaceholderText("Search advocates...");
    const resetButton = screen.getByRole("button", { name: /reset/i });

    // First search
    await user.type(input, "first");
    expect(mockOnSearch).toHaveBeenLastCalledWith("first");

    // First reset
    await user.click(resetButton);
    expect(mockOnReset).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue("");

    // Second search
    await user.type(input, "second");
    expect(mockOnSearch).toHaveBeenLastCalledWith("second");

    // Second reset
    await user.click(resetButton);
    expect(mockOnReset).toHaveBeenCalledTimes(2);
    expect(input).toHaveValue("");
  });

  it("handles special characters in search", async () => {
    const mockOnSearch = vi.fn();
    const mockOnReset = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} onReset={mockOnReset} />);

    const input = screen.getByPlaceholderText("Search advocates...");
    await user.type(input, "test@123!#");

    expect(mockOnSearch).toHaveBeenLastCalledWith("test@123!#");
    expect(screen.getByText("test@123!#")).toBeInTheDocument();
  });
});
