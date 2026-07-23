"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../../components/AppShell";
import { supabase } from "../../lib/supabase";
import { DEFAULT_CONTRACT_TERMS } from "../../lib/defaultContractTerms";
import { PRO_CONTRACT_TERMS } from "../../lib/proContractTerms";
import { getUserSubscription } from "../../lib/billing/subscription";
import { toast } from "react-hot-toast";

type Customer = {
  id: string;
  full_name: string;
  proof_number: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
};

export default function NewContractPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  const [isPro, setIsPro] = useState(false);
  const [loadingContractType, setLoadingContractType] = useState(true);
  const [saving, setSaving] = useState(false);

  // بيانات العميل
  const [clientName, setClientName] = useState("");
  const [clientProofNumber, setClientProofNumber] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCity, setClientCity] = useState("");

  // بيانات الخدمة
  const [eventType, setEventType] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");

  // المخرجات والملاحظات
  const [deliverables, setDeliverables] = useState("");
  const [serviceNotes, setServiceNotes] = useState("");

  // البيانات المالية
  const [contractValue, setContractValue] = useState("");
  const [deposit, setDeposit] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [remainingDueDate, setRemainingDueDate] = useState("");

  // السياسات الخاصة
  const [reviewPeriodDays, setReviewPeriodDays] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [postponementPolicy, setPostponementPolicy] = useState("");
  const [
    intellectualPropertyPolicy,
    setIntellectualPropertyPolicy,
  ] = useState("");

  const [contractTerms, setContractTerms] = useState(
    DEFAULT_CONTRACT_TERMS
  );

  const [defaultTerms, setDefaultTerms] = useState(
    DEFAULT_CONTRACT_TERMS
  );

  useEffect(() => {
    loadCustomers();
    loadContractConfiguration();
  }, []);

  async function loadCustomers() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("customers")
      .select(
        "id, full_name, proof_number, phone, email, city"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ أثناء تحميل العملاء");
      return;
    }

    setCustomers((data || []) as Customer[]);
  }

  async function loadContractConfiguration() {
    setLoadingContractType(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setContractTerms(DEFAULT_CONTRACT_TERMS);
      setDefaultTerms(DEFAULT_CONTRACT_TERMS);
      setIsPro(false);
      setLoadingContractType(false);
      return;
    }

    const [{ data: profile }, userSubscription] = await Promise.all([
      supabase
        .from("profiles")
        .select("default_contract_terms")
        .eq("id", user.id)
        .single(),

      getUserSubscription(user.id),
    ]);

    const savedFreeTerms =
      profile?.default_contract_terms?.trim() ||
      DEFAULT_CONTRACT_TERMS;

    const proAccount = Boolean(userSubscription?.isPro);

    const selectedTerms = proAccount
      ? PRO_CONTRACT_TERMS
      : savedFreeTerms;

    setIsPro(proAccount);
    setDefaultTerms(selectedTerms);
    setContractTerms(selectedTerms);
    setLoadingContractType(false);
  }

  function handleSelectCustomer(customerId: string) {
    setSelectedCustomerId(customerId);

    if (!customerId) {
      setClientName("");
      setClientProofNumber("");
      setClientPhone("");
      setClientEmail("");
      setClientCity("");
      return;
    }

    const customer = customers.find(
      (item) => item.id === customerId
    );

    if (!customer) return;

    setClientName(customer.full_name || "");
    setClientProofNumber(customer.proof_number || "");
    setClientPhone(customer.phone || "");
    setClientEmail(customer.email || "");
    setClientCity(customer.city || "");
  }

  function resetTerms() {
    setContractTerms(defaultTerms);
  }

  async function handleSave() {
    if (saving || loadingContractType) return;

    if (!clientName.trim()) {
      toast.error("أدخل اسم العميل");
      return;
    }

    if (!eventType.trim()) {
      toast.error("أدخل نوع الخدمة");
      return;
    }

    if (!eventDate) {
      toast.error("حدد تاريخ التنفيذ");
      return;
    }

    const totalValue = Number(contractValue) || 0;
    const amountPaid = Number(deposit) || 0;

    if (totalValue <= 0) {
      toast.error("أدخل قيمة صحيحة للعقد");
      return;
    }

    if (amountPaid < 0) {
      toast.error("قيمة العربون غير صحيحة");
      return;
    }

    if (amountPaid > totalValue) {
      toast.error("لا يمكن أن يكون العربون أكبر من قيمة العقد");
      return;
    }

    if (isPro && !serviceDescription.trim()) {
      toast.error("أدخل وصف الخدمة");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("يجب تسجيل الدخول أولًا");
      setSaving(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
          full_name,
          business_name,
          proof_number,
          phone,
          email,
          city,
          signature_image
        `
      )
      .eq("id", user.id)
      .single();

    if (profileError) {
      toast.error("تعذر تحميل بيانات مقدم الخدمة");
      setSaving(false);
      return;
    }

    const remainingAmount = Math.max(
      totalValue - amountPaid,
      0
    );

    const paymentStatus =
      amountPaid <= 0
        ? "unpaid"
        : amountPaid >= totalValue
          ? "paid"
          : "partial";

    const reviewDays =
      reviewPeriodDays.trim() === ""
        ? null
        : Number(reviewPeriodDays);

    if (
      reviewDays !== null &&
      (!Number.isInteger(reviewDays) || reviewDays < 0)
    ) {
      toast.error("أدخل عدد أيام صحيح لمدة المراجعة");
      setSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from("contracts")
      .insert({
        user_id: user.id,
        customer_id: selectedCustomerId || null,

        contract_type: isPro ? "pro" : "free",

        provider_name: profile?.full_name?.trim() || null,
        provider_business_name:
          profile?.business_name?.trim() || null,
        provider_proof_number:
          profile?.proof_number?.trim() || null,
        provider_phone: profile?.phone?.trim() || null,
        provider_email: profile?.email?.trim() || user.email || null,
        provider_city: profile?.city?.trim() || null,

        client_name: clientName.trim(),
        client_proof_number:
          clientProofNumber.trim() || null,
        client_phone: clientPhone.trim() || null,
        client_email: clientEmail.trim() || null,
        client_city: clientCity.trim() || null,

        event_type: eventType.trim(),
        service_description:
          serviceDescription.trim() || null,
        event_date: eventDate,
        service_time: serviceTime || null,
        service_location: serviceLocation.trim() || null,
        service_duration: serviceDuration.trim() || null,

        deliverables: deliverables.trim() || null,
        service_notes: serviceNotes.trim() || null,

        contract_value: totalValue,
        deposit: amountPaid,
        amount_paid: amountPaid,
        remaining_amount: remainingAmount,
        payment_status: paymentStatus,
        payment_method: paymentMethod.trim() || null,
        remaining_due_date: remainingDueDate || null,

        review_period_days: reviewDays,
        cancellation_policy:
          cancellationPolicy.trim() || null,
        postponement_policy:
          postponementPolicy.trim() || null,
        intellectual_property_policy:
          intellectualPropertyPolicy.trim() || null,

        status: "draft",
        photographer_signature_image:
          profile?.signature_image || null,
        contract_terms: contractTerms.trim(),
      })
      .select("id")
      .single();

    setSaving(false);

    if (error) {
      toast.error(
        "حدث خطأ أثناء حفظ العقد: " + error.message
      );
      return;
    }

    toast.success("تم حفظ العقد بنجاح 🎉");

    setTimeout(() => {
      router.push(`/contracts/${data.id}`);
    }, 800);
  }

  const remainingAmount = Math.max(
    (Number(contractValue) || 0) -
      (Number(deposit) || 0),
    0
  );

  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-[32px] border border-[var(--mithaq-border)] bg-white/75 p-6 shadow-[var(--mithaq-shadow-sm)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                العقود
              </p>

              <h1 className="mt-2 text-3xl font-black text-[var(--mithaq-text)] sm:text-4xl">
                إنشاء عقد جديد
              </h1>

              <p className="mt-3 text-sm leading-7 text-[var(--mithaq-muted)]">
                أدخل بيانات العميل وتفاصيل الاتفاق، ثم احفظ العقد
                لإرساله إلى العميل للتوقيع الإلكتروني.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] px-5 py-3">
              <p className="text-xs font-bold text-[var(--mithaq-muted)]">
                نوع العقد
              </p>

              <p className="mt-1 text-sm font-black text-[var(--mithaq-primary)]">
                {loadingContractType
                  ? "جاري التحقق..."
                  : isPro
                    ? "عقد احترافي — Pro"
                    : "عقد أساسي — مجاني"}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <ContractSection
              title="بيانات العميل"
              description="اختر عميلًا محفوظًا أو أدخل بيانات الطرف الثاني يدويًا."
            >
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
                  العميل المحفوظ
                </span>

                <select
                  value={selectedCustomerId}
                  onChange={(event) =>
                    handleSelectCustomer(event.target.value)
                  }
                  className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 text-sm text-[var(--mithaq-text)] outline-none transition focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
                >
                  <option value="">
                    اختر عميلًا محفوظًا أو أدخل البيانات يدويًا
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.full_name}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="اسم العميل"
                value={clientName}
                onChange={setClientName}
                placeholder="مثال: أحمد محمد"
                required
              />

              {isPro && (
                <Field
                  label="رقم الإثبات"
                  value={clientProofNumber}
                  onChange={setClientProofNumber}
                  placeholder="رقم الهوية أو الإقامة أو السجل التجاري"
                />
              )}

              <Field
                label="رقم جوال العميل"
                value={clientPhone}
                onChange={setClientPhone}
                placeholder="05xxxxxxxx"
              />

              {isPro && (
                <>
                  <Field
                    label="البريد الإلكتروني"
                    type="email"
                    value={clientEmail}
                    onChange={setClientEmail}
                    placeholder="client@email.com"
                  />

                  <Field
                    label="المدينة"
                    value={clientCity}
                    onChange={setClientCity}
                    placeholder="مثال: الرياض"
                  />
                </>
              )}
            </ContractSection>

            <ContractSection
              title="بيانات الخدمة"
              description="حدد طبيعة الخدمة وموعد ومكان تنفيذها."
            >
              <Field
                label="نوع الخدمة"
                value={eventType}
                onChange={setEventType}
                placeholder="مثال: تصوير، تصميم، استشارة..."
                required
              />

              <Field
                label="تاريخ التنفيذ"
                type="date"
                value={eventDate}
                onChange={setEventDate}
                placeholder=""
                required
              />

              {isPro && (
                <>
                  <TextAreaField
                    label="وصف الخدمة"
                    value={serviceDescription}
                    onChange={setServiceDescription}
                    placeholder="اكتب وصفًا واضحًا للخدمة المتفق عليها..."
                    required
                    className="md:col-span-2"
                  />

                  <Field
                    label="وقت التنفيذ"
                    type="time"
                    value={serviceTime}
                    onChange={setServiceTime}
                    placeholder=""
                  />

                  <Field
                    label="مكان التنفيذ"
                    value={serviceLocation}
                    onChange={setServiceLocation}
                    placeholder="مثال: مقر العميل أو عن بُعد"
                  />

                  <Field
                    label="مدة التنفيذ"
                    value={serviceDuration}
                    onChange={setServiceDuration}
                    placeholder="مثال: 5 ساعات أو 10 أيام عمل"
                  />
                </>
              )}
            </ContractSection>

            {isPro && (
              <ContractSection
                title="المخرجات والملاحظات"
                description="وضح ما سيتسلمه العميل وأي تفاصيل إضافية مرتبطة بالخدمة."
              >
                <TextAreaField
                  label="المخرجات المتفق عليها"
                  value={deliverables}
                  onChange={setDeliverables}
                  placeholder="مثال: الملفات النهائية، عدد التصاميم، التقرير، جلسة التسليم..."
                  className="md:col-span-2"
                />

                <TextAreaField
                  label="ملاحظات الخدمة"
                  value={serviceNotes}
                  onChange={setServiceNotes}
                  placeholder="أي ملاحظات أو متطلبات إضافية خاصة بهذا الاتفاق..."
                  className="md:col-span-2"
                />
              </ContractSection>
            )}

            <ContractSection
              title="البيانات المالية"
              description="حدد قيمة العقد والدفعات المرتبطة به."
            >
              <Field
                label="قيمة العقد"
                type="number"
                value={contractValue}
                onChange={setContractValue}
                placeholder="0 ريال"
                min="0"
                required
              />

              <Field
                label="العربون أو المبلغ المدفوع"
                type="number"
                value={deposit}
                onChange={setDeposit}
                placeholder="0 ريال"
                min="0"
              />

              {isPro && (
                <>
                  <Field
                    label="طريقة الدفع"
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    placeholder="مثال: تحويل بنكي"
                  />

                  <Field
                    label="تاريخ استحقاق المتبقي"
                    type="date"
                    value={remainingDueDate}
                    onChange={setRemainingDueDate}
                    placeholder=""
                  />
                </>
              )}
            </ContractSection>

            {isPro && (
              <ContractSection
                title="السياسات الخاصة"
                description="أضف الأحكام الخاصة بتنفيذ هذا العقد."
              >
                <Field
                  label="مدة المراجعة بالأيام"
                  type="number"
                  value={reviewPeriodDays}
                  onChange={setReviewPeriodDays}
                  placeholder="مثال: 3"
                  min="0"
                />

                <TextAreaField
                  label="سياسة الإلغاء"
                  value={cancellationPolicy}
                  onChange={setCancellationPolicy}
                  placeholder="وضح آلية الإلغاء والمبالغ المستحقة عند الإلغاء..."
                  className="md:col-span-2"
                />

                <TextAreaField
                  label="سياسة التأجيل"
                  value={postponementPolicy}
                  onChange={setPostponementPolicy}
                  placeholder="وضح شروط وإجراءات تأجيل موعد تنفيذ الخدمة..."
                  className="md:col-span-2"
                />

                <TextAreaField
                  label="الملكية الفكرية وحقوق الاستخدام"
                  value={intellectualPropertyPolicy}
                  onChange={setIntellectualPropertyPolicy}
                  placeholder="وضح ملكية المخرجات وحقوق استخدامها ونشرها..."
                  className="md:col-span-2"
                />
              </ContractSection>
            )}

            <section className="mithaq-card rounded-[32px] p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-[var(--mithaq-primary)]">
                    النص القانوني
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                    شروط العقد
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
                    يمكنك تعديل النص لهذا العقد فقط قبل الحفظ.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetTerms}
                  className="mithaq-btn-secondary px-5 py-3 text-sm"
                >
                  استعادة الشروط الافتراضية
                </button>
              </div>

              <textarea
                value={contractTerms}
                onChange={(event) =>
                  setContractTerms(event.target.value)
                }
                rows={isPro ? 20 : 12}
                className="w-full resize-y rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-4 text-sm leading-8 text-[var(--mithaq-text)] outline-none transition focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
                placeholder="اكتب شروط العقد هنا..."
              />
            </section>
          </div>

          <aside className="h-fit xl:sticky xl:top-6">
            <section className="mithaq-card-premium rounded-[32px] p-6">
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                مراجعة قبل الحفظ
              </p>

              <h2 className="mt-1 text-2xl font-black text-[var(--mithaq-text)]">
                ملخص العقد
              </h2>

              <div className="mt-6 space-y-3">
                <Summary
                  label="العميل"
                  value={clientName || "-"}
                />

                <Summary
                  label="نوع الخدمة"
                  value={eventType || "-"}
                />

                <Summary
                  label="تاريخ التنفيذ"
                  value={eventDate || "-"}
                />

                {isPro && serviceLocation && (
                  <Summary
                    label="مكان التنفيذ"
                    value={serviceLocation}
                  />
                )}

                <Summary
                  label="قيمة العقد"
                  value={`${Number(contractValue) || 0} ر.س`}
                />

                <Summary
                  label="المدفوع"
                  value={`${Number(deposit) || 0} ر.س`}
                />

                <Summary
                  label="المتبقي"
                  value={`${remainingAmount} ر.س`}
                  highlight={remainingAmount > 0}
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loadingContractType}
                className="mithaq-btn-primary mt-6 flex w-full items-center justify-center px-6 py-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "جاري حفظ العقد..." : "حفظ العقد"}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function ContractSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mithaq-card rounded-[32px] p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[var(--mithaq-text)]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-7 text-[var(--mithaq-muted)]">
          {description}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
        {label}
        {required && (
          <span className="mr-1 text-red-500">*</span>
        )}
      </span>

      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 text-sm text-[var(--mithaq-text)] outline-none transition placeholder:text-[var(--mithaq-muted-soft)] focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-black text-[var(--mithaq-text)]">
        {label}
        {required && (
          <span className="mr-1 text-red-500">*</span>
        )}
      </span>

      <textarea
        rows={4}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full resize-y rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--mithaq-text)] outline-none transition placeholder:text-[var(--mithaq-muted-soft)] focus:border-[var(--mithaq-primary)] focus:ring-2 focus:ring-[var(--mithaq-primary-soft)]"
      />
    </label>
  );
}

function Summary({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm ${
        highlight
          ? "bg-[var(--mithaq-primary)] text-white"
          : "border border-[var(--mithaq-border)] bg-white"
      }`}
    >
      <span
        className={
          highlight
            ? "text-white/85"
            : "text-[var(--mithaq-muted)]"
        }
      >
        {label}
      </span>

      <span
        className={`max-w-[58%] break-words text-left font-black ${
          highlight
            ? "text-white"
            : "text-[var(--mithaq-text)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}