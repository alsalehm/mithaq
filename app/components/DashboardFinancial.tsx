import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Wallet,
} from "lucide-react";

type Props = {
  totalValue: number;
  totalPaid: number;
  totalRemaining: number;
};

export default function DashboardFinancial({
  totalValue,
  totalPaid,
  totalRemaining,
}: Props) {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <FinancialCard
        title="إجمالي قيمة العقود"
        value={totalValue}
        subtitle="جميع العقود"
        icon={Wallet}
        color="primary"
      />

      <FinancialCard
        title="إجمالي المدفوع"
        value={totalPaid}
        subtitle="تم استلامه"
        icon={BanknoteArrowDown}
        color="success"
      />

      <FinancialCard
        title="إجمالي المتبقي"
        value={totalRemaining}
        subtitle="بانتظار التحصيل"
        icon={BanknoteArrowUp}
        color="warning"
      />
    </section>
  );
}

function FinancialCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  color: "primary" | "success" | "warning";
}) {
  const styles = {
    primary: {
      bg: "bg-[var(--mithaq-primary-soft)]",
      text: "text-[var(--mithaq-primary)]",
      value: "text-[var(--mithaq-text)]",
    },
    success: {
      bg: "bg-green-100",
      text: "text-green-700",
      value: "text-green-700",
    },
    warning: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      value: "text-amber-700",
    },
  }[color];

  return (
    <div className="mithaq-card group rounded-[30px] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--mithaq-shadow-md)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[var(--mithaq-muted)]">
            {title}
          </p>

          <h3 className={`mt-3 text-4xl font-black ${styles.value}`}>
            {value.toLocaleString()} ر.س
          </h3>

          <p className="mt-2 text-sm text-[var(--mithaq-muted-soft)]">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-3xl ${styles.bg} ${styles.text} transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}