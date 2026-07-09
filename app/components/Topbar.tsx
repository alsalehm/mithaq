export default function Topbar() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <p className="text-sm text-[#75532F]">
          👋 مرحبًا، عبدالرحمن
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#2A1A0C]">
          لوحة التحكم
        </h1>

        <p className="mt-2 text-[#6B5A49]">
          إدارة أعمالك أصبحت أكثر سهولة
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7D6C2] bg-white hover:bg-[#F8F1E8]">
          🔔
        </button>

        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7D6C2] bg-white hover:bg-[#F8F1E8]">
          ❔
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFE0CF] font-bold text-[#75532F]">
          ع
        </div>
      </div>
    </header>
  );
}