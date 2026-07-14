"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import AppShell from "../../../components/AppShell";
import { supabase } from "../../../lib/supabase";
import {
  ensureFreeSubscription,
  getUserSubscription,
} from "../../../lib/billing/subscription";

declare global {
  interface Window {
    Moyasar?: {
      init: (options: Record<string, unknown>) => void;
    };
  }
}

const PRO_PRICE_IN_HALALAS = 4900;

export default function SubscriptionCheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const formInitialized = useRef(false);

  const publishableKey =
    process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY ?? "";

  const loadCheckout = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        window.location.href = "/login";
        return;
      }

      let currentSubscription = await getUserSubscription(user.id);

      if (!currentSubscription) {
        currentSubscription = await ensureFreeSubscription(user.id);
      }

      if (!currentSubscription) {
        throw new Error("تعذر تحميل بيانات اشتراكك.");
      }

      if (currentSubscription.isPro) {
        window.location.href = "/dashboard/subscription";
        return;
      }

      setUserId(user.id);
    } catch (error) {
      console.error("Failed to prepare checkout:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر تجهيز صفحة الدفع."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCheckout();
  }, [loadCheckout]);

  useEffect(() => {
    if (
      loading ||
      !scriptLoaded ||
      !userId ||
      !publishableKey ||
      !window.Moyasar ||
      formInitialized.current
    ) {
      return;
    }

    formInitialized.current = true;

    const callbackUrl = `${window.location.origin}/dashboard/subscription/payment-result`;


window.Moyasar.init({
  element: ".mysr-form",
  amount: PRO_PRICE_IN_HALALAS,
  currency: "SAR",
  description: "اشتراك ميثاق الاحترافي - شهر واحد",
  publishable_api_key: publishableKey,
  callback_url: callbackUrl,
  methods: ["creditcard"],
  supported_networks: ["mada", "visa", "mastercard"],
  language: "ar",
  fixed_width: false,
  metadata: {
    user_id: userId,
    plan: "pro",
    billing_period: "monthly",
  },
  credit_card: {
    save_card: true,
  },
});

  }, [loading, publishableKey, scriptLoaded, userId]);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 sm:px-6">
          <div className="mithaq-card-premium w-full max-w-md rounded-[28px] p-6 text-center sm:rounded-[32px] sm:p-8">
            <LoaderCircle
              className="mx-auto animate-spin text-[var(--mithaq-primary)]"
              size={34}
            />

            <p className="mt-5 text-lg font-black text-[var(--mithaq-text)]">
              جاري تجهيز صفحة الدفع
            </p>

            <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
              يتم التحقق من حسابك وباقتك الحالية.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Script
        src="https://cdn.moyasar.com/mpf/1.15.0/moyasar.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() =>
          setErrorMessage("تعذر تحميل نموذج الدفع من مُيسر.")
        }
      />

      <AppShell>
        <div dir="rtl" className="space-y-6 sm:space-y-8">
          <section className="rounded-[28px] border border-[var(--mithaq-border)] bg-white/75 p-5 shadow-[var(--mithaq-shadow-sm)] backdrop-blur sm:rounded-[32px] sm:p-6">
            <Link
              href="/dashboard/subscription"
              className="inline-flex items-center gap-2 text-sm font-black text-[var(--mithaq-primary)] transition hover:opacity-75"
            >
              <ArrowRight size={17} />
              العودة إلى إدارة الاشتراك
            </Link>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black text-[var(--mithaq-primary)]">
                  الدفع الآمن
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--mithaq-text)] sm:text-4xl">
                  الترقية إلى الباقة الاحترافية
                </h1>

                <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                  أكمل بيانات الدفع لتفعيل اشتراك ميثاق الاحترافي.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                <CreditCard size={28} />
              </div>
            </div>
          </section>

          {errorMessage ? (
            <section className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center">
              <p className="font-black text-red-700">
                تعذر تجهيز عملية الدفع
              </p>

              <p className="mt-3 text-sm leading-7 text-red-600">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-2xl bg-red-700 px-6 py-3 text-sm font-black text-white"
              >
                المحاولة مرة أخرى
              </button>
            </section>
          ) : (
            <section className="grid items-start gap-6 lg:grid-cols-[0.7fr_1.3fr]">
              <article className="rounded-[30px] border border-[var(--mithaq-border)] bg-white p-6 shadow-[var(--mithaq-shadow-sm)] sm:rounded-[34px] sm:p-8">
                <p className="text-sm font-black text-[var(--mithaq-primary)]">
                  ملخص الاشتراك
                </p>

                <h2 className="mt-3 text-2xl font-black text-[var(--mithaq-text)]">
                  الباقة الاحترافية
                </h2>

                <div className="mt-6 border-y border-[var(--mithaq-border)] py-6">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-[var(--mithaq-text)]">
                      49
                    </span>

                    <span className="pb-1 text-sm font-bold text-[var(--mithaq-muted)]">
                      ريال شهريًا
                    </span>
                  </div>
                </div>

                <ul className="mt-7 space-y-4">
                  <CheckoutFeature text="عقود غير محدودة" />
                  <CheckoutFeature text="عملاء وفواتير غير محدودة" />
                  <CheckoutFeature text="الاستشارات القانونية" />
                  <CheckoutFeature text="جميع المزايا الحالية والمستقبلية" />
                </ul>

                <div className="mt-8 rounded-2xl bg-[var(--mithaq-surface-soft)] p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      className="mt-0.5 shrink-0 text-[var(--mithaq-primary)]"
                      size={20}
                    />

                    <p className="text-sm leading-7 text-[var(--mithaq-muted)]">
                      تتم معالجة بيانات البطاقة عبر مُيسر، ولا يقوم ميثاق
                      بحفظ بيانات بطاقتك.
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[30px] border border-[var(--mithaq-border)] bg-white p-5 shadow-[var(--mithaq-shadow-sm)] sm:rounded-[34px] sm:p-8">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                    <LockKeyhole size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-[var(--mithaq-text)]">
                      بيانات الدفع
                    </h2>

                    <p className="mt-1 text-sm text-[var(--mithaq-muted)]">
                      أنت الآن في بيئة الاختبار.
                    </p>
                  </div>
                </div>

                {!scriptLoaded && (
                  <div className="flex min-h-48 items-center justify-center">
                    <LoaderCircle
                      className="animate-spin text-[var(--mithaq-primary)]"
                      size={30}
                    />
                  </div>
                )}

                <div className="mysr-form" />
              </article>
            </section>
          )}
        </div>
      </AppShell>
    </>
  );
}

function CheckoutFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-[var(--mithaq-text)]">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
        <Check size={15} />
      </span>

      <span>{text}</span>
    </li>
  );
}