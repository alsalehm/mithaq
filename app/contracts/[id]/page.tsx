"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  IdCard,
  Mail,
  MapPin,
  MessageCircle,
  NotebookText,
  PackageCheck,
  Phone,
  ReceiptText,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";

type Contract = {
  id: string;
  user_id: string;
  customer_id: string | null;

  contract_type: string | null;

  provider_name: string | null;
  provider_business_name: string | null;
  provider_proof_number: string | null;
  provider_phone: string | null;
  provider_email: string | null;
  provider_city: string | null;

  client_name: string;
  client_proof_number: string | null;
  client_phone: string | null;
  client_email: string | null;
  client_city: string | null;

  event_type: string | null;
  event_date: string | null;
  service_description: string | null;
  service_time: string | null;
  service_location: string | null;
  service_duration: string | null;

  deliverables: string | null;
  service_notes: string | null;

  contract_value: number | null;
  deposit: number | null;
  amount_paid: number | null;
  remaining_amount: number | null;
  payment_status: string | null;
  payment_method: string | null;
  remaining_due_date: string | null;

  review_period_days: number | null;
  cancellation_policy: string | null;
  postponement_policy: string | null;
  intellectual_property_policy: string | null;

  status: string;
  signature_image: string | null;
  photographer_signature_image: string | null;
  contract_terms: string | null;
};

