import { ImageResponse } from "next/og";

export const alt = "MYLINK - 당신을 소개하는 가장 짧고 멋진 한 페이지";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #FFFFFF 0%, #EEF6FF 52%, #D8EBFF 100%)",
          color: "#191F28",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: 520, background: "rgba(49, 130, 246, 0.10)", top: -275, right: -80 }} />
        <div style={{ position: "absolute", width: 260, height: 260, borderRadius: 260, background: "rgba(124, 92, 252, 0.10)", bottom: -150, left: 400 }} />

        <div style={{ width: "51%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", width: 48, height: 48, borderRadius: 15, background: "#3182F6", color: "white", alignItems: "center", justifyContent: "center", fontSize: 23, fontWeight: 800 }}>M</div>
            <div style={{ display: "flex", fontSize: 29, fontWeight: 800, letterSpacing: -1.5 }}>MYLINK</div>
            <div style={{ display: "flex", marginLeft: 2, borderRadius: 999, background: "#E8F3FF", color: "#3182F6", padding: "6px 11px", fontSize: 14, fontWeight: 700 }}>LINK HUB</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#3182F6", fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>ONE LINK, YOUR STORY</div>
            <div style={{ display: "flex", marginTop: 16, fontSize: 58, lineHeight: 1.08, letterSpacing: -3.3, fontWeight: 800 }}>A page that<br />connects you.</div>
            <div style={{ display: "flex", marginTop: 20, color: "#6B7684", fontSize: 22, lineHeight: 1.45, letterSpacing: -0.7 }}>Your favorite places, gathered into one easy-to-share profile.</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#4E5968", fontSize: 17, fontWeight: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ color: "#3182F6", fontSize: 22 }}>●</span> One profile</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ color: "#3182F6", fontSize: 22 }}>●</span> Every link</div>
          </div>
        </div>

        <div style={{ width: "49%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", width: 390, borderRadius: 35, background: "white", padding: 17, boxShadow: "0 24px 52px rgba(49, 130, 246, 0.20)", border: "1px solid rgba(255,255,255,0.95)" }}>
            <div style={{ display: "flex", width: "100%", flexDirection: "column", borderRadius: 25, background: "#F7F9FC", padding: 23 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", fontSize: 15, color: "#6B7684", fontWeight: 700 }}>MY PAGE</div>
                <div style={{ display: "flex", borderRadius: 999, background: "white", padding: "7px 10px", color: "#8B95A1", fontSize: 12, fontWeight: 700 }}>Preview</div>
              </div>
              <div style={{ display: "flex", marginTop: 19, borderRadius: 21, background: "white", padding: 18, flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", width: 56, height: 56, borderRadius: 56, alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #D7EAFF, #AFCFFF)", color: "#3182F6", fontWeight: 800, fontSize: 20 }}>Y</div>
                <div style={{ display: "flex", marginTop: 10, fontSize: 18, fontWeight: 800, letterSpacing: -0.6 }}>your story</div>
                <div style={{ display: "flex", marginTop: 4, color: "#8B95A1", fontSize: 12 }}>all your favorite places</div>
                {[
                  ["N", "Featured note", "#FFF1D8"],
                  ["P", "Creative portfolio", "#E8F3FF"],
                  ["I", "Say hello", "#FDEBF2"],
                ].map(([mark, label, color]) => (
                  <div key={label} style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, marginTop: 10, borderRadius: 15, border: "1px solid #EDF0F3", padding: "10px 11px" }}>
                    <div style={{ display: "flex", width: 29, height: 29, borderRadius: 10, background: color, alignItems: "center", justifyContent: "center", color: "#333D4B", fontWeight: 800, fontSize: 12 }}>{mark}</div>
                    <div style={{ display: "flex", flex: 1, fontSize: 13, fontWeight: 700 }}>{label}</div>
                    <div style={{ display: "flex", color: "#B0B8C1", fontSize: 18 }}>›</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
