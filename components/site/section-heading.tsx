export function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="mb-12 text-center sm:mb-16">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-title">
        {title}
      </h2>
    </div>
  );
}
