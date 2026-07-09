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
  ReceiptText,
  UserRound,
  Wallet,
} from "lucide-react";

type Invoice = {
  id: string;
  invoice_number: string | null;
  client_name: string | null;
  amount: number | null;
  due_date: string | null;
  status: string | null;
  created_at: string;
};

function statusArabic(status: string | null) {
  if (status === "paid") return "مدفوعة";
  if (status === "unpaid") return "غير مدفوعة";
  if (status === "cancelled") return "ملغية";
  return "غير محدد";
}

function statusColor(status: string | null) {
  if (status === "paid") return "bg-emerald-100 text-emerald-800";
  if (status === "unpaid") return "bg-red-100 text-red-800";
  if (status === "cancelled") return "bg-gray-100 text-gray-800";
  return "bg-amber-100 text-amber-800";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setInvoices(data);
      }

      setLoading(false);
    }

    loadInvoices();
  }, []);

  const paidCount = invoices.filter((invoice) => invoice.status === "paid").length;
  const unpaidCount = invoices.filter(
    (invoice) => invoice.status === "unpaid"
  ).length;
  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount || 0),
    0
  );

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-[32px] border border-[var(--mithaq-border)] bg-white/75 p-6 shadow-[var(--mithaq-shadow-sm)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                إدارة الفواتير
              </p>
              <h1 className="mt-2 text-4xl font-black text-[var(--mithaq-text)]">
                الفواتير
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                تابع فواتيرك، حالاتها، ومبالغها من مكان واحد.
              </p>
            </div>

            <Link
              href="/invoices/new"
              className="mithaq-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
            >
              <FilePlus2 size={18} />
              إنشاء فاتورة
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="إجمالي الفواتير" value={invoices.length} icon={ReceiptText} />
          <StatCard title="مدفوعة" value={paidCount} icon={CheckCircle2} />
          <StatCard title="غير مدفوعة" value={unpaidCount} icon={Clock3} />
          <StatCard
            title="إجمالي المبالغ"
            value={`${totalAmount.toLocaleString()} ر.س`}
            icon={Wallet}
          />
        </section>

        <section className="mithaq-card rounded-[32px] p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                قائمة الفواتير
              </p>
              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                جميع الفواتير
              </h2>
              <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
                الفواتير المرتبطة بحسابك فقط.
              </p>
            </div>

            <p className="rounded-2xl bg-[var(--mithaq-primary-soft)] px-4 py-2 text-sm font-black text-[var(--mithaq-primary)]">
              {invoices.length} فاتورة
            </p>
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-[var(--mithaq-surface-soft)] p-8 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-2xl bg-[var(--mithaq-primary-soft)]" />
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                جاري تحميل الفواتير...
              </p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="rounded-[28px] border-2 border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                <ReceiptText size={30} />
              </div>
              <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                لا توجد فواتير
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--mithaq-muted)]">
                أنشئ أول فاتورة لك أو أنشئ فاتورة مباشرة من تفاصيل العقد.
              </p>

              <Link
                href="/invoices/new"
                className="mithaq-btn-primary mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
              >
                <FilePlus2 size={18} />
                إنشاء فاتورة
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {invoices.map((invoice) => (
                <article
                  key={invoice.id}
                  className="group rounded-[28px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--mithaq-border-strong)] hover:bg-white hover:shadow-[var(--mithaq-shadow-md)]"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[var(--mithaq-muted)]">
                        رقم الفاتورة
                      </p>
                      <h3 className="mt-1 text-xl font-black text-[var(--mithaq-text)]">
                        {invoice.invoice_number || "بدون رقم"}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${statusColor(
                        invoice.status
                      )}`}
                    >
                      {statusArabic(invoice.status)}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-[var(--mithaq-muted)]">
                    <Info
                      label="العميل"
                      value={invoice.client_name || "-"}
                      icon={UserRound}
                    />
                    <Info
                      label="المبلغ"
                      value={`${(invoice.amount || 0).toLocaleString()} ر.س`}
                      icon={Wallet}
                    />
                    <Info
                      label="تاريخ الاستحقاق"
                      value={formatDate(invoice.due_date)}
                      icon={CalendarDays}
                    />
                    <Info
                      label="تاريخ الإنشاء"
                      value={formatDate(invoice.created_at)}
                      icon={Clock3}
                    />
                  </div>

                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="mithaq-btn-primary mt-6 flex items-center justify-center gap-2 px-5 py-3 text-sm"
                  >
                    عرض تفاصيل الفاتورة
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
  value: number | string;
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