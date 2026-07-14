import { NextResponse } from "next/server";

export async function GET() {
  const secretKey = process.env.MOYASAR_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      {
        success: false,
        message: "MOYASAR_SECRET_KEY غير موجود داخل .env.local",
      },
      { status: 500 }
    );
  }

  try {
    const auth = Buffer.from(`${secretKey}:`).toString("base64");

    const response = await fetch(
      "https://api.moyasar.com/v1/payments?per=1",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      return NextResponse.json(
        {
          success: false,
          message: "فشل الاتصال بمُيسر",
          status: response.status,
          error: errorData,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم الاتصال بمُيسر بنجاح باستخدام Test Secret Key",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء الاتصال بمُيسر",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}