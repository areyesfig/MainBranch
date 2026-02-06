import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ReleaseCard from "../ReleaseCard";
import { mockReleases } from "@/lib/mockData";

describe("ReleaseCard", () => {
  it("renderiza tecnología y versión", () => {
    const release = mockReleases[0];
    render(<ReleaseCard release={release} />);

    expect(screen.getByText(release.technology)).toBeInTheDocument();
    expect(screen.getByText(`v${release.version}`)).toBeInTheDocument();
  });

  it("renderiza tldr", () => {
    const release = mockReleases[0];
    const { container } = render(<ReleaseCard release={release} />);

    expect(container.textContent).toContain(release.tldr);
  });

  it("muestra badge Breaking Changes cuando aplica", () => {
    const breaking = mockReleases.find((r) => r.breakingChange);
    if (!breaking) return;

    render(<ReleaseCard release={breaking} />);
    expect(screen.getAllByText(/Breaking Changes/i).length).toBeGreaterThan(0);
  });

  it("enlaza al detalle del release", () => {
    const release = mockReleases[0];
    render(<ReleaseCard release={release} />);

    const links = screen.getAllByRole("link", { name: /Ver detalles/i });
    expect(links[0]).toHaveAttribute("href", `/releases/${release.id}`);
  });
});
