"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { paymentService, Transaction } from "@/service/payment.service";
import { participantService } from "@/service/participant.service";
import { ServerActionResponse } from "@/types/file-types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubmitPaymentInput {
  billNo: string;
  requestId: string;
  payerName: string;
  remark: string;
  amount: number;
  postId: string;
}

// ─── Static Bank Fields ───────────────────────────────────────────────────────
// Placeholders until real bank integration is wired in.

const STATIC_BANK_FIELDS = {
  transaction_id: 111111,
  transaction_date: "20260920",
  transaction_time: "100000",
  payer_account_no: "01211111111",
  currency_code: "USD",
  payment_method: "PM003",
  sender_bank_name: "ABA Bank",
  sender_account_name: "ABA Bank",
  settlement_date: "20260920",
  settlement_time: "100100",
  settlement_status: "0",
  settlement_error_message: null,
} as const;

// ─── Logger ───────────────────────────────────────────────────────────────────

function logStep(label: string, data?: unknown) {
  console.log(`\n[Payment] ─── ${label} ───`);
  if (data !== undefined) console.log(JSON.stringify(data, null, 2));
}

function logError(label: string, error: unknown) {
  console.error(`\n[Payment] ✗ ${label}`);
  if (error instanceof Error) {
    console.error("  message :", error.message);
    console.error("  stack   :", error.stack);
  } else {
    console.error("  raw     :", JSON.stringify(error, null, 2));
  }
}

// ─── Main Action ──────────────────────────────────────────────────────────────

/**
 * Sequential payment flow:
 *   1. POST /payments/notify       — must succeed first
 *   2. POST /posts/{id}/participants — only runs if notify succeeded
 *   3. GET  /payments/transactions/me — filtered by billNo for receipt
 *
 * Why sequential instead of parallel:
 *   - If notify fails the payment isn't recorded; registering the user would
 *     create a phantom participant with no payment record.
 *   - Sequential gives us a clear failure point and a meaningful error message.
 */
export async function submitPaymentAction(
  input: SubmitPaymentInput,
): Promise<ServerActionResponse<Transaction>> {
  logStep("submitPaymentAction called", {
    billNo: input.billNo,
    postId: input.postId,
    payerName: input.payerName,
    amount: input.amount,
    requestId: input.requestId,
    remark: input.remark,
  });

  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!token) {
      logError("Auth", "No access token in session");
      return { ok: false, error: "Your session has expired. Please log in again." };
    }

    // ── Step 1: Notify payment ────────────────────────────────────────────────
    const notifyPayload = {
      bill_no: input.billNo,
      payer_name: input.payerName,
      remark: input.remark,
      amount: input.amount,
      request_id: input.requestId,
      ...STATIC_BANK_FIELDS,
    };

    logStep("Step 1 — POST /payments/notify — request payload", notifyPayload);

    let notifyResponse;
    try {
      notifyResponse = await paymentService.notify(notifyPayload, token);
      logStep("Step 1 — notify response", notifyResponse);
    } catch (err) {
      logError("Step 1 — notify FAILED", err);
      return {
        ok: false,
        error:
          err instanceof Error
            ? `Payment notification failed: ${err.message}`
            : "Payment notification failed. Please try again.",
      };
    }

    // ── Step 2: Register participant ──────────────────────────────────────────
    const registerPayload = {
      remark: input.remark,
      billNo: input.billNo,
    };

    logStep("Step 2 — POST /posts/${input.postId}/participants — request payload", {
      postId: input.postId,
      body: registerPayload,
    });

    let registerResponse;
    try {
      registerResponse = await participantService.register(
        input.postId,
        registerPayload,
        token,
      );
      logStep("Step 2 — register response", registerResponse);
    } catch (err) {
      logError("Step 2 — register FAILED", err);
      // Payment was already notified — warn but don't hard-fail so the
      // user can still see their receipt. Log clearly for manual follow-up.
      console.warn(
        "[Payment] ⚠ Notify succeeded but participant registration failed.",
        "Manual reconciliation may be needed for billNo:",
        input.billNo,
      );
    }

    // ── Step 3: Fetch receipt ─────────────────────────────────────────────────
    logStep("Step 3 — GET /payments/transactions/me — filtering by billNo", {
      billNo: input.billNo,
    });

    let transaction: Transaction | undefined;
    try {
      transaction = await paymentService.getTransactionByBillNo(
        input.billNo,
        token,
      );
      logStep("Step 3 — matched transaction", transaction ?? "NOT FOUND");
    } catch (err) {
      logError("Step 3 — getTransactionByBillNo FAILED", err);
      return {
        ok: false,
        error:
          "Payment submitted successfully, but we couldn't load your receipt. Please check your transaction history.",
      };
    }

    if (!transaction) {
      console.warn(
        "[Payment] ⚠ transactions/me returned no match for billNo:",
        input.billNo,
      );
      return {
        ok: false,
        error:
          "Payment submitted, but receipt not found. It may take a moment — please refresh your transaction history.",
      };
    }

    logStep("✓ submitPaymentAction complete", { transactionId: transaction.id });
    return { ok: true, payload: transaction };
  } catch (error) {
    logError("submitPaymentAction — unexpected top-level error", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
    };
  }
}

// ─── Secondary Action ─────────────────────────────────────────────────────────

export async function getMyTransactionsAction(): Promise<
  ServerActionResponse<Transaction[]>
> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!token) {
      return { ok: false, error: "Authorization session has expired." };
    }

    logStep("getMyTransactionsAction — GET /payments/transactions/me");
    const transactions = await paymentService.getMyTransactions(token);
    logStep("getMyTransactionsAction — result count", { count: transactions.length });

    return { ok: true, payload: transactions };
  } catch (error) {
    logError("getMyTransactionsAction", error);
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch transactions.",
    };
  }
}