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
          background: "linear-gradient(135deg, #000000 0%, #05080F 60%, #1c1208 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="96" height="88" viewBox="0 0 100 92">
            <polygon points="0,0 24,0 50,64 76,19 90,19 50,91" fill="#1238B0" />
            <polygon points="26,0 100,0 89.4,17.6 72.6,17.6 51,52 43,38 55,17.6 33,17.6" fill="#F58220" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 12, fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>
              <span style={{ color: "#1238B0" }}>VEYRA</span>
              <span style={{ color: "#F58220" }}>TECH</span>
            </div>
            <div style={{ display: "flex", fontSize: 20, fontWeight: 600 }}>Technology &amp; Consulting</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 20, fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            <span>Custom software that</span>
            <span style={{ color: "#F58220" }}>transforms</span>
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
