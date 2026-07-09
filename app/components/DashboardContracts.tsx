import Link from "next/link";
import { ArrowLeft, CalendarDays, FileText } from "lucide-react";

type Contract = {
  id: string;
  client_name: string;
  event_type: string | null;
  event_date: string | null;
  contract_value: number | null;
  status: string | null;
};

export default function DashboardContracts({
  contracts,
}: {
  contracts: Contract[];
}) {
  return (
    <section className="mithaq-card rounded-[32px] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[var(--mithaq-primary)]">
            العقود
          </p>

          <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
            آخر العقود
          </h2>

          <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
            أحدث العقود التي تم إنشاؤها.
          </p>
        </div>

        <Link
          href="/contracts"
          className="inline-flex items-center gap-2 text-sm font-black text-[var(--mithaq-primary)] transition hover:gap-3"
        >
          عرض الكل
          <ArrowLeft size={16} />
        </Link>
      </div>

      {contracts.length === 0 ? (
        <div className="rounded-[28px] border-2 border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
            <FileText size={26} />
          </div>

          <h3 className="text-lg font-black text-[var(--mithaq-text)]">
            لا توجد عقود حتى الآن
          </h3>

          <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
            ابدأ بإنشاء أول عقد وسيظهر هنا مباشرة.
          </p>

          <Link
            href="/contracts/new"
            className="mithaq-btn-primary mt-6 inline-flex px-6 py-3 text-sm"
          >
            إنشاء عقد جديد
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <Link
              key={contract.id}
              href={`/contracts/${contract.id}`}
              className="group flex items-center justify-between rounded-[24px] border border-[var(--mithaq-border)] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--mithaq-border-strong)] hover:shadow-[var(--mithaq-shadow-sm)]"
            >
              <div>
                <h3 className="text-lg font-black text-[var(--mithaq-text)]">
                  {contract.client_name}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-[var(--mithaq-muted)]">
                  <CalendarDays size={16} />
                  <span>
                    {contract.event_type || "بدون نوع"} •{" "}
                    {contract.event_date || "بدون تاريخ"}
                  </span>
                </div>
              </div>

              <div className="text-left">
                <p className="text-xl font-black text-[var(--mithaq-text)]">
                  {(contract.contract_value || 0).toLocaleString()} ر.س
                </p>

                <span className="mt-2 inline-flex rounded-full bg-[var(--mithaq-primary-soft)] px-3 py-1 text-xs font-black text-[var(--mithaq-primary)]">
                  {contract.status || "draft"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}