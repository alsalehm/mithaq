import { FileText, ReceiptText, Scale, UsersRound } from "lucide-react";

type Props = {
  totalCustomers: number;
  totalContracts: number;
  totalInvoices: number;
  totalConsultations: number;
};

export default function DashboardStats({
  totalCustomers,
  totalContracts,
  totalInvoices,
  totalConsultations,
}: Props) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card
        title="العملاء"
        value={totalCustomers}
        subtitle="إجمالي العملاء"
        icon={UsersRound}
      />

      <Card
        title="العقود"
        value={totalContracts}
        subtitle="إجمالي العقود"
        icon={FileText}
      />

      <Card
        title="الفواتير"
        value={totalInvoices}
        subtitle="إجمالي الفواتير"
        icon={ReceiptText}
      />

      <Card
        title="الاستشارات"
        value={totalConsultations}
        subtitle="الاستشارات القانونية"
        icon={Scale}
      />
    </section>
  );
}

function Card({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <div className="mithaq-card group rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--mithaq-border-strong)] hover:bg-white hover:shadow-[var(--mithaq-shadow-md)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[var(--mithaq-muted)]">
            {title}
          </p>

          <h3 className="mt-2 text-4xl font-black text-[var(--mithaq-text)]">
            {value}
          </h3>

          <p className="mt-2 text-sm text-[var(--mithaq-muted-soft)]">
            {subtitle}
          </p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)] transition-all duration-300 group-hover:scale-105">
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}