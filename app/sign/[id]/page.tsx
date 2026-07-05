"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { DEFAULT_CONTRACT_TERMS } from "../../lib/defaultContractTerms";
import SignatureCanvas from "react-signature-canvas";

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

export default function SignPage() {
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [signed, setSigned] = useState(false);
  const [signing, setSigning] = useState(false);
  const [message, setMessage] = useState("");

  const sigRef = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    async function loadContract() {
      const { data } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setContract(data);
        setSigned(data.status === "signed" || data.status === "completed");
      }
    }

    if (id) {
      loadContract();
    }
  }, [id]);

  async function signContract() {
    if (!contract || signing) return;

    if (!sigRef.current || sigRef.current.isEmpty()) {
      setMessage("الرجاء رسم توقيعك أولاً");
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
      setMessage("حدث خطأ أثناء توقيع العقد");
      return;
    }

    setContract({
      ...contract,
      status: "signed",
      signature_image: signatureImage,
    });

    setSigned(true);
    setMessage("تم توقيع العقد بنجاح ✅");
  }

  if (!contract) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-[#F5E9DC]"
      >
        جاري التحميل...
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold text-[#75532F]">
          عقد تصوير
        </h1>

        <div className="space-y-4 text-lg">
          <p>
            <strong>العميل:</strong> {contract.client_name}
          </p>

          <p>
            <strong>نوع المناسبة:</strong> {contract.event_type}
          </p>

          <p>
            <strong>التاريخ:</strong> {contract.event_date}
          </p>

          <p>
            <strong>قيمة العقد:</strong> {contract.contract_value} ر.س
          </p>

          <p>
            <strong>العربون:</strong> {contract.deposit} ر.س
          </p>
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="mb-4 text-xl font-bold">بنود العقد</h2>

          <ul className="space-y-3 leading-8 text-gray-700">
  {(contract.contract_terms?.trim() || DEFAULT_CONTRACT_TERMS)
    .split("\n")
    .filter((term) => term.trim() !== "")
    .map((term, index) => (
      <li key={index}>{term}</li>
    ))}
</ul>
</div>
        {!signed ? (
          <div className="mt-10">
            <p className="mb-3 font-bold text-[#75532F]">
              ارسم توقيعك هنا
            </p>

            <div className="rounded-xl border border-[#D9C3A6] bg-white">
              <SignatureCanvas
                ref={sigRef}
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 180,
                  className: "w-full rounded-xl",
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => sigRef.current?.clear()}
              className="mt-3 rounded-xl bg-[#F0E2D0] px-5 py-2 font-bold text-[#75532F]"
            >
              مسح التوقيع
            </button>

            <button
              onClick={signContract}
              className="mt-4 w-full rounded-xl bg-[#75532F] py-4 font-bold text-white"
            >
              {signing ? "جاري التوقيع..." : "أوافق وأوقع العقد"}
            </button>
          </div>
        ) : (
          <div className="mt-10 rounded-xl bg-green-100 p-4 text-center font-bold text-green-700">
            ✅ تم توقيع العقد بنجاح
          </div>
        )}

        {message && (
          <p className="mt-4 text-center font-bold text-[#75532F]">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}