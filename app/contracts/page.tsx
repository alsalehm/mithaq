"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "../components/AppShell";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FilePlus2,
  FileText,
  PenLine,
  Send,
  Wallet,
} from "lucide-react";

type Contract = {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  contract_value: number;
  status: string;
  created_at?: string;
};

function statusArabic(status: string) {
  if (status === "signed") return "موقّع";
  if (status === "draft") return "مسودة";
  if (status === "sent") return "تم الإرسال";
  if (status === "completed") return "مكتمل";
  if (status === "cancelled") return "ملغي";
  return "غير محدد";
}

function statusColor(status: string) {
  if (status === "draft") return "bg-amber-100 text-amber-800";
  if (status === "sent") return "bg-blue-100 text-blue-800";
  if (status === "signed") return "bg-emerald-100 text-emerald-800";
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "cancelled") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
}

function formatDate(value: string | undefined) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchContracts() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("contracts")
        .select(
          "id, client_name, event_type, event_date, contract_value, status, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        setContracts((data ?? []) as Contract[]);
      }

      setLoading(false);
    }

    fetchContracts();
  }, []);

  const filteredContracts =
    filter === "all"
      ? contracts
      : contracts.filter((contract) => contract.status === filter);

  const draftCount = contracts.filter((c) => c.status === "draft").length;
  const sentCount = contracts.filter((c) => c.status === "sent").length;
  const signedCount = contracts.filter((c) => c.status === "signed").length;
  const completedCount = contracts.filter((c) => c.status === "completed").length;

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-[32px] border border-[var(--mithaq-border)] bg-white/75 p-6 shadow-[var(--mithaq-shadow-sm)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                إدارة العقود
              </p>
              <h1 className="mt-2 text-4xl font-black text-[var(--mithaq-text)]">
                العقود
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                تابع جميع العقود، حالاتها، وقيمها من مكان واحد.
              </p>
            </div>

            <Link
              href="/contracts/new"
              className="mithaq-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
            >
              <FilePlus2 size={18} />
              إنشاء عقد جديد
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="إجمالي العقود" value={contracts.length} icon={FileText} />
          <StatCard title="مسودة" value={draftCount} icon={Clock3} />
          <StatCard title="تم الإرسال" value={sentCount} icon={Send} />
          <StatCard title="موقّع" value={signedCount} icon={PenLine} />
          <StatCard title="مكتمل" value={completedCount} icon={CheckCircle2} />
        </section>

        <section className="mithaq-card rounded-[28px] p-5">
          <div className="flex flex-wrap gap-3">
            {[
              ["all", "الكل"],
              ["draft", "مسودة"],
              ["sent", "تم الإرسال"],
              ["signed", "موقّع"],
              ["completed", "مكتمل"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`rounded-2xl px-5 py-2.5 text-sm font-black transition-all duration-300 ${
                  filter === value
                    ? "bg-[var(--mithaq-primary)] text-white shadow-[var(--mithaq-shadow-sm)]"
                    : "bg-[var(--mithaq-surface-soft)] text-[var(--mithaq-primary)] hover:bg-[var(--mithaq-primary-soft)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="mithaq-card rounded-[32px] p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                قائمة العقود
              </p>
              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                جميع العقود
              </h2>
              <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
                العقود المرتبطة بحسابك فقط.
              </p>
            </div>

            <p className="rounded-2xl bg-[var(--mithaq-primary-soft)] px-4 py-2 text-sm font-black text-[var(--mithaq-primary)]">
              {filteredContracts.length} عقد
            </p>
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-[var(--mithaq-surface-soft)] p-8 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-2xl bg-[var(--mithaq-primary-soft)]" />
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                جاري تحميل العقود...
              </p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="rounded-[28px] border-2 border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                <FileText size={30} />
              </div>
              <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                لا توجد عقود
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--mithaq-muted)]">
                أنشئ أول عقد لك وابدأ بإرساله للعميل للتوقيع.
              </p>

              <Link
                href="/contracts/new"
                className="mithaq-btn-primary mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
              >
                <FilePlus2 size={18} />
                إنشاء عقد جديد
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredContracts.map((contract) => (
                <article
                  key={contract.id}
                  className="group rounded-[28px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--mithaq-border-strong)] hover:bg-white hover:shadow-[var(--mithaq-shadow-md)]"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                        {contract.client_name}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--mithaq-muted)]">
                        {contract.event_type || "بدون نوع"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${statusColor(
                        contract.status
                      )}`}
                    >
                      {statusArabic(contract.status)}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-[var(--mithaq-muted)]">
                    <Info
                      label="تاريخ المناسبة"
                      value={formatDate(contract.event_date)}
                      icon={CalendarDays}
                    />
                    <Info
                      label="قيمة العقد"
                      value={`${(contract.contract_value ?? 0).toLocaleString()} ر.س`}
                      icon={Wallet}
                    />
                    <Info
                      label="تاريخ الإنشاء"
                      value={formatDate(contract.created_at)}
                      icon={Clock3}
                    />
                  </div>

                  <Link
                    href={`/contracts/${contract.id}`}
                    className="mithaq-btn-primary mt-6 flex items-center justify-center gap-2 px-5 py-3 text-sm"
                  >
                    عرض تفاصيل العقد
                    <ArrowLeft size={16} />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="mithaq-card group rounded-[28px] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--mithaq-shadow-md)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[var(--mithaq-muted)]">{title}</p>
          <p className="mt-2 text-3xl font-black text-[var(--mithaq-text)]">
            {value}
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)] transition-all duration-300 group-hover:scale-105">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3">
      <span className="flex items-center gap-2">
        <Icon size={16} className="text-[var(--mithaq-primary)]" />
        <span>{label}</span>
      </span>
      <span className="font-black text-[var(--mithaq-text)]">{value}</span>
    </div>
  );
}