import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  PenLine,
  ReceiptText,
  Scale,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Info from "./components/landing/Info";
import SectionHeader from "./components/landing/SectionHeader";
import Stat from "./components/landing/Stat";

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden">
<nav className="sticky top-0 z-50 border-b border-[var(--mithaq-border)] bg-[var(--mithaq-bg)]/85 backdrop-blur-xl">
  <div className="mithaq-container flex items-center justify-between py-4">
    <Link href="/" className="group">
      <span className="text-4xl font-black tracking-tight text-[var(--mithaq-text)] transition-colors duration-300 group-hover:text-[var(--mithaq-primary)]">
        ميثاق
      </span>
    </Link>

    <div className="hidden items-center gap-8 text-sm font-bold text-[var(--mithaq-muted)] md:flex">
      <a
        href="#features"
        className="transition hover:text-[var(--mithaq-primary)]"
      >
        المميزات
      </a>

      <a
        href="#how"
        className="transition hover:text-[var(--mithaq-primary)]"
      >
        كيف يعمل
      </a>

      <Link
        href="/pricing"
        className="transition hover:text-[var(--mithaq-primary)]"
      >
        الأسعار
      </Link>
    </div>

    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/login"
        className="mithaq-btn-secondary px-4 py-2 text-sm"
      >
        تسجيل الدخول
      </Link>

      <Link
        href="/signup"
        className="mithaq-btn-primary px-4 py-2 text-sm"
      >
        إنشاء حساب
      </Link>
    </div>
  </div>
</nav>

      <section className="relative">
        <div className="absolute left-[-140px] top-[-140px] h-96 w-96 rounded-full bg-[#E9D7C2]/70 blur-3xl" />
        <div className="absolute bottom-[-160px] right-[-140px] h-[420px] w-[420px] rounded-full bg-[#D8B98F]/30 blur-3xl" />

        <div className="mithaq-container relative grid items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            

            <h1 className="max-w-4xl text-5xl font-black leading-[1.15] tracking-tight text-[var(--mithaq-text)] md:text-7xl">
             منصة عربية لإدارة أعمال المستقلين
            </h1>

            <p className="mt-7 max-w-2xl text-lg font-medium leading-9 text-[var(--mithaq-muted)] md:text-xl">
             ميثاق يساعدك على إنشاء العقود، إرسالها للعميل، توقيعها إلكترونيًا، وإدارة الفواتير والمدفوعات في مكان واحد.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/signup" className="mithaq-btn-primary flex items-center gap-2 px-8 py-4 text-sm">
                ابدأ الآن مجانًا
                <ArrowLeft size={18} />
              </Link>

              <a href="#how" className="mithaq-btn-secondary px-8 py-4 text-sm">
                شاهد كيف يعمل
              </a>
            </div>

            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
             <Stat value="أنشئ عقودك" label="خلال دقائق" />
<Stat value="وقّع إلكترونيًا" label="بسهولة وأمان" />
<Stat value="تابع مدفوعاتك" label="من مكان واحد" />
<Stat value="استشارات قانونية" label="عند الحاجة" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-[#E7D6C2] to-transparent opacity-70 blur-xl" />

            <div className="mithaq-card-premium relative rounded-[36px] p-4">
              <div className="rounded-[28px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-6">
                <div className="mb-6 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[var(--mithaq-muted-soft)]">
                     مثال توضيحي
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--mithaq-text)]">
                      عقد تصوير زواج
                    </h2>
                  </div>

                  <span className="rounded-full bg-[var(--mithaq-primary-soft)] px-3 py-1 text-xs font-black text-[var(--mithaq-primary)]">
  بانتظار التوقيع
