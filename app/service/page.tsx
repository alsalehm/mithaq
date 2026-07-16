"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  ReceiptText,
  UsersRound,
  WalletCards,
} from "lucide-react";

const sections = [
  {
    title: "1. نبذة عن الخدمة",
    body: "ميثاق منصة إلكترونية عربية تساعد المستقلين على إدارة أعمالهم اليومية من خلال نظام متكامل لإدارة العملاء والعقود والفواتير والاشتراكات والاستشارات القانونية.",
  },
  {
    title: "2. الخدمات المتوفرة",
    body: "تشمل خدمات المنصة إنشاء العقود الإلكترونية، وإصدار الفواتير، ومتابعة المدفوعات، وإدارة بيانات العملاء، وتنظيم الأعمال في مكان واحد.",
  },
  {
    title: "3. آلية الاستخدام",
    body: "بعد إنشاء الحساب، يمكن للمستخدم اختيار الباقة المناسبة ثم استخدام الأدوات والمزايا المتاحة وفقًا لنوع الاشتراك الخاص به.",
  },
  {
    title: "4. الاشتراكات",
    body: "تقدم منصة ميثاق باقة مجانية وباقة احترافية مدفوعة، ويتم تفعيل الاشتراك المدفوع مباشرة بعد نجاح عملية الدفع.",
  },
  {
    title: "5. توفر الخدمة",
    body: "نعمل على توفير المنصة على مدار الساعة، مع إمكانية إجراء أعمال الصيانة والتحديثات عند الحاجة لتحسين الأداء واستقرار الخدمة.",
  },
];

export default function ServicePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#F7F3EE] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-black tracking-[0.35em] text-[#75532F]">
            MITHAQ
          </span>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-bold transition hover:bg-white"
          >
            العودة للرئيسية
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="overflow-hidden rounded-[28px] border bg-white">
          <header className="border-b p-10">
            <div className="mb-6 flex justify-end">
              <div className="rounded-2xl bg-[#F8F1E8] p-4">
                <BriefcaseBusiness className="text-[#75532F]" />
              </div>
            </div>

            <p className="text-sm font-bold text-[#75532F]">
              الخدمة والمنصة
            </p>

            <h1 className="mt-2 text-5xl font-black text-[#2A1A0C]">
              وصف الخدمة
            </h1>

            <p className="mt-4 leading-8 text-gray-600">
              توفر منصة ميثاق حلولًا رقمية لإدارة أعمال المستقلين، بما يشمل
              إدارة العملاء والعقود والفواتير والاشتراكات والاستشارات القانونية،
              من خلال منصة إلكترونية آمنة وسهلة الاستخدام.
            </p>
          </header>

          <div className="grid grid-cols-2 border-b sm:grid-cols-4">
            <div className="flex items-center justify-center gap-2 p-5">
              <UsersRound size={18} />
              إدارة العملاء
            </div>

            <div className="flex items-center justify-center gap-2 p-5">
              <FileText size={18} />
              العقود
            </div>

            <div className="flex items-center justify-center gap-2 p-5">
              <ReceiptText size={18} />
              الفواتير
            </div>

            <div className="flex items-center justify-center gap-2 p-5">
              <WalletCards size={18} />
              الاشتراكات
            </div>
          </div>

          <div className="space-y-5 p-8">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border p-6"
              >
                <h2 className="mb-3 text-2xl font-black text-[#2A1A0C]">
                  {section.title}
                </h2>

                <p className="leading-8 text-gray-600">
                  {section.body}
                </p>
              </section>
            ))}

            <section className="rounded-3xl border border-[#E7D6C2] bg-[#F8F1E8] p-6">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="text-[#75532F]" />

                <h2 className="text-2xl font-black text-[#2A1A0C]">
                  منصة متكاملة للمستقلين
                </h2>
              </div>

              <p className="mt-5 leading-8 text-gray-700">
                تهدف ميثاق إلى جمع الأدوات الأساسية التي يحتاجها المستقل لإدارة
                أعماله في منصة عربية واحدة، مع الحفاظ على سهولة الاستخدام
                والوضوح والتنظيم.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}