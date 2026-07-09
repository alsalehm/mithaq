"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../../components/AppShell";
import { supabase } from "../../lib/supabase";
import { DEFAULT_CONTRACT_TERMS } from "../../lib/defaultContractTerms";
import { toast } from "react-hot-toast";

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
      toast.error("يجب تسجيل الدخول أولًا");
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
      amountPaid <= 0 ? "unpaid" : amountPaid >= totalValue ? "paid" : "partial";

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
      toast.error("حدث خطأ أثناء حفظ العقد: " + error.message);
      return;
    }

    toast.success("تم حفظ العقد بنجاح 🎉");

    setTimeout(() => {
      router.push(`/contracts/${data.id}`);
    }, 800);
  }

  return (
    <AppShell>
      <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#75532F]">العقود</p>
          <h1 className="mt-2 text-4xl font-bold text-[#2A1A0C]">
            إنشاء عقد جديد
          </h1>
          <p className="mt-2 text-sm text-[#6B5A49]">
            أدخل بيانات العميل والمناسبة، ثم احفظ العقد لإرساله للعميل.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="rounded-xl bg-[#75532F] px-6 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#5F4225]"
        >
          حفظ العقد
        </button>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-[#E7D6C2] bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#2A1A0C]">
              بيانات العقد
            </h2>
            <p className="mt-2 text-sm text-[#6B5A49]">
              اختر عميلًا محفوظًا أو أدخل بيانات العميل يدويًا.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#2A1A0C]">
                العميل
              </span>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleSelectCustomer(e.target.value)}
                className="w-full rounded-xl border border-[#D8BFA3] bg-white px-4 py-3 text-sm text-[#2A1A0C] outline-none transition focus:border-[#75532F] focus:ring-2 focus:ring-[#EFE0CF]"
              >
                <option value="">اختر العميل من القائمة</option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="اسم العميل"
                value={clientName}
                onChange={setClientName}
                placeholder="مثال: أحمد محمد"
              />

              <Field
                label="رقم جوال العميل"
                value={clientPhone}
                onChange={setClientPhone}
                placeholder="05xxxxxxxx"
              />

              <Field
                label="نوع المناسبة"
                value={eventType}
                onChange={setEventType}
                placeholder="زواج، تخرج، منتجات..."
              />

              <Field
                label="تاريخ المناسبة"
                type="date"
                value={eventDate}
                onChange={setEventDate}
                placeholder=""
              />

              <Field
                label="قيمة العقد"
                type="number"
                value={contractValue}
                onChange={setContractValue}
                placeholder="0"
              />

              <Field
                label="العربون"
                type="number"
                value={deposit}
                onChange={setDeposit}
                placeholder="0"
              />
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-[#E7D6C2] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#2A1A0C]">ملخص العقد</h2>
          <p className="mt-2 text-sm text-[#6B5A49]">
            مراجعة سريعة قبل الحفظ.
          </p>

          <div className="mt-6 space-y-3">
            <Summary label="العميل" value={clientName || "-"} />
            <Summary label="رقم الجوال" value={clientPhone || "-"} />
            <Summary label="نوع المناسبة" value={eventType || "-"} />
            <Summary label="تاريخ المناسبة" value={eventDate || "-"} />
            <Summary label="قيمة العقد" value={`${Number(contractValue) || 0} ر.س`} />
            <Summary label="العربون" value={`${Number(deposit) || 0} ر.س`} />
            <Summary
              label="المتبقي"
              value={`${Math.max(
                (Number(contractValue) || 0) - (Number(deposit) || 0),
                0
              )} ر.س`}
            />
          </div>

          {message && (
            <p className="mt-5 rounded-xl bg-[#EFE0CF] px-4 py-3 text-center text-sm font-semibold text-[#75532F]">
              {message}
            </p>
          )}
        </aside>
      </div>

      <section className="mt-8 rounded-3xl border border-[#E7D6C2] bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#2A1A0C]">شروط العقد</h2>
            <p className="mt-2 text-sm text-[#6B5A49]">
              يمكنك تعديل الشروط لهذا العقد فقط قبل الحفظ.
            </p>
          </div>

          <button
            type="button"
            onClick={resetTerms}
            className="rounded-xl border border-[#D8BFA3] bg-white px-5 py-3 text-sm font-bold text-[#75532F] transition hover:bg-[#EFE0CF]"
          >
            استعادة الشروط الافتراضية
          </button>
        </div>

        <textarea
          value={contractTerms}
          onChange={(e) => setContractTerms(e.target.value)}
          rows={10}
          className="w-full resize-y rounded-xl border border-[#D8BFA3] bg-white px-4 py-3 text-sm leading-8 text-[#2A1A0C] outline-none transition focus:border-[#75532F] focus:ring-2 focus:ring-[#EFE0CF]"
          placeholder="اكتب شروط العقد هنا..."
        />

        <button
          onClick={handleSave}
          className="mt-6 w-full rounded-xl bg-[#75532F] px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#5F4225]"
        >
          حفظ العقد
        </button>
      </section>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#2A1A0C]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#D8BFA3] bg-white px-4 py-3 text-sm text-[#2A1A0C] outline-none transition placeholder:text-[#9A8A7A] focus:border-[#75532F] focus:ring-2 focus:ring-[#EFE0CF]"
      />
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#F8F1E8] px-4 py-3 text-sm">
      <span className="text-[#6B5A49]">{label}</span>
      <span className="font-bold text-[#2A1A0C]">{value}</span>
    </div>
  );
}