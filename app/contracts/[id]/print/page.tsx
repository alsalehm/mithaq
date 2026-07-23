"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { DEFAULT_CONTRACT_TERMS } from "../../../lib/defaultContractTerms";

type Contract = {
  id: string;
  user_id: string;
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

export default function ContractPrintPage() {
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [profileSignature, setProfileSignature] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContract() {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setContract(null);
        setLoading(false);
        return;
      }

      setContract(data as Contract);

      if (!data.photographer_signature_image && data.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("signature_image")
          .eq("id", data.user_id)
          .single();

        setProfileSignature(profile?.signature_image || null);
      }

      setLoading(false);
    }

    if (id) {
      loadContract();
    }
  }, [id]);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#F3F0EC] p-6"
      >
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow">
          <p className="font-bold text-[#2A1A0C]">
            جاري تجهيز نسخة العقد للطباعة...
          </p>
        </div>
      </main>
    );
  }

  if (!contract) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#F3F0EC] p-6"
      >
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow">
          <p className="font-bold text-[#2A1A0C]">
            لم يتم العثور على العقد.
          </p>

          <Link
            href="/contracts"
            className="mt-5 inline-block rounded-xl bg-[#75532F] px-5 py-3 text-sm font-bold text-white"
          >
            الرجوع للعقود
          </Link>
        </div>
      </main>
    );
  }

  const isPro = contract.contract_type === "pro";

  const providerSignature =
    contract.photographer_signature_image || profileSignature;

  const legalTerms = getLegalTerms(
    contract.contract_terms,
    isPro
  );

  const statusLabel =
    contract.status === "draft"
      ? "مسودة"
      : contract.status === "sent"
        ? "تم الإرسال"
        : contract.status === "signed"
          ? "موقّع"
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
          : "غير محدد";

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#EAE6E1] py-8 text-[#2A1A0C] print:bg-white print:py-0"
    >
      <div className="no-print mx-auto mb-6 flex max-w-[210mm] items-center justify-between px-4">
        <Link
          href={`/contracts/${contract.id}`}
          className="rounded-xl border border-[#D8BFA3] bg-white px-5 py-3 text-sm font-bold text-[#75532F]"
        >
          الرجوع للعقد
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl bg-[#75532F] px-6 py-3 text-sm font-bold text-white"
        >
          حفظ العقد PDF
        </button>
      </div>

      <div className="print-document mx-auto w-[210mm] bg-white">
        <PrintPage>
          <ContractHeader
            isPro={isPro}
            statusLabel={statusLabel}
            paymentStatusLabel={paymentStatusLabel}
          />

          {isPro ? (
            <div className="space-y-6">
              <PrintSection title="بيانات الطرف الأول — مقدم الخدمة">
                <DataGrid>
                  <PrintField
                    label="الاسم"
                    value={contract.provider_name}
                  />
                  <PrintField
                    label="اسم النشاط"
                    value={contract.provider_business_name}
                  />
                  <PrintField
                    label="رقم الإثبات"
                    value={contract.provider_proof_number}
                  />
                  <PrintField
                    label="رقم الجوال"
                    value={contract.provider_phone}
                  />
                  <PrintField
                    label="البريد الإلكتروني"
                    value={contract.provider_email}
                  />
                  <PrintField
                    label="المدينة"
                    value={contract.provider_city}
                  />
                </DataGrid>
              </PrintSection>

              <PrintSection title="بيانات الطرف الثاني — العميل">
                <DataGrid>
                  <PrintField
                    label="الاسم"
                    value={contract.client_name}
                  />
                  <PrintField
                    label="رقم الإثبات"
                    value={contract.client_proof_number}
                  />
                  <PrintField
                    label="رقم الجوال"
                    value={contract.client_phone}
                  />
                  <PrintField
                    label="البريد الإلكتروني"
                    value={contract.client_email}
                  />
                  <PrintField
                    label="المدينة"
                    value={contract.client_city}
                  />
                </DataGrid>
              </PrintSection>
            </div>
          ) : (
            <PrintSection title="تفاصيل العقد">
              <DataGrid>
                <PrintField
                  label="العميل"
                  value={contract.client_name}
                />
                <PrintField
                  label="الجوال"
                  value={contract.client_phone}
                />
                <PrintField
                  label="نوع الخدمة"
                  value={contract.event_type}
                />
                <PrintField
                  label="تاريخ التنفيذ"
                  value={formatDate(contract.event_date)}
                />
                <PrintField
                  label="قيمة العقد"
                  value={formatMoney(contract.contract_value)}
                />
                <PrintField
                  label="العربون"
                  value={formatMoney(contract.deposit)}
                />
                <PrintField
                  label="المتبقي"
                  value={formatMoney(contract.remaining_amount)}
                />
              </DataGrid>
            </PrintSection>
          )}
        </PrintPage>

        {isPro && (
          <PrintPage>
            <PrintSection title="تفاصيل الخدمة">
              <DataGrid>
                <PrintField
                  label="نوع الخدمة"
                  value={contract.event_type}
                />

                <PrintField
                  label="تاريخ التنفيذ"
                  value={formatDate(contract.event_date)}
                />

                <PrintField
                  label="وقت التنفيذ"
                  value={formatTime(contract.service_time)}
                />

                <PrintField
                  label="مكان التنفيذ"
                  value={contract.service_location}
                />

                <PrintField
                  label="مدة التنفيذ"
                  value={contract.service_duration}
                />

                <PrintField
                  label="وصف الخدمة"
                  value={contract.service_description}
                  wide
                />
              </DataGrid>
            </PrintSection>

            <PrintSection title="المخرجات والملاحظات">
              <DataGrid>
                <PrintField
                  label="المخرجات المتفق عليها"
                  value={contract.deliverables}
                  wide
                />

                <PrintField
                  label="ملاحظات الخدمة"
                  value={contract.service_notes}
                  wide
                />
              </DataGrid>
            </PrintSection>

            <PrintSection title="البيانات المالية">
              <DataGrid>
                <PrintField
                  label="قيمة العقد"
                  value={formatMoney(contract.contract_value)}
                />

                <PrintField
                  label="العربون أو المبلغ المدفوع"
                  value={formatMoney(contract.deposit)}
                />

                <PrintField
                  label="إجمالي المدفوع"
                  value={formatMoney(contract.amount_paid)}
                />

                <PrintField
                  label="المبلغ المتبقي"
                  value={formatMoney(contract.remaining_amount)}
                />

                <PrintField
                  label="طريقة الدفع"
                  value={contract.payment_method}
                />

                <PrintField
                  label="تاريخ استحقاق المتبقي"
                  value={formatDate(contract.remaining_due_date)}
                />
              </DataGrid>
            </PrintSection>

            <PrintSection title="السياسات الخاصة">
              <DataGrid>
                <PrintField
                  label="مدة المراجعة"
                  value={
                    contract.review_period_days !== null &&
                    contract.review_period_days !== undefined
                      ? `${contract.review_period_days} يوم`
                      : null
                  }
                />

                <PrintField
                  label="سياسة الإلغاء"
                  value={contract.cancellation_policy}
                  wide
                />

                <PrintField
                  label="سياسة التأجيل"
                  value={contract.postponement_policy}
                  wide
                />

                <PrintField
                  label="الملكية الفكرية وحقوق الاستخدام"
                  value={contract.intellectual_property_policy}
                  wide
                />
              </DataGrid>
            </PrintSection>
          </PrintPage>
        )}

        <section className="legal-pages">
          <div className="legal-header">
            <h2>الشروط والأحكام القانونية</h2>
            <p>
              البنود القانونية المكملة للبيانات والتفاصيل
              الموضحة في العقد.
            </p>
          </div>

          <div className="legal-terms">
            {legalTerms.map((term, index) => (
              <div
                key={`${term}-${index}`}
                className="legal-term"
              >
                {term}
              </div>
            ))}
          </div>
        </section>

        <PrintPage className="signature-page">
          <div className="flex h-full flex-col">
            <div className="mb-8 border-b border-[#DCC9B5] pb-5">
              <h2 className="text-2xl font-black">
                اعتماد وتوقيع العقد
              </h2>

              <p className="mt-2 text-sm text-[#6B5A49]">
                يقر الطرفان بالموافقة على جميع بيانات العقد
                وبنوده.
              </p>
            </div>

            <div className="grid flex-1 grid-cols-2 items-center gap-8">
              <SignatureBox
                title="توقيع العميل"
                image={contract.signature_image}
              />

              <SignatureBox
                title={
                  isPro
                    ? "توقيع مقدم الخدمة"
                    : "توقيع المصور"
                }
                image={providerSignature}
              />
            </div>
          </div>
        </PrintPage>
      </div>

      <style jsx global>{`
        @page {
  size: A4;
  margin: 10mm 0;
}

        * {
          box-sizing: border-box;
        }

        .print-document {
          box-shadow: 0 20px 60px rgba(42, 26, 12, 0.15);
        }

        .print-page {
  width: 210mm;
  min-height: 277mm;
  padding: 8mm 14mm 14mm;
  background: white;
  page-break-after: always;
  break-after: page;
  overflow: hidden;
}

        .print-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }

       .legal-pages {
  width: 210mm;
  padding: 8mm 14mm 14mm;
  background: white;
}

        .legal-header {
          margin-bottom: 8mm;
          border-bottom: 1px solid #dcc9b5;
          padding-bottom: 5mm;
        }

        .legal-header h2 {
          font-size: 22px;
          font-weight: 900;
          color: #2a1a0c;
        }

        .legal-header p {
          margin-top: 6px;
          font-size: 12px;
          color: #6b5a49;
        }

        .legal-terms {
          display: block;
        }

        .legal-term {
          margin-bottom: 3mm;
          border: 1px solid #eadaca;
          border-radius: 10px;
          padding: 3mm 4mm;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.75;
          color: #4f4032;
          white-space: pre-wrap;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        @media print {
          html,
          body {
            width: 210mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          .print-document {
            width: 210mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }

          .print-page {
            margin: 0 !important;
            box-shadow: none !important;
          }

          .legal-pages {
            margin: 0 !important;
          }

          .legal-header {
            page-break-after: avoid;
            break-after: avoid;
          }

          .signature-page {
            page-break-before: always;
            break-before: page;
          }

          img {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </main>
  );
}

function PrintPage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`print-page ${className}`}>
      {children}
    </section>
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
    <header className="mb-8 border-b border-[#DCC9B5] pb-6">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h1 className="text-3xl font-black">
            {isPro
              ? "عقد تقديم خدمات احترافية"
              : "عقد تقديم خدمة"}
          </h1>

          <p className="mt-2 text-sm text-[#6B5A49]">
            صادر من منصة ميثاق لإدارة أعمال المستقلين
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2 text-xs font-black">
          {isPro && (
            <span className="rounded-full bg-[#75532F] px-4 py-2 text-white">
              عقد Pro
            </span>
          )}

          <span className="rounded-full bg-[#EFE0CF] px-4 py-2 text-[#75532F]">
            {statusLabel}
          </span>

          <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
            {paymentStatusLabel}
          </span>
        </div>
      </div>
    </header>
  );
}

function PrintSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 rounded-2xl border border-[#E5D1BD] p-5">
      <h2 className="mb-4 text-lg font-black">
        {title}
      </h2>

      {children}
    </section>
  );
}

function DataGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {children}
    </div>
  );
}

function PrintField({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string | number | null | undefined;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-[#EADACA] bg-[#FCF9F5] px-4 py-3 ${
        wide ? "col-span-2" : ""
      }`}
    >
      <p className="text-xs font-bold text-[#806A55]">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap break-words text-sm font-black leading-6">
        {hasValue(value) ? value : "غير محدد"}
      </p>
    </div>
  );
}

