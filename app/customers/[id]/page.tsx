"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "../../components/AppShell";
import { supabase } from "../../lib/supabase";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Edit3,
  FileText,
  Mail,
  MapPin,
  Phone,
  Receipt,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

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
  payment_status: string | null;
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

  function formatMoney(value: number | null | undefined) {
    return `${Number(value || 0).toLocaleString("ar-SA")} ر.س`;
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
      <main dir="rtl" className="min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 sm:px-6">
          <div className="mithaq-card-premium w-full max-w-md rounded-[28px] p-6 text-center sm:rounded-[32px] sm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
              <UserRound size={28} />
            </div>

            <p className="text-lg font-black text-[var(--mithaq-text)]">
              جاري تحميل تفاصيل العميل
            </p>

            <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
              يتم تجهيز بيانات العميل والعقود والفواتير.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!customer) {
    return (
      <AppShell>
        <div className="mithaq-card rounded-[32px] p-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700">
            <X size={30} />
          </div>

          <h1 className="text-2xl font-black text-[var(--mithaq-text)]">
            لم يتم العثور على العميل
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--mithaq-muted)]">
            {message || "قد يكون العميل محذوفًا أو غير مرتبط بحسابك."}
          </p>

          <Link
            href="/customers"
            className="mithaq-btn-primary mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            رجوع للعملاء
            <ArrowLeft size={16} />
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 sm:space-y-8">
        <section className="rounded-[28px] border border-[var(--mithaq-border)] bg-white/75 p-5 shadow-[var(--mithaq-shadow-sm)] backdrop-blur sm:rounded-[32px] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link
                href="/customers"
                className="inline-flex items-center gap-2 text-sm font-black text-[var(--mithaq-primary)] transition hover:gap-3"
              >
                رجوع للعملاء
                <ArrowLeft size={16} />
              </Link>

              <p className="mt-5 text-sm font-black text-[var(--mithaq-primary)]">
                ملف العميل CRM
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--mithaq-text)] sm:text-4xl">
                {customer.full_name}
              </h1>

              <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                تفاصيل العميل، العقود، الفواتير، وسجل النشاط من مكان واحد.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-wrap lg:justify-end">
              <button
                onClick={startEditing}
                className="mithaq-btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
              >
                <Edit3 size={17} />
                تعديل البيانات
              </button>

              <button
                onClick={handleDeleteCustomer}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 transition hover:bg-red-100"
              >
                <Trash2 size={17} />
                حذف العميل
              </button>

              <Link
                href={`/contracts/new?customer_id=${customer.id}`}
                className="mithaq-btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
              >
                <FileText size={17} />
                إنشاء عقد
              </Link>
            </div>
          </div>
        </section>

        {message && (
          <div className="rounded-[24px] border border-[var(--mithaq-border)] bg-white p-4 text-sm font-black leading-7 text-[var(--mithaq-primary)] shadow-[var(--mithaq-shadow-sm)]">
            {message}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="إجمالي العقود"
            value={totalContracts.toString()}
            note="العقود المرتبطة بالعميل"
            icon={ClipboardList}
          />
          <StatCard
            title="قيمة العقود"
            value={formatMoney(totalValue)}
            note="إجمالي قيمة العقود"
            icon={Banknote}
          />
          <StatCard
            title="المدفوع"
            value={formatMoney(totalPaid)}
            note="إجمالي المبالغ المستلمة"
            icon={CheckCircle2}
          />
          <StatCard
            title="المتبقي"
            value={formatMoney(totalRemaining)}
            note="المبالغ بانتظار التحصيل"
            icon={CreditCard}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="إجمالي الفواتير"
            value={totalInvoices.toString()}
            note="الفواتير المرتبطة بالعميل"
            icon={Receipt}
          />
          <StatCard
            title="قيمة الفواتير"
            value={formatMoney(totalInvoiceAmount)}
            note="إجمالي مبالغ الفواتير"
            icon={Banknote}
          />
          <StatCard
            title="فواتير مدفوعة"
            value={paidInvoices.toString()}
            note="الفواتير المسددة"
            icon={CheckCircle2}
          />
          <StatCard
            title="فواتير غير مدفوعة"
            value={unpaidInvoices.toString()}
            note="الفواتير المتبقية"
            icon={CreditCard}
          />
        </section>

        {isEditing && (
          <section className="mithaq-card rounded-[28px] p-5 sm:rounded-[32px] sm:p-6">
            <div className="mb-6">
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                تعديل العميل
              </p>
              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                تعديل بيانات العميل
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
                حدّث بيانات التواصل والملاحظات الخاصة بهذا العميل.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="اسم العميل"
                value={editFullName}
                onChange={setEditFullName}
                placeholder="اسم العميل"
                icon={UserRound}
              />

              <Field
                label="رقم الجوال"
                value={editPhone}
                onChange={setEditPhone}
                placeholder="رقم الجوال"
                icon={Phone}
              />

              <Field
                label="المدينة"
                value={editCity}
                onChange={setEditCity}
                placeholder="المدينة"
                icon={MapPin}
              />

              <Field
                label="البريد الإلكتروني"
                value={editEmail}
                onChange={setEditEmail}
                placeholder="البريد الإلكتروني"
                icon={Mail}
              />
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
                ملاحظات العميل
              </span>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="ملاحظات عن العميل"
                rows={5}
                className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--mithaq-text)] outline-none transition placeholder:text-[var(--mithaq-muted-soft)] focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleUpdateCustomer}
                className="mithaq-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
              >
                <Save size={18} />
                حفظ التعديلات
              </button>

              <button
                onClick={cancelEditing}
                className="mithaq-btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
              >
                <X size={18} />
                إلغاء
              </button>
            </div>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-1">
            <div className="mithaq-card rounded-[28px] p-5 sm:rounded-[32px] sm:p-6">
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                بيانات العميل
              </p>

              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                معلومات التواصل
              </h2>

              <div className="mt-6 space-y-3">
                <Info label="الاسم" value={customer.full_name || "-"} icon={UserRound} />
                <Info label="الجوال" value={customer.phone || "-"} icon={Phone} />
                <Info label="المدينة" value={customer.city || "-"} icon={MapPin} />
                <Info label="البريد" value={customer.email || "-"} icon={Mail} />
              </div>
            </div>

            <div className="mithaq-card rounded-[28px] p-5 sm:rounded-[32px] sm:p-6">
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                ملاحظات
              </p>

              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                ملاحظات العميل
              </h2>

              {customer.notes ? (
                <p className="mt-5 whitespace-pre-wrap text-sm leading-8 text-[var(--mithaq-muted)]">
                  {customer.notes}
                </p>
              ) : (
                <p className="mt-5 rounded-2xl bg-[var(--mithaq-surface-soft)] p-4 text-sm leading-7 text-[var(--mithaq-muted)]">
                  لا توجد ملاحظات حتى الآن.
                </p>
              )}
            </div>
          </section>

          <section className="space-y-6 lg:col-span-2">
            <div className="mithaq-card rounded-[28px] p-5 sm:rounded-[32px] sm:p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-[var(--mithaq-primary)]">
                    عقود العميل
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                    العقود
                  </h2>
                </div>

                <Link
                  href={`/contracts/new?customer_id=${customer.id}`}
                  className="mithaq-btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
                >
                  <FileText size={17} />
                  إنشاء عقد جديد
                </Link>
              </div>

              {contracts.length === 0 ? (
                <div className="rounded-[28px] border-2 border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                    <FileText size={26} />
                  </div>

                  <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                    لا توجد عقود مرتبطة بهذا العميل
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--mithaq-muted)]">
                    أنشئ أول عقد لهذا العميل لتظهر تفاصيله هنا.
                  </p>

                  <Link
                    href={`/contracts/new?customer_id=${customer.id}`}
                    className="mithaq-btn-primary mt-5 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
                  >
                    إنشاء أول عقد
                    <ArrowLeft size={16} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <article
                      key={contract.id}
                      className="rounded-[26px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5 transition hover:border-[var(--mithaq-border-strong)] hover:bg-white hover:shadow-[var(--mithaq-shadow-sm)]"
                    >
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                            {contract.event_type || "عقد بدون نوع مناسبة"}
                          </h3>

                          <p className="mt-2 flex items-center gap-2 text-sm text-[var(--mithaq-muted)]">
                            <CalendarDays size={16} />
                            {contract.event_date || "-"}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-[var(--mithaq-primary-soft)] px-4 py-2 text-xs font-black text-[var(--mithaq-primary)]">
                          {contractStatusLabel(contract.status)}
                        </span>
                      </div>

                      <div className="grid gap-3 text-sm md:grid-cols-3">
                        <MiniInfo
                          label="قيمة العقد"
                          value={formatMoney(contract.contract_value)}
                        />
                        <MiniInfo
                          label="المدفوع"
                          value={formatMoney(
                            contract.amount_paid ?? contract.deposit
                          )}
                        />
                        <MiniInfo
                          label="حالة الدفع"
                          value={paymentStatusLabel(contract.payment_status)}
                        />
                      </div>

                      <Link
                        href={`/contracts/${contract.id}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--mithaq-primary)] transition hover:gap-3"
                      >
                        عرض العقد
                        <ArrowLeft size={16} />
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="mithaq-card rounded-[28px] p-5 sm:rounded-[32px] sm:p-6">
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                فواتير العميل
              </p>

              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                الفواتير
              </h2>

              {invoices.length === 0 ? (
                <div className="mt-6 rounded-[28px] border-2 border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
                    <Receipt size={26} />
                  </div>

                  <p className="text-sm leading-7 text-[var(--mithaq-muted)]">
                    لا توجد فواتير مرتبطة بهذا العميل حتى الآن.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {invoices.map((invoice) => (
                    <article
                      key={invoice.id}
                      className="rounded-[24px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <span
  className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${
    invoice.payment_status === "paid"
      ? "bg-green-100 text-green-700"
      : invoice.payment_status === "partial"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700"
  }`}
>
  {invoice.payment_status === "paid"
    ? "مدفوعة"
    : invoice.payment_status === "partial"
      ? "مدفوعة جزئيًا"
      : "غير مدفوعة"}
</span>
                          <h3 className="text-lg font-black text-[var(--mithaq-text)]">
                            {invoice.invoice_number || "فاتورة بدون رقم"}
                          </h3>
                          <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
                            تاريخ الاستحقاق: {invoice.due_date || "-"}
                          </p>
                        </div>

                        <span className="text-lg font-black text-[var(--mithaq-primary)]">
                          {formatMoney(invoice.amount)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="mithaq-card rounded-[28px] p-5 sm:rounded-[32px] sm:p-6">
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                سجل النشاط
              </p>

              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                آخر الأحداث
              </h2>

              {timeline.length === 0 ? (
                <div className="mt-6 rounded-[28px] border-2 border-dashed border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-8 text-center">
                  <p className="text-sm leading-7 text-[var(--mithaq-muted)]">
                    لا توجد أحداث مسجلة لهذا العميل حتى الآن.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {timeline.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[24px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5"
                    >
                      <h3 className="text-lg font-black text-[var(--mithaq-text)]">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
                          {item.description}
                        </p>
                      )}

                      <p className="mt-3 text-xs font-bold text-[var(--mithaq-muted-soft)]">
                        {item.created_at}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  title,
  value,
  note,
  icon: Icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ElementType;
}) {
  return (
    <div className="mithaq-card rounded-[28px] p-5">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
        <Icon size={23} />
      </div>

      <p className="text-sm font-black text-[var(--mithaq-muted)]">{title}</p>

      <p className="mt-2 text-2xl font-black text-[var(--mithaq-text)]">
        {value}
      </p>

      <p className="mt-2 text-xs font-bold text-[var(--mithaq-muted-soft)]">
        {note}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ElementType;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
        {label}
      </span>

      <div className="relative">
        <Icon
          size={19}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mithaq-muted-soft)]"
        />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 pr-11 text-sm text-[var(--mithaq-text)] outline-none transition placeholder:text-[var(--mithaq-muted-soft)] focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
        />
      </div>
    </label>
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
      <span className="flex items-center gap-2 text-sm text-[var(--mithaq-muted)]">
        <Icon size={16} className="text-[var(--mithaq-primary)]" />
        <span>{label}</span>
      </span>

      <span className="text-sm font-black text-[var(--mithaq-text)]">
        {value}
      </span>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3">
      <p className="text-xs font-bold text-[var(--mithaq-muted)]">{label}</p>
      <p className="mt-1 text-sm font-black text-[var(--mithaq-text)]">
        {value}
      </p>
    </div>
  );
}