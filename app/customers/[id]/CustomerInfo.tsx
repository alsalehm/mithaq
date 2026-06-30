type Customer = {
  full_name: string;
  phone: string | null;
  city: string | null;
  email: string | null;
};

type CustomerInfoProps = {
  customer: Customer;
};

export default function CustomerInfo({ customer }: CustomerInfoProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-5 text-2xl font-bold text-[#75532F]">
        بيانات العميل
      </h2>

      <div className="space-y-4 text-gray-700">
        <div>
          <p className="text-sm text-gray-500">الاسم</p>
          <p className="font-bold text-[#362008]">{customer.full_name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">رقم الجوال</p>
          <p className="font-bold text-[#362008]">{customer.phone || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">المدينة</p>
          <p className="font-bold text-[#362008]">{customer.city || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">البريد الإلكتروني</p>
          <p className="font-bold text-[#362008]">{customer.email || "-"}</p>
        </div>
      </div>
    </div>
  );
}