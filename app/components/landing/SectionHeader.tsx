type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  desc?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  desc,
}: SectionHeaderProps) {
  return (
    <div className="mb-12 text-center">
      <span className="inline-flex rounded-full border border-[var(--mithaq-border)] bg-white px-4 py-2 text-sm font-black text-[var(--mithaq-primary)] shadow-sm">
        {eyebrow}
      </span>

      <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-[var(--mithaq-text)] md:text-5xl">
        {title}
      </h2>

      {desc && (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--mithaq-muted)]">
          {desc}
        </p>
      )}
    </div>
  );
}