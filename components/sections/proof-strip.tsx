import { home } from "@/content/home";

export function ProofStrip() {
  return (
    <section aria-label="Proof" className="page-width pb-10 sm:pb-14">
      <dl className="drawing-frame grid grid-cols-1 sm:grid-cols-3 sm:divide-x">
        {home.proof.map((item, index) => (
          <div
            key={item.label}
            className={index < home.proof.length - 1 ? "border-b p-4 sm:border-b-0" : "p-4"}
          >
            <dt className="drawing-label">{item.label}</dt>
            <dd className="mt-1 text-xl font-semibold [font-stretch:85%]">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