</span>
                </div>

                <div className="space-y-3 text-sm">
                  <Info label="العميل" value="أحمد محمد" />
                  <Info label="قيمة العقد" value="3,500 ر.س" />
                  <Info label="العربون" value="1,000 ر.س" />
                  <Info label="المتبقي" value="2,500 ر.س" />
                </div>

                <div className="mt-8 rounded-3xl border border-[var(--mithaq-border)] bg-[var(--mithaq-primary-soft)] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--mithaq-primary)] shadow-sm">
                      <PenLine size={21} />
                    </div>
                    <div>
                      <p className="font-black text-[var(--mithaq-primary)]">
                       جاهز للإرسال عبر واتساب
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[var(--mithaq-muted)]">
                       شارك العقد مع العميل للتوقيع الإلكتروني.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <div className="h-3 flex-1 rounded-full bg-[var(--mithaq-primary)]" />
                  <div className="h-3 flex-1 rounded-full bg-[var(--mithaq-border)]" />
                  <div className="h-3 flex-1 rounded-full bg-[var(--mithaq-border)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mithaq-container py-16">
        <SectionHeader
          eyebrow="المميزات"
          title="كل ما تحتاجه لإدارة أعمالك"
          desc="ميثاق يجمع العقود، الفواتير، التوقيع الإلكتروني، ومتابعة المدفوعات في تجربة واحدة بسيطة وواضحة."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            [FileText, "إنشاء عقود", "أنشئ عقودًا احترافية خلال دقائق."],
            [PenLine, "توقيع إلكتروني", "وقّع العقود إلكترونيًا بسهولة وأمان."],
            [ReceiptText, "إدارة الفواتير", "أنشئ الفواتير وتابع المدفوعات من مكان واحد."],
            [Scale, "استشارات قانونية", "احصل على استشارة قانونية عند الحاجة."],
          ].map(([Icon, title, desc]) => (
            <div
              key={title as string}
              className="mithaq-card group rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--mithaq-border-strong)] hover:bg-white hover:shadow-[var(--mithaq-shadow-md)]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)] transition-all duration-300 group-hover:scale-105">
                <Icon size={24} />
              </div>

              <h3 className="mb-3 text-xl font-black text-[var(--mithaq-text)]">
                {title as string}
              </h3>
              <p className="leading-7 text-[var(--mithaq-muted)]">{desc as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="mithaq-container py-16">
        <div className="mithaq-card rounded-[36px] p-6 md:p-10">
          <SectionHeader
            eyebrow="كيف يعمل؟"
            title="إدارة أعمالك في خطوات بسيطة"
          />

          <div className="grid gap-5 md:grid-cols-3">
            {[
           
  [FileText, "أنشئ العقد", "أدخل بيانات العميل، والشروط، وقيمة العقد."],
  [Send, "شارك العقد", "أرسل رابط العقد للعميل للتوقيع إلكترونيًا."],
  [CheckCircle2, "تابع الفواتير والمدفوعات", "أنشئ الفواتير وتابع حالة المدفوعات بسهولة."],

            ].map(([Icon, title, desc], index) => (
              <div
                key={title as string}
                className="rounded-[28px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--mithaq-shadow-md)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--mithaq-primary)] text-white shadow-sm">
                  <Icon size={22} />
                </div>

                <p className="mb-2 text-xs font-black text-[var(--mithaq-primary)]">
                  الخطوة {index + 1}
                </p>
                <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                  {title as string}
                </h3>
                <p className="mt-2 leading-7 text-[var(--mithaq-muted)]">
                  {desc as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mithaq-container py-16">
        <div className="relative overflow-hidden rounded-[36px] bg-[var(--mithaq-text)] p-8 text-center text-white shadow-[var(--mithaq-shadow-lg)] md:p-14">
          <div className="absolute left-[-80px] top-[-80px] h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[-100px] right-[-100px] h-72 w-72 rounded-full bg-[#D8B98F]/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#F5E9DC]">
              <ShieldCheck size={28} />
            </div>

            <p className="text-sm font-black text-[#F5E9DC]">ابدأ الآن</p>

            <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
              ابنِ عملًا أكثر احترافية واحفظ حقوقك مع ميثاق
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#F5E9DC]/90">
              ميثاق يحفظ حقك، ينظم عقودك، ويسهّل تجربة العميل من أول اتفاق حتى
              آخر دفعة.
            </p>

            <div className="mt-9 flex justify-center">
              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-2xl bg-[#F5E9DC] px-8 py-4 text-sm font-black text-[var(--mithaq-text)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
              >
                إنشاء حساب مجاني
                <ArrowLeft size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--mithaq-border)] bg-[#F2E9DD]/45 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-[var(--mithaq-muted)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black text-[var(--mithaq-text)]">ميثاق</p>
            <p className="mt-1">© 2026 ميثاق. جميع الحقوق محفوظة.</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-bold">
            <Link
              href="/service"
              className="transition hover:text-[var(--mithaq-primary)]"
            >
              وصف الخدمة
            </Link>

            <Link
              href="/privacy"
              className="transition hover:text-[var(--mithaq-primary)]"
            >
              سياسة الخصوصية
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-[var(--mithaq-primary)]"
            >
              شروط الاستخدام
            </Link>

            <Link
              href="/refund"
              className="transition hover:text-[var(--mithaq-primary)]"
            >
              سياسة الاسترجاع
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-[var(--mithaq-primary)]"
            >
              تواصل معنا
            </Link>

            <Link
              href="/login"
              className="transition hover:text-[var(--mithaq-primary)]"
            >
              تسجيل الدخول
            </Link>

            <Link
              href="/signup"
              className="transition hover:text-[var(--mithaq-primary)]"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}