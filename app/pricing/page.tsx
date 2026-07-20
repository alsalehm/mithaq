"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Crown,
  FileText,
  Sparkles,
  X,
} from "lucide-react";
import { getPlans } from "../lib/billing/plans";
import { Plan } from "../lib/billing/types";

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await getPlans();
        setPlans(data);
      } catch (error) {
        console.error("Failed to load pricing plans:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  const freePlan = plans.find((plan) => plan.slug === "free");
  const proPlan = plans.find((plan) => plan.slug === "pro");

  const freeContractsLimit = freePlan?.contracts_limit ?? 3;
  const proPrice = proPlan?.price_monthly ?? 49;
  const currency = proPlan?.currency ?? "SAR";

  return (
    <main dir="rtl" className="min-h-screen bg-white text-[#2A1A0C]">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <header className="mb-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#E7D6C2] bg-white px-5 py-3 text-sm font-bold text-[#75532F] transition hover:-translate-y-0.5 hover:bg-[#EFE0CF]"
          >
            <ArrowLeft size={16} />
            العودة للرئيسية
          </Link>

          <div className="text-left">
            <h1 className="text-3xl font-black text-[#75532F]">ميثاق</h1>

            <p className="mt-1 text-xs tracking-[0.35em] text-[#B59676]">
              MITHAQ
            </p>
          </div>
        </header>

        <section className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-3xl border border-[#E7D6C2] bg-white text-[#75532F] shadow-sm">
            <Sparkles size={31} />
          </div>

          <p className="text-sm font-black text-[#75532F]">
            الأسعار والاشتراكات
          </p>

          <h2 className="mt-5 text-4xl font-black leading-[1.35] tracking-tight text-[#2A1A0C] sm:text-5xl md:text-6xl">
            اختر الباقة المناسبة وابدأ بإدارة أعمالك باحترافية
          </h2>
        </section>

        <section id="plans" className="scroll-mt-10 pt-16">
          {loading ? (
            <div className="rounded-[32px] border border-[#E7D6C2] bg-white p-10 text-center shadow-[0_24px_70px_rgba(42,26,12,0.18)]">
              <p className="font-bold text-[#75532F]">
                جاري تحميل الباقات...
              </p>
            </div>
          ) : (
            <div className="grid items-stretch gap-8 lg:grid-cols-2">
              <article className="flex flex-col rounded-[36px] border border-[#E7D6C2] bg-white p-7 shadow-[0_30px_85px_rgba(42,26,12,0.24),0_10px_30px_rgba(42,26,12,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_38px_100px_rgba(42,26,12,0.30),0_14px_36px_rgba(42,26,12,0.18)] sm:p-9">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F1E8] text-[#75532F]">
                  <FileText size={28} />
                </div>

                <h3 className="text-3xl font-black text-[#2A1A0C]">
                  الباقة المجانية
                </h3>

                <p className="mt-2 text-xs font-black tracking-[0.22em] text-[#B59676]">
                  FREE
                </p>

                <div className="mt-8 border-b border-[#EFE4D7] pb-8">
                  <p className="text-5xl font-black leading-none text-[#2A1A0C] sm:text-6xl">
                    مجانية
                  </p>
                </div>

                <p className="mt-7 min-h-[64px] text-sm leading-8 text-[#6B5A49]">
                  ابدأ باستخدام ميثاق، واستفد من الأدوات الأساسية لإدارة
                  أعمالك.
                </p>

                <ul className="mt-8 flex-1 space-y-4 text-sm">
                  <Feature
                    ok
                    text={`حتى ${freeContractsLimit} عقود مدى الحياة`}
                  />
                  <Feature ok text="إدارة العملاء" />
                  <Feature ok text="إدارة الفواتير" />
                  <Feature ok text="التوقيع الإلكتروني" />
                  <Feature ok text="تحميل ملفات PDF" />
                  <Feature text="الاستشارات القانونية" />
                </ul>

                <Link
                  href="/signup"
                  className="mt-9 block rounded-2xl border border-[#D8BFA3] bg-white px-6 py-4 text-center text-sm font-black text-[#75532F] transition hover:-translate-y-0.5 hover:bg-[#EFE0CF]"
                >
                  ابدأ مجانًا
                </Link>
              </article>

              <article className="relative flex flex-col overflow-hidden rounded-[36px] border border-[#75532F] bg-[#2A1A0C] p-7 text-white shadow-[0_34px_95px_rgba(42,26,12,0.42),0_12px_34px_rgba(42,26,12,0.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_42px_115px_rgba(42,26,12,0.50),0_16px_42px_rgba(42,26,12,0.30)] sm:p-9">
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

                <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#B59676]/30 blur-3xl" />

                <div className="relative flex h-full flex-col">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#F5E9DC]">
                    <Crown size={30} />
                  </div>

                  <h3 className="mt-8 text-3xl font-black text-white">
                    الباقة الاحترافية
                  </h3>

                  <p className="mt-2 text-xs font-black tracking-[0.22em] text-[#D8BFA3]">
                    PRO
                  </p>

                  <div className="mt-8 border-b border-white/10 pb-8">
                    <div className="flex items-end gap-3">
                      <span className="text-6xl font-black leading-none sm:text-7xl">
                        {proPrice}
                      </span>

                      <span className="pb-1 text-xl font-black text-white">
                        {currency === "SAR" ? "ريال" : currency}
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
                    <Feature dark ok text="عقود غير محدودة" />
                    <Feature dark ok text="عملاء غير محدودين" />
                    <Feature dark ok text="فواتير غير محدودة" />
                    <Feature dark ok text="استشارات قانونية" />
                    <Feature dark ok text="جميع المزايا الحالية" />
                    <Feature dark ok text="جميع المزايا المستقبلية" />
                  </ul>

                  <Link
                    href="/login"
                    className="mt-9 block rounded-2xl bg-[#F5E9DC] px-6 py-4 text-center text-sm font-black text-[#2A1A0C] shadow-lg transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    ابدأ مع Pro
                  </Link>
                </div>
              </article>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Feature({
  text,
  ok = false,
  dark = false,
}: {
  text: string;
  ok?: boolean;
  dark?: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          ok
            ? dark
              ? "bg-white/15 text-[#F5E9DC]"
              : "bg-[#EFE0CF] text-[#75532F]"
            : "bg-red-50 text-red-500"
        }`}
      >
        {ok ? <Check size={15} /> : <X size={15} />}
      </span>

      <span className={dark ? "text-[#F5E9DC]/90" : "text-[#2A1A0C]"}>
        {text}
      </span>
    </li>
  );
}