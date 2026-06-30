"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Contract = {
  id: string;
  user_id: string;
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
      alert(error.message);
      return;
    }

    window.location.href = `/invoices/${data.id}`;
  }

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
        جاري تحميل العقد...
      </main>
    );
  }

  if (!contract) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#F5E9DC] p-8 text-[#362008]">
        لم يتم العثور على العقد
      </main>
    );
  }

  const photographerSignature =
    contract.photographer_signature_image || profileSignature;

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] px-6 py-10 text-[#362008]">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg">
        <div className="mb-8 border-b border-[#D9C3A6] pb-6">
          <h1 className="text-3xl font-bold text-[#75532F]">عقد تصوير</h1>
          <p className="mt-2 text-sm text-[#4F381D]">
            صادر من منصة ميثاق لإدارة عقود المصورين
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3 print:hidden">
          <a
            href="/contracts"
            className="rounded-xl bg-[#F0E2D0] px-5 py-3 font-bold text-[#75532F]"
          >
            رجوع للعقود
          </a>

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-black px-5 py-3 font-bold text-white"
          >
            تحميل PDF
          </button>

          <button
            type="button"
            onClick={sendToClient}
            className="rounded-xl bg-[#75532F] px-5 py-3 font-bold text-white"
          >
            إرسال للعميل
          </button>

          <button
            type="button"
            onClick={createInvoiceFromContract}
            disabled={creatingInvoice}
            className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60"
          >
            {creatingInvoice ? "جاري إنشاء الفاتورة..." : "إنشاء فاتورة"}
          </button>

          {contract.status === "signed" && (
            <button
              onClick={completeContract}
              className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white"
            >
              إنهاء العقد
            </button>
          )}
        </div>

        <div className="space-y-4 text-lg">
          <p><strong>العميل:</strong> {contract.client_name}</p>
          <p><strong>الجوال:</strong> {contract.client_phone}</p>
          <p><strong>نوع المناسبة:</strong> {contract.event_type}</p>
          <p><strong>تاريخ المناسبة:</strong> {contract.event_date}</p>
          <p><strong>قيمة العقد:</strong> {contract.contract_value} ر.س</p>
          <p><strong>العربون:</strong> {contract.deposit} ر.س</p>
          <p><strong>المدفوع:</strong> {contract.amount_paid} ر.س</p>
          <p><strong>المتبقي:</strong> {contract.remaining_amount} ر.س</p>

          <p>
            <strong>الحالة المالية:</strong>{" "}
            {contract.payment_status === "unpaid"
              ? "غير مدفوع"
              : contract.payment_status === "partial"
              ? "مدفوع جزئياً"
              : contract.payment_status === "paid"
              ? "مدفوع بالكامل"
              : contract.payment_status}
          </p>

          <p>
            <strong>الحالة:</strong>{" "}
            {contract.status === "draft"
              ? "مسودة"
              : contract.status === "sent"
              ? "تم الإرسال"
              : contract.status === "signed"
              ? "موقع"
              : contract.status === "completed"
              ? "مكتمل"
              : contract.status}
          </p>

          <div className="mt-10 border-t pt-6">
            <h2 className="mb-4 text-xl font-bold text-[#75532F]">بنود العقد</h2>

            <ul className="space-y-3 text-gray-700 leading-8">
              <li>يلتزم المصور بتنفيذ جلسة التصوير في التاريخ المتفق عليه.</li>
              <li>يلتزم العميل بسداد كامل قيمة العقد قبل تسليم الملفات النهائية.</li>
              <li>العربون المدفوع غير مسترد في حال إلغاء المناسبة من قبل العميل.</li>
              <li>مدة تسليم الصور النهائية من 7 إلى 14 يوم عمل بعد المناسبة.</li>
              <li>لا يحق للعميل إعادة بيع أو تعديل الصور التجارية دون موافقة المصور.</li>
            </ul>

            <div className="mt-12 grid grid-cols-2 gap-10">
              <div>
                <p className="font-bold">توقيع العميل</p>

                {contract.signature_image ? (
                  <img
                    src={contract.signature_image}
                    alt="توقيع العميل"
                    className="mt-2 max-h-20 rounded border bg-white p-1"
                  />
                ) : (
                  <div className="mt-6 border-b border-gray-400"></div>
                )}
              </div>

              <div>
                <p className="font-bold">توقيع المصور</p>

                {photographerSignature ? (
                  <img
                    src={photographerSignature}
                    alt="توقيع المصور"
                    className="mt-2 max-h-20 rounded border bg-white p-1"
                  />
                ) : (
                  <div className="mt-6 border-b border-gray-400"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          main {
            background: white !important;
            padding: 0 !important;
          }

          .shadow-lg {
            box-shadow: none !important;
          }
        }
      `}</style>
    </main>
  );
}