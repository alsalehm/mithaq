import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ReceiptText,
  UserRound,
  Wallet,
} from "lucide-react";

type Invoice = {
  id: string;
  user_id: string | null;
  invoice_number: string | null;
  client_name: string | null;
  amount: number | null;
  amount_paid: number | null;
  remaining_amount: number | null;
  payment_status: string | null;
  status: string | null;
  due_date: string | null;
  notes: string | null;
  share_token: string;
};

type Profile = {
  business_name: string | null;
  full_name: string | null;
  phone: string | null;
  city: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatMoney(value: number | null | undefined) {
  return `${Number(value || 0).toLocaleString("ar-SA")} ر.س`;
}

function getPaymentStatusArabic(status: string | null) {
  if (status === "paid") return "مدفوعة";
  if (status === "partial") return "مدفوعة جزئيًا";
  return "غير مدفوعة";
}

function getStatusColor(status: string | null) {
  if (status === "paid") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === "partial") {
    return "bg-amber-100 text-amber-800";
  }

  return "bg-red-100 text-red-800";
}

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || !token) {
    notFound();
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: invoiceData, error: invoiceError } = await supabaseAdmin
    .from("invoices")
    .select(
      `
        id,
        user_id,
        invoice_number,
        client_name,
        amount,
        amount_paid,
        remaining_amount,
        payment_status,
        status,
        due_date,
        notes,
        share_token
      `
    )
    .eq("share_token", token)
    .maybeSingle();

  if (invoiceError || !invoiceData) {
    notFound();
  }

  const invoice = invoiceData as Invoice;

  let profile: Profile | null = null;

  if (invoice.user_id) {
    const { data: profileData } = await supabaseAdmin
      .from("profiles")
      .select("business_name, full_name, phone, city")
      .eq("id", invoice.user_id)
      .maybeSingle();

    profile = (profileData || null) as Profile | null;
  }

  const invoiceAmount = Number(invoice.amount) || 0;
  const paidAmount = Number(invoice.amount_paid) || 0;

  const remainingAmount =
    invoice.remaining_amount !== null &&
    invoice.remaining_amount !== undefined
      ? Number(invoice.remaining_amount)
      : Math.max(invoiceAmount - paidAmount, 0);

  const currentStatus =
    invoice.payment_status || invoice.status || "unpaid";

  const progress =
    invoiceAmount > 0
      ? Math.min((paidAmount / invoiceAmount) * 100, 100)
      : 0;

  const businessName =
    profile?.business_name || profile?.full_name || "ميثاق";

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F7F3EE] px-4 py-8 text-[#2A1A0C] sm:px-6 sm:py-12"
    >
      <div className="mx-auto max-w-4xl">
        <section className="mb-6 text-center print:hidden">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE3D6] text-[#75532F]">
            <ReceiptText size={28} />
          </div>

          <p className="mt-4 text-sm font-black text-[#75532F]">
            فاتورة إلكترونية
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {invoice.invoice_number || "فاتورة"}
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#75685C]">
            يمكنك الاطلاع على تفاصيل الفاتورة وحالة السداد من خلال هذه الصفحة.
          </p>
        </section>

        <section className="invoice-public-page overflow-hidden rounded-[32px] border border-[#E7D6C2] bg-white shadow-[0_18px_50px_rgba(82,58,35,0.10)]">
          <header className="border-b border-[#E7D6C2] px-6 py-7 sm:px-10 sm:py-9">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#75532F]">
                  فاتورة
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {businessName}
                </h2>

                <div className="mt-3 space-y-1 text-sm font-bold text-[#75685C]">
                  {profile?.phone && <p>{profile.phone}</p>}
                  {profile?.city && <p>{profile.city}</p>}
                </div>
              </div>

              <div className="sm:text-left">
                <p className="text-xs font-black text-[#8A7B6D]">
                  رقم الفاتورة
                </p>

                <p className="mt-2 text-2xl font-black">
                  {invoice.invoice_number || "-"}
                </p>

                <span
                  className={`mt-4 inline-flex rounded-full px-4 py-2 text-xs font-black ${getStatusColor(
                    currentStatus
                  )}`}
                >
                  {getPaymentStatusArabic(currentStatus)}
                </span>
              </div>
            </div>
          </header>

          <section className="grid gap-4 border-b border-[#E7D6C2] px-6 py-6 sm:grid-cols-2 sm:px-10">
            <InfoCard
              label="العميل"
              value={invoice.client_name || "-"}
              icon={UserRound}
            />

            <InfoCard
              label="تاريخ الاستحقاق"
              value={formatDate(invoice.due_date)}
              icon={CalendarDays}
            />
          </section>

          <section className="px-6 py-7 sm:px-10 sm:py-9">
            <div className="overflow-hidden rounded-2xl border border-[#E7D6C2]">
              <table className="w-full border-collapse text-right">
                <thead>
                  <tr className="bg-[#F8F1E8]">
                    <th className="px-5 py-4 text-sm font-black text-[#75532F]">
                      البيان
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-black text-[#75532F]">
                      المبلغ
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t border-[#E7D6C2]">
                    <td className="px-5 py-5 font-black">
                      قيمة الفاتورة
                    </td>

                    <td className="px-5 py-5 text-left font-black">
                      {formatMoney(invoiceAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-7 mr-auto w-full max-w-sm space-y-3">
              <MoneyRow
                label="الإجمالي"
                value={formatMoney(invoiceAmount)}
              />

              <MoneyRow
                label="المدفوع"
                value={formatMoney(paidAmount)}
              />

              <MoneyRow
                label="المتبقي"
                value={formatMoney(remainingAmount)}
                emphasized
              />
            </div>
          </section>

          <section className="border-t border-[#E7D6C2] px-6 py-7 sm:px-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-[#75532F]">
                  حالة الدفع
                </p>

                <p className="mt-1 text-lg font-black">
                  تم دفع {Math.round(progress)}٪
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-xs font-black ${getStatusColor(
                  currentStatus
                )}`}
              >
                {getPaymentStatusArabic(currentStatus)}
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-[#F8F1E8]">
              <div
                className="h-full rounded-full bg-[#75532F]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          {invoice.notes && (
            <section className="border-t border-[#E7D6C2] px-6 py-7 sm:px-10">
              <p className="text-sm font-black text-[#75532F]">
                ملاحظات
              </p>

              <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-[#F8F1E8] p-5 text-sm font-bold leading-8">
                {invoice.notes}
              </p>
            </section>
          )}

          <section className="grid gap-4 border-t border-[#E7D6C2] px-6 py-7 sm:grid-cols-3 sm:px-10">
            <StatCard
              label="الإجمالي"
              value={formatMoney(invoiceAmount)}
              icon={Wallet}
            />

            <StatCard
              label="المدفوع"
              value={formatMoney(paidAmount)}
              icon={CheckCircle2}
            />

            <StatCard
              label="المتبقي"
              value={formatMoney(remainingAmount)}
              icon={Clock3}
            />
          </section>

          <footer className="border-t border-[#E7D6C2] px-6 py-6 text-center sm:px-10">
            <p className="text-xs font-bold leading-6 text-[#75685C]">
              تم إصدار هذه الفاتورة إلكترونيًا من خلال منصة ميثاق.
            </p>
          </footer>
        </section>
      </div>
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
    <div className="rounded-2xl border border-[#E7D6C2] bg-[#F8F1E8] p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-[#75685C]">
        <Icon size={16} className="text-[#75532F]" />
        <span>{label}</span>
      </div>

      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}

function MoneyRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl px-5 py-4 ${
        emphasized
          ? "bg-[#2A1A0C] text-white"
          : "bg-[#F8F1E8]"
      }`}
    >
      <p className={emphasized ? "font-black" : "font-bold text-[#75685C]"}>
        {label}
      </p>

      <p className="font-black">{value}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[#E7D6C2] bg-[#F8F1E8] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEE3D6] text-[#75532F]">
        <Icon size={20} />
      </div>

      <p className="mt-4 text-sm font-bold text-[#75685C]">
        {label}
      </p>

      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}