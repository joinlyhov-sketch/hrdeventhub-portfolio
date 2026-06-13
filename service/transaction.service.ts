import { apiGet } from "@/libs/api";

export const transactionService = {
  getTransactions: async (token: string): Promise<any> => {
    return await apiGet<any>("/payments/transactions?page=1&size=10", {
      authToken: token,
      fetchOptions: { cache: "no-store" },
    });
  },

  getTransactionDetail: async (transactionUUID: string, token: string): Promise<any> => {
    return await apiGet<any>(`/payments/transactions/detail/${transactionUUID}`, {
      authToken: token,
      fetchOptions: { cache: "no-store" },
    });
  },

  getProfileById: async (id: string, token: string): Promise<any> => {
    return await apiGet<any>(`/profile/${id}`, {
      authToken: token,
      fetchOptions: { cache: "no-store" },
    });
  },

  getEventById: async (id: string, token: string): Promise<any> => {
    return await apiGet<any>(`/posts/events/${id}`, {
      authToken: token,
      fetchOptions: { cache: "no-store" },
    });
  },

  findPayerIdFromTransactionList: async (token: string, transactionUUID: string, tx: any): Promise<string> => {
    try {
      const json = await apiGet<any>("/payments/transactions", {
        authToken: token,
        fetchOptions: { cache: "no-store" },
      });
      const transactions = Array.isArray(json?.payload) ? json.payload : [];

      const matched = transactions.find((item: any) => {
        return (
          firstString(item.id) === transactionUUID ||
          firstString(item.id) === firstString(tx.id) ||
          firstString(item.billNo) === firstString(tx.billNo) ||
          firstString(item.transactionId) === firstString(tx.transactionId)
        );
      });

      return firstString(
        matched?.appUserId,
        matched?.app_user_id,
        matched?.userId,
        matched?.user_id,
        matched?.payerId,
        matched?.payer_id,
        matched?.payerAppUserId,
        matched?.payer_app_user_id,
      );
    } catch (error) {
      console.error("Failed to resolve payer from transaction list:", error);
      return "";
    }
  },

  findPayerIdFromUsers: async (token: string, tx: any): Promise<string> => {
    const targetEmail = normalizeText(
      firstString(tx.email, tx.payerEmail, tx.payer_email, tx.appUser?.email, tx.payer?.email),
    );
    const targetPhone = normalizeText(
      firstString(tx.phoneNumber, tx.phone, tx.payerPhone, tx.payer_phone, tx.appUser?.phoneNumber, tx.payer?.phoneNumber),
    );
    const targetUsername = normalizeText(
      firstString(tx.username, tx.appUser?.username, tx.payer?.username),
    );
    const targetName = normalizeText(
      firstString(tx.payerName, tx.payer_name, tx.senderAccountName, tx.sender_account_name),
    );

    if (!targetEmail && !targetPhone && !targetUsername && !targetName) return "";

    try {
      const json = await apiGet<any>("/admin/users?page=1&size=200", {
        authToken: token,
        fetchOptions: { cache: "no-store" },
      });
      const users = Array.isArray(json?.payload) ? json.payload : [];

      const matched = users.find((user: any) => {
        const fullName = normalizeText(`${user.firstName ?? ""} ${user.lastName ?? ""}`);
        const reverseName = normalizeText(`${user.lastName ?? ""} ${user.firstName ?? ""}`);

        return (
          (targetEmail && normalizeText(user.email) === targetEmail) ||
          (targetPhone && normalizeText(user.phoneNumber) === targetPhone) ||
          (targetUsername && normalizeText(user.username) === targetUsername) ||
          (targetName && (fullName === targetName || reverseName === targetName))
        );
      });

      return firstString(matched?.appUserId, matched?.app_user_id, matched?.userId, matched?.user_id);
    } catch (error) {
      console.error("Failed to resolve payer from users:", error);
      return "";
    }
  }
};

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

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}