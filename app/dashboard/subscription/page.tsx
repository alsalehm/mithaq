"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Crown,
  FileText,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import AppShell from "../../components/AppShell";
import { supabase } from "../../lib/supabase";
import {
  ensureFreeSubscription,
  getUserSubscription,
  type UserSubscription,
} from "../../lib/billing/subscription";

function formatDate(value: string | null) {
  if (!value) {
    return "غير محدد";
  }

  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export default function SubscriptionPage() {
  const [userSubscription, setUserSubscription] =
    useState<UserSubscription | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadSubscription = useCallback(async () => {
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

      let subscription = await getUserSubscription(user.id);

      if (!subscription) {
        subscription = await ensureFreeSubscription(user.id);
      }

      if (!subscription) {
        throw new Error("تعذر إنشاء أو تحميل اشتراك المستخدم.");
      }

      setUserSubscription(subscription);
    } catch (error) {
      console.error("Failed to load subscription:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تحميل بيانات الاشتراك."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 sm:px-6">
          <div className="mithaq-card-premium w-full max-w-md rounded-[28px] p-6 text-center sm:rounded-[32px] sm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
              <LoaderCircle className="animate-spin" size={28} />
            </div>

            <p className="text-lg font-black text-[var(--mithaq-text)]">
              جاري تحميل الاشتراك
            </p>

            <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
              يتم تجهيز معلومات باقتك الحالية.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (errorMessage || !userSubscription) {
    return (
      <AppShell>
        <div
          dir="rtl"
          className="mx-auto max-w-3xl rounded-[28px] border border-red-200 bg-red-50 p-6 text-center sm:rounded-[32px] sm:p-8"
        >
          <p className="text-lg font-black text-red-700">
            تعذر تحميل بيانات الاشتراك
          </p>

          <p className="mt-3 text-sm leading-7 text-red-600">
            {errorMessage || "لم نتمكن من العثور على الاشتراك الحالي."}
          </p>

          <button
            type="button"
            onClick={loadSubscription}
            className="mt-6 rounded-2xl bg-red-700 px-6 py-3 text-sm font-black text-white transition hover:bg-red-800"
          >
            المحاولة مرة أخرى
          </button>
        </div>
      </AppShell>
    );
  }

  const { subscription, plan, isPro, isExpired } = userSubscription;

  return (
    <AppShell>
     <div dir="rtl" className="space-y-6 sm:space-y-8">
  <section className="rounded-[28px] border border-[var(--mithaq-border)] bg-white/75 px-6 py-5 shadow-[var(--mithaq-shadow-sm)] backdrop-blur sm:rounded-[32px]">
    <div className="flex items-center justify-between">
      <div>
        

        <h1 className="mt-1 text-3xl font-black tracking-tight text-[var(--mithaq-text)]">
          إدارة اشتراكك
        </h1>

        
      </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
              <Crown size={28} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <article
            className={`relative overflow-hidden rounded-[30px] border p-6 shadow-[var(--mithaq-shadow-sm)] sm:rounded-[34px] sm:p-8 ${
              isPro
                ? "border-[#75532F] bg-[#2A1A0C] text-white"
                : "border-[var(--mithaq-border)] bg-white"
            }`}
          >
            {isPro && (
              <>
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[#B59676]/30 blur-3xl" />
              </>
            )}

            <div className="relative">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      isPro
                        ? "bg-white/10 text-[#F5E9DC]"
                        : "bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]"
                    }`}
                  >
                    {isPro ? <Crown size={29} /> : <FileText size={28} />}
                  </div>

                  <p
                    className={`mt-6 text-sm font-black ${
                      isPro
                        ? "text-[#D8BFA3]"
                        : "text-[var(--mithaq-primary)]"
                    }`}
                  >
                    باقتك الحالية
                  </p>

                  <h2
                    className={`mt-2 text-3xl font-black sm:text-4xl ${
                      isPro ? "text-white" : "text-[var(--mithaq-text)]"
                    }`}
                  >
                    {plan.name}
                  </h2>

                  <p
                    className={`mt-3 max-w-xl text-sm leading-7 ${
                      isPro
                        ? "text-[#F5E9DC]/75"
                        : "text-[var(--mithaq-muted)]"
                    }`}
                  >
                    {isPro
                      ? "جميع أدوات ميثاق متاحة لك دون قيود."
                      : `يمكنك إنشاء حتى ${
                          plan.contracts_limit ?? 3
                        } عقود والاستفادة من الأدوات الأساسية.`}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-xs font-black ${
                    isPro
                      ? "bg-white/10 text-[#F5E9DC]"
                      : "bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]"
                  }`}
                >
                  {isExpired
                    ? "منتهي"
                    : subscription.status === "active"
                      ? "نشط"
                      : "مجاني"}
                </span>
              </div>

              <div
                className={`mt-8 grid gap-4 border-t pt-6 sm:grid-cols-2 ${
                  isPro ? "border-white/10" : "border-[var(--mithaq-border)]"
                }`}
              >
                <SubscriptionDetail
                  dark={isPro}
                  icon={<CalendarDays size={20} />}
                  title="بداية الفترة"
                  value={
                    isPro
                      ? formatDate(subscription.current_period_start)
                      : "لا توجد دورة فوترة"
                  }
                />

                <SubscriptionDetail
                  dark={isPro}
                  icon={<CalendarDays size={20} />}
                  title="موعد التجديد"
                  value={
                    isPro
                      ? formatDate(subscription.current_period_end)
                      : "غير مطلوب"
                  }
                />
              </div>

              {!isPro && (
                <Link
                  href="/dashboard/subscription/checkout"
                  className="mt-50 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--mithaq-primary)] px-6 py-4 text-base font-black text-white shadow-lg transition hover:-translate-y-0.5 ]"
                >
                  الترقية إلى الباقة الاحترافية
                  <ArrowLeft size={17} />
                </Link>
              )}

              {isPro && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      className="mt-0.5 shrink-0 text-[#F5E9DC]"
                      size={21}
                    />

                    <div>
                      <p className="text-sm font-black text-white">
                        اشتراكك الاحترافي نشط
                      </p>

                      <p className="mt-1 text-sm leading-7 text-[#F5E9DC]/70">
                        يمكنك استخدام جميع أدوات ومزايا ميثاق.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>

          <article className="relative flex min-h-[680px] flex-col overflow-hidden rounded-[36px] border border-[#75532F] bg-[#2A1A0C] p-7 text-white shadow-[0_34px_95px_rgba(42,26,12,0.42),0_12px_34px_rgba(42,26,12,0.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_42px_115px_rgba(42,26,12,0.50),0_16px_42px_rgba(42,26,12,0.30)] sm:p-9">
  <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

  <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#B59676]/30 blur-3xl" />

  <div className="relative flex h-full flex-col">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#F5E9DC]">
      <Crown size={30} />
    </div>

    <h2 className="mt-8 text-3xl font-black text-white">
      الباقة الاحترافية
    </h2>

    <p className="mt-2 text-xs font-black tracking-[0.22em] text-[#D8BFA3]">
      PRO
    </p>

    <div className="mt-8 border-b border-white/10 pb-8">
      <div className="flex items-end gap-3">
        <span className="text-6xl font-black leading-none sm:text-7xl">
          49
        </span>

        <span className="pb-1 text-xl font-black text-white">
          ريال
        </span>
      </div>

      <p className="mt-3 text-sm text-[#F5E9DC]/65">
        شهريًا
      </p>
    </div>

    <p className="mt-7 min-h-[64px] text-sm leading-8 text-[#F5E9DC]/80">
      جميع أدوات ميثاق لإدارة أعمالك، دون قيود.
    </p>

    <ul className="mt-8 flex-1 space-y-4 text-sm">
      {[
        "عقود غير محدودة",
        "عملاء غير محدودين",
        "فواتير غير محدودة",
        "استشارات قانونية",
        "جميع المزايا الحالية",
        "جميع المزايا المستقبلية",
      ].map((feature) => (
        <li key={feature} className="flex items-center gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#F5E9DC]">
            <Check size={15} />
          </span>

          <span className="text-[#F5E9DC]/90">
            {feature}
          </span>
        </li>
      ))}
    </ul>
  </div>
</article>
        </section>

        
      </div>
    </AppShell>
  );
}

function SubscriptionDetail({
  icon,
  title,
  value,
  dark = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        dark
          ? "border border-white/10 bg-white/5"
          : "border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)]"
      }`}
    >
      <div
        className={`flex items-center gap-2 text-sm font-black ${
          dark ? "text-[#F5E9DC]" : "text-[var(--mithaq-primary)]"
        }`}
      >
        {icon}
        {title}
      </div>

      <p
        className={`mt-3 text-sm font-bold ${
          dark ? "text-white" : "text-[var(--mithaq-text)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ProFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-[var(--mithaq-text)]">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
        <Check size={15} />
      </span>

      <span>{text}</span>
    </li>
  );
}