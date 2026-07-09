import Link from "next/link";
import {
  FilePlus2,
  ReceiptText,
  Scale,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

export default function QuickActions() {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black text-[var(--mithaq-primary)]">
            الإجراءات السريعة
          </p>
          <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
            ابدأ إجراءً جديدًا
          </h2>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard
          href="/contracts/new"
          title="إنشاء عقد جديد"
          description="إنشاء عقد وإرساله للعميل"
          icon={FilePlus2}
          primary
        />

        <ActionCard
          href="/customers"
          title="إضافة عميل"
          description="إضافة عميل جديد"
          icon={UserPlus}
        />

        <ActionCard
          href="/invoices/new"
          title="إنشاء فاتورة"
          description="إنشاء فاتورة جديدة"
          icon={ReceiptText}
        />

        <ActionCard
          href="/legal-consultations"
          title="طلب استشارة"
          description="استشارة قانونية"
          icon={Scale}
        />
      </div>
    </section>
  );
}

function ActionCard({
  href,
  title,
  description,
  icon: Icon,
  primary,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-[28px] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--mithaq-shadow-md)] ${
        primary
          ? "border-[var(--mithaq-primary)] bg-[var(--mithaq-primary)] text-white"
          : "border-[var(--mithaq-border)] bg-white/75 text-[var(--mithaq-text)] backdrop-blur hover:border-[var(--mithaq-border-strong)] hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black">{title}</h3>

          <p
            className={`mt-2 text-sm leading-7 ${
              primary ? "text-white/80" : "text-[var(--mithaq-muted)]"
            }`}
          >
            {description}
          </p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105 ${
            primary
              ? "bg-white text-[var(--mithaq-primary)]"
              : "bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]"
          }`}
        >
          <Icon size={25} />
        </div>
      </div>

      <div
        className={`mt-6 flex items-center gap-2 text-sm font-black ${
          primary ? "text-white" : "text-[var(--mithaq-primary)]"
        }`}
      >
        فتح
        <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
      </div>
    </Link>
  );
}