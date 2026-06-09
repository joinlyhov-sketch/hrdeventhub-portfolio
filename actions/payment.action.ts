"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import {
  paymentService,
  Transaction,
  GenerateQrResponse,
} from "@/service/payment.service";
import { participantService } from "@/service/participant.service";
import {
  ServerActionResponse,
  ServerActionResponse2,
} from "@/types/file-types";

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

const ALLOWED_ROLES = ["alumni", "student"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

function assertAllowedRole(role?: string): role is AllowedRole {
  return ALLOWED_ROLES.includes(role as AllowedRole);
}

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

export interface StudentRegisterInput {
  postId: string;
  remark: string;
  role: string;
}

export async function studentRegisterAction(
  input: StudentRegisterInput,
): Promise<ServerActionResponse2<{ message: string }>> {
  logStep("studentRegisterAction called", input);

  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;
    const role = input.role?.toLowerCase();

    console.log("[Role check] input.role:", input.role, "→ normalized:", role);

    if (!token) {
      logError("Auth", "No access token");
      return {
        ok: false,
        error: "Your session has expired. Please log in again.",
      };
    }

    if (role !== "student") {
      logError("Role guard", `Expected student, got: ${role}`);
      return {
        ok: false,
        error: "This registration flow is only available for students.",
      };
    }

    logStep("POST /posts/${input.postId}/participants", {
      remark: input.remark,
      billNo: null,
    });

    try {
      const response = await participantService.register(
        input.postId,
        { remark: input.remark, billNo: null },
        token,
      );
      logStep("register response", response);
    } catch (err) {
      logError("register FAILED", err);
      return {
        ok: false,
        error:
          err instanceof Error
            ? `Registration failed: ${err.message}`
            : "Registration failed. Please try again.",
      };
    }

    logStep("✓ studentRegisterAction complete");
    return {
      ok: true,
      payload: {
        message:
          "You've successfully registered for this event! Check your email for confirmation.",
      },
    };
  } catch (error) {
    logError("studentRegisterAction — unexpected error", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
}

export interface AlumniFixedPaymentInput {
  billNo: string;
  requestId: string;
  payerName: string;
  remark: string;
  amount: number;
  postId: string;
  role: string;
}

export async function alumniFixedPaymentAction(
  input: AlumniFixedPaymentInput,
): Promise<ServerActionResponse2<Transaction>> {
  logStep("alumniFixedPaymentAction called", {
    billNo: input.billNo,
    postId: input.postId,
    payerName: input.payerName,
    amount: input.amount,
    requestId: input.requestId,
    remark: input.remark,
    role: input.role,
  });

  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;
    const role = input.role?.toLowerCase();

    console.log("[Role check] input.role:", input.role, "→ normalized:", role);

    if (!token) {
      logError("Auth", "No access token");
      return {
        ok: false,
        error: "Your session has expired. Please log in again.",
      };
    }

    if (role !== "alumni") {
      logError("Role guard", `Expected alumni, got: ${role}`);
      return {
        ok: false,
        error: "This payment flow is only available for alumni.",
      };
    }

    const notifyPayload = {
      bill_no: input.billNo,
      payer_name: input.payerName,
      remark: input.remark,
      amount: input.amount,
      request_id: input.requestId,
      ...STATIC_BANK_FIELDS,
    };

    logStep("Step 1 — POST /payments/notify", notifyPayload);

    try {
      const notifyRes = await paymentService.notify(notifyPayload);
      logStep("Step 1 — notify response", notifyRes);
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

    logStep("Step 2 — POST /posts/${input.postId}/participants", {
      remark: input.remark,
      billNo: input.billNo,
    });

    try {
      const registerRes = await participantService.register(
        input.postId,
        { remark: input.remark, billNo: input.billNo },
        token,
      );
      logStep("Step 2 — register response", registerRes);
    } catch (err) {
      logError(
        "Step 2 — register FAILED (notify already succeeded — log for reconciliation)",
        err,
      );
      console.warn(
        "[Payment] ⚠ billNo for manual reconciliation:",
        input.billNo,
      );
    }

    logStep("Step 3 — GET /payments/transactions/me → filter by billNo", {
      billNo: input.billNo,
    });

    try {
      const transaction = await paymentService.getTransactionByBillNo(
        input.billNo,
        token,
      );
      logStep("Step 3 — matched transaction", transaction ?? "NOT FOUND");

      if (!transaction) {
        console.warn(
          "[Payment] ⚠ No transaction matched billNo:",
          input.billNo,
        );
        return {
          ok: false,
          error:
            "Payment submitted, but receipt not found. Check your transaction history.",
        };
      }

      logStep("✓ alumniFixedPaymentAction complete", {
        transactionId: transaction.id,
      });
      return { ok: true, payload: transaction };
    } catch (err) {
      logError("Step 3 — getTransactionByBillNo FAILED", err);
      return {
        ok: false,
        error:
          "Payment submitted, but we couldn't load your receipt. Check your transaction history.",
      };
    }
  } catch (error) {
    logError("alumniFixedPaymentAction — unexpected error", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
}

export interface GenerateFlexibleQrInput {
  postId: string;
  amount: number;
  role: string;
}

export async function generateFlexibleQrAction(
  input: GenerateFlexibleQrInput,
): Promise<ServerActionResponse2<GenerateQrResponse>> {
  logStep("generateFlexibleQrAction called", input);

  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;
    const role = input.role?.toLowerCase();

    console.log("[Role check] input.role:", input.role, "→ normalized:", role);

    if (!token) {
      logError("Auth", "No access token");
      return {
        ok: false,
        error: "Your session has expired. Please log in again.",
      };
    }

    if (role !== "alumni") {
      logError("Role guard", `Expected alumni, got: ${role}`);
      return {
        ok: false,
        error: "This payment flow is only available for alumni.",
      };
    }

    const qrPayload = {
      postId: input.postId,
      amount: input.amount,
      remark: "",
    };
    logStep("POST /payments/qr/generate", qrPayload);

    try {
      const qrResponse = await paymentService.generateQr(qrPayload, token);
      logStep("QR generate response", {
        billNo: qrResponse.billNo,
        requestId: qrResponse.requestId,
        amount: qrResponse.amount,
        currency: qrResponse.currency,
        khqrData: qrResponse.khqrData.slice(0, 40) + "…",
      });
      return { ok: true, payload: qrResponse };
    } catch (err) {
      logError("QR generate FAILED", err);
      return {
        ok: false,
        error:
          err instanceof Error
            ? `QR generation failed: ${err.message}`
            : "Failed to generate payment QR. Please try again.",
      };
    }
  } catch (error) {
    logError("generateFlexibleQrAction — unexpected error", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
}

export async function alumniFlexiblePaymentAction(
  input: AlumniFixedPaymentInput,
): Promise<ServerActionResponse2<Transaction>> {
  return alumniFixedPaymentAction(input);
}

export async function getMyTransactionsAction(): Promise<
  ServerActionResponse2<Transaction[]>
> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!token)
      return { ok: false, error: "Authorization session has expired." };

    logStep("getMyTransactionsAction — GET /payments/transactions/me");
    const transactions = await paymentService.getMyTransactions(token);
    logStep("result count", { count: transactions.length });

    return { ok: true, payload: transactions };
  } catch (error) {
    logError("getMyTransactionsAction", error);
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch transactions.",
    };
  }
}
