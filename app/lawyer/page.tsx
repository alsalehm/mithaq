export default function LawyerDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#362008]">
        لوحة المحامية ⚖️
      </h1>

      <p className="mt-3 text-[#75532F]">
        مرحبًا بك في بوابة المحامية الخاصة بمنصة ميثاق.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-sm text-gray-500">
            طلبات جديدة
          </h2>

          <p className="mt-3 text-4xl font-bold text-[#362008]">
            0
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-sm text-gray-500">
            تم التواصل
          </h2>

          <p className="mt-3 text-4xl font-bold text-[#362008]">
            0
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-sm text-gray-500">
            مكتملة
          </h2>

          <p className="mt-3 text-4xl font-bold text-[#362008]">
            0
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-sm text-gray-500">
            ملغاة
          </h2>

          <p className="mt-3 text-4xl font-bold text-[#362008]">
            0
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-[#362008]">
          آخر طلبات الاستشارات
        </h2>

        <p className="mt-4 text-gray-500">
          ستظهر هنا أحدث طلبات العملاء بعد ربط الصفحة بقاعدة البيانات.
        </p>
      </div>
    </div>
  );
}