"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw, CreditCard, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "1. الاشتراكات الرقمية",
    body: "ميثاق يقدم خدمة رقمية باشتراك شهري أو سنوي، ويتم تفعيل الاشتراك مباشرة بعد نجاح عملية الدفع.",
  },
  {
    title: "2. طلب الاسترجاع",
    body: "يتم تفعيل اشتراك ميثاق مباشرة بعد إتمام عملية الدفع، ويُمنح المستخدم إمكانية الوصول إلى جميع مزايا الباقة الرقمية فورًا. ونظرًا لأن ميثاق يقدم خدمة رقمية غير ملموسة يتم تنفيذها بشكل فوري، فإن قيمة الاشتراك غير قابلة للاسترداد بعد تفعيل الخدمة بسبب بدء تنفيذ الخدمة وتمكين المستخدم من الاستفادة من جميع المزايا. ومع ذلك، إذا كان الاسترجاع واجبًا بموجب الأنظمة المعمول بها في المملكة العربية السعودية أو ثبت وجود خلل جوهري في الخدمة يمنع استخدامها على النحو المقصود، فسيتم التعامل مع الحالة وفقًا للأنظمة واللوائح ذات الصلة.",
  },
  {
    title: "3. الحالات غير المشمولة",
    body: "قد لا يكون الاسترجاع متاحًا إذا تم استخدام الخدمة بصورة جوهرية أو في الحالات التي تستثنيها الأنظمة أو شروط الاشتراك.",
  },
  {
    title: "4. معالجة الطلب",
    body: "تتم مراجعة طلبات الاسترجاع خلال مدة معقولة، وفي حال الموافقة تتم إعادة المبلغ عبر وسيلة الدفع الأصلية متى أمكن.",
  },
  {
    title: "5. التواصل",
    body: "للاستفسارات المتعلقة بالاسترجاع يرجى التواصل عبر: support@mithaq.com",
  },
]

export default function RefundPage() {
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
              <div className="rounded-2xl bg-[#F8F1E8] p-4"><RotateCcw className="text-[#75532F]"/></div>
            </div>
            <p className="text-sm font-bold text-[#75532F]">المدفوعات والاسترجاع</p>
            <h1 className="mt-2 text-5xl font-black text-[#2A1A0C]">سياسة الاسترجاع</h1>
            <p className="mt-4 text-gray-600">تهدف هذه السياسة إلى توضيح آلية مراجعة طلبات الاسترجاع الخاصة باشتراكات منصة ميثاق.</p>
          </header>

          <div className="grid grid-cols-3 border-b">
            <div className="flex items-center justify-center gap-2 p-5"><ShieldCheck size={18}/> وضوح</div>
            <div className="flex items-center justify-center gap-2 p-5"><CreditCard size={18}/> مدفوعات آمنة</div>
            <div className="flex items-center justify-center gap-2 p-5"><RotateCcw size={18}/> مراجعة عادلة</div>
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
