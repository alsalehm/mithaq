"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "../../../components/AppShell";

export default function PaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState("جاري التحقق من عملية الدفع...");

  useEffect(() => {
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      setMessage("لم يتم العثور على رقم عملية الدفع.");
      return;
    }

    async function verify() {
      try {
        const response = await fetch("/api/subscription/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        setMessage("✅ تم تفعيل اشتراكك بنجاح.");

        setTimeout(() => {
          router.replace("/dashboard/subscription");
        }, 2000);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء التحقق من الدفع."
        );
      }
    }

    verify();
  }, [router, searchParams]);

  return (
    <AppShell>
      <div
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center"
      >
        <div className="mithaq-card-premium max-w-lg rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-black mb-4">
            التحقق من عملية الدفع
          </h1>

          <p className="text-base">{message}</p>
        </div>
      </div>
    </AppShell>
  );
}