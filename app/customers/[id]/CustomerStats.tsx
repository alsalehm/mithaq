type CustomerStatsProps = {
  totalContracts: number;
  totalValue: number;
  totalPaid: number;
  totalRemaining: number;
  totalInvoices?: number;
  totalInvoiceAmount?: number;
  paidInvoices?: number;
  unpaidInvoices?: number;
};

export default function CustomerStats({
  totalContracts,
  totalValue,
  totalPaid,
  totalRemaining,
  totalInvoices = 0,
  totalInvoiceAmount = 0,
  paidInvoices = 0,
  unpaidInvoices = 0,
}: CustomerStatsProps) {
  return (
    <div className="mb-8 space-y-6">
      <section>
        <h2 className="mb-4 text-xl font-bold text-[#75532F]">
          إحصائيات العقود
        </h2>

        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">عدد العقود</p>
            <h3 className="mt-2 text-3xl font-bold">{totalContracts}</h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي العقود</p>
            <h3 className="mt-2 text-3xl font-bold">{totalValue} ريال</h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">المدفوع</p>
            <h3 className="mt-2 text-3xl font-bold">{totalPaid} ريال</h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">المتبقي</p>
            <h3 className="mt-2 text-3xl font-bold">{totalRemaining} ريال</h3>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-[#75532F]">
          إحصائيات الفواتير
        </h2>

        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">عدد الفواتير</p>
            <h3 className="mt-2 text-3xl font-bold">{totalInvoices}</h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">إجمالي الفواتير</p>
            <h3 className="mt-2 text-3xl font-bold">
              {totalInvoiceAmount} ريال
            </h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">فواتير مدفوعة</p>
            <h3 className="mt-2 text-3xl font-bold">{paidInvoices}</h3>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">فواتير غير مدفوعة</p>
            <h3 className="mt-2 text-3xl font-bold">{unpaidInvoices}</h3>
          </div>
        </div>
      </section>
    </div>
  );
}