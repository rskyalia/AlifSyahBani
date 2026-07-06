type Props = {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  label,
  title,
  description,
  align = "left",
}: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-12 md:mb-16 max-w-2xl ${alignClass}`}>
      {label && (
        <p className="section-label mb-3">{label}</p>
      )}
      <h2 className="section-title">{title}</h2>
      {description && (
        <p className="mt-4 text-blue-100/55 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