export default function ContractDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [profileSignature, setProfileSignature] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  useEffect(() => {
    async function loadContract() {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("تعذر تحميل العقد");
        setLoading(false);
        return;
      }

      if (data) {
        setContract(data as Contract);

        if (!data.photographer_signature_image && data.user_id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("signature_image")
            .eq("id", data.user_id)
            .single();

          setProfileSignature(profile?.signature_image || null);
        }
      }

      setLoading(false);
    }

    if (id) {
      loadContract();
    }
  }, [id]);

  async function sendToClient() {
    if (!contract) return;

    let phone = (contract.client_phone || "")
      .replace(/[٠-٩]/g, (digit) =>
        "٠١٢٣٤٥٦٧٨٩".indexOf(digit).toString()
      )
      .replace(/[۰-۹]/g, (digit) =>
        "۰۱۲۳۴۵۶۷۸۹".indexOf(digit).toString()
      )
      .replace(/\D/g, "");

    if (phone.startsWith("05")) {
      phone = "966" + phone.substring(1);
    } else if (phone.startsWith("5")) {
      phone = "966" + phone;
    } else if (phone.startsWith("9660")) {
      phone = "966" + phone.substring(4);
    }

    if (!phone) {
      toast.error("لا يوجد رقم جوال صالح للعميل");
      return;
    }

    const signUrl = `${window.location.origin}/sign/${contract.id}`;

    const message = `مرحباً ${contract.client_name}

تم تجهيز عقدك.

نوع الخدمة: ${contract.event_type || "-"}
تاريخ التنفيذ: ${formatDate(contract.event_date)}
قيمة العقد: ${formatMoney(contract.contract_value)}

للتوقيع على العقد:
${signUrl}

شكراً لك 🌷`;

    const { error } = await supabase
      .from("contracts")
      .update({ status: "sent" })
      .eq("id", contract.id);

    if (error) {
      toast.error("تعذر تحديث حالة العقد");
      return;
    }

    setContract({
      ...contract,
      status: "sent",
    });

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  async function completeContract() {
    if (!contract) return;

    const { error } = await supabase
      .from("contracts")
      .update({ status: "completed" })
      .eq("id", contract.id);

    if (error) {
      toast.error("تعذر إنهاء العقد");
      return;
    }

    setContract({
      ...contract,
      status: "completed",
    });

    toast.success("تم إنهاء العقد");
  }

  async function createInvoiceFromContract() {
    if (!contract || creatingInvoice) return;

    const { data: existingInvoice } = await supabase
      .from("invoices")
      .select("id")
      .eq("contract_id", contract.id)
      .maybeSingle();

    if (existingInvoice) {
      window.location.href = `/invoices/${existingInvoice.id}`;
      return;
    }

    setCreatingInvoice(true);

    const invoiceAmount =
      Number(contract.remaining_amount) > 0
        ? Number(contract.remaining_amount)
        : Number(contract.contract_value);

    const invoiceNumber = `INV-${Date.now()}`;

    const { data, error } = await supabase
      .from("invoices")
      .insert({
        user_id: contract.user_id,
        contract_id: contract.id,
        customer_id: contract.customer_id || null,
        invoice_number: invoiceNumber,
        client_name: contract.client_name,
        amount: invoiceAmount,
        due_date:
          contract.remaining_due_date ||
          contract.event_date ||
          null,
        notes: `فاتورة مرتبطة بعقد: ${
          contract.event_type || "تقديم خدمات"
        }`,
        status: "unpaid",
      })
      .select("id")
      .single();

    setCreatingInvoice(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    window.location.href = `/invoices/${data.id}`;
  }

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen px-6 py-8">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">
          <div className="mithaq-card-premium rounded-[32px] p-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)]">
              <FileText size={28} />
            </div>

            <p className="text-lg font-black text-[var(--mithaq-text)]">
              جاري تحميل العقد
            </p>

            <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
              يتم تجهيز تفاصيل العقد والتواقيع.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!contract) {
    return (
      <main dir="rtl" className="min-h-screen px-6 py-8">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">
          <div className="mithaq-card-premium rounded-[32px] p-8 text-center">
            <p className="text-lg font-black text-[var(--mithaq-text)]">
              لم يتم العثور على العقد
            </p>

            <Link
              href="/contracts"
              className="mithaq-btn-primary mt-6 inline-flex px-6 py-3 text-sm"
            >
              الرجوع للعقود
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isPro = contract.contract_type === "pro";

  const photographerSignature =
    contract.photographer_signature_image || profileSignature;

  const legalTerms = getLegalTerms(contract.contract_terms, isPro);

  const statusLabel =
    contract.status === "draft"
      ? "مسودة"
      : contract.status === "sent"
        ? "تم الإرسال"
        : contract.status === "signed"
          ? "موقع"
          : contract.status === "completed"
            ? "مكتمل"
            : contract.status === "cancelled"
              ? "ملغي"
              : contract.status;

  const paymentStatusLabel =
    contract.payment_status === "unpaid"
      ? "غير مدفوع"
      : contract.payment_status === "partial"
        ? "مدفوع جزئيًا"
        : contract.payment_status === "paid"
          ? "مدفوع بالكامل"
          : contract.payment_status || "غير محدد";

  return (
    <main
      dir="rtl"
      className="print-area min-h-screen px-6 py-8 text-[var(--mithaq-text)]"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="print:hidden mithaq-card-premium rounded-[32px] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-[var(--mithaq-primary)]">
                تفاصيل العقد
              </p>

              <h1 className="mt-2 text-3xl font-black text-[var(--mithaq-text)] sm:text-4xl">
                عقد {contract.client_name}
              </h1>

              <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
                راجع تفاصيل العقد وأرسله للعميل أو أنشئ فاتورة مرتبطة به.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contracts"
                className="mithaq-btn-secondary inline-flex items-center gap-2 px-5 py-3 text-sm"
              >
                <ArrowLeft size={17} />
                رجوع للعقود
              </Link>

              <button
                type="button"
                onClick={() =>
  window.open(`/contracts/${contract.id}/print`, "_blank")
}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--mithaq-primary)] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
              >
                <Download size={18} />
                تحميل PDF
              </button>

              <button
                type="button"
                onClick={sendToClient}
                className="mithaq-btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
              >
                <MessageCircle size={18} />
                إرسال للعميل
              </button>

              <button
                type="button"
                onClick={createInvoiceFromContract}
                disabled={creatingInvoice}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--mithaq-primary)] px-5 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <ReceiptText size={18} />

                {creatingInvoice
                  ? "جاري إنشاء الفاتورة..."
                  : "إنشاء فاتورة"}
              </button>

              {contract.status === "signed" && (
                <button
                  type="button"
                  onClick={completeContract}
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-700 px-5 py-3 text-sm font-black text-white transition hover:bg-green-800"
                >
                  <CheckCircle2 size={18} />
                  إنهاء العقد
                </button>
              )}
            </div>
          </div>
        </div>

        <section className="contract-print-page contract-page-one rounded-[32px] border border-[var(--mithaq-border)] bg-white p-8 shadow-[var(--mithaq-shadow-sm)]">
          <ContractHeader
            isPro={isPro}
            statusLabel={statusLabel}
            paymentStatusLabel={paymentStatusLabel}
          />

          {isPro ? (
            <div className="space-y-7">
              <ContractDataSection
                title="بيانات الطرف الأول — مقدم الخدمة"
                description="البيانات المحفوظة لمقدم الخدمة وقت إنشاء العقد."
                icon={Building2}
              >
                <InfoCard
                  label="الاسم"
                  value={contract.provider_name}
                  icon={UserRound}
                />

                <InfoCard
                  label="اسم النشاط"
                  value={contract.provider_business_name}
                  icon={Building2}
                />

                <InfoCard
                  label="رقم الإثبات"
                  value={contract.provider_proof_number}
                  icon={IdCard}
                />

                <InfoCard
                  label="رقم الجوال"
                  value={contract.provider_phone}
                  icon={Phone}
                />

                <InfoCard
                  label="البريد الإلكتروني"
                  value={contract.provider_email}
                  icon={Mail}
                />

                <InfoCard
                  label="المدينة"
                  value={contract.provider_city}
                  icon={MapPin}
                />
              </ContractDataSection>

              <ContractDataSection
                title="بيانات الطرف الثاني — العميل"
                description="بيانات العميل المثبتة في هذا العقد."
                icon={UserRound}
              >
                <InfoCard
                  label="الاسم"
                  value={contract.client_name}
                  icon={UserRound}
                />

                <InfoCard
                  label="رقم الإثبات"
                  value={contract.client_proof_number}
                  icon={IdCard}
                />

                <InfoCard
                  label="رقم الجوال"
                  value={contract.client_phone}
                  icon={Phone}
                />

                <InfoCard
                  label="البريد الإلكتروني"
                  value={contract.client_email}
                  icon={Mail}
                />

                <InfoCard
                  label="المدينة"
                  value={contract.client_city}
                  icon={MapPin}
                />
              </ContractDataSection>
            </div>
          ) : (
            <section className="grid gap-4 md:grid-cols-2">
              <InfoCard
                label="العميل"
                value={contract.client_name}
                icon={UserRound}
              />

              <InfoCard
                label="الجوال"
                value={contract.client_phone}
                icon={Phone}
              />

              <InfoCard
                label="نوع الخدمة"
                value={contract.event_type}
                icon={BadgeCheck}
              />

              <InfoCard
                label="تاريخ التنفيذ"
                value={formatDate(contract.event_date)}
                icon={CalendarDays}
              />

              <InfoCard
                label="قيمة العقد"
                value={formatMoney(contract.contract_value)}
                icon={Wallet}
              />

              <InfoCard
                label="العربون"
                value={formatMoney(contract.deposit)}
                icon={Wallet}
              />

              <InfoCard
                label="المدفوع"
                value={formatMoney(contract.amount_paid)}
                icon={Wallet}
              />

              <InfoCard
                label="المتبقي"
                value={formatMoney(contract.remaining_amount)}
                icon={Wallet}
              />
            </section>
          )}
        </section>

        {isPro && (
          <section className="contract-print-page contract-page-two rounded-[32px] border border-[var(--mithaq-border)] bg-white p-8 shadow-[var(--mithaq-shadow-sm)]">
            <div className="space-y-7">
              <ContractDataSection
                title="تفاصيل الخدمة"
                description="طبيعة الخدمة ومعلومات تنفيذها."
                icon={BadgeCheck}
              >
                <InfoCard
                  label="نوع الخدمة"
                  value={contract.event_type}
                  icon={BadgeCheck}
                />

                <InfoCard
                  label="تاريخ التنفيذ"
                  value={formatDate(contract.event_date)}
                  icon={CalendarDays}
                />

                <InfoCard
                  label="وقت التنفيذ"
                  value={formatTime(contract.service_time)}
                  icon={Clock3}
                />

                <InfoCard
                  label="مكان التنفيذ"
                  value={contract.service_location}
                  icon={MapPin}
                />

                <InfoCard
                  label="مدة التنفيذ"
                  value={contract.service_duration}
                  icon={Clock3}
                />

                <WideInfoCard
                  label="وصف الخدمة"
                  value={contract.service_description}
                  icon={NotebookText}
                />
              </ContractDataSection>

              <ContractDataSection
                title="المخرجات والملاحظات"
                description="ما سيتسلمه العميل وأي تفاصيل إضافية خاصة بالخدمة."
                icon={PackageCheck}
              >
                <WideInfoCard
                  label="المخرجات المتفق عليها"
                  value={contract.deliverables}
                  icon={PackageCheck}
                />

                <WideInfoCard
                  label="ملاحظات الخدمة"
                  value={contract.service_notes}
                  icon={NotebookText}
                />
              </ContractDataSection>

              <ContractDataSection
                title="البيانات المالية"
                description="قيمة العقد والدفعات والاستحقاقات المرتبطة به."
                icon={Banknote}
              >
                <InfoCard
                  label="قيمة العقد"
                  value={formatMoney(contract.contract_value)}
                  icon={Wallet}
                />

                <InfoCard
                  label="العربون أو المدفوع"
                  value={formatMoney(contract.deposit)}
                  icon={Wallet}
                />

                <InfoCard
                  label="إجمالي المدفوع"
                  value={formatMoney(contract.amount_paid)}
                  icon={Wallet}
                />

                <InfoCard
                  label="المبلغ المتبقي"
                  value={formatMoney(contract.remaining_amount)}
                  icon={Wallet}
                />

                <InfoCard
                  label="طريقة الدفع"
                  value={contract.payment_method}
                  icon={Banknote}
                />

                <InfoCard
                  label="تاريخ استحقاق المتبقي"
                  value={formatDate(contract.remaining_due_date)}
                  icon={CalendarDays}
                />
              </ContractDataSection>
            </div>
          </section>
        )}

        <section
          className={`contract-print-page ${
            isPro ? "contract-page-three" : "contract-page-two"
          } rounded-[32px] border border-[var(--mithaq-border)] bg-white p-8 shadow-[var(--mithaq-shadow-sm)]`}
        >
          {isPro && (
            <div className="mb-8">
              <ContractDataSection
                title="السياسات الخاصة"
                description="الأحكام الخاصة المتفق عليها لتنفيذ هذا العقد."
                icon={ShieldCheck}
              >
                <InfoCard
                  label="مدة المراجعة"
                  value={
                    contract.review_period_days !== null &&
                    contract.review_period_days !== undefined
                      ? `${contract.review_period_days} يوم`
                      : null
                  }
                  icon={CalendarDays}
                />

                <WideInfoCard
                  label="سياسة الإلغاء"
                  value={contract.cancellation_policy}
                  icon={ShieldCheck}
                />

                <WideInfoCard
                  label="سياسة التأجيل"
                  value={contract.postponement_policy}
                  icon={ShieldCheck}
                />

                <WideInfoCard
                  label="الملكية الفكرية وحقوق الاستخدام"
                  value={contract.intellectual_property_policy}
                  icon={ShieldCheck}
                />
              </ContractDataSection>
            </div>
          )}

          <section className="rounded-[32px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)] print:hidden">
                <FileText size={22} />
              </div>

              <div>
                <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                  الشروط والأحكام القانونية
                </h3>

                <p className="mt-1 text-sm text-[var(--mithaq-muted)]">
                  البنود القانونية المكملة للبيانات والتفاصيل الموضحة في هذا
                  العقد.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 leading-8 text-[var(--mithaq-muted)]">
              {legalTerms.length > 0 ? (
                legalTerms.map((term, index) => (
                  <div
                    key={`${term}-${index}`}
                    className="whitespace-pre-wrap rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3"
                  >
                    {term}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-5 text-center">
                  لا توجد شروط إضافية محفوظة.
                </div>
              )}
            </div>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <SignatureBox
              title="توقيع العميل"
              image={contract.signature_image}
              alt="توقيع العميل"
            />

            <SignatureBox
              title={
                isPro ? "توقيع مقدم الخدمة" : "توقيع المصور"
              }
              image={photographerSignature}
              alt="توقيع مقدم الخدمة"
            />
          </section>
        </section>
      </div>

<style jsx global>{`
  @media print {
    @page {
      size: A4;
      margin: 10mm;
    }

    html,
    body {
      background: white !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    .print\\:hidden {
      display: none !important;
    }

    main {
      background: white !important;
      padding: 0 !important;
    }

    .print-area > div {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
    }

    .contract-print-page {
      width: 100% !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 10mm 7mm !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      page-break-after: auto !important;
      break-after: auto !important;
      page-break-inside: auto !important;
      break-inside: auto !important;
    }

    .contract-page-one,
    .contract-page-two,
    .contract-page-three {
      page-break-after: auto !important;
      break-after: auto !important;
    }

    .contract-print-page section {
      page-break-inside: auto !important;
      break-inside: auto !important;
    }

    .contract-print-page h2,
    .contract-print-page h3 {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    .contract-print-page .grid {
      gap: 7px !important;
    }

  .contract-print-page img,
.contract-print-page h2,
.contract-print-page h3 {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

.contract-print-page > section,
.contract-print-page .grid > div {
  page-break-inside: auto !important;
  break-inside: auto !important;
}

.contract-print-page .mt-8.grid {
  page-break-before: avoid !important;
  break-before: avoid !important;
}

.contract-print-page .mt-8.grid > div {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
.contract-page-three > section:last-of-type {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 12px !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

.contract-page-three > section:last-of-type > div {
  min-height: 120px !important;
  padding: 10px !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

.contract-page-three > section:last-of-type img {
  max-height: 70px !important;
  margin-top: 8px !important;
}

    .contract-print-page [class*="p-5"] {
      padding: 9px !important;
    }

    .contract-print-page [class*="p-6"] {
      padding: 11px !important;
    }

    .contract-print-page [class*="p-8"] {
      padding: 12px !important;
    }

    .contract-print-page [class*="space-y-7"] > :not([hidden]) ~ :not([hidden]) {
      margin-top: 12px !important;
    }

    .contract-print-page [class*="space-y-3"] > :not([hidden]) ~ :not([hidden]) {
      margin-top: 6px !important;
    }

    .contract-print-page p,
    .contract-print-page div {
      line-height: 1.45 !important;
    }

    .contract-print-page h2 {
      font-size: 22px !important;
    }

    .contract-print-page h3 {
      font-size: 17px !important;
    }

    .contract-print-page p {
      font-size: 11px !important;
    }

    img {
      max-width: 100% !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .shadow-sm,
    .shadow-\\[var\\(--mithaq-shadow-sm\\)\\],
    .shadow-\\[var\\(--mithaq-shadow-md\\)\\],
    .shadow-\\[var\\(--mithaq-shadow-lg\\)\\] {
      box-shadow: none !important;
    }
  }
`}</style>
    </main>
  );
}

