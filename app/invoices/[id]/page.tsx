"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "../../components/AppShell";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  MessageCircle,
  ReceiptText,
  Save,
  Wallet,
} from "lucide-react";

type Invoice = {
  id: string;
  user_id: string | null;
  customer_id: string | null;
  invoice_number: string | null;
  client_name: string | null;
  amount: number | null;
  amount_paid: number | null;
  remaining_amount: number | null;
  payment_status: string | null;
  status: string | null;
  due_date: string | null;
  notes: string | null;
  contract_id: string | null;
};

type Payment = {
  id: string;
  amount: number;
  created_at: string;
};

export default function InvoiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [savingPayment, setSavingPayment] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  async function loadInvoice() {
    if (!id) return;

    const { data } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single();

    const { data: paymentsData } = await supabase
      .from("invoice_payments")
      .select("*")
      .eq("invoice_id", id)
      .order("created_at", { ascending: false });

    setInvoice(data as Invoice);
    setPayments((paymentsData || []) as Payment[]);
    setLoading(false);
  }

  function getPaymentStatus(amount: number, paid: number) {
    if (paid <= 0) return "unpaid";
    if (paid >= amount) return "paid";
    return "partial";
  }

  function getPaymentStatusArabic(status: string | null) {
    if (status === "paid") return "مدفوعة";
    if (status === "partial") return "مدفوعة جزئيًا";
    return "غير مدفوعة";
  }

  function getStatusColor(status: string | null) {
    if (status === "paid") return "bg-emerald-100 text-emerald-800";
    if (status === "partial") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  }

  function formatDate(value: string | null | undefined) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }

  function formatMoney(value: number | null | undefined) {
    return `${Number(value || 0).toLocaleString("ar-SA")} ر.س`;
  }

  function sendWhatsApp() {
    if (!invoice) return;

    const invoiceUrl = window.location.href;

    const message = `مرحباً،

هذه فاتورتك رقم ${invoice.invoice_number}

المبلغ: ${invoice.amount} ر.س
المدفوع: ${invoice.amount_paid || 0} ر.س
المتبقي: ${invoice.remaining_amount || invoice.amount} ر.س
تاريخ الاستحقاق: ${invoice.due_date || "-"}

رابط الفاتورة:
${invoiceUrl}

شكراً لك.`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  }

  async function updateInvoicePayment(finalPaid: number, paymentToRecord: number) {
    if (!invoice) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const invoiceAmount = Number(invoice.amount) || 0;
    const remainingAmount = Math.max(invoiceAmount - finalPaid, 0);
    const paymentStatus = getPaymentStatus(invoiceAmount, finalPaid);
    const currentUserId = user?.id || invoice.user_id;

    const { error } = await supabase
      .from("invoices")
      .update({
        amount_paid: finalPaid,
        remaining_amount: remainingAmount,
        payment_status: paymentStatus,
        status: paymentStatus,
      })
      .eq("id", invoice.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (paymentToRecord > 0) {
      const { error: paymentError } = await supabase
        .from("invoice_payments")
        .insert({
          user_id: currentUserId,
          invoice_id: invoice.id,
          amount: paymentToRecord,
        });

      if (paymentError) {
        toast.error(paymentError.message);
        return;
      }

      const { error: timelineError } = await supabase
        .from("customer_timeline")
        .insert({
          user_id: currentUserId,
          customer_id: invoice.customer_id,
          event_type: "payment_received",
          title: "تم استلام دفعة",
          description: `تم استلام دفعة بقيمة ${paymentToRecord} ر.س`,
        });

      if (timelineError) {
        toast.error(timelineError.message);
        return;
      }
    }

    if (invoice.contract_id) {
      await supabase
        .from("contracts")
        .update({
          amount_paid: finalPaid,
          remaining_amount: remainingAmount,
          payment_status: paymentStatus,
        })
        .eq("id", invoice.contract_id);
    }

    setInvoice({
      ...invoice,
      amount_paid: finalPaid,
      remaining_amount: remainingAmount,
      payment_status: paymentStatus,
      status: paymentStatus,
    });

    await loadInvoice();
  }

  async function savePayment() {
    if (!invoice || savingPayment) return;

    const newPayment = Number(paymentAmount);

    if (!newPayment || newPayment <= 0) {
      toast.error("أدخل مبلغًا صحيحًا للدفع");
      return;
    }

    const invoiceAmount = Number(invoice.amount) || 0;
    const currentPaid = Number(invoice.amount_paid) || 0;
    const remainingBeforePayment = Math.max(invoiceAmount - currentPaid, 0);
    const paymentToRecord = Math.min(newPayment, remainingBeforePayment);
    const finalPaid = Math.min(currentPaid + newPayment, invoiceAmount);

    setSavingPayment(true);
    await updateInvoicePayment(finalPaid, paymentToRecord);
    setPaymentAmount("");
    setSavingPayment(false);
  }

  async function markAsPaid() {
    if (!invoice) return;

    const invoiceAmount = Number(invoice.amount) || 0;
    const currentPaid = Number(invoice.amount_paid) || 0;
    const remainingBeforePayment = Math.max(invoiceAmount - currentPaid, 0);

    await updateInvoicePayment(invoiceAmount, remainingBeforePayment);
  }

  if (loading) {
    return (
      <AppShell>
        <div className="mithaq-card-premium rounded-[28px] p-8 text-center sm:rounded-[32px]">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
            <ReceiptText size={28} />
          </div>

          <p className="text-lg font-black text-[var(--mithaq-text)]">
            جاري تحميل الفاتورة
          </p>

          <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
            يتم تجهيز تفاصيل الفاتورة وسجل الدفعات.
          </p>
        </div>
      </AppShell>
    );
  }

  if (!invoice) {
    return (
      <AppShell>
        <div className="mithaq-card-premium rounded-[28px] p-8 text-center sm:rounded-[32px]">
          <p className="text-lg font-black text-[var(--mithaq-text)]">
            الفاتورة غير موجودة
          </p>
        </div>
      </AppShell>
    );
  }

  const invoiceAmount = Number(invoice.amount) || 0;
  const paidAmount = Number(invoice.amount_paid) || 0;
  const remainingAmount =
    invoice.remaining_amount !== null && invoice.remaining_amount !== undefined
      ? Number(invoice.remaining_amount)
      : Math.max(invoiceAmount - paidAmount, 0);

  const currentStatus = invoice.payment_status || invoice.status || "unpaid";
  const progress =
    invoiceAmount > 0 ? Math.min((paidAmount / invoiceAmount) * 100, 100) : 0;

  return (
    <AppShell>
      <div className="print-area space-y-6 sm:space-y-8">
        <section className="print:hidden rounded-[28px] border border-[var(--mithaq-border)] bg-white/75 p-5 shadow-[var(--mithaq-shadow-sm)] backdrop-blur sm:rounded-[32px] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                تفاصيل الفاتورة
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--mithaq-text)] sm:text-4xl">
                {invoice.invoice_number || "فاتورة بدون رقم"}
              </h1>

              <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                تابع حالة الدفع وسجل الدفعات لهذه الفاتورة.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-5 py-2 text-sm font-black ${getStatusColor(
                currentStatus
              )}`}
            >
              {getPaymentStatusArabic(currentStatus)}
            </span>
          </div>
        </section>

        <section className="print:hidden flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            onClick={() => window.history.back()}
            className="mithaq-btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
          >
            <ArrowLeft size={17} />
            رجوع
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--mithaq-text)] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
          >
            <Download size={17} />
            تحميل PDF
          </button>

          <button
            onClick={sendWhatsApp}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-700 px-5 py-3 text-sm font-black text-white transition hover:bg-green-800"
          >
            <MessageCircle size={17} />
            واتساب
          </button>

          {currentStatus !== "paid" && (
            <button
              onClick={markAsPaid}
              className="mithaq-btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
            >
              <CheckCircle2 size={17} />
              تحديد كمدفوعة
            </button>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard title="المبلغ" value={formatMoney(invoiceAmount)} icon={Wallet} />
          <StatCard title="المدفوع" value={formatMoney(paidAmount)} icon={CheckCircle2} />
          <StatCard title="المتبقي" value={formatMoney(remainingAmount)} icon={Clock3} />
        </section>

        <section className="mithaq-card rounded-[28px] p-5 sm:rounded-[32px] sm:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                حالة الدفع
              </p>

              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                تقدم السداد
              </h2>

              <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
                تم دفع {Math.round(progress)}٪ من قيمة الفاتورة.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-xs font-black ${getStatusColor(
                currentStatus
              )}`}
            >
              {getPaymentStatusArabic(currentStatus)}
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-[var(--mithaq-surface-soft)]">
            <div
              className="h-full rounded-full bg-[var(--mithaq-primary)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {currentStatus !== "paid" && (
          <section className="print:hidden mithaq-card rounded-[28px] p-5 sm:rounded-[32px] sm:p-6">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                تسجيل دفعة
              </p>

              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                إضافة دفعة جديدة
              </h2>

              <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
                أدخل مبلغ الدفعة وسيتم تحديث حالة الفاتورة والعقد المرتبط تلقائيًا.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="مثال: 500"
                className="min-w-[220px] flex-1 rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 text-sm text-[var(--mithaq-text)] outline-none transition placeholder:text-[var(--mithaq-muted-soft)] focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
              />

              <button
                onClick={savePayment}
                disabled={savingPayment}
                className="mithaq-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm disabled:opacity-60"
              >
                <Save size={17} />
                {savingPayment ? "جاري الحفظ..." : "حفظ الدفعة"}
              </button>
            </div>
          </section>
        )}

        <section className="mithaq-card rounded-[28px] p-5 sm:rounded-[32px] sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                سجل الدفعات
              </p>

              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                جميع الدفعات
              </h2>

              <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
                جميع الدفعات المسجلة على هذه الفاتورة.
              </p>
            </div>

            <p className="w-fit rounded-2xl bg-[var(--mithaq-primary-soft)] px-4 py-2 text-sm font-black text-[var(--mithaq-primary)]">
              {payments.length} دفعة
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="rounded-[28px] border-2 border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                <ReceiptText size={26} />
              </div>

              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                لا توجد دفعات مسجلة حتى الآن.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col gap-2 rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-lg font-black text-[var(--mithaq-text)]">
                    {formatMoney(payment.amount)}
                  </p>

                  <p className="text-sm font-bold text-[var(--mithaq-muted)]">
                    {formatDate(payment.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mithaq-card rounded-[28px] p-5 sm:rounded-[32px] sm:p-6">
          <div className="mb-6">
            <p className="text-sm font-black text-[var(--mithaq-primary)]">
              معلومات الفاتورة
            </p>

            <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
              البيانات الأساسية
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard label="رقم الفاتورة" value={invoice.invoice_number || "-"} />
            <InfoCard label="العميل" value={invoice.client_name || "-"} />
            <InfoCard label="تاريخ الاستحقاق" value={formatDate(invoice.due_date)} />
            <InfoCard
              label="الحالة المالية"
              value={getPaymentStatusArabic(currentStatus)}
            />

            <div className="rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5 md:col-span-2">
              <p className="text-sm font-bold text-[var(--mithaq-muted)]">
                الملاحظات
              </p>

              <p className="mt-2 font-black leading-7 text-[var(--mithaq-text)]">
                {invoice.notes || "-"}
              </p>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print-area {
            background: white !important;
          }

          .shadow-sm,
          .shadow-\\[var\\(--mithaq-shadow-sm\\)\\],
          .shadow-\\[var\\(--mithaq-shadow-md\\)\\] {
            box-shadow: none !important;
          }
        }
      `}</style>
    </AppShell>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5">
      <p className="text-sm font-bold text-[var(--mithaq-muted)]">{label}</p>
      <p className="mt-2 font-black text-[var(--mithaq-text)]">{value}</p>
    </div>
  );
}