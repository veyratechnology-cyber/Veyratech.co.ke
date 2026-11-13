import { ImageResponse } from "next/og";

// Apple touch icon (home-screen icon on iPhone/iPad), 180x180: the VT mark on black.
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#000000" }}>
        <svg width="130" height="120" viewBox="0 0 100 92">
          <polygon points="0,0 24,0 50,64 76,19 90,19 50,91" fill="#1238B0" />
          <polygon points="26,0 100,0 89.4,17.6 72.6,17.6 51,52 43,38 55,17.6 33,17.6" fill="#F58220" />
        </svg>
      </div>
    ),
    size
  );
}
