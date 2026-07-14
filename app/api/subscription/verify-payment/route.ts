import { NextRequest, NextResponse } from "next/server";
import { verifyMoyasarPayment } from "../../../lib/billing/moyasar";
import { supabaseAdmin } from "../../../lib/supabase-admin";
const PRO_PRICE_IN_HALALAS = 4900;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    const paymentId =
      typeof body?.paymentId === "string"
        ? body.paymentId.trim()
        : "";

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          message: "رقم عملية الدفع غير موجود.",
        },
        { status: 400 }
      );
    }

    const payment = await verifyMoyasarPayment({
      paymentId,
      expectedAmount: PRO_PRICE_IN_HALALAS,
      expectedCurrency: "SAR",
    });
const { error: subscriptionError } = await supabaseAdmin
  .from("subscriptions")
  .update({
    status: "active",
    plan_id: "2dfe1809-88cd-44b3-804a-939ec6b00348",
    provider: "moyasar",
    provider_subscription_id: payment.id,
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
  })
  .eq("user_id", String(payment.metadata?.user_id));

if (subscriptionError) {
  throw new Error(subscriptionError.message);
}

    return NextResponse.json({
      success: true,
      message: "تم التحقق من عملية الدفع بنجاح.",
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        description: payment.description,
        metadata: payment.metadata,
        createdAt: payment.created_at,
      },
    });
  } catch (error) {
    console.error("Payment verification failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "تعذر التحقق من عملية الدفع.",
      },
      { status: 400 }
    );
  }
}