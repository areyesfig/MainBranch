export const revalidate = 3600; // revalidar cada hora

import { getReleases } from "@/lib/data/releases";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
  const releases = await getReleases();

  return <NotificationsClient initialReleases={releases} />;
}
