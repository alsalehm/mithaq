"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  MessageCircle,
  Phone,
  ReceiptText,
  UserRound,
  Wallet,
} from "lucide-react";

type Contract = {
  id: string;
  user_id: string;
  customer_id: string | null;
  client_name: string;
  client_phone: string;
  event_type: string;
  event_date: string;
  contract_value: number;
  deposit: number;
  status: string;
  signature_image: string | null;
  photographer_signature_image: string | null;
  amount_paid: number;
  remaining_amount: number;
  payment_status: string;
  contract_terms: string | null;
};

export default function ContractDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [profileSignature, setProfileSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  useEffect(() => {
    async function loadContract() {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setContract(data);

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

    if (id) loadContract();
  }, [id]);

  async function sendToClient() {
    if (!contract) return;

    let phone = (contract.client_phone || "")
      .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
      .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
      .replace(/\D/g, "");

    if (phone.startsWith("05")) {
      phone = "966" + phone.substring(1);
    } else if (phone.startsWith("5")) {
      phone = "966" + phone;
    } else if (phone.startsWith("9660")) {
      phone = "966" + phone.substring(4);
    }

    const signUrl = window.location.origin + "/sign/" + contract.id;

    const message = `مرحباً ${contract.client_name}

تم تجهيز عقدك.

نوع المناسبة: ${contract.event_type}
تاريخ المناسبة: ${contract.event_date}
قيمة العقد: ${contract.contract_value} ر.س

للتوقيع على العقد:
${signUrl}

شكراً لك 🌷`;

    await supabase
      .from("contracts")
      .update({ status: "sent" })
      .eq("id", contract.id);

    setContract({ ...contract, status: "sent" });

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  async function completeContract() {
    if (!contract) return;

    await supabase
      .from("contracts")
      .update({ status: "completed" })
      .eq("id", contract.id);

    setContract({ ...contract, status: "completed" });
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

    const invoiceNumber = "INV-" + Date.now();

    const { data, error } = await supabase
      .from("invoices")
      .insert({
        user_id: contract.user_id,
        contract_id: contract.id,
        customer_id: contract.customer_id || null,
        invoice_number: invoiceNumber,
        client_name: contract.client_name,
        amount: invoiceAmount,
        due_date: contract.event_date,
        notes: `فاتورة مرتبطة بعقد: ${contract.event_type}`,
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

  const photographerSignature =
    contract.photographer_signature_image || profileSignature;

  const contractTerms = (
    contract.contract_terms ||
    `يلتزم المصور بتنفيذ جلسة التصوير في التاريخ المتفق عليه.

يلتزم العميل بسداد كامل قيمة العقد قبل تسليم الملفات النهائية.

العربون المدفوع غير مسترد في حال إلغاء المناسبة من قبل العميل.

مدة تسليم الصور النهائية من 7 إلى 14 يوم عمل بعد المناسبة.

لا يحق للعميل إعادة بيع أو تعديل الصور التجارية دون موافقة المصور.`
  )
    .split("\n")
    .filter((line) => line.trim() !== "");

  const statusLabel =
    contract.status === "draft"
      ? "مسودة"
      : contract.status === "sent"
      ? "تم الإرسال"
      : contract.status === "signed"
      ? "موقع"
      : contract.status === "completed"
      ? "مكتمل"
      : contract.status;

  const paymentStatusLabel =
    contract.payment_status === "unpaid"
      ? "غير مدفوع"
      : contract.payment_status === "partial"
      ? "مدفوع جزئياً"
      : contract.payment_status === "paid"
      ? "مدفوع بالكامل"
      : contract.payment_status;

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
              <h1 className="mt-2 text-4xl font-black text-[var(--mithaq-text)]">
                عقد {contract.client_name}
              </h1>
              <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
                راجع تفاصيل العقد وأرسله للعميل أو أنشئ فاتورة مرتبطة به.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contracts"
                className="mithaq-btn-secondary px-5 py-3 text-sm"
              >
                رجوع للعقود
              </Link>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--mithaq-primary)] px-5 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-60"
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
                {creatingInvoice ? "جاري إنشاء الفاتورة..." : "إنشاء فاتورة"}
              </button>

              {contract.status === "signed" && (
                <button
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
          <div className="mb-8 border-b border-[var(--mithaq-border)] pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)] print:hidden">
                  <FileText size={28} />
                </div>
                <h2 className="text-3xl font-black text-[var(--mithaq-text)]">
                  عقد تصوير
                </h2>
                <p className="mt-2 text-sm text-[var(--mithaq-muted)]">
                  صادر من منصة ميثاق لإدارة عقود المصورين
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--mithaq-primary-soft)] px-4 py-2 text-sm font-black text-[var(--mithaq-primary)]">
                  {statusLabel}
                </span>
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
                  {paymentStatusLabel}
                </span>
              </div>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            <InfoCard label="العميل" value={contract.client_name} icon={UserRound} />
            <InfoCard label="الجوال" value={contract.client_phone} icon={Phone} />
            <InfoCard
              label="نوع المناسبة"
              value={contract.event_type}
              icon={BadgeCheck}
            />
            <InfoCard
              label="تاريخ المناسبة"
              value={contract.event_date}
              icon={CalendarDays}
            />
            <InfoCard
              label="قيمة العقد"
              value={`${Number(contract.contract_value || 0).toLocaleString()} ر.س`}
              icon={Wallet}
            />
            <InfoCard
              label="العربون"
              value={`${Number(contract.deposit || 0).toLocaleString()} ر.س`}
              icon={Wallet}
            />
            <InfoCard
              label="المدفوع"
              value={`${Number(contract.amount_paid || 0).toLocaleString()} ر.س`}
              icon={Wallet}
            />
            <InfoCard
              label="المتبقي"
              value={`${Number(contract.remaining_amount || 0).toLocaleString()} ر.س`}
              icon={Wallet}
            />
          </section>
        </section>

        <section className="contract-print-page contract-page-two rounded-[32px] border border-[var(--mithaq-border)] bg-white p-8 shadow-[var(--mithaq-shadow-sm)]">
          <section className="rounded-[32px] border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--mithaq-primary-soft)] text-[var(--mithaq-primary)] print:hidden">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--mithaq-text)]">
                  بنود العقد
                </h3>
                <p className="mt-1 text-sm text-[var(--mithaq-muted)]">
                  الشروط الأساسية المتفق عليها بين الطرفين.
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3 leading-8 text-[var(--mithaq-muted)]">
              {contractTerms.map((term, index) => (
                <li
                  key={index}
                  className="rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3"
                >
                  {term}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <SignatureBox
              title="توقيع العميل"
              image={contract.signature_image}
              alt="توقيع العميل"
            />

            <SignatureBox
              title="توقيع المصور"
              image={photographerSignature}
              alt="توقيع المصور"
            />
          </section>
        </section>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 8mm;
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
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
            gap: 0 !important;
          }

          .contract-print-page {
            width: 100% !important;
            min-height: calc(297mm - 16mm) !important;
            box-shadow: none !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .contract-page-one {
            page-break-after: always;
            break-after: page;
          }

          .contract-page-two {
            page-break-after: auto;
            break-after: auto;
          }

          .contract-print-page section {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .contract-page-one .grid {
            gap: 10px !important;
          }

          .contract-page-one [class*="p-5"] {
            padding: 12px !important;
          }

          .contract-page-two {
            padding-top: 14mm !important;
          }

          .contract-page-two li {
            padding-top: 8px !important;
            padding-bottom: 8px !important;
            line-height: 1.6 !important;
          }

          img {
            max-width: 100%;
            break-inside: avoid;
            page-break-inside: avoid;
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

function InfoCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[var(--mithaq-border)] bg-[var(--mithaq-surface-soft)] p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-[var(--mithaq-muted)]">
        <Icon size={16} className="text-[var(--mithaq-primary)] print:hidden" />
        <span>{label}</span>
      </div>
      <p className="mt-2 text-lg font-black text-[var(--mithaq-text)]">
        {value}
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
      <p className="font-black text-[var(--mithaq-text)]">{title}</p>

      {image ? (
        <img
          src={image}
          alt={alt}
          className="mt-4 max-h-28 rounded-2xl border border-[var(--mithaq-border)] bg-white p-3"
        />
      ) : (
        <div className="mt-12 border-b border-[var(--mithaq-muted-soft)]"></div>
      )}
    </div>
  );
}
