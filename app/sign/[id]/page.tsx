"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  FileSignature,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { supabase } from "../../lib/supabase";
import { DEFAULT_CONTRACT_TERMS } from "../../lib/defaultContractTerms";

type Contract = {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  contract_value: number;
  deposit: number;
  status: string;
  signature_image?: string;
  contract_terms?: string;
};

function formatDate(value: string) {
  if (!value) {
    return "غير محدد";
  }

  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ar-SA", {
  style: "currency",
  currency: "SAR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(value || 0);
}

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

      setContract(data);
      setSigned(data.status === "signed" || data.status === "completed");
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

    const signatureImage = sigRef.current.toDataURL("image/png");

    const { error } = await supabase
      .from("contracts")
      .update({
        status: "signed",
        signature_image: signatureImage,
      })
      .eq("id", contract.id);

    setSigning(false);

    if (error) {
      setMessage("حدث خطأ أثناء توقيع العقد. حاول مرة أخرى.");
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
            <LoaderCircle className="animate-spin" size={32} />
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
            {loadError || "لم نتمكن من تحميل بيانات العقد."}
          </p>
        </section>
      </main>
    );
  }

  const contractTerms = (
    contract.contract_terms?.trim() || DEFAULT_CONTRACT_TERMS
  )
    .split("\n")
    .filter((term) => term.trim() !== "");

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8F1E8] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 text-center">
          <p className="text-3xl font-black text-[#75532F]">ميثاق</p>

          <p className="mt-2 text-sm font-bold text-[#B59676]">
            توقيع العقود إلكترونيًا
          </p>
        </header>

        <section className="overflow-hidden rounded-[32px] border border-[#E7D6C2] bg-white shadow-[0_30px_90px_rgba(42,26,12,0.18)] sm:rounded-[38px]">
          <div className="border-b border-[#EFE4D7] bg-[#2A1A0C] px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#D8BFA3]">
                  عقد إلكتروني
                </p>

                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                  مراجعة العقد والتوقيع
                </h1>

                <p className="mt-3 text-sm leading-7 text-[#F5E9DC]/75">
                  يرجى مراجعة تفاصيل العقد وبنوده قبل إضافة توقيعك.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#F5E9DC]">
                <FileSignature size={28} />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8 md:p-10">
            <section>
              <h2 className="text-xl font-black text-[#2A1A0C]">
                تفاصيل العقد
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ContractDetail
                  label="اسم العميل"
                  value={contract.client_name}
                />

                <ContractDetail
                  label="نوع الخدمة أو المناسبة"
                  value={contract.event_type || "غير محدد"}
                />

                <ContractDetail
                  icon={<CalendarDays size={19} />}
                  label="التاريخ"
                  value={formatDate(contract.event_date)}
                />

                <ContractDetail
                  icon={<WalletCards size={19} />}
                  label="قيمة العقد"
                  value={formatCurrency(contract.contract_value)}
                />

                <ContractDetail
                  icon={<WalletCards size={19} />}
                  label="العربون"
                  value={formatCurrency(contract.deposit)}
                />

                <ContractDetail
                  label="المبلغ المتبقي"
                  value={formatCurrency(
                    Math.max(
                      Number(contract.contract_value || 0) -
                        Number(contract.deposit || 0),
                      0
                    )
                  )}
                />
              </div>
            </section>

            <section className="mt-10 border-t border-[#EFE4D7] pt-8">
              <h2 className="text-xl font-black text-[#2A1A0C]">
                بنود العقد
              </h2>

              <p className="mt-2 text-sm leading-7 text-[#6B5A49]">
                يرجى قراءة جميع البنود بعناية قبل التوقيع.
              </p>

              <ol className="mt-6 space-y-4">
                {contractTerms.map((term, index) => (
                  <li
                    key={`${term}-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-[#EFE4D7] bg-[#FCF9F5] p-4 text-sm leading-8 text-[#4F4032]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFE0CF] text-xs font-black text-[#75532F]">
                      {index + 1}
                    </span>

                    <span>{term}</span>
                  </li>
                ))}
              </ol>
            </section>

            {!signed ? (
              <section className="mt-10 border-t border-[#EFE4D7] pt-8">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F8F1E8] text-[#75532F]">
                    <FileSignature size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-[#2A1A0C]">
                      توقيع العميل
                    </h2>

                    <p className="mt-2 text-sm leading-7 text-[#6B5A49]">
                      ارسم توقيعك داخل المساحة التالية، ثم اضغط على زر الموافقة.
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border-2 border-dashed border-[#D8BFA3] bg-white">
                  <SignatureCanvas
                    ref={sigRef}
                    penColor="#2A1A0C"
                    canvasProps={{
                      width: 760,
                      height: 220,
                      className: "block h-[220px] w-full touch-none bg-white",
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
                        <LoaderCircle className="animate-spin" size={18} />
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
                  بالضغط على زر التوقيع، فإنك تقر بأنك قرأت تفاصيل العقد
                  وبنوده ووافقت عليها.
                </p>
              </section>
            ) : (
              <section className="mt-10 rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-emerald-600 shadow-sm">
                  <CheckCircle2 size={34} />
                </div>

                <h2 className="mt-5 text-2xl font-black text-emerald-800">
                  تم توقيع العقد بنجاح
                </h2>

                <p className="mt-3 text-sm leading-7 text-emerald-700">
                  تم حفظ توقيعك الإلكتروني وتحديث حالة العقد.
                </p>
              </section>
            )}
          </div>
        </section>

        <footer className="mt-6 text-center">
          <p className="text-xs leading-6 text-[#8A7765]">
            تم إنشاء هذا العقد وإرساله للتوقيع عبر منصة ميثاق.
          </p>
        </footer>
      </div>
    </main>
  );
}

function ContractDetail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#EFE4D7] bg-[#FCF9F5] p-4">
      <div className="flex items-center gap-2 text-sm font-black text-[#75532F]">
        {icon}
        {label}
      </div>

      <p className="mt-3 text-base font-bold text-[#2A1A0C]">
        {value}
      </p>
    </div>
  );
}