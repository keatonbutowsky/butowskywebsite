import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Butowsky. Investments. Real estate. Artificial intelligence.";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f1e8",
          color: "#0f1c2b",
        }}
      >
        <div style={{ fontSize: 132, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Butowsky
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            letterSpacing: "0.28em",
            color: "#1e6c41",
          }}
        >
          INVESTMENTS · REAL ESTATE · AI
        </div>
      </div>
    ),
    { ...size },
  );
}
