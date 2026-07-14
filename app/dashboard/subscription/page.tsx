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
        <section className="rounded-[28px] border border-[var(--mithaq-border)] bg-white/75 p-5 shadow-[var(--mithaq-shadow-sm)] backdrop-blur sm:rounded-[32px] sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                الاشتراك والفوترة
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--mithaq-text)] sm:text-4xl">
                إدارة اشتراكك
              </h1>

              <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                تابع باقتك الحالية وتفاصيل التجديد وإمكانية الترقية.
              </p>
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
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--mithaq-primary)] px-6 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--mithaq-primary-dark)] sm:w-auto"
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

          <article className="rounded-[30px] border border-[var(--mithaq-border)] bg-white p-6 shadow-[var(--mithaq-shadow-sm)] sm:rounded-[34px] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
              <Sparkles size={24} />
            </div>

            <h2 className="mt-5 text-xl font-black text-[var(--mithaq-text)]">
              الباقة الاحترافية
            </h2>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-black text-[var(--mithaq-text)]">
                49
              </span>

              <span className="pb-1 text-sm font-bold text-[var(--mithaq-muted)]">
                ريال شهريًا
              </span>
            </div>

            <ul className="mt-7 space-y-4">
              <ProFeature text="عقود غير محدودة" />
              <ProFeature text="عملاء وفواتير غير محدودة" />
              <ProFeature text="الاستشارات القانونية" />
              <ProFeature text="جميع المزايا الحالية والمستقبلية" />
            </ul>
          </article>
        </section>

        <section className="rounded-[28px] border border-[var(--mithaq-border)] bg-white p-5 shadow-[var(--mithaq-shadow-sm)] sm:rounded-[32px] sm:p-6">
          <h2 className="text-xl font-black text-[var(--mithaq-text)]">
            معلومات الفوترة
          </h2>

          <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
            ستظهر هنا لاحقًا تفاصيل وسيلة الدفع وسجل المدفوعات والفواتير بعد
            إتمام أول اشتراك.
          </p>
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