"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { Transaction, Event } from "@/types/transaction";
import { TransactionDetail, EventDetail } from "@/types/transaction-detail";

const statusMap: Record<string, string> = {
  "0": "Successful",
  "1": "Pending",
  "2": "Failed",
};

const eventStatusMap: Record<string, Event["status"]> = {
  active: "Active",
  closed: "Cancel",
  draft: "Published",
};

function formatRelative(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hrs ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

function formatEventDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "Asia/Phnom_Penh",
  });
}

function formatDetailDate(dateStr: string, timeStr: string): string {
  if (!dateStr || !timeStr) return "";
  const d = dateStr;
  const t = timeStr;
  const iso = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${t.slice(0, 2)}:${t.slice(2, 4)}:${t.slice(4, 6)}`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Phnom_Penh",
  });
}

function formatEventDateTime(isoString: string): { date: string; time: string } {
  if (!isoString) return { date: "", time: "" };
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "2-digit", year: "numeric",
      timeZone: "Asia/Phnom_Penh",
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit",
      timeZone: "Asia/Phnom_Penh",
    }),
  };
}

export async function getTransactions(): Promise<Transaction[]> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/transactions`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }
  const json = await res.json();
  return json.payload.map((t: any) => ({
  id: `#TX-${String(t.transactionId).slice(-5)}`,
  uuid: t.id,          // ← add this
  username: t.username ?? t.payerName,
  avatar: t.profilePicture ?? "",
  amount: t.amount,
  status: statusMap[t.settlementStatus] ?? "Pending",
  timestamp: formatRelative(t.createdAt),
  eventId: t.postId,
}));
}

export async function getEventSummaries(): Promise<Event[]> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/events/summary?size=10`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch event summaries");
  }
  const json = await res.json();
  return (json.payload ?? []).map((e: any) => ({
    id: e.postId,
    title: e.title,
    date: formatEventDate(e.eventStart),
    status: eventStatusMap[e.status] ?? "Published",
    amount: Number(e.amountRaised ?? 0),
    attendees: e.attendeeCount ?? 0,
    year: new Date(e.eventStart).getFullYear(),
  }));
}

export async function getTransactionDetail(transactionUUID: string): Promise<TransactionDetail> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");

  const headers = { Authorization: `Bearer ${session.accessToken}` };
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  const txRes = await fetch(`${base}/payments/transactions/detail/${transactionUUID}`, {
    headers,
    cache: "no-store",
});
if (!txRes.ok) {
    const body = await txRes.text();
    console.error("=== TRANSACTION FETCH FAILED ===");
    console.error("Status:", txRes.status);
    console.error("URL:", `${base}/payments/transactions/detail/${transactionUUID}`);
    console.error("Body:", body);
    console.error("================================");
    throw new Error(`Transaction not found (${txRes.status})`);
}
  const txJson = await txRes.json();
  const tx = txJson.payload;

  const profileRes = await fetch(`${base}/profile/${tx.appUserId}`, {
    headers,
    cache: "no-store",
  });
  const profileJson = profileRes.ok ? await profileRes.json() : null;
  const profile = profileJson?.payload;

  const postRes = await fetch(`${base}/posts/events/${tx.postId}`, {
    headers,
    cache: "no-store",
  });
  const postJson = postRes.ok ? await postRes.json() : null;
  const post = postJson?.payload;

  const statusMap: Record<string, TransactionDetail["status"]> = {
    "0": "Successful",
    "1": "Pending",
    "2": "Failed",
  };

  const eventStatusMap: Record<string, EventDetail["status"]> = {
    active: "Active",
    closed: "Cancel",
    draft: "Published",
  };

  const { date: eventDate, time: eventTime } = post?.eventStart
    ? formatEventDateTime(post.eventStart)
    : { date: "", time: "" };

  const coverImage = post?.media?.find((m: any) => m.isCover)?.filePath
    ?? post?.media?.[0]?.filePath
    ?? "";

  const appUser = profile?.appUser;
  const skills = profile?.skills;
  const firstSkill = Array.isArray(skills) && skills.length > 0 ? skills[0] : "";
  const generation = profile?.generation?.name ?? "";

  return {
    id: tx.id,
    processedDate: formatDetailDate(tx.transactionDate, tx.transactionTime),
    amount: tx.amount,
    currency: tx.currencyCode ?? "USD",
    status: statusMap[tx.settlementStatus] ?? "Pending",
    referenceId: tx.billNo ?? "",
    transactionId: `#TX-${String(tx.transactionId).slice(-5)}`,
    payer: {
      id: tx.appUserId,
      name: appUser
        ? `${appUser.firstName ?? ""} ${appUser.lastName ?? ""}`.trim() || appUser.username
        : tx.payerName,
      avatar: profile?.profilePicture ?? "",
      badge: (profile?.roles ?? "ALUMNI").toString().toUpperCase(),
      generation,
      skill: firstSkill,
      email: appUser?.email ?? "",
      phone: appUser?.phoneNumber ?? "",
    },
    event: {
      id: tx.postId,
      title: post?.title ?? "",
      date: eventDate,
      time: eventTime,
      location: post?.location?.locationName ?? "",
      image: coverImage,
      badge: "EVENT",
      status: eventStatusMap[post?.status] ?? "Active",
    },
  };
}