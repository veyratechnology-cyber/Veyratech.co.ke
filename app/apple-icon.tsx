import { ImageResponse } from "next/og";

// Apple touch icon (home-screen icon on iPhone/iPad), 180x180.
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D2340",
          color: "#FC8436",
          fontSize: 92,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: -4,
        }}
      >
        VT
      </div>
    ),
    size
  );
}
