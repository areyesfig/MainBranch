import type { Metadata } from "next";
import { getReleases } from "@/lib/data/releases";
import BookmarksClient from "./BookmarksClient";

export const metadata: Metadata = {
  title: "Guardados",
  description: "Tus releases guardados en Main Branch.",
};

export default async function BookmarksPage() {
  const releases = await getReleases();

  return <BookmarksClient allReleases={releases} />;
}
