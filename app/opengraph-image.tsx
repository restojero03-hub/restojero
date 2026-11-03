import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}: ${site.promise}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#f3f6f9",
        backgroundColor: "#123a7a",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div style={{ display: "flex", fontSize: 32 }}>{site.name}</div>
      <div
        style={{
          display: "flex",
          fontSize: 84,
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
        }}
      >
        {site.promise}
      </div>
      <div style={{ display: "flex", fontSize: 30, color: "#c7d6ec" }}>
        AI Full-Stack Developer | SaaS &amp; Automated Sales Funnels
      </div>
    </div>,
    size,
  );
}