function ContractHeader({
  isPro,
  statusLabel,
  paymentStatusLabel,
}: {
  isPro: boolean;
  statusLabel: string;
  paymentStatusLabel: string;
}) {
  return (
    <div className="mb-8 border-b border-[var(--mithaq-border)] pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)] print:hidden">
            <FileText size={28} />
          </div>

          <h2 className="text-3xl font-black text-[var(--mithaq-text)]">
            {isPro ? "عقد تقديم خدمات احترافية" : "عقد تقديم خدمة"}
          </h2>

          <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
            صادر من منصة ميثاق لإدارة أعمال المستقلين
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isPro && (
            <span className="rounded-full bg-[var(--mithaq-primary)] px-4 py-2 text-sm font-black text-white">
              عقد Pro
            </span>
          )}

          <span className="rounded-full bg-[var(--mithaq-primary-soft)] px-4 py-2 text-sm font-black text-[var(--mithaq-primary)]">
            {statusLabel}
          </span>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
            {paymentStatusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function ContractDataSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-[var(--mithaq-border)] bg-white p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)] print:hidden">
          <Icon size={22} />
        </div>

        <div>
          <h3 className="text-xl font-black text-[var(--mithaq-text)]">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-7 text-[var(--mithaq-muted)]">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number | null | undefined;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-[var(--mithaq-muted)]">
        <Icon
          size={16}
          className="text-[var(--mithaq-primary)] print:hidden"
        />

        <span>{label}</span>
      </div>

      <p className="mt-2 break-words text-base font-black text-[var(--mithaq-text)]">
        {hasValue(value) ? value : "غير محدد"}
      </p>
    </div>
  );
}

function WideInfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | null | undefined;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5 md:col-span-2">
      <div className="flex items-center gap-2 text-sm font-bold text-[var(--mithaq-muted)]">
        <Icon
          size={16}
          className="text-[var(--mithaq-primary)] print:hidden"
        />

        <span>{label}</span>
      </div>

      <p className="mt-3 whitespace-pre-wrap break-words text-sm font-bold leading-8 text-[var(--mithaq-text)]">
        {hasValue(value) ? value : "غير محدد"}
      </p>
    </div>
  );
}

function SignatureBox({
  title,
  image,
  alt,
}: {
  title: string;
  image: string | null;
  alt: string;
}) {
  return (
    <div className="rounded-[28px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-6">
      <p className="font-black text-[var(--mithaq-text)]">
        {title}
      </p>

      {image ? (
        <img
          src={image}
          alt={alt}
          className="mt-4 max-h-28 rounded-2xl border border-[var(--mithaq-border)] bg-white p-3"
        />
      ) : (
        <div className="mt-12 border-b border-[var(--mithaq-muted-soft)]" />
      )}
    </div>
  );
}

function hasValue(
  value: string | number | null | undefined
) {
  if (value === null || value === undefined) return false;

  if (typeof value === "string") {
    return value.trim() !== "";
  }

  return true;
}

