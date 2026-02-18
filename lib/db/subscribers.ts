import { prisma } from "@/lib/db";

export async function createSubscriber(email: string) {
  return prisma.subscriber.create({
    data: { email },
  });
}

export async function findSubscriberByEmail(email: string) {
  return prisma.subscriber.findUnique({ where: { email } });
}

export async function findSubscriberByToken(token: string) {
  return prisma.subscriber.findUnique({ where: { token } });
}

export async function confirmSubscriber(token: string) {
  return prisma.subscriber.update({
    where: { token },
    data: { confirmedAt: new Date() },
  });
}

export async function deleteSubscriberByToken(token: string) {
  return prisma.subscriber.delete({ where: { token } });
}

export async function getConfirmedSubscribers() {
  return prisma.subscriber.findMany({
    where: { confirmedAt: { not: null } },
    select: { email: true, token: true },
  });
}

export async function getSubscriberCount() {
  return prisma.subscriber.count({ where: { confirmedAt: { not: null } } });
}
