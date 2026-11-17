"use server";
import { getAppSession as getServerSession } from "@/libs/server-session";
import { authOptions } from "@/libs/auth";
import { Transaction, TransactionStatus, Event } from "@/types/transaction";
import { TransactionDetail, EventDetail } from "@/types/transaction-detail";
import { transactionService } from "@/service/transaction.service";

const statusMap: Record<string, TransactionStatus> = {
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

function formatEventDateTime(isoString: string): {
  date: string;
  time: string;
} {
  if (!isoString) return { date: "", time: "" };
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
      timeZone: "Asia/Phnom_Penh",
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
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
  return ((json.payload as Record<string, unknown>[]) ?? []).map((t) => ({
    id: `#TX-${String(t.transactionId).slice(-5)}`,
    uuid: t.id as string,
    username: (t.payerName ?? t.senderAccountName ?? "") as string,
    avatar: (t.profilePicture ?? "") as string,
    senderBankName: (t.senderBankName ?? "") as string,
    amount: t.amount as number,
    status: statusMap[String(t.settlementStatus)] ?? "Pending",
    timestamp: formatRelative(String(t.createdAt ?? "")),
    eventId: ((t.post as Record<string, unknown>)?.postId ??
      t.postId ??
      "") as string,
  }));
}

export async function getEventSummaries(): Promise<Event[]> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    throw new Error("Unauthorized");
  }

  const json = await transactionService.getTransactions(session.accessToken);
  const transactions = ((json.payload as unknown[]) ?? []) as Record<
    string,
    unknown
  >[];

  const seenPostIds = new Set<string>();
  const events: Event[] = [];

  for (const t of transactions) {
    const post = t.post as Record<string, unknown> | undefined;
    if (!post?.postId || seenPostIds.has(post.postId as string)) continue;
    seenPostIds.add(post.postId as string);

    const payment = post.payment as Record<string, unknown> | undefined;
    const eventStart = post.eventStart as string | undefined;
    const createdAt = post.createdAt as string | undefined;

    events.push({
      id: post.postId as string,
      title: (post.title ?? "") as string,
      date: formatEventDate(eventStart ?? createdAt ?? ""),
      status: eventStatusMap[post.status as string] ?? "Published",
      amount: Number(payment?.amountRaised ?? 0),
      attendees: 0,
      year: new Date(eventStart ?? createdAt ?? "").getFullYear(),
    });
  }

  return events;
}

export async function getTransactionDetail(
  transactionUUID: string,
): Promise<TransactionDetail> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");

  const token = session.accessToken;
  const txJson = await transactionService.getTransactionDetail(
    transactionUUID,
    token,
  );
  const tx = txJson.payload as Record<string, unknown>;
  const txPayer = (tx.payer ?? {}) as Record<string, unknown>;
  const txAppUser = (tx.appUser ?? {}) as Record<string, unknown>;

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
    txPayer.appUserId,
    txPayer.app_user_id,
    txPayer.userId,
    txPayer.user_id,
    txPayer.id,
    txAppUser.appUserId,
    txAppUser.app_user_id,
    txAppUser.userId,
    txAppUser.user_id,
    txAppUser.id,
  );

  if (!txAppUserId) {
    txAppUserId = await transactionService.findPayerIdFromTransactionList(
      token,
      transactionUUID,
      tx,
    );
  }

  if (!txAppUserId) {
    txAppUserId = await transactionService.findPayerIdFromUsers(token, tx);
  }

  let profileJson = null;
  if (txAppUserId) {
    try {
      profileJson = await transactionService.getProfileById(txAppUserId, token);
    } catch {
      profileJson = null;
    }
  }
  const profile = profileJson?.payload as Record<string, unknown> | undefined;

  let postJson = null;
  try {
    postJson = await transactionService.getEventById(
      tx.postId as string,
      token,
    );
  } catch {
    postJson = null;
  }
  const post = postJson?.payload as Record<string, unknown> | undefined;

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

  const postEventStart = post?.eventStart as string | undefined;
  const { date: eventDate, time: eventTime } = postEventStart
    ? formatEventDateTime(postEventStart)
    : { date: "", time: "" };

  const postMedia = post?.media as Record<string, unknown>[] | undefined;
  const coverImage =
    (postMedia?.find((m) => m.isCover)?.filePath as string) ??
    (postMedia?.[0]?.filePath as string) ??
    "";

  const appUser = profile?.appUser as Record<string, unknown> | undefined;
  const profileUser = profile?.user as Record<string, unknown> | undefined;
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
    profileUser?.appUserId,
    profileUser?.app_user_id,
    profileUser?.userId,
    profileUser?.user_id,
    txAppUserId,
  );
  const skills = profile?.skills;
  const firstSkill =
    Array.isArray(skills) && skills.length > 0 ? (skills[0] as string) : "";
  const profileGeneration = profile?.generation as
    | Record<string, unknown>
    | undefined;
  const generation = (profileGeneration?.name ?? "") as string;

  const postLocation = post?.location as Record<string, unknown> | undefined;

  return {
    id: tx.id as string,
    processedDate: formatDetailDate(
      tx.transactionDate as string,
      tx.transactionTime as string,
    ),
    amount: tx.amount as number,
    currency: (tx.currencyCode ?? "USD") as string,
    status: detailStatusMap[tx.settlementStatus as string] ?? "Pending",
    referenceId: (tx.billNo ?? "") as string,
    transactionId: `#TX-${String(tx.transactionId).slice(-5)}`,
    senderBankName: (tx.senderBankName ?? "") as string,
    payer: {
      id: payerProfileId,
      name: appUser
        ? `${(appUser.firstName ?? "") as string} ${(appUser.lastName ?? "") as string}`.trim() ||
          (appUser.username as string)
        : (tx.payerName as string),
      avatar: (profile?.profilePicture ?? "") as string,
      badge: ((profile?.roles ?? "ALUMNI") as { toString(): string })
        .toString()
        .toUpperCase(),
      generation,
      skill: firstSkill,
      email: (appUser?.email ?? "") as string,
      phone: (appUser?.phoneNumber ?? "") as string,
    },
    event: {
      id: tx.postId as string,
      workspaceId: (post?.workspaceId ?? "") as string,
      title: (post?.title ?? "") as string,
      date: eventDate,
      time: eventTime,
      location: (postLocation?.locationName ?? "") as string,
      image: coverImage,
      badge: "EVENT",
      status: detailEventStatusMap[post?.status as string] ?? "Active",
    },
  };
}
