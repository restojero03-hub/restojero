import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { primaryCta } from "@/lib/cta";

type ButtonProps = Pick<ComponentProps<typeof Button>, "size" | "className">;

export function PrimaryCta({ size = "lg", className }: ButtonProps) {
  const cta = primaryCta();
  return (
    <Button asChild size={size} className={className}>
      {cta.external ? (
        <a href={cta.href} target="_blank" rel="noopener noreferrer">
          {cta.label}
        </a>
      ) : (
        <Link href={cta.href}>{cta.label}</Link>
      )}
    </Button>
  );
}

export function DownloadCv({ size = "lg", className }: ButtonProps) {
  return (
    <Button asChild size={size} variant="outline" className={className}>
      <a href={site.cvPath} download>
        Download CV
      </a>
    </Button>
  );
}
