import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const routes = ["/", "/work/conexa-pro", "/work/meta-ads-funnel", "/resume", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl();
  return routes.map((route) => ({ url: `${url}${route}` }));
}
