"use client";

// Shown if a page can't be built because the database is unreachable. It has to stand alone,
// because the site's own layout and styles are what failed to load.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: 16,
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          color: "#c4cfde",
          backgroundColor: "#212428",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 32 }}>This page didn&apos;t load</h1>
        <p style={{ margin: 0 }}>Please try again in a minute.</p>
        <button
          type="button"
          onClick={() => retry()}
          style={{
            minHeight: 48,
            padding: "0 24px",
            border: 0,
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
            color: "#ffffff",
            backgroundColor: "#e4004b",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
