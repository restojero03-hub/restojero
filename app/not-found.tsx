import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="page-width flex flex-1 flex-col justify-center py-20 sm:py-28">
      <p className="section-eyebrow">Error 404</p>
      <h1 className="section-title">Page not found</h1>
      <p className="mt-5 max-w-prose text-lg">
        This page doesn&apos;t exist or may have moved. You can find my work and ways to reach me on the home page.
      </p>
      <div className="mt-8">
        <Link prefetch={false} href="/" className="btn">
          Back to the home page
        </Link>
      </div>
    </main>
  );
}
