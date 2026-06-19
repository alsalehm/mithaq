export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] text-[#362008]">
<nav className="sticky top-0 z-50 border-b border-[#B59676]/20 bg-[#F5E9DC]/90 backdrop-blur">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#75532F] text-xl font-bold text-white">
        م
      </div>

      <span className="text-2xl font-bold">
        ميثاق
      </span>
    </div>

    <div className="hidden items-center gap-8 md:flex">
      <a href="#" className="hover:text-[#75532F]">
        المميزات
      </a>

      <a href="#" className="hover:text-[#75532F]">
        الأسعار
      </a>

      <a href="#" className="hover:text-[#75532F]">
        كيف يعمل
      </a>
    </div>

    <div className="flex items-center gap-3">
      <button className="rounded-xl border border-[#75532F] px-4 py-2 text-[#75532F]">
        تسجيل الدخول
      </button>

      <button className="rounded-xl bg-[#75532F] px-4 py-2 text-white">
        إنشاء حساب
      </button>
    </div>

  </div>
</nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-bold text-[#75532F]">
            للمصورين وأصحاب الأعمال الإبداعية
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
            عقود وفواتير احترافية خلال دقائق
          </h1>

          <p className="mb-8 text-lg leading-8 text-[#75532F]">
            ميثاق يساعدك على إنشاء العقود، إرسالها للعميل، توقيعها إلكترونيًا،
            ثم تحويلها إلى PDF رسمي قابل للمشاركة.
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-xl bg-[#75532F] px-7 py-3 text-white">
              ابدأ الآن
            </button>
            <button className="rounded-xl border border-[#75532F] px-7 py-3 text-[#75532F]">
              شاهد كيف يعمل
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white/70 p-6 shadow-sm">
          <div className="rounded-2xl border border-[#B59676]/40 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold">عقد تصوير زواج</span>
              <span className="rounded-full bg-[#F5E9DC] px-3 py-1 text-sm text-[#75532F]">
                بانتظار التوقيع
              </span>
            </div>

            <div className="space-y-4 text-sm text-[#75532F]">
              <div className="flex justify-between">
                <span>العميل</span>
                <strong className="text-[#362008]">أحمد محمد</strong>
              </div>
              <div className="flex justify-between">
                <span>قيمة العقد</span>
                <strong className="text-[#362008]">3,500 ر.س</strong>
              </div>
              <div className="flex justify-between">
                <span>العربون</span>
                <strong className="text-[#362008]">1,000 ر.س</strong>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-[#F5E9DC] p-4 text-center text-[#75532F]">
              رابط التوقيع جاهز للإرسال
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="mb-8 text-center text-3xl font-bold">
          كل ما يحتاجه المصور لإدارة الاتفاقات
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["إنشاء عقود", "قوالب جاهزة قابلة للتعديل حسب نوع التصوير."],
            ["توقيع إلكتروني", "أرسل رابطًا للعميل ليوقع من جواله مباشرة."],
            ["تصدير PDF", "احصل على عقد رسمي جاهز للمشاركة والحفظ."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl bg-white/70 p-6">
              <h3 className="mb-3 text-xl font-bold">{title}</h3>
              <p className="leading-7 text-[#75532F]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-[#362008] p-8 text-center text-white">
          <h2 className="mb-3 text-3xl font-bold">ابدأ ببناء عمل أكثر احترافية</h2>
          <p className="mb-6 text-[#F5E9DC]">
            ميثاق يحفظ حقك، وينظم عقودك، ويجعل تجربة العميل أسهل.
          </p>
          <button className="rounded-xl bg-[#F5E9DC] px-7 py-3 font-bold text-[#362008]">
            إنشاء حساب مجاني
          </button>
        </div>
      </section>
    </main>
  );
}