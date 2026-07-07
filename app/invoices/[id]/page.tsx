"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
    if (status === "paid") return "bg-green-100 text-green-700";
    if (status === "partial") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
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
      <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
        جاري التحميل...
      </main>
    );
  }

  if (!invoice) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
        الفاتورة غير موجودة
      </main>
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
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
      <div className="print-area mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-md">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">تفاصيل الفاتورة</h1>
            <p className="mt-2 text-[#75532F]">
              {invoice.invoice_number || "فاتورة بدون رقم"}
            </p>
          </div>

          <span
            className={`rounded-full px-5 py-2 font-bold ${getStatusColor(
              currentStatus
            )}`}
          >
            {getPaymentStatusArabic(currentStatus)}
          </span>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 print:hidden">
          <button
            onClick={() => window.history.back()}
            className="rounded-xl bg-[#75532F] px-4 py-2 text-white"
          >
            رجوع
          </button>

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-black px-4 py-2 text-white"
          >
            تحميل PDF
          </button>

          <button
            onClick={sendWhatsApp}
            className="rounded-xl bg-green-600 px-4 py-2 text-white"
          >
            واتساب
          </button>

          {currentStatus !== "paid" && (
            <button
              onClick={markAsPaid}
              className="rounded-xl bg-green-700 px-4 py-2 text-white"
            >
              تحديد كمدفوعة
            </button>
          )}
        </div>

        <div className="mb-8 rounded-2xl bg-[#F5E9DC] p-5">
          <h2 className="mb-4 text-xl font-bold text-[#75532F]">حالة الدفع</h2>

          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">المبلغ</p>
              <p className="text-2xl font-bold">{invoiceAmount} ر.س</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">المدفوع</p>
              <p className="text-2xl font-bold">{paidAmount} ر.س</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">المتبقي</p>
              <p className="text-2xl font-bold">{remainingAmount} ر.س</p>
            </div>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#75532F]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-gray-600">
            تم دفع {Math.round(progress)}٪ من قيمة الفاتورة.
          </p>
        </div>

        {currentStatus !== "paid" && (
          <div className="mb-8 rounded-2xl bg-[#F5E9DC] p-5 print:hidden">
            <h2 className="mb-4 text-xl font-bold text-[#75532F]">
              تسجيل دفعة
            </h2>

            <div className="flex flex-wrap gap-3">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="مثال: 500"
                className="min-w-[220px] flex-1 rounded-xl border p-3 outline-none"
              />

              <button
                onClick={savePayment}
                disabled={savingPayment}
                className="rounded-xl bg-[#75532F] px-5 py-3 font-bold text-white disabled:opacity-60"
              >
                {savingPayment ? "جاري الحفظ..." : "حفظ الدفعة"}
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 rounded-2xl border border-[#B59676]/30 p-5">
          <h2 className="mb-4 text-xl font-bold text-[#75532F]">
            سجل الدفعات
          </h2>

          {payments.length === 0 ? (
            <p className="text-gray-500">لا توجد دفعات مسجلة حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-xl bg-[#F5E9DC] p-4"
                >
                  <p className="font-bold">{payment.amount} ر.س</p>
                  <p className="text-sm text-gray-600">
                    {new Date(payment.created_at).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-gray-500">رقم الفاتورة</p>
            <p className="font-bold">{invoice.invoice_number || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">العميل</p>
            <p className="font-bold">{invoice.client_name || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">تاريخ الاستحقاق</p>
            <p className="font-bold">{invoice.due_date || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">الحالة المالية</p>
            <p className="font-bold">{getPaymentStatusArabic(currentStatus)}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-gray-500">الملاحظات</p>
            <p className="font-bold">{invoice.notes || "-"}</p>
          </div>
        </div>
      </div>
    </main>
  );
}