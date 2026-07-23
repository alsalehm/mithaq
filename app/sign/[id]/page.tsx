"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileSignature,
  FileText,
  IdCard,
  LoaderCircle,
  Mail,
  MapPin,
  NotebookText,
  PackageCheck,
  Phone,
  RotateCcw,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { supabase } from "../../lib/supabase";
import { DEFAULT_CONTRACT_TERMS } from "../../lib/defaultContractTerms";

type Contract = {
  id: string;

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

export default function SignPage() {
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [signed, setSigned] = useState(false);
  const [signing, setSigning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");

  const sigRef = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    async function loadContract() {
      setLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setLoadError("تعذر العثور على العقد المطلوب.");
        setLoading(false);
        return;
      }

      setContract(data as Contract);

      setSigned(
        data.status === "signed" ||
          data.status === "completed"
      );

      setLoading(false);
    }

    if (id && id !== "[id]") {
      loadContract();
    } else {
      setLoadError("رابط العقد غير صالح.");
      setLoading(false);
    }
  }, [id]);

  async function signContract() {
    if (!contract || signing) return;

    if (!sigRef.current || sigRef.current.isEmpty()) {
      setMessage("الرجاء رسم توقيعك أولًا.");
      return;
    }

    setSigning(true);
    setMessage("");

    const signatureImage =
      sigRef.current.toDataURL("image/png");

    const { error } = await supabase
      .from("contracts")
      .update({
        status: "signed",
        signature_image: signatureImage,
      })
      .eq("id", contract.id);

    setSigning(false);

    if (error) {
      setMessage(
        "حدث خطأ أثناء توقيع العقد. حاول مرة أخرى."
      );
      return;
    }

    setContract({
      ...contract,
      status: "signed",
      signature_image: signatureImage,
    });

    setSigned(true);
    setMessage("");
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#F8F1E8] px-5"
      >
        <section className="w-full max-w-md rounded-[30px] border border-[#E7D6C2] bg-white p-8 text-center shadow-[0_24px_70px_rgba(42,26,12,0.14)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F8F1E8] text-[#75532F]">
            <LoaderCircle
              className="animate-spin"
              size={32}
            />
          </div>

          <h1 className="mt-6 text-2xl font-black text-[#2A1A0C]">
            جاري تحميل العقد
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#6B5A49]">
            يتم تجهيز تفاصيل العقد للتوقيع الإلكتروني.
          </p>
        </section>
      </main>
    );
  }

  if (loadError || !contract) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#F8F1E8] px-5"
      >
        <section className="w-full max-w-md rounded-[30px] border border-red-200 bg-white p-8 text-center shadow-[0_24px_70px_rgba(42,26,12,0.14)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600">
            <CircleAlert size={32} />
          </div>

          <h1 className="mt-6 text-2xl font-black text-[#2A1A0C]">
            تعذر فتح العقد
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#6B5A49]">
            {loadError ||
              "لم نتمكن من تحميل بيانات العقد."}
          </p>
        </section>
      </main>
    );
  }

  const isPro = contract.contract_type === "pro";

  const legalTerms = getLegalTerms(
    contract.contract_terms,
    isPro
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F8F1E8] px-4 py-8 sm:px-6 sm:py-12"
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 text-center">
          <p className="text-3xl font-black text-[#75532F]">
            ميثاق
          </p>

          <p className="mt-2 text-sm font-bold text-[#B59676]">
            توقيع العقود إلكترونيًا
          </p>
        </header>

        <section className="overflow-hidden rounded-[32px] border border-[#E7D6C2] bg-white shadow-[0_30px_90px_rgba(42,26,12,0.18)] sm:rounded-[38px]">
          <div className="border-b border-[#EFE4D7] bg-[#2A1A0C] px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#D8BFA3]">
                  {isPro
                    ? "عقد احترافي — Pro"
                    : "عقد إلكتروني"}
                </p>

                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                  مراجعة العقد والتوقيع
                </h1>

                <p className="mt-3 text-sm leading-7 text-[#F5E9DC]/75">
                  يرجى مراجعة جميع بيانات العقد وبنوده قبل
                  إضافة توقيعك.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#F5E9DC]">
                <FileSignature size={28} />
              </div>
            </div>
          </div>

          <div className="space-y-8 p-5 sm:p-8 md:p-10">
            {isPro ? (
              <>
                <SignSection
                  title="بيانات الطرف الأول — مقدم الخدمة"
                  description="البيانات المثبتة لمقدم الخدمة في هذا العقد."
                  icon={Building2}
                >
                  <ContractDetail
                    label="الاسم"
                    value={contract.provider_name}
                    icon={UserRound}
                  />

                  <ContractDetail
                    label="اسم النشاط"
                    value={contract.provider_business_name}
                    icon={Building2}
                  />

                  <ContractDetail
                    label="رقم الإثبات"
                    value={contract.provider_proof_number}
                    icon={IdCard}
                  />

                  <ContractDetail
                    label="رقم الجوال"
                    value={contract.provider_phone}
                    icon={Phone}
                  />

                  <ContractDetail
                    label="البريد الإلكتروني"
                    value={contract.provider_email}
                    icon={Mail}
                  />

                  <ContractDetail
                    label="المدينة"
                    value={contract.provider_city}
                    icon={MapPin}
                  />
                </SignSection>

                <SignSection
                  title="بيانات الطرف الثاني — العميل"
                  description="بياناتك المثبتة في هذا العقد."
                  icon={UserRound}
                >
                  <ContractDetail
                    label="الاسم"
                    value={contract.client_name}
                    icon={UserRound}
                  />

                  <ContractDetail
                    label="رقم الإثبات"
                    value={contract.client_proof_number}
                    icon={IdCard}
                  />

                  <ContractDetail
                    label="رقم الجوال"
                    value={contract.client_phone}
                    icon={Phone}
                  />

                  <ContractDetail
                    label="البريد الإلكتروني"
                    value={contract.client_email}
                    icon={Mail}
                  />

                  <ContractDetail
                    label="المدينة"
                    value={contract.client_city}
                    icon={MapPin}
                  />
                </SignSection>

                <SignSection
                  title="تفاصيل الخدمة"
                  description="طبيعة الخدمة وموعد ومكان تنفيذها."
                  icon={BadgeCheck}
                >
                  <ContractDetail
                    label="نوع الخدمة"
                    value={contract.event_type}
                    icon={BadgeCheck}
                  />

                  <ContractDetail
                    label="تاريخ التنفيذ"
                    value={formatDate(contract.event_date)}
                    icon={CalendarDays}
                  />

                  <ContractDetail
                    label="وقت التنفيذ"
                    value={formatTime(contract.service_time)}
                    icon={Clock3}
                  />

                  <ContractDetail
                    label="مكان التنفيذ"
                    value={contract.service_location}
                    icon={MapPin}
                  />

                  <ContractDetail
                    label="مدة التنفيذ"
                    value={contract.service_duration}
                    icon={Clock3}
                  />

                  <WideContractDetail
                    label="وصف الخدمة"
                    value={contract.service_description}
                    icon={NotebookText}
                  />
                </SignSection>

                <SignSection
                  title="المخرجات والملاحظات"
                  description="ما سيتم تسليمه وأي تفاصيل إضافية مرتبطة بالخدمة."
                  icon={PackageCheck}
                >
                  <WideContractDetail
                    label="المخرجات المتفق عليها"
                    value={contract.deliverables}
                    icon={PackageCheck}
                  />

                  <WideContractDetail
                    label="ملاحظات الخدمة"
                    value={contract.service_notes}
                    icon={NotebookText}
                  />
                </SignSection>

                <SignSection
                  title="البيانات المالية"
                  description="قيمة العقد والدفعات والاستحقاقات."
                  icon={Banknote}
                >
                  <ContractDetail
                    label="قيمة العقد"
                    value={formatCurrency(
                      contract.contract_value
                    )}
                    icon={WalletCards}
                  />

                  <ContractDetail
                    label="العربون أو المدفوع"
                    value={formatCurrency(contract.deposit)}
                    icon={WalletCards}
                  />

                  <ContractDetail
                    label="إجمالي المدفوع"
                    value={formatCurrency(
                      contract.amount_paid
                    )}
                    icon={WalletCards}
                  />

                  <ContractDetail
                    label="المبلغ المتبقي"
                    value={formatCurrency(
                      contract.remaining_amount
                    )}
                    icon={WalletCards}
                  />

                  <ContractDetail
                    label="طريقة الدفع"
                    value={contract.payment_method}
                    icon={Banknote}
                  />

                  <ContractDetail
                    label="تاريخ استحقاق المتبقي"
                    value={formatDate(
                      contract.remaining_due_date
                    )}
                    icon={CalendarDays}
                  />
                </SignSection>

                <SignSection
                  title="السياسات الخاصة"
                  description="الأحكام الخاصة المتفق عليها لتنفيذ العقد."
                  icon={ShieldCheck}
                >
                  <ContractDetail
                    label="مدة المراجعة"
                    value={
                      contract.review_period_days !== null &&
                      contract.review_period_days !==
                        undefined
                        ? `${contract.review_period_days} يوم`
                        : null
                    }
                    icon={CalendarDays}
                  />

                  <WideContractDetail
                    label="سياسة الإلغاء"
                    value={contract.cancellation_policy}
                    icon={ShieldCheck}
                  />

                  <WideContractDetail
                    label="سياسة التأجيل"
                    value={contract.postponement_policy}
                    icon={ShieldCheck}
                  />

                  <WideContractDetail
                    label="الملكية الفكرية وحقوق الاستخدام"
                    value={
                      contract.intellectual_property_policy
                    }
                    icon={ShieldCheck}
                  />
                </SignSection>
              </>
            ) : (
              <section>
                <h2 className="text-xl font-black text-[#2A1A0C]">
                  تفاصيل العقد
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <ContractDetail
                    label="اسم العميل"
                    value={contract.client_name}
                    icon={UserRound}
                  />

                  <ContractDetail
                    label="نوع الخدمة أو المناسبة"
                    value={contract.event_type}
                    icon={BadgeCheck}
                  />

                  <ContractDetail
                    label="التاريخ"
                    value={formatDate(contract.event_date)}
                    icon={CalendarDays}
                  />

                  <ContractDetail
                    label="قيمة العقد"
                    value={formatCurrency(
                      contract.contract_value
                    )}
                    icon={WalletCards}
                  />

                  <ContractDetail
                    label="العربون"
                    value={formatCurrency(contract.deposit)}
                    icon={WalletCards}
                  />

                  <ContractDetail
                    label="المبلغ المتبقي"
                    value={formatCurrency(
                      Math.max(
                        Number(
                          contract.contract_value || 0
                        ) -
                          Number(contract.deposit || 0),
                        0
                      )
                    )}
                    icon={WalletCards}
                  />
                </div>
              </section>
            )}

            <section className="border-t border-[#EFE4D7] pt-8">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F8F1E8] text-[#75532F]">
                  <FileText size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-[#2A1A0C]">
                    الشروط والأحكام القانونية
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-[#6B5A49]">
                    يرجى قراءة جميع البنود بعناية قبل
                    التوقيع.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {legalTerms.map((term, index) => (
                  <div
                    key={`${term}-${index}`}
                    className="whitespace-pre-wrap rounded-2xl border border-[#EFE4D7] bg-[#FCF9F5] px-5 py-4 text-sm font-bold leading-8 text-[#4F4032]"
                  >
                    {term}
                  </div>
                ))}
              </div>
            </section>

            {!signed ? (
              <section className="border-t border-[#EFE4D7] pt-8">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F8F1E8] text-[#75532F]">
                    <FileSignature size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-[#2A1A0C]">
                      توقيع العميل
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-[#6B5A49]">
                      ارسم توقيعك داخل المساحة التالية، ثم
                      اضغط على زر الموافقة.
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border-2 border-dashed border-[#D8BFA3] bg-white">
                  <SignatureCanvas
                    ref={sigRef}
                    penColor="#2A1A0C"
                    canvasProps={{
                      width: 900,
                      height: 240,
                      className:
                        "block h-[240px] w-full touch-none bg-white",
                    }}
                  />
                </div>

                {message && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm font-bold text-amber-700">
                    {message}
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      sigRef.current?.clear();
                      setMessage("");
                    }}
                    disabled={signing}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8BFA3] bg-white px-6 py-4 text-sm font-black text-[#75532F] transition hover:bg-[#F8F1E8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RotateCcw size={17} />
                    مسح التوقيع
                  </button>

                  <button
                    type="button"
                    onClick={signContract}
                    disabled={signing}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#75532F] px-6 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#624426] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {signing ? (
                      <>
                        <LoaderCircle
                          className="animate-spin"
                          size={18}
                        />
                        جاري حفظ التوقيع
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={18} />
                        أوافق على العقد وأوقّع إلكترونيًا
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-5 text-center text-xs leading-6 text-[#8A7765]">
                  بالضغط على زر التوقيع، فإنك تقر بأنك
                  قرأت جميع بيانات العقد وبنوده ووافقت
                  عليها.
                </p>
              </section>
            ) : (
              <section className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-emerald-600 shadow-sm">
                  <CheckCircle2 size={34} />
                </div>

                <h2 className="mt-5 text-2xl font-black text-emerald-800">
                  تم توقيع العقد بنجاح
                </h2>

                <p className="mt-3 text-sm leading-7 text-emerald-700">
                  تم حفظ توقيعك الإلكتروني وتحديث حالة
                  العقد.
                </p>

                {contract.signature_image && (
                  <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-emerald-200 bg-white p-4">
                    <p className="mb-3 text-sm font-black text-emerald-800">
                      توقيع العميل
                    </p>

                    <img
                      src={contract.signature_image}
                      alt="توقيع العميل"
                      className="mx-auto max-h-28"
                    />
                  </div>
                )}
              </section>
            )}
          </div>
        </section>

        <footer className="mt-6 text-center">
          <p className="text-xs leading-6 text-[#8A7765]">
            تم إنشاء هذا العقد وإرساله للتوقيع عبر منصة
            ميثاق.
          </p>
        </footer>
      </div>
    </main>
  );
}

function SignSection({
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
    <section className="rounded-[28px] border border-[#EFE4D7] bg-[#FCF9F5] p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EFE0CF] text-[#75532F]">
          <Icon size={22} />
        </div>

        <div>
          <h2 className="text-xl font-black text-[#2A1A0C]">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-7 text-[#6B5A49]">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function ContractDetail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[#EFE4D7] bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-black text-[#75532F]">
        {Icon && <Icon size={18} />}
        {label}
      </div>

      <p className="mt-3 break-words text-base font-bold text-[#2A1A0C]">
        {hasValue(value) ? value : "غير محدد"}
      </p>
    </div>
  );
}

function WideContractDetail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | null | undefined;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[#EFE4D7] bg-white p-4 sm:col-span-2">
      <div className="flex items-center gap-2 text-sm font-black text-[#75532F]">
        <Icon size={18} />
        {label}
      </div>

      <p className="mt-3 whitespace-pre-wrap break-words text-sm font-bold leading-8 text-[#2A1A0C]">
        {hasValue(value) ? value : "غير محدد"}
      </p>
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

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return "غير محدد";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatTime(
  value: string | null | undefined
) {
  if (!value) {
    return "غير محدد";
  }

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

function formatCurrency(
  value: number | null | undefined
) {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
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