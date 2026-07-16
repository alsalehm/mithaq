"use client";

import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Clock3,
  Headphones,
  MessageSquare,
  Phone,
} from "lucide-react";

const sections = [
  {
    title: "1. البريد الإلكتروني",
    body: "يمكنكم التواصل معنا عبر البريد الإلكتروني التالي لأي استفسارات أو ملاحظات أو طلبات دعم تتعلق بمنصة ميثاق: support@mithaq.com",
  },
  {
    title: "2. أوقات الاستجابة",
    body: "نعمل على الرد على جميع الرسائل خلال أوقات العمل الرسمية، من الأحد إلى الخميس، من الساعة 9:00 صباحًا حتى 6:00 مساءً بتوقيت المملكة العربية السعودية.",
  },
  {
    title: "3. الدعم الفني",
    body: "إذا واجهت أي مشكلة تقنية أثناء استخدام المنصة، يرجى توضيح تفاصيل المشكلة وإرفاق أي معلومات تساعد فريق الدعم على معالجتها بأسرع وقت ممكن.",
  },
  {
    title: "4. المقترحات والملاحظات",
    body: "نرحب بجميع الاقتراحات والأفكار التي تساعدنا على تطوير منصة ميثاق وتحسين تجربة المستخدم لجميع المستقلين.",
  },
  {
    title: "5. معلومات التواصل",
    body: "البريد الإلكتروني الرسمي للدعم: support@mithaq.com",
  },
];

export default function ContactPage() {
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
                <Mail className="text-[#75532F]" />
              </div>
            </div>

            <p className="text-sm font-bold text-[#75532F]">
              الدعم والتواصل
            </p>

            <h1 className="mt-2 text-5xl font-black text-[#2A1A0C]">
              تواصل معنا
            </h1>

            <p className="mt-4 text-gray-600 leading-8">
              يسعدنا استقبال استفساراتكم وملاحظاتكم المتعلقة بمنصة ميثاق،
              وسنعمل على الرد في أقرب وقت ممكن.
            </p>
          </header>

          <div className="grid grid-cols-4 border-b">
            <div className="flex items-center justify-center gap-2 p-5">
              <Mail size={18} />
              البريد
            </div>

            <div className="flex items-center justify-center gap-2 p-5">
              <Clock3 size={18} />
              أوقات العمل
            </div>

            <div className="flex items-center justify-center gap-2 p-5">
              <Headphones size={18} />
              دعم فني
            </div>

            <div className="flex items-center justify-center gap-2 p-5">
              <MessageSquare size={18} />
              الملاحظات
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
                <Phone className="text-[#75532F]" />
                <h2 className="text-2xl font-black text-[#2A1A0C]">
                  بيانات التواصل
                </h2>
              </div>

              <div className="mt-6 space-y-3 leading-8 text-gray-700">
                <p>
                  <strong>البريد الإلكتروني:</strong>{" "}
                  support@mithaq.com
                </p>

                <p>
                  <strong>أوقات العمل:</strong>
                </p>

                <p>
                  الأحد - الخميس
                  <br />
                  9:00 صباحًا - 6:00 مساءً
                  <br />
                  بتوقيت المملكة العربية السعودية
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}