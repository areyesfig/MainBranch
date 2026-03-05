import type { Metadata } from "next";

export const revalidate = 3600; // revalidar cada hora

import { getReleases } from "@/lib/data/releases";
import NotificationsClient from "./NotificationsClient";

export const metadata: Metadata = {
  title: "Notificaciones",
  description: "Configura tus preferencias de notificación y mantente al día con los releases que más te interesan.",
  alternates: { canonical: "/notifications" },
  openGraph: {
    title: "Notificaciones — Main Branch",
    description: "Configura tus preferencias de notificación y mantente al día con los releases que más te interesan.",
    url: "/notifications",
  },
};

export default async function NotificationsPage() {
  const releases = await getReleases();

  return <NotificationsClient initialReleases={releases} />;
}
