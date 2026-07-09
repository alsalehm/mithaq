"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "../../components/AppShell";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

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
        <div className="rounded-3xl bg-white p-8 text-center text-sm font-semibold text-[#75532F] shadow-sm">
          جاري تحميل الفاتورة...
        </div>
      </AppShell>
    );
  }

  if (!invoice) {
    return (
      <AppShell>
        <div className="rounded-3xl bg-white p-8 text-center text-sm font-semibold text-[#75532F] shadow-sm">
          الفاتورة غير موجودة
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
      <div className="print-area">
        <section className="mb-8 flex flex-col gap-4 print:hidden lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#75532F]">تفاصيل الفاتورة</p>
            <h1 className="mt-2 text-4xl font-bold text-[#2A1A0C]">
              {invoice.invoice_number || "فاتورة بدون رقم"}
            </h1>
            <p className="mt-2 text-sm text-[#6B5A49]">
              تابع حالة الدفع وسجل الدفعات لهذه الفاتورة.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-5 py-2 text-sm font-bold ${getStatusColor(
              currentStatus
            )}`}
          >
            {getPaymentStatusArabic(currentStatus)}
          </span>
        </section>

        <section className="mb-8 flex flex-wrap gap-3 print:hidden">
          <button
            onClick={() => window.history.back()}
            className="rounded-xl bg-[#F8F1E8] px-5 py-3 text-sm font-bold text-[#75532F] transition hover:bg-[#EFE0CF]"
          >
            رجوع
          </button>

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-[#2A1A0C] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
          >
            تحميل PDF
          </button>

          <button
            onClick={sendWhatsApp}
            className="rounded-xl bg-[#3F7D58] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#326746]"
          >
            واتساب
          </button>

          {currentStatus !== "paid" && (
            <button
              onClick={markAsPaid}
              className="rounded-xl bg-[#75532F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5F4225]"
            >
              تحديد كمدفوعة
            </button>
          )}
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <StatCard title="المبلغ" value={`${invoiceAmount} ر.س`} icon="💰" />
          <StatCard title="المدفوع" value={`${paidAmount} ر.س`} icon="✅" />
          <StatCard title="المتبقي" value={`${remainingAmount} ر.س`} icon="⏳" />
        </section>

        <section className="mb-8 rounded-3xl border border-[#E7D6C2] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#2A1A0C]">حالة الدفع</h2>
              <p className="mt-1 text-sm text-[#6B5A49]">
                تم دفع {Math.round(progress)}٪ من قيمة الفاتورة.
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusColor(
                currentStatus
              )}`}
            >
              {getPaymentStatusArabic(currentStatus)}
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-[#F8F1E8]">
            <div
              className="h-full rounded-full bg-[#75532F]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {currentStatus !== "paid" && (
          <section className="mb-8 rounded-3xl border border-[#E7D6C2] bg-white p-6 shadow-sm print:hidden">
            <h2 className="text-2xl font-bold text-[#2A1A0C]">تسجيل دفعة</h2>
            <p className="mt-1 text-sm text-[#6B5A49]">
              أدخل مبلغ الدفعة وسيتم تحديث حالة الفاتورة والعقد المرتبط تلقائيًا.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="مثال: 500"
                className="min-w-[220px] flex-1 rounded-xl border border-[#E7D6C2] bg-[#FFFDF9] px-4 py-3 text-sm outline-none focus:border-[#75532F]"
              />

              <button
                onClick={savePayment}
                disabled={savingPayment}
                className="rounded-xl bg-[#75532F] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#5F4225] disabled:opacity-60"
              >
                {savingPayment ? "جاري الحفظ..." : "حفظ الدفعة"}
              </button>
            </div>
          </section>
        )}

        <section className="mb-8 rounded-3xl border border-[#E7D6C2] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#2A1A0C]">سجل الدفعات</h2>
              <p className="mt-1 text-sm text-[#6B5A49]">
                جميع الدفعات المسجلة على هذه الفاتورة.
              </p>
            </div>

            <p className="text-sm font-semibold text-[#75532F]">
              {payments.length} دفعة
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D8BFA3] bg-[#F8F1E8] p-8 text-center text-sm font-semibold text-[#75532F]">
              لا توجد دفعات مسجلة حتى الآن.
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-[#F8F1E8] px-5 py-4"
                >
                  <p className="text-lg font-bold text-[#2A1A0C]">
                    {payment.amount} ر.س
                  </p>
                  <p className="text-sm font-semibold text-[#6B5A49]">
                    {formatDate(payment.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-[#E7D6C2] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-[#2A1A0C]">
            معلومات الفاتورة
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard label="رقم الفاتورة" value={invoice.invoice_number || "-"} />
            <InfoCard label="العميل" value={invoice.client_name || "-"} />
            <InfoCard label="تاريخ الاستحقاق" value={formatDate(invoice.due_date)} />
            <InfoCard
              label="الحالة المالية"
              value={getPaymentStatusArabic(currentStatus)}
            />

            <div className="rounded-2xl bg-[#F8F1E8] p-5 md:col-span-2">
              <p className="text-sm text-[#6B5A49]">الملاحظات</p>
              <p className="mt-2 font-bold leading-7 text-[#2A1A0C]">
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

          .shadow-sm {
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
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-3xl border border-[#E7D6C2] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-[#6B5A49]">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#2A1A0C]">{value}</p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EFE0CF] text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F8F1E8] p-5">
      <p className="text-sm text-[#6B5A49]">{label}</p>
      <p className="mt-2 font-bold text-[#2A1A0C]">{value}</p>
    </div>
  );
}