"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function NewContractPage() {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [contractValue, setContractValue] = useState("");
  const [deposit, setDeposit] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage("يجب تسجيل الدخول أولًا");
      return;
    }

  const { data: profile } = await supabase
  .from("profiles")
  .select("signature_image")
  .eq("id", user.id)
  .single();

const { error } = await supabase.from("contracts").insert({
  user_id: user.id,
  client_name: clientName,
  client_phone: clientPhone,
  event_type: eventType,
  event_date: eventDate,
  contract_value: Number(contractValue),
  deposit: Number(deposit),
  status: "draft",
  photographer_signature_image: profile?.signature_image || null,
});

    if (error) {
      setMessage("حدث خطأ أثناء حفظ العقد: " + error.message);
    } else {
      setMessage("تم حفظ العقد بنجاح 🎉");
      setClientName("");
      setClientPhone("");
      setEventType("");
      setEventDate("");
      setContractValue("");
      setDeposit("");
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5E9DC] px-6 py-10 text-[#362008]">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">إنشاء عقد جديد</h1>
        <p className="mb-8 text-[#75532F]">
          أدخل بيانات العقد وسيتم حفظه في قاعدة بيانات ميثاق.
        </p>

        <div className="space-y-4">
          <input
            placeholder="اسم العميل"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <input
            placeholder="رقم جوال العميل"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <input
            placeholder="نوع المناسبة: زواج، تخرج، منتجات..."
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <input
            placeholder="قيمة العقد"
            type="number"
            value={contractValue}
            onChange={(e) => setContractValue(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <input
            placeholder="العربون"
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="w-full rounded-xl border border-[#B59676]/40 p-4 outline-none"
          />

          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-[#75532F] p-4 font-bold text-white"
          >
            حفظ العقد
          </button>

          {message && (
            <p className="text-center font-medium text-[#75532F]">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}