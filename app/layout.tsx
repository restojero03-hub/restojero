import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getContent } from "@/lib/content/get-content";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: site.metaTitle, template: `%s | ${site.name}` },
    description: site.metaDescription,
    authors: [{ name: site.name }],
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.metaTitle,
      description: site.metaDescription,
      url: "/",
    },
    twitter: { card: "summary_large_image", title: site.metaTitle, description: site.metaDescription },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${poppins.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
