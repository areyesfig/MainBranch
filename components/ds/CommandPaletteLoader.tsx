"use client";

import dynamic from "next/dynamic";

const CommandPalette = dynamic(() => import("@/components/ds/CommandPalette"), {
  ssr: false,
});

export default function CommandPaletteLoader() {
  return <CommandPalette />;
}