function SignatureBox({
  title,
  image,
}: {
  title: string;
  image: string | null;
}) {
  return (
    <div className="rounded-2xl border border-[#DCC9B5] p-6 text-center">
      <h3 className="text-lg font-black">{title}</h3>

      {image ? (
        <div className="mt-6 flex h-40 items-center justify-center rounded-xl border border-[#EADACA] bg-white p-4">
          <img
            src={image}
            alt={title}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="mt-20 border-b border-[#806A55]" />
      )}
    </div>
  );
}

function hasValue(
  value: string | number | null | undefined
) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim() !== "";
  }

  return true;
}

function formatMoney(
  value: number | null | undefined
) {
  return `${Number(value || 0).toLocaleString(
    "en-US"
  )} ر.س`;
}

function formatDate(
  value: string | null | undefined
) {
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

function formatTime(
  value: string | null | undefined
) {
  if (!value) return "غير محدد";

  const [hoursText, minutesText] = value.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText || 0);

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
  const source =
    rawTerms?.trim() || DEFAULT_CONTRACT_TERMS;

  const terms = source
    .split("\n")
    .map((term) => term.trim())
    .filter(Boolean);

  if (!isPro) {
    return terms;
  }

  const excludedLines = new Set([
    "عقد تقديم خدمات احترافية",
    "أولاً: بيانات الطرفين",
    "أولًا: بيانات الطرفين",
    "الطرف الأول: مقدم الخدمة",
    "الطرف الثاني: العميل",
    "الاسم",
    "الاسم:",
    "رقم الإثبات (الهوية الوطنية / الإقامة / السجل التجاري)",
    "رقم الإثبات (الهوية الوطنية / الإقامة / السجل التجاري):",
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
    const normalized = term
      .replace(/[•\-]/g, "")
      .trim();

    return (
      !excludedLines.has(term) &&
      !excludedLines.has(normalized)
    );
  });
}