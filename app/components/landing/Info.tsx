type InfoProps = {
  label: string;
  value: string;
};

export default function Info({ label, value }: InfoProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--mithaq-border)] bg-white px-4 py-3 shadow-sm transition-all duration-300 hover:border-[var(--mithaq-border-strong)]">
      <span className="font-semibold text-[var(--mithaq-muted)]">
        {label}
      </span>

      <span className="font-black text-[var(--mithaq-text)]">
        {value}
      </span>
    </div>
  );
}