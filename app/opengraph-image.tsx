import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content/get-content";

export const alt = "Ronil Estojero: full-stack developer, digital marketer and funnel builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { site, hero } = await getContent();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        color: "#c4cfde",
        backgroundColor: "#212428",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {hero.eyebrow}
      </div>
      <div style={{ display: "flex", marginTop: 28, fontSize: 88, fontWeight: 700, color: "#ffffff" }}>
        Hi, I&rsquo;m&nbsp;<span style={{ color: "#ff014f" }}>{site.name}</span>
      </div>
      <div style={{ display: "flex", marginTop: 24, fontSize: 38, fontWeight: 600 }}>
        {hero.titles.slice(0, 3).join(" | ")}
      </div>
    </div>,
    size,
  );
}
