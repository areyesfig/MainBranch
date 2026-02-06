import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import StackFilter from "../StackFilter";

describe("StackFilter", () => {
  it("renderiza opción Todos y stacks", () => {
    const stacks = ["nextjs", "react"];
    const onStackChange = () => {};

    render(
      <StackFilter
        stacks={stacks}
        selectedStack={null}
        onStackChange={onStackChange}
      />
    );

    expect(screen.getByRole("button", { name: /Todos/i })).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("llama onStackChange al hacer clic en stack", () => {
    const stacks = ["nextjs"];
    const onStackChange = vi.fn();

    const { container } = render(
      <StackFilter
        stacks={stacks}
        selectedStack={null}
        onStackChange={onStackChange}
      />
    );

    const buttons = container.querySelectorAll("button");
    const nextjsBtn = Array.from(buttons).find((b) => b.textContent === "Next.js");
    expect(nextjsBtn).toBeTruthy();
    fireEvent.click(nextjsBtn!);
    expect(onStackChange).toHaveBeenCalledWith("nextjs");
  });

  it("llama onStackChange(null) al hacer clic en Todos", () => {
    const onStackChange = vi.fn();

    const { container } = render(
      <StackFilter
        stacks={["nextjs"]}
        selectedStack="nextjs"
        onStackChange={onStackChange}
      />
    );

    const todosBtn = container.querySelector("button");
    expect(todosBtn?.textContent).toBe("Todos");
    fireEvent.click(todosBtn!);
    expect(onStackChange).toHaveBeenCalledWith(null);
  });
});
