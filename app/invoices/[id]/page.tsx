"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoice() {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();

      setInvoice(data);
      setLoading(false);
    }

    if (id) loadInvoice();
  }, [id]);

  function sendWhatsApp() {
    if (!invoice) return;

    const invoiceUrl = window.location.href;

    const message = `مرحباً،

هذه فاتورتك رقم ${invoice.invoice_number}

المبلغ: ${invoice.amount} ر.س
تاريخ الاستحقاق: ${invoice.due_date}

رابط الفاتورة:
${invoiceUrl}

شكراً لك.`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  async function markAsPaid() {
    if (!invoice) return;

    const { error } = await supabase
      .from("invoices")
      .update({ status: "paid" })
      .eq("id", invoice.id);

    if (error) {
      alert(error.message);
      return;
    }

    setInvoice({ ...invoice, status: "paid" });
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

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-md">
        <h1 className="mb-8 text-3xl font-bold">تفاصيل الفاتورة</h1>

        <div className="mb-8 flex flex-wrap gap-3 print:hidden">
          <button
            onClick={() => window.history.back()}
            className="rounded-xl bg-[#75532F] px-4 py-2 text-white"
          >
            رجوع للفواتير
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

          {invoice.status !== "paid" && (
            <button
              onClick={markAsPaid}
              className="rounded-xl bg-green-600 px-4 py-2 text-white"
            >
              تحديد كمدفوعة
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-gray-500">رقم الفاتورة</p>
            <p className="font-bold">{invoice.invoice_number}</p>
          </div>

          <div>
            <p className="text-gray-500">العميل</p>
            <p className="font-bold">{invoice.client_name}</p>
          </div>

          <div>
            <p className="text-gray-500">المبلغ</p>
            <p className="font-bold">{invoice.amount} ر.س</p>
          </div>

          <div>
            <p className="text-gray-500">تاريخ الاستحقاق</p>
            <p className="font-bold">{invoice.due_date || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">الحالة</p>
            <p className="font-bold">
              {invoice.status === "paid" ? "مدفوعة" : "غير مدفوعة"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">الملاحظات</p>
            <p className="font-bold">{invoice.notes || "-"}</p>
          </div>
        </div>
      </div>
    </main>
  );
}