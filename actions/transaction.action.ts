"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { Transaction, Event } from "@/types/transaction";
import { TransactionDetail, EventDetail } from "@/types/transaction-detail";
import { transactionService } from "@/service/transaction.service";

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

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (
        trimmed &&
        trimmed.toLowerCase() !== "undefined" &&
        trimmed.toLowerCase() !== "null"
      ) {
        return trimmed;
      }
    }
  }
  return "";
}

export async function getTransactions(): Promise<Transaction[]> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }

  const json = await transactionService.getTransactions(session.accessToken);

  return (json.payload ?? []).map((t: any) => ({
    id: `#TX-${String(t.transactionId).slice(-5)}`,
    uuid: t.id,
    username: t.payerName ?? t.senderAccountName ?? "",
    avatar: t.profilePicture ?? "",
    amount: t.amount,
    status: statusMap[t.settlementStatus] ?? "Pending",
    timestamp: formatRelative(t.createdAt),
    eventId: t.post?.postId ?? t.postId ?? "",
  }));
}

export async function getEventSummaries(): Promise<Event[]> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }

  const json = await transactionService.getTransactions(session.accessToken);
  const transactions: any[] = json.payload ?? [];

  const seenPostIds = new Set<string>();
  const events: Event[] = [];

  for (const t of transactions) {
    const post = t.post;
    if (!post?.postId || seenPostIds.has(post.postId)) continue;
    seenPostIds.add(post.postId);

    events.push({
      id: post.postId,
      title: post.title ?? "",
      date: formatEventDate(post.eventStart ?? post.createdAt),
      status: eventStatusMap[post.status] ?? "Published",
      amount: Number(post.payment?.amountRaised ?? 0),
      attendees: 0,
      year: new Date(post.eventStart ?? post.createdAt).getFullYear(),
    });
  }

  return events;
}

export async function getTransactionDetail(transactionUUID: string): Promise<TransactionDetail> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");

  const token = session.accessToken;
  const txJson = await transactionService.getTransactionDetail(transactionUUID, token);
  const tx = txJson.payload;

  let txAppUserId = firstString(
    tx.appUserId,
    tx.app_user_id,
    tx.userId,
    tx.user_id,
    tx.payerId,
    tx.payer_id,
    tx.payerAppUserId,
    tx.payer_app_user_id,
    tx.customerId,
    tx.customer_id,
    tx.memberId,
    tx.member_id,
    tx.payer?.appUserId,
    tx.payer?.app_user_id,
    tx.payer?.userId,
    tx.payer?.user_id,
    tx.payer?.id,
    tx.appUser?.appUserId,
    tx.appUser?.app_user_id,
    tx.appUser?.userId,
    tx.appUser?.user_id,
    tx.appUser?.id,
  );

  if (!txAppUserId) {
    txAppUserId = await transactionService.findPayerIdFromTransactionList(token, transactionUUID, tx);
  }

  if (!txAppUserId) {
    txAppUserId = await transactionService.findPayerIdFromUsers(token, tx);
  }

  let profileJson = null;
  if (txAppUserId) {
    try {
      profileJson = await transactionService.getProfileById(txAppUserId, token);
    } catch (e) {
      profileJson = null;
    }
  }
  const profile = profileJson?.payload;

  let postJson = null;
  try {
    postJson = await transactionService.getEventById(tx.postId, token);
  } catch (e) {
    postJson = null;
  }
  const post = postJson?.payload;

  const detailStatusMap: Record<string, TransactionDetail["status"]> = {
    "0": "Successful",
    "1": "Pending",
    "2": "Failed",
  };

  const detailEventStatusMap: Record<string, EventDetail["status"]> = {
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
  const payerProfileId = firstString(
    appUser?.appUserId,
    appUser?.app_user_id,
    appUser?.userId,
    appUser?.user_id,
    appUser?.id,
    profile?.appUserId,
    profile?.app_user_id,
    profile?.userId,
    profile?.user_id,
    profile?.user?.appUserId,
    profile?.user?.app_user_id,
    profile?.user?.userId,
    profile?.user?.user_id,
    txAppUserId,
  );
  const skills = profile?.skills;
  const firstSkill = Array.isArray(skills) && skills.length > 0 ? skills[0] : "";
  const generation = profile?.generation?.name ?? "";

  return {
    id: tx.id,
    processedDate: formatDetailDate(tx.transactionDate, tx.transactionTime),
    amount: tx.amount,
    currency: tx.currencyCode ?? "USD",
    status: detailStatusMap[tx.settlementStatus] ?? "Pending",
    referenceId: tx.billNo ?? "",
    transactionId: `#TX-${String(tx.transactionId).slice(-5)}`,
    payer: {
      id: payerProfileId,
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
      workspaceId: post?.workspaceId ?? "",
      title: post?.title ?? "",
      date: eventDate,
      time: eventTime,
      location: post?.location?.locationName ?? "",
      image: coverImage,
      badge: "EVENT",
      status: detailEventStatusMap[post?.status] ?? "Active",
    },
  };
}