"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Customer = {
  id: string;
  full_name: string;
  phone: string | null;
};

export default function NewInvoicePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const customerId = params.get("customer_id") || "";

    loadCustomers(customerId);
  }, []);

  async function loadCustomers(customerIdFromUrl = "") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("customers")
      .select("id, full_name, phone")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const loadedCustomers = (data || []) as Customer[];

    setCustomers(loadedCustomers);

    if (customerIdFromUrl) {
      const matchedCustomer = loadedCustomers.find(
        (customer) => customer.id === customerIdFromUrl
      );

      if (matchedCustomer) {
        setSelectedCustomerId(matchedCustomer.id);
        setClientName(matchedCustomer.full_name);
      }
    }
  }

  function handleSelectCustomer(customerId: string) {
    setSelectedCustomerId(customerId);

    const customer = customers.find((item) => item.id === customerId);

    if (customer) {
      setClientName(customer.full_name);
    }
  }

  async function saveInvoice() {
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!clientName.trim()) {
      setMessage("اسم العميل مطلوب");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("مبلغ الفاتورة مطلوب");
      return;
    }

    const invoiceNumber = "INV-" + Date.now();

    const { error } = await supabase.from("invoices").insert({
      user_id: user.id,
      customer_id: selectedCustomerId || null,
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
    setSelectedCustomerId("");
    setClientName("");
    setAmount("");
    setDueDate("");
    setNotes("");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-md">
        <h1 className="mb-3 text-3xl font-bold text-[#75532F]">
          إنشاء فاتورة جديدة
        </h1>

        <p className="mb-8 text-gray-600">
          اختر العميل من القائمة أو اكتب اسم العميل يدويًا.
        </p>

        <div className="space-y-4">
          <select
            value={selectedCustomerId}
            onChange={(e) => handleSelectCustomer(e.target.value)}
            className="w-full rounded-xl border p-4 outline-none"
          >
            <option value="">اختر العميل من القائمة</option>

            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.full_name}
              </option>
            ))}
          </select>

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
            <p className="text-center font-bold text-[#75532F]">{message}</p>
          )}
        </div>
      </div>
    </main>
  );
}