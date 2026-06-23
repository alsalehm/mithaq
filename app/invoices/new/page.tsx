"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NewInvoicePage() {
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  async function saveInvoice() {
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("يجب تسجيل الدخول أولاً");
      return;
    }

    const invoiceNumber = "INV-" + Date.now();

    const { error } = await supabase.from("invoices").insert({
      user_id: user.id,
      invoice_number: invoiceNumber,
      client_name: clientName,
      amount: Number(amount),
      due_date: dueDate || null,
      status: "unpaid",
      notes,
    });

    if (error) {
      setMessage("حدث خطأ: " + error.message);
      return;
    }

    setMessage("تم إنشاء الفاتورة بنجاح 🎉");
    setClientName("");
    setAmount("");
    setDueDate("");
    setNotes("");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-md">
        <h1 className="mb-8 text-3xl font-bold text-[#75532F]">
          إنشاء فاتورة جديدة
        </h1>

        <div className="space-y-4">
          <input
            placeholder="اسم العميل"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-xl border p-4 outline-none"
          />

          <input
            placeholder="مبلغ الفاتورة"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border p-4 outline-none"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border p-4 outline-none"
          />

          <textarea
            placeholder="ملاحظات اختيارية"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-32 w-full rounded-xl border p-4 outline-none"
          />

          <button
            type="button"
            onClick={saveInvoice}
            className="w-full rounded-xl bg-[#75532F] p-4 font-bold text-white"
          >
            حفظ الفاتورة
          </button>

          {message && (
            <p className="text-center font-bold text-[#75532F]">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}