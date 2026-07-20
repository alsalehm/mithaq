"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import AppShell from "../../../components/AppShell";

type PaymentStatus = "loading" | "success" | "error";

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentResultLoading />}>
      <PaymentResultContent />
    </Suspense>
  );
}

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [message, setMessage] = useState(
    "جاري التحقق من عملية الدفع وتفعيل اشتراكك."
  );

  useEffect(() => {
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      setStatus("error");
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

        const responseText = await response.text();

        if (!responseText) {
          throw new Error("لم يصل رد صالح من خادم التحقق.");
        }

        let result: {
          success?: boolean;
          message?: string;
        };

        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error("تعذر قراءة نتيجة التحقق من عملية الدفع.");
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "تعذر التحقق من عملية الدفع."
          );
        }

        setStatus("success");
        setMessage(
          "تم تفعيل اشتراكك الاحترافي بنجاح. سيتم تحويلك إلى صفحة الاشتراك."
        );

        const redirectTimer = window.setTimeout(() => {
          router.replace("/dashboard/subscription");
        }, 2000);

        return () => window.clearTimeout(redirectTimer);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء التحقق من عملية الدفع."
        );
      }
    }

    verify();
  }, [router, searchParams]);

  return (
    <AppShell>
      <div
        dir="rtl"
        className="flex min-h-[65vh] items-center justify-center px-4"
      >
        <section className="w-full max-w-xl overflow-hidden rounded-[32px] border border-[var(--mithaq-border)] bg-white p-7 text-center shadow-[0_28px_80px_rgba(42,26,12,0.18)] sm:p-10">
          <StatusIcon status={status} />

          <p className="mt-6 text-sm font-black text-[var(--mithaq-primary)]">
            الدفع والاشتراك
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--mithaq-text)]">
            {status === "success"
              ? "تم تفعيل اشتراكك"
              : status === "error"
                ? "تعذر إتمام العملية"
                : "جاري التحقق من الدفع"}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-[var(--mithaq-muted)]">
            {message}
          </p>

          {status === "loading" && (
            <div className="mt-7 rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-4">
              <div className="flex items-center justify-center gap-3">
                <ShieldCheck
                  size={20}
                  className="text-[var(--mithaq-primary)]"
                />

                <p className="text-sm font-bold text-[var(--mithaq-text)]">
                  لا تغلق الصفحة أثناء التحقق
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-black text-emerald-700">
                اشتراكك الاحترافي أصبح نشطًا
              </p>
            </div>
          )}

          {status === "error" && (
            <button
              type="button"
              onClick={() => router.replace("/dashboard/subscription")}
              className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--mithaq-primary)] px-6 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 sm:w-auto"
            >
              العودة إلى إدارة الاشتراك
            </button>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function StatusIcon({ status }: { status: PaymentStatus }) {
  if (status === "success") {
    return (
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
        <CheckCircle2 size={34} />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600">
        <CircleAlert size={34} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
      <LoaderCircle className="animate-spin" size={34} />
    </div>
  );
}

function PaymentResultLoading() {
  return (
    <AppShell>
      <div
        dir="rtl"
        className="flex min-h-[65vh] items-center justify-center px-4"
      >
        <section className="w-full max-w-xl rounded-[32px] border border-[var(--mithaq-border)] bg-white p-7 text-center shadow-[0_28px_80px_rgba(42,26,12,0.18)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
            <LoaderCircle className="animate-spin" size={34} />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-[var(--mithaq-text)]">
            جاري تحميل نتيجة الدفع
          </h1>

          <p className="mt-4 text-sm leading-8 text-[var(--mithaq-muted)]">
            يتم تجهيز بيانات عملية الدفع.
          </p>
        </section>
      </div>
    </AppShell>
  );
}