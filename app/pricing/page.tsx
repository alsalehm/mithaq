"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  Crown,
  FileSignature,
  FileText,
  ReceiptText,
  Scale,
  Sparkles,
  UsersRound,
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
    <main dir="rtl" className="min-h-screen bg-[#F8F1E8] text-[#2A1A0C]">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <header className="mb-20 flex items-center justify-between">
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
            في ميثاق... كل ما تحتاجه لإدارة أعمالك، في منصة واحدة.
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#6B5A49] sm:text-lg sm:leading-9">
            ابدأ مجانًا، واستمتع بتجربة سهلة واحترافية لإدارة أعمالك. وعندما
            تحتاج إلى مزايا أكثر، يمكنك الترقية إلى Pro في أي وقت.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#75532F] px-7 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#5F4225] sm:w-auto"
            >
              أنشئ حسابك مجانًا
            </Link>

            <a
              href="#plans"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-[#D8BFA3] bg-white px-7 py-4 text-sm font-black text-[#75532F] transition hover:-translate-y-0.5 hover:bg-[#EFE0CF] sm:w-auto"
            >
              عرض الباقات
            </a>
          </div>
        </section>

        <section className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black text-[#75532F]">
              تجربة متكاملة للمستقل
            </p>

            <h3 className="mt-3 text-5xl font-black leading-tight tracking-tight text-[#2A1A0C] lg:text-6xl">
              كل ما تحتاجه... في مكان واحد.
            </h3>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-9 text-[#6B5A49]">
              أنشئ العقود، وأدر العملاء والفواتير، ووقّع العقود إلكترونيًا،
              واحصل على استشارات قانونية... كل ذلك من مكان واحد، في تجربة
              صُممت خصيصًا للمستقلين.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <ValueCard
              icon={<FileText size={32} />}
              title="العقود"
              description="أنشئ عقودًا احترافية خلال دقائق، وأرسلها لعملائك للتوقيع الإلكتروني بكل سهولة."
            />

            <ValueCard
              icon={<UsersRound size={32} />}
              title="العملاء"
              description="احتفظ بجميع بيانات عملائك في مكان واحد، مع وصول سريع إلى تفاصيلهم وعقودهم."
            />

            <ValueCard
              icon={<ReceiptText size={32} />}
              title="الفواتير"
              description="أنشئ الفواتير، وتابع المدفوعات والمبالغ المتبقية بسهولة ووضوح."
            />

            <ValueCard
              icon={<FileSignature size={32} />}
              title="التوقيع الإلكتروني"
              description="دع عملاءك يوقعون العقود إلكترونيًا من أي جهاز، دون الحاجة إلى الطباعة أو الحضور."
            />

            <ValueCard
              icon={<Scale size={32} />}
              title="الاستشارات القانونية"
              description="احصل على استشارات قانونية مباشرة من داخل ميثاق عندما تحتاج إليها."
              badge="متوفر في Pro"
              highlighted
            />

            <ValueCard
              icon={<BriefcaseBusiness size={32} />}
              title="مصمم للمستقلين"
              description="مهما كان تخصصك، صُمم ميثاق ليساعدك على تنظيم أعمالك وإدارتها باحترافية، لتتفرغ لما تتقنه."
            />
          </div>
        </section>

        <section id="plans" className="scroll-mt-10 pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black text-[#75532F]">باقات واضحة</p>

            <h3 className="mt-3 text-4xl font-black tracking-tight text-[#2A1A0C] sm:text-5xl">
              اختر الباقة المناسبة لك.
            </h3>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6B5A49]">
              باقة مجانية للبدء، وباقة احترافية تتيح لك استخدام جميع أدوات
              ميثاق دون قيود.
            </p>
          </div>

          {loading ? (
            <div className="mt-12 rounded-[32px] border border-[#E7D6C2] bg-white p-10 text-center shadow-sm">
              <p className="font-bold text-[#75532F]">
                جاري تحميل الباقات...
              </p>
            </div>
          ) : (
            <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-2">
              <article className="flex flex-col rounded-[36px] border border-[#E7D6C2] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F1E8] text-[#75532F]">
                  <FileText size={28} />
                </div>

                <h4 className="text-3xl font-black text-[#2A1A0C]">
                  الباقة المجانية
                </h4>

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

              <article className="relative flex flex-col overflow-hidden rounded-[36px] border border-[#75532F] bg-[#2A1A0C] p-7 text-white shadow-[0_24px_70px_rgba(42,26,12,0.26)] transition duration-300 hover:-translate-y-1 sm:p-9">
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#B59676]/30 blur-3xl" />

                <div className="relative flex h-full flex-col">
                  <div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#F5E9DC]">
                      <Crown size={30} />
                    </div>
                  </div>

                  <h4 className="mt-8 text-3xl font-black text-white">
                    الباقة الاحترافية
                  </h4>

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

                    <p className="mt-3 text-sm text-[#F5E9DC]/65">شهريًا</p>
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

        <section className="mt-24 rounded-[36px] border border-[#E7D6C2] bg-white p-7 shadow-sm sm:p-9">
          <div className="mb-9">
            <p className="text-sm font-black text-[#75532F]">
              مقارنة الباقات
            </p>

            <h3 className="mt-2 text-3xl font-black text-[#2A1A0C]">
              قارن واختر بثقة.
            </h3>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#E7D6C2]">
            <CompareRow
              title="العقود"
              free={`${freeContractsLimit} مدى الحياة`}
              pro="غير محدود"
            />
            <CompareRow title="العملاء" free="متاح" pro="غير محدود" />
            <CompareRow title="الفواتير" free="متاح" pro="غير محدود" />
            <CompareRow title="التوقيع الإلكتروني" free="متاح" pro="متاح" />
            <CompareRow title="تحميل PDF" free="متاح" pro="متاح" />
            <CompareRow
              title="الاستشارات القانونية"
              free="غير متاح"
              pro="متاح"
            />
          </div>
        </section>

        <section className="mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black text-[#75532F]">
              الأسئلة الشائعة
            </p>

            <h3 className="mt-3 text-4xl font-black tracking-tight text-[#2A1A0C]">
              لديك سؤال؟
            </h3>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <FAQ
              question="هل يمكنني تغيير الباقة لاحقًا؟"
              answer="نعم، يمكنك الترقية إلى الباقة الاحترافية أو العودة إلى الباقة المجانية في أي وقت."
            />

            <FAQ
              question="هل تُحذف بياناتي عند انتهاء الاشتراك؟"
              answer="لا، تبقى بياناتك محفوظة ويمكنك الرجوع إلى أعمالك السابقة في أي وقت."
            />

            <FAQ
              question="هل يمكنني الترقية لاحقًا؟"
              answer="نعم، يمكنك البدء مجانًا ثم الترقية إلى Pro عندما تحتاج إلى مزايا إضافية."
            />
          </div>
        </section>

        <section className="relative mt-24 overflow-hidden rounded-[38px] bg-[#75532F] p-9 text-center text-white shadow-[0_24px_70px_rgba(117,83,47,0.25)] sm:p-14">
          <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#2A1A0C]/25 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-black text-[#F5E9DC]/80">
              خطوتك الأولى تبدأ هنا
            </p>

            <h3 className="mt-3 text-4xl font-black sm:text-5xl">
              ابدأ اليوم مع ميثاق.
            </h3>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#F5E9DC]">
              أنشئ حسابك مجانًا، وابدأ في إدارة أعمالك بطريقة أكثر تنظيمًا
              واحترافية.
            </p>

            <Link
              href="/signup"
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-sm font-black text-[#75532F] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#F5E9DC]"
            >
              إنشاء حساب مجاني
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function ValueCard({
  icon,
  title,
  description,
  badge,
  highlighted = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  highlighted?: boolean;
}) {
  return (
    <article
      className={`group relative min-h-[245px] overflow-hidden rounded-[34px] border p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        highlighted
          ? "border-[#C9AA88] bg-[#FFFDFC]"
          : "border-[#E7D6C2] bg-white"
      }`}
    >
      {highlighted && (
        <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#EFE0CF]/60 blur-3xl" />
      )}

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EFE0CF] text-[#75532F] transition duration-300 group-hover:scale-105">
            {icon}
          </div>

          {badge && (
            <span className="rounded-full bg-[#75532F] px-3 py-1.5 text-[11px] font-black text-white">
              {badge}
            </span>
          )}
        </div>

        <h4 className="mt-6 text-2xl font-black text-[#2A1A0C]">{title}</h4>

        <p className="mt-3 text-[15px] leading-8 text-[#6B5A49]">
          {description}
        </p>
      </div>
    </article>
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

function CompareRow({
  title,
  free,
  pro,
}: {
  title: string;
  free: string;
  pro: string;
}) {
  return (
    <div className="grid grid-cols-[1.15fr_0.9fr_0.9fr] border-b border-[#E7D6C2] last:border-b-0">
      <div className="bg-[#F8F1E8] p-4 text-sm font-black text-[#2A1A0C] sm:p-5">
        {title}
      </div>

      <div className="p-4 text-sm text-[#6B5A49] sm:p-5">{free}</div>

      <div className="bg-[#FFFCF8] p-4 text-sm font-black text-[#75532F] sm:p-5">
        {pro}
      </div>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <article className="rounded-[28px] border border-[#E7D6C2] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <h4 className="text-lg font-black text-[#2A1A0C]">{question}</h4>

      <p className="mt-4 text-sm leading-7 text-[#6B5A49]">{answer}</p>
    </article>
  );
}