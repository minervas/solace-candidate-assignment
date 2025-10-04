import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Title } from "./Title";

describe("Title", () => {
  it("renders children text correctly", () => {
    render(<Title>Test Title</Title>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders as an h1 element", () => {
    render(<Title>Heading Text</Title>);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Heading Text");
  });

  it("renders multiple children correctly", () => {
    render(
      <Title>
        <span>Part 1</span> <span>Part 2</span>
      </Title>
    );
    expect(screen.getByText("Part 1")).toBeInTheDocument();
    expect(screen.getByText("Part 2")).toBeInTheDocument();
  });

  it("renders empty children", () => {
    render(<Title>{""}</Title>);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("");
  });
});
