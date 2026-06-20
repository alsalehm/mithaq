"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Contract = {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  contract_value: number;
  deposit: number;
  status: string;
};

export default function SignPage() {
  const params = useParams();
  const id = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [signed, setSigned] = useState(false);
const [signing, setSigning] = useState(false);
const [message, setMessage] = useState("");
  useEffect(() => {
    async function loadContract() {
      const { data } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setContract(data);
      }
    }

    if (id) {
      loadContract();
    }
  }, [id]);
async function signContract() {
  if (!contract || signing) return;

  setSigning(true);
  setMessage("");

  const { error } = await supabase
    .from("contracts")
    .update({
      status: "completed",
    })
    .eq("id", contract.id);

  setSigning(false);

  if (error) {
    setMessage("حدث خطأ أثناء توقيع العقد");
    return;
  }

  setContract({
    ...contract,
    status: "completed",
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
    <main
      dir="rtl"
      className="min-h-screen bg-[#F5E9DC] px-6 py-10"
    >
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg">

        <h1 className="mb-8 text-center text-3xl font-bold text-[#75532F]">
          عقد تصوير
        </h1>

        <div className="space-y-4 text-lg">
          <p><strong>العميل:</strong> {contract.client_name}</p>
          <p><strong>نوع المناسبة:</strong> {contract.event_type}</p>
          <p><strong>التاريخ:</strong> {contract.event_date}</p>
          <p><strong>قيمة العقد:</strong> {contract.contract_value} ر.س</p>
          <p><strong>العربون:</strong> {contract.deposit} ر.س</p>
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="mb-4 text-xl font-bold">
            بنود العقد
          </h2>

          <ul className="space-y-3">
            <li>يلتزم المصور بتنفيذ جلسة التصوير في التاريخ المحدد.</li>
            <li>يلتزم العميل بسداد كامل قيمة العقد.</li>
            <li>العربون غير مسترد عند الإلغاء.</li>
            <li>مدة التسليم من 7 إلى 14 يوم عمل.</li>
          </ul>
        </div>

        {!signed ? (
          <button
            onClick={signContract}
            className="mt-10 w-full rounded-xl bg-[#75532F] py-4 font-bold text-white"
          >
            أوافق على العقد
          </button>
        ) : (
          <div className="mt-10 rounded-xl bg-green-100 p-4 text-center font-bold text-green-700">
            ✅ تم توقيع العقد بنجاح
          </div>
        )}
      </div>
    </main>
  );
}