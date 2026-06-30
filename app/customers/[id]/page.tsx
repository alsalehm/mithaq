"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import CustomerStats from "./CustomerStats";
import CustomerInfo from "./CustomerInfo";
import CustomerInvoices from "./CustomerInvoices";
import CustomerTimeline from "./CustomerTimeline";
type Customer = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  city: string | null;
  email: string | null;
  notes: string | null;
  created_at?: string;
};

type Contract = {
  id: string;
  customer_id: string | null;
  client_name: string;
  client_phone: string | null;
  event_type: string | null;
  event_date: string | null;
  contract_value: number | null;
  deposit: number | null;
  amount_paid?: number | null;
  remaining_amount?: number | null;
  payment_status?: string | null;
  status: string | null;
  created_at?: string;
};
type Invoice = {
  id: string;
  customer_id: string | null;
  invoice_number: string | null;
  client_name: string | null;
  amount: number | null;
  due_date: string | null;
  status: string | null;
  notes: string | null;
};
type TimelineEvent = {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  created_at: string;
};
export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    loadCustomerDetails();
  }, []);

  async function loadCustomerDetails() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .eq("user_id", user.id)
      .single();

    if (customerError || !customerData) {
      setMessage("لم يتم العثور على العميل.");
      setLoading(false);
      return;
    }

    const { data: contractsData, error: contractsError } = await supabase
      .from("contracts")
      .select("*")
      .eq("customer_id", customerId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (contractsError) {
      setMessage("تم تحميل العميل، لكن حدث خطأ أثناء تحميل العقود.");
    }
const { data: invoicesData, error: invoicesError } = await supabase
  .from("invoices")
  .select("*")
  .eq("customer_id", customerId)
  .eq("user_id", user.id)
  .order("due_date", { ascending: false });

if (invoicesError) {
    const { data: timelineData } = await supabase
  .from("customer_timeline")
  .select("*")
  .eq("customer_id", customerId)
  .order("created_at", { ascending: false });
  setMessage("تم تحميل العميل، لكن حدث خطأ أثناء تحميل الفواتير.");
}
const { data: timelineData } = await supabase
  .from("customer_timeline")
  .select("*")
  .eq("customer_id", customerId)
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });
    const loadedCustomer = customerData as Customer;

    setCustomer(loadedCustomer);
    setEditFullName(loadedCustomer.full_name || "");
    setEditPhone(loadedCustomer.phone || "");
    setEditCity(loadedCustomer.city || "");
    setEditEmail(loadedCustomer.email || "");
    setEditNotes(loadedCustomer.notes || "");
    setContracts((contractsData || []) as Contract[]);
    setInvoices((invoicesData || []) as Invoice[]);
    setTimeline((timelineData || []) as TimelineEvent[]);
    setLoading(false);
  }

  async function handleUpdateCustomer() {
    setMessage("");

    if (!customer) return;

    if (!editFullName.trim()) {
      setMessage("اسم العميل مطلوب.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("customers")
      .update({
        full_name: editFullName,
        phone: editPhone,
        city: editCity,
        email: editEmail,
        notes: editNotes,
      })
      .eq("id", customer.id)
      .eq("user_id", user.id);

    if (error) {
      setMessage("حدث خطأ أثناء تحديث بيانات العميل: " + error.message);
      return;
    }

    setCustomer({
      ...customer,
      full_name: editFullName,
      phone: editPhone,
      city: editCity,
      email: editEmail,
      notes: editNotes,
    });

    setIsEditing(false);
    setMessage("تم تحديث بيانات العميل بنجاح ✅");
  }

  async function handleDeleteCustomer() {
    setMessage("");

    if (!customer) return;

    if (contracts.length > 0) {
      setMessage(
        "لا يمكن حذف هذا العميل لأنه مرتبط بعقود. احذف العقود أو انقلها أولًا."
      );
      return;
    }

    const confirmed = window.confirm("هل أنت متأكد من حذف هذا العميل؟");

    if (!confirmed) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", customer.id)
      .eq("user_id", user.id);

    if (error) {
      setMessage("حدث خطأ أثناء حذف العميل: " + error.message);
      return;
    }

    router.push("/customers");
  }

  function startEditing() {
    if (!customer) return;

    setEditFullName(customer.full_name || "");
    setEditPhone(customer.phone || "");
    setEditCity(customer.city || "");
    setEditEmail(customer.email || "");
    setEditNotes(customer.notes || "");
    setIsEditing(true);
    setMessage("");
  }

  function cancelEditing() {
    if (!customer) return;

    setEditFullName(customer.full_name || "");
    setEditPhone(customer.phone || "");
    setEditCity(customer.city || "");
    setEditEmail(customer.email || "");
    setEditNotes(customer.notes || "");
    setIsEditing(false);
    setMessage("");
  }

  function contractStatusLabel(status: string | null) {
    if (status === "draft") return "مسودة";
    if (status === "sent") return "تم الإرسال";
    if (status === "signed") return "موقّع";
    if (status === "completed") return "مكتمل";
    if (status === "cancelled") return "ملغي";
    return "غير محدد";
  }

  function paymentStatusLabel(status?: string | null) {
    if (status === "paid") return "مدفوع";
    if (status === "partial") return "مدفوع جزئيًا";
    if (status === "unpaid") return "غير مدفوع";
    return "غير محدد";
  }

  const totalContracts = contracts.length;

  const totalValue = contracts.reduce(
    (sum, contract) => sum + (Number(contract.contract_value) || 0),
    0
  );

  const totalPaid = contracts.reduce(
    (sum, contract) =>
      sum + (Number(contract.amount_paid ?? contract.deposit) || 0),
    0
  );

  const totalRemaining = contracts.reduce(
    (sum, contract) => sum + (Number(contract.remaining_amount) || 0),
    0
  );
const totalInvoices = invoices.length;

const totalInvoiceAmount = invoices.reduce(
  (sum, invoice) => sum + (Number(invoice.amount) || 0),
  0
);

const paidInvoices = invoices.filter(
  (invoice) => invoice.status === "paid"
).length;

const unpaidInvoices = invoices.filter(
  (invoice) => invoice.status !== "paid"
).length;
  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
        جاري تحميل تفاصيل العميل...
      </main>
    );
  }

  if (!customer) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-md">
          <p className="mb-6 font-bold text-red-700">
            {message || "لم يتم العثور على العميل."}
          </p>

          <Link
            href="/customers"
            className="rounded-xl bg-[#75532F] px-5 py-3 font-bold text-white"
          >
            رجوع للعملاء
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/customers" className="text-sm underline">
              رجوع للعملاء
            </Link>
            <h1 className="mt-3 text-4xl font-bold">{customer.full_name}</h1>
            <p className="mt-2 text-[#75532F]">ملف العميل CRM</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={startEditing}
              className="rounded-xl bg-black px-5 py-3 font-bold text-white"
            >
              تعديل بيانات العميل
            </button>

            <button
              onClick={handleDeleteCustomer}
              className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white"
            >
              حذف العميل
            </button>

            <Link
              href={`/contracts/new?customer_id=${customer.id}`}
              className="rounded-xl bg-[#75532F] px-5 py-3 font-bold text-white"
            >
              إنشاء عقد جديد لهذا العميل
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl bg-white p-4 font-medium text-[#75532F] shadow-md">
            {message}
          </div>
        )}

        <CustomerStats
  totalContracts={totalContracts}
  totalValue={totalValue}
  totalPaid={totalPaid}
  totalRemaining={totalRemaining}
  totalInvoices={totalInvoices}
  totalInvoiceAmount={totalInvoiceAmount}
  paidInvoices={paidInvoices}
  unpaidInvoices={unpaidInvoices}
/>

        {isEditing && (
          <section className="mb-8 rounded-3xl bg-white p-6 shadow-md">
            <h2 className="mb-5 text-2xl font-bold text-[#75532F]">
              تعديل بيانات العميل
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                placeholder="اسم العميل"
                className="rounded-xl border border-[#B59676]/40 p-4 outline-none"
              />

              <input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="رقم الجوال"
                className="rounded-xl border border-[#B59676]/40 p-4 outline-none"
              />

              <input
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                placeholder="المدينة"
                className="rounded-xl border border-[#B59676]/40 p-4 outline-none"
              />

              <input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="rounded-xl border border-[#B59676]/40 p-4 outline-none"
              />
            </div>

            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="ملاحظات عن العميل"
              rows={5}
              className="mt-4 w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
            />

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleUpdateCustomer}
                className="rounded-xl bg-[#75532F] px-6 py-3 font-bold text-white"
              >
                حفظ التعديلات
              </button>

              <button
                onClick={cancelEditing}
                className="rounded-xl border border-[#75532F] px-6 py-3 font-bold text-[#75532F]"
              >
                إلغاء
              </button>
            </div>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="space-y-8 lg:col-span-1">
            <CustomerInfo customer={customer} />

            <div className="rounded-3xl bg-white p-6 shadow-md">
              <h2 className="mb-5 text-2xl font-bold text-[#75532F]">
                ملاحظات العميل
              </h2>

              {customer.notes ? (
                <p className="whitespace-pre-wrap leading-8 text-gray-700">
                  {customer.notes}
                </p>
              ) : (
                <p className="text-gray-500">لا توجد ملاحظات حتى الآن.</p>
              )}
            </div>
          </section>
          <CustomerInvoices
  invoices={invoices}
  customerId={customer.id}
/>
<CustomerTimeline
  timeline={timeline}
/>
          <section className="rounded-3xl bg-white p-6 shadow-md lg:col-span-2">
            <h2 className="mb-5 text-2xl font-bold text-[#75532F]">
              عقود العميل
            </h2>

            {contracts.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-8 text-center">
                <p className="mb-5 text-gray-600">
                  لا توجد عقود مرتبطة بهذا العميل حتى الآن.
                </p>

                <Link
                  href={`/contracts/new?customer_id=${customer.id}`}
                  className="rounded-xl bg-[#75532F] px-5 py-3 font-bold text-white"
                >
                  إنشاء أول عقد
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="rounded-2xl border border-[#B59676]/30 p-5"
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold">
                          {contract.event_type || "عقد بدون نوع مناسبة"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          التاريخ: {contract.event_date || "-"}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#F5E9DC] px-4 py-2 text-sm font-bold">
                        {contractStatusLabel(contract.status)}
                      </span>
                    </div>

                    <div className="grid gap-3 text-sm md:grid-cols-3">
                      <p>قيمة العقد: {contract.contract_value || 0} ريال</p>
                      <p>
                        المدفوع:{" "}
                        {contract.amount_paid ?? contract.deposit ?? 0} ريال
                      </p>
                      <p>
                        حالة الدفع: {paymentStatusLabel(contract.payment_status)}
                      </p>
                    </div>

                    <div className="mt-5">
                      <Link
                        href={`/contracts/${contract.id}`}
                        className="font-bold text-[#75532F] underline"
                      >
                        عرض العقد
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}