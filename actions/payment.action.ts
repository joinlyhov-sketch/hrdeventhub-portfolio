"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import {
  paymentService,
  Transaction,
  GenerateQrResponse,
  BankCredentialPayload,
} from "@/service/payment.service";
import { participantService } from "@/service/participant.service";
import {
  ServerActionResponse,
  ServerActionResponse2,
} from "@/types/file-types";

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
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;
    const role = input.role?.toLowerCase();

    if (!token) {
      return {
        ok: false,
        error: "Your session has expired. Please log in again.",
      };
    }

    if (role !== "student") {
      return {
        ok: false,
        error: "This registration flow is only available for students.",
      };
    }

    try {
      await participantService.register(
        input.postId,
        { remark: input.remark, billNo: null },
        token,
      );
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? `Registration failed: ${err.message}`
            : "Registration failed. Please try again.",
      };
    }

    return {
      ok: true,
      payload: {
        message:
          "You've successfully registered for this event! Check your email for confirmation.",
      },
    };
  } catch (error) {
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
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;
    const role = input.role?.toLowerCase();

    if (!token) {
      return {
        ok: false,
        error: "Your session has expired. Please log in again.",
      };
    }

    if (role !== "alumni") {
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

    try {
      await paymentService.notify(notifyPayload);
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? `Payment notification failed: ${err.message}`
            : "Payment notification failed. Please try again.",
      };
    }

    try {
      await participantService.register(
        input.postId,
        { remark: input.remark, billNo: input.billNo },
        token,
      );
    } catch (err) {
    }

    try {
      const transaction = await paymentService.getTransactionByBillNo(
        input.billNo,
        token,
      );

      if (!transaction) {
        return {
          ok: false,
          error:
            "Payment submitted, but receipt not found. Check your transaction history.",
        };
      }

      return { ok: true, payload: transaction };
    } catch (err) {
      return {
        ok: false,
        error:
          "Payment submitted, but we couldn't load your receipt. Check your transaction history.",
      };
    }
  } catch (error) {
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
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;
    const role = input.role?.toLowerCase();

    if (!token) {
      return {
        ok: false,
        error: "Your session has expired. Please log in again.",
      };
    }

    if (role !== "alumni") {
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

    try {
      const qrResponse = await paymentService.generateQr(qrPayload, token);
      return { ok: true, payload: qrResponse };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? `QR generation failed: ${err.message}`
            : "Failed to generate payment QR. Please try again.",
      };
    }
  } catch (error) {
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

    const transactions = await paymentService.getMyTransactions(token);

    return { ok: true, payload: transactions };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch transactions.",
    };
  }
}

export async function connectBankCredentialAction(
  input: BankCredentialPayload,
): Promise<ServerActionResponse2<{ message: string }>> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken as string | undefined;

    if (!token) {
      return {
        ok: false,
        error: "Your session has expired. Please log in again.",
      };
    }

    try {
      await paymentService.connectBankCredential(input, token);
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? `Connection failed: ${err.message}` : "Failed to connect bank credential parameters.",
      };
    }

    return {
      ok: true,
      payload: {
        message: "WeBill365 integration channel linked securely.",
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "An unexpected gateway connection error occurred.",
    };
  }
}