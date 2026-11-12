import { ImageResponse } from "next/og";

// Social preview image (Open Graph / Twitter / WhatsApp / LinkedIn), 1200x630.
export const runtime = "edge";
export const alt = "VeyraTech - Custom software development in Kenya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #081A30 0%, #0D2340 55%, #3a2413 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#FC8436",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            VT
          </div>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>
            <span>VEYRA</span>
            <span style={{ color: "#FC8436" }}>TECH</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 20, fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            <span>Custom software that</span>
            <span style={{ color: "#FC8436" }}>transforms</span>
            <span>your business</span>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#C9D3E2" }}>
            Websites · Mobile apps · POS · Business systems · M-Pesa integration
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9DB4D6" }}>
          <span>veyratech.co.ke</span>
          <span>Nairobi, Kenya</span>
        </div>
      </div>
    ),
    size
  );
}
