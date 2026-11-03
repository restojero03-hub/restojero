import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="page-width py-20 sm:py-28">
      <p className="drawing-label">Error 404</p>
      <h1 className="mt-3 text-[clamp(2.5rem,6vw,4rem)] leading-none font-semibold">Page not found</h1>
      <p className="mt-5 max-w-prose text-lg text-muted-foreground">
        This page doesn&apos;t exist or may have moved. You can find my work and ways to reach me on
        the home page.
      </p>
      <Button asChild size="lg" className="mt-7">
        <Link href="/">Back to the home page</Link>
      </Button>
    </section>
  );
}