function formatMoney(value: number | null | undefined) {
  return `${Number(value || 0).toLocaleString("en-US")} ر.س`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "غير محدد";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatTime(value: string | null | undefined) {
  if (!value) return "غير محدد";

  const parts = value.split(":");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1] || 0);

  if (Number.isNaN(hours)) {
    return value;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("ar-SA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getLegalTerms(
  rawTerms: string | null,
  isPro: boolean
) {
  const fallbackTerms = `يلتزم مقدم الخدمة بتنفيذ الخدمة المتفق عليها وفق التفاصيل المثبتة في العقد.

يلتزم العميل بسداد قيمة العقد والدفعات في المواعيد المتفق عليها.

يعد التوقيع الإلكتروني على العقد موافقة ملزمة على جميع بياناته وبنوده.

يخضع العقد للأنظمة المعمول بها في المملكة العربية السعودية.`;

  const terms = (rawTerms || fallbackTerms)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!isPro) {
    return terms;
  }

  const excludedExactLines = new Set([
    "عقد تقديم خدمات احترافية",
    "أولاً: بيانات الطرفين",
    "أولًا: بيانات الطرفين",
    "الطرف الأول: مقدم الخدمة",
    "الطرف الثاني: العميل",
    "الاسم",
    "الاسم:",
    "رقم البيان (الهوية الوطنية / الإقامة / السجل التجاري)",
    "رقم البيان (الهوية الوطنية / الإقامة / السجل التجاري):",
    "رقم الجوال",
    "رقم الجوال:",
    "البريد الإلكتروني",
    "البريد الإلكتروني:",
    "المدينة",
    "المدينة:",
  ]);

  return terms.filter((term) => {
    if (excludedExactLines.has(term)) {
      return false;
    }

    const normalized = term
      .replace(/[•\-]/g, "")
      .trim();

    if (excludedExactLines.has(normalized)) {
      return false;
    }

    return true;
  });
}