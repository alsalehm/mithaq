
const MOYASAR_API_BASE_URL = "https://api.moyasar.com/v1";
export interface MoyasarPayment {
  id: string;
  status: string;
  amount: number;
  fee: number;
  currency: string;
  refunded: number;
  refunded_at: string | null;
  captured: number;
  captured_at: string | null;
  voided_at: string | null;
  description: string | null;
  invoice_id: string | null;
  ip: string | null;
  callback_url: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, string> | null;
  source?: {
    type?: string;
    company?: string;
    name?: string;
    number?: string;
    message?: string;
    reference_number?: string;
    token?: string;
  };
}

function getMoyasarSecretKey(): string {
  const secretKey = process.env.MOYASAR_SECRET_KEY;

  if (!secretKey) {
    throw new Error("MOYASAR_SECRET_KEY is not configured.");
  }

  return secretKey;
}

function getAuthorizationHeader(): string {
  const secretKey = getMoyasarSecretKey();
  const encodedKey = Buffer.from(`${secretKey}:`).toString("base64");

  return `Basic ${encodedKey}`;
}

async function parseMoyasarResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error?.message ||
      `Moyasar request failed with status ${response.status}.`;

    throw new Error(message);
  }

  return data as T;
}

export async function getMoyasarPayment(
  paymentId: string
): Promise<MoyasarPayment> {
  if (!paymentId) {
    throw new Error("Payment ID is required.");
  }

  const response = await fetch(
    `${MOYASAR_API_BASE_URL}/payments/${encodeURIComponent(paymentId)}`,
    {
      method: "GET",
      headers: {
        Authorization: getAuthorizationHeader(),
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  return parseMoyasarResponse<MoyasarPayment>(response);
}

export async function verifyMoyasarPayment(params: {
  paymentId: string;
  expectedAmount: number;
  expectedCurrency?: string;
  expectedUserId?: string;
}): Promise<MoyasarPayment> {
  const {
    paymentId,
    expectedAmount,
    expectedCurrency = "SAR",
    expectedUserId,
  } = params;

  const payment = await getMoyasarPayment(paymentId);

  if (payment.status !== "paid") {
    throw new Error("Payment has not been completed.");
  }

  if (payment.amount !== expectedAmount) {
    throw new Error("Payment amount does not match the expected amount.");
  }

  if (payment.currency.toUpperCase() !== expectedCurrency.toUpperCase()) {
    throw new Error("Payment currency does not match the expected currency.");
  }

  if (
    expectedUserId &&
    payment.metadata?.user_id !== expectedUserId
  ) {
    throw new Error("Payment does not belong to the expected user.");
  }

  return payment;
}