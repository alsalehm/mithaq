import Link from "next/link";

type Invoice = {
  id: string;
  invoice_number: string | null;
  client_name: string | null;
  amount: number | null;
  due_date: string | null;
  status: string | null;
  notes: string | null;
};

type CustomerInvoicesProps = {
  invoices: Invoice[];
  customerId: string;
};

export default function CustomerInvoices({
  invoices,
  customerId,
}: CustomerInvoicesProps) {
  function invoiceStatusLabel(status: string | null) {
    if (status === "paid") return "مدفوعة";
    if (status === "unpaid") return "غير مدفوعة";
    if (status === "partial") return "مدفوعة جزئيًا";
    return "غير محدد";
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-md">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-[#75532F]">فواتير العميل</h2>

        <Link
          href={`/invoices/new?customer_id=${customerId}`}
          className="rounded-xl bg-[#75532F] px-4 py-2 text-sm font-bold text-white"
        >
          إنشاء فاتورة
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <p className="mb-5 text-gray-600">
            لا توجد فواتير مرتبطة بهذا العميل حتى الآن.
          </p>

          <Link
            href={`/invoices/new?customer_id=${customerId}`}
            className="rounded-xl bg-[#75532F] px-5 py-3 font-bold text-white"
          >
            إنشاء أول فاتورة
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="rounded-2xl border border-[#B59676]/30 p-5"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">
                    {invoice.invoice_number || "فاتورة بدون رقم"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    تاريخ الاستحقاق: {invoice.due_date || "-"}
                  </p>
                </div>

                <span className="rounded-full bg-[#F5E9DC] px-4 py-2 text-sm font-bold">
                  {invoiceStatusLabel(invoice.status)}
                </span>
              </div>

              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>المبلغ: {invoice.amount || 0} ريال</p>
                <p>العميل: {invoice.client_name || "-"}</p>
              </div>

              {invoice.notes && (
                <p className="mt-4 whitespace-pre-wrap text-sm text-gray-600">
                  {invoice.notes}
                </p>
              )}

              <div className="mt-5">
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="font-bold text-[#75532F] underline"
                >
                  عرض الفاتورة
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}