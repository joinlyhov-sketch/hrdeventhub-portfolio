import { apiPost, apiGet } from "@/libs/api";

export type PaymentProvider = "webill" | "bakong";

export interface PaymentNotifyPayload {
  bill_no: string;
  transaction_id: number;
  transaction_date: string;
  transaction_time: string;
  payer_account_no: string;
  payer_name: string;
  currency_code: string;
  payment_method: string;
  amount: number;
  sender_bank_name: string;
  sender_account_name: string;
  settlement_date: string;
  settlement_time: string;
  settlement_status: string;
  settlement_error_message: string | null;
  remark: string;
  request_id: string;
}

export interface PaymentNotifyResponse {
  success: boolean;
  message: string;
  status: string;
}

export interface GenerateQrPayload {
  postId: string;
  amount: number;
  remark: string;
}

export interface GenerateQrResponse {
  billNo: string;
  accountNo: string;
  khqrData: string;
  khqrDataBase64: string;
  amount: number;
  currency: string;
  requestId: string;
}

export interface BakongQrGenerateResponse {
  paymentIntentId: string;
  provider: "BAKONG";
  billNo: string;
  accountNo: string;
  accountName: string;
  khqrData: string;
  khqrDataBase64?: string | null;
  khqrMd5: string;
  amount: number;
  currency: string;
  requestId: string;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED";
  expiresAt: string;
}

export interface BakongPaymentStatusResponse {
  paymentIntentId: string;
  provider: "BAKONG";
  billNo: string;
  requestId: string;
  postId: string;
  appUserId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED";
  paid: boolean;
  message: string;
  expiresAt?: string;
  paidAt?: string;
}

export interface Transaction {
  id: string;
  billNo: string;
  transactionId: number;
  transactionDate: string;
  transactionTime: string;
  payerAccountNo: string;
  payerName: string;
  currencyCode: string;
  paymentMethod: string;
  amount: number;
  senderBankName: string;
  senderAccountName: string;
  settlementDate: string;
  settlementTime: string;
  settlementStatus: string;
  remark: string;
  createdAt: string;
  appUserId: string;
  postId: string;
  username?: string;
}

interface TransactionsResponse {
  success: boolean;
  message: string;
  status: string;
  payload: Transaction[];
  timestamp: string;
}

export interface BankCredentialPayload {
  accountName: string;
  accountNo: string;
  clientId: string;
  clientSecret: string;
}

export interface BankCredentialResponse {
  success: boolean;
  message: string;
  status: string;
}

export const paymentService = {
  notify: async (
    payload: PaymentNotifyPayload,
  ): Promise<PaymentNotifyResponse> => {
    return apiPost<PaymentNotifyResponse, PaymentNotifyPayload>(
      "/payments/notify",
      payload,
      { accept: "*/*" },
    );
  },

  generateQr: async (
    payload: GenerateQrPayload,
    authToken: string,
  ): Promise<GenerateQrResponse> => {
    return apiPost<GenerateQrResponse, GenerateQrPayload>(
      "/payments/qr/generate",
      payload,
      { authToken, accept: "*/*" },
    );
  },

  generateBakongQr: async (
    payload: GenerateQrPayload,
    authToken: string,
  ): Promise<BakongQrGenerateResponse> => {
    const response = await apiPost<
      BakongQrGenerateResponse | { payload: BakongQrGenerateResponse },
      GenerateQrPayload
    >("/payments/bakong/qr/generate", payload, {
      authToken,
      accept: "*/*",
    });

    if ("payload" in response) {
      return response.payload;
    }

    return response;
  },

  checkBakongPayment: async (
    paymentIntentId: string,
    authToken: string,
  ): Promise<BakongPaymentStatusResponse> => {
    const response = await apiGet<
      BakongPaymentStatusResponse | { payload: BakongPaymentStatusResponse }
    >(`/payments/bakong/check/${paymentIntentId}`, {
      authToken,
      accept: "*/*",
    });

    if ("payload" in response) {
      return response.payload;
    }

    return response;
  },

  mockConfirmBakongPayment: async (
    paymentIntentId: string,
    authToken: string,
  ): Promise<BakongPaymentStatusResponse> => {
    const response = await apiPost<
      BakongPaymentStatusResponse | { payload: BakongPaymentStatusResponse },
      Record<string, never>
    >(
      `/payments/bakong/mock/confirm/${paymentIntentId}`,
      {},
      {
        authToken,
        accept: "*/*",
      },
    );

    if ("payload" in response) {
      return response.payload;
    }

    return response;
  },

  getMyTransactions: async (authToken: string): Promise<Transaction[]> => {
    const response = await apiGet<TransactionsResponse>(
      "/payments/transactions/me",
      { authToken, accept: "*/*" },
    );
    return response.payload;
  },

  getAllTransactions: async (authToken: string): Promise<Transaction[]> => {
    const response = await apiGet<TransactionsResponse>(
      "/payments/transactions",
      { authToken, accept: "*/*" },
    );
    return response.payload || [];
  },

  getTransactionByBillNo: async (
    billNo: string,
    authToken: string,
  ): Promise<Transaction | undefined> => {
    const transactions = await paymentService.getMyTransactions(authToken);
    return transactions.find((t) => t.billNo === billNo);
  },

  connectBankCredential: async (
    payload: BankCredentialPayload,
    authToken: string,
  ): Promise<BankCredentialResponse> => {
    return apiPost<BankCredentialResponse, BankCredentialPayload>(
      "/payments/credential",
      payload,
      { authToken, accept: "application/json" },
    );
  },
};