"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { DEFAULT_CONTRACT_TERMS } from "../../lib/defaultContractTerms";

type Customer = {
  id: string;
  full_name: string;
  phone: string | null;
};

export default function NewContractPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [contractValue, setContractValue] = useState("");
  const [deposit, setDeposit] = useState("");
  const [contractTerms, setContractTerms] = useState(DEFAULT_CONTRACT_TERMS);
  const [defaultTerms, setDefaultTerms] = useState(DEFAULT_CONTRACT_TERMS);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCustomers();
    loadDefaultTerms();
  }, []);

  async function loadCustomers() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("customers")
      .select("id, full_name, phone")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setCustomers((data || []) as Customer[]);
  }

  async function loadDefaultTerms() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setContractTerms(DEFAULT_CONTRACT_TERMS);
      setDefaultTerms(DEFAULT_CONTRACT_TERMS);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("default_contract_terms")
      .eq("id", user.id)
      .single();

    const savedTerms =
      data?.default_contract_terms?.trim() || DEFAULT_CONTRACT_TERMS;

    setDefaultTerms(savedTerms);
    setContractTerms(savedTerms);
  }

  function handleSelectCustomer(customerId: string) {
    setSelectedCustomerId(customerId);

    const customer = customers.find((item) => item.id === customerId);

    if (customer) {
      setClientName(customer.full_name);
      setClientPhone(customer.phone || "");
    }
  }

  function resetTerms() {
    setContractTerms(defaultTerms);
  }

  async function handleSave() {
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("يجب تسجيل الدخول أولًا");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("signature_image")
      .eq("id", user.id)
      .single();

    const amountPaid = Number(deposit) || 0;
    const totalValue = Number(contractValue) || 0;
    const remainingAmount = Math.max(totalValue - amountPaid, 0);

    const paymentStatus =
      amountPaid <= 0
        ? "unpaid"
        : amountPaid >= totalValue
        ? "paid"
        : "partial";

   const { data, error } = await supabase
  .from("contracts")
  .insert({
    user_id: user.id,
    customer_id: selectedCustomerId || null,
    client_name: clientName,
    client_phone: clientPhone,
    event_type: eventType,
    event_date: eventDate,
    contract_value: totalValue,
    deposit: amountPaid,
    amount_paid: amountPaid,
    remaining_amount: remainingAmount,
    payment_status: paymentStatus,
    status: "draft",
    photographer_signature_image: profile?.signature_image || null,
    contract_terms: contractTerms,
  })
  .select()
  .single();

    if (error) {
      setMessage("حدث خطأ أثناء حفظ العقد: " + error.message);
      return;
    }

    setMessage("تم حفظ العقد بنجاح 🎉");
    setTimeout(() => {
  router.push(`/contracts/${data.id}`);
}, 800);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] px-6 py-10 text-[#362008]">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">إنشاء عقد جديد</h1>

        <p className="mb-8 text-[#75532F]">
          اختر العميل ثم أدخل بيانات العقد.
        </p>

        <div className="space-y-4">
          <select
            value={selectedCustomerId}
            onChange={(e) => handleSelectCustomer(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
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
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <input
            placeholder="رقم جوال العميل"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <input
            placeholder="نوع المناسبة: زواج، تخرج، منتجات..."
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <input
            placeholder="قيمة العقد"
            type="number"
            value={contractValue}
            onChange={(e) => setContractValue(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <input
            placeholder="العربون"
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <label className="font-bold">شروط العقد</label>

              <button
                type="button"
                onClick={resetTerms}
                className="rounded-xl border border-[#75532F] px-4 py-2 text-sm font-bold text-[#75532F]"
              >
                استعادة الشروط الافتراضية
              </button>
            </div>

            <textarea
              value={contractTerms}
              onChange={(e) => setContractTerms(e.target.value)}
              rows={10}
              className="w-full resize-y rounded-xl border border-[#B59676]/40 p-4 leading-8 outline-none"
              placeholder="اكتب شروط العقد هنا..."
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-[#75532F] p-4 font-bold text-white"
          >
            حفظ العقد
          </button>

          {message && (
            <p className="text-center font-medium text-[#75532F]">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}