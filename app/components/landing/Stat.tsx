type StatProps = {
  value: string;
  label: string;
};

export default function Stat({ value, label }: StatProps) {
  return (
    <div className="mithaq-card rounded-[var(--mithaq-radius-lg)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--mithaq-shadow-md)]">
      <p className="text-xl font-black text-[var(--mithaq-text)]">
        {value}
      </p>

      <p className="mt-2 text-sm font-semibold text-[var(--mithaq-muted)]">
        {label}
      </p>
    </div>
  );
}