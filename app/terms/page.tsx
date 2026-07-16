
"use client";

import Link from "next/link";
import { ArrowRight, Scale, ShieldCheck, FileText } from "lucide-react";

const sections = [
  {
    title: "1. قبول الشروط",
    body:
      "باستخدام منصة ميثاق فإنك توافق على الالتزام بهذه الشروط والأحكام، ويعد استمرارك في استخدام المنصة موافقة على أي تحديثات مستقبلية يتم نشرها.",
  },
  {
    title: "2. وصف الخدمة",
    body:
      "توفر ميثاق منصة إلكترونية تساعد المستقلين على إدارة العملاء والعقود والفواتير والاستشارات القانونية والاشتراكات المرتبطة بالخدمة.",
  },
  {
    title: "3. مسؤولية المستخدم",
    body:
      "يلتزم المستخدم بإدخال بيانات صحيحة، والمحافظة على سرية حسابه، وعدم استخدام المنصة بما يخالف الأنظمة أو حقوق الآخرين.",
  },
  {
    title: "4. الملكية الفكرية",
    body:
      "جميع حقوق التصميم والبرمجيات والعلامات التجارية والمحتوى الخاص بميثاق محفوظة، ولا يجوز نسخها أو إعادة استخدامها دون إذن.",
  },
  {
    title: "5. إيقاف الخدمة",
    body:
      "يجوز تعليق أو إيقاف الحساب عند إساءة استخدام المنصة أو مخالفة هذه الشروط أو الأنظمة المعمول بها.",
  },
  {
    title: "6. تعديل الشروط",
    body:
      "يجوز تحديث هذه الشروط عند الحاجة، ويعتبر استمرار استخدام المنصة بعد نشر التحديث موافقة عليها.",
  },
  {
    title: "7. التواصل",
    body:
      "للاستفسارات المتعلقة بهذه الشروط يمكن التواصل عبر: support@mithaq.com",
  },
];

export default function TermsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#F7F3EE] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-black tracking-[0.35em] text-[#75532F]">MITHAQ</span>
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-bold">
            العودة للرئيسية <ArrowRight size={18}/>
          </Link>
        </div>

        <div className="overflow-hidden rounded-[28px] border bg-white">
          <header className="border-b p-10">
            <div className="mb-6 flex justify-end">
              <div className="rounded-2xl bg-[#F8F1E8] p-4"><Scale className="text-[#75532F]"/></div>
            </div>
            <p className="text-sm font-bold text-[#75532F]">الشروط والأحكام</p>
            <h1 className="mt-2 text-5xl font-black text-[#2A1A0C]">شروط الاستخدام</h1>
            <p className="mt-4 text-gray-600">تنظم هذه الشروط استخدام منصة ميثاق وتوضح حقوق والتزامات جميع المستخدمين.</p>
          </header>

          <div className="grid grid-cols-3 border-b">
            <div className="flex items-center justify-center gap-2 p-5"><ShieldCheck size={18}/> استخدام آمن</div>
            <div className="flex items-center justify-center gap-2 p-5"><FileText size={18}/> شروط واضحة</div>
            <div className="flex items-center justify-center gap-2 p-5"><Scale size={18}/> التزام نظامي</div>
          </div>

          <div className="space-y-5 p-8">
            {sections.map((s)=>(
              <section key={s.title} className="rounded-3xl border p-6">
                <h2 className="mb-3 text-2xl font-black text-[#2A1A0C]">{s.title}</h2>
                <p className="leading-8 text-gray-600">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
