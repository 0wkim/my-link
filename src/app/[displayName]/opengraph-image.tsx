import { connection } from "next/server";
import { ImageResponse } from "next/og";
import { findUserByDisplayNameOrUsername } from "@/lib/firestore-profile";
import { getLinksFromFirestore } from "@/lib/firestore-links";

export const alt = "MYLINK 프로필";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ displayName: string }>;
}

function getInitials(name: string) {
  const letters = Array.from(name.trim());
  return (letters[0] || "M").toUpperCase();
}

export default async function OpenGraphImage({ params }: ImageProps) {
  await connection();

  const { displayName } = await params;
  const handle = decodeURIComponent(displayName).replace(/^@/, "").trim();
  const profile = handle ? await findUserByDisplayNameOrUsername(handle) : null;
  const links = profile ? await getLinksFromFirestore(profile.uid) : [];
  const visibleLinks = links
    .filter((link) => link.isActive)
    .sort((a, b) => Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned)) || a.displayOrder - b.displayOrder)
    .slice(0, 3);

  const name = profile?.displayName || handle || "MYLINK member";
  const bio = profile?.bio || "All my favorite places, in one link.";
  const username = profile?.username ? `@${profile.username}` : "MYLINK profile";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          padding: "58px 66px",
          color: "#191F28",
          background: "linear-gradient(135deg, #F8FBFF 0%, #EAF4FF 55%, #D7E9FF 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: 500, background: "rgba(49,130,246,0.13)", right: -190, top: -215 }} />
        <div style={{ position: "absolute", width: 290, height: 290, borderRadius: 290, background: "rgba(124,92,252,0.08)", left: 265, bottom: -175 }} />

        <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <div style={{ display: "flex", width: 45, height: 45, borderRadius: 14, alignItems: "center", justifyContent: "center", background: "#3182F6", color: "white", fontSize: 22, fontWeight: 800 }}>M</div>
              <div style={{ display: "flex", fontSize: 27, letterSpacing: -1.4, fontWeight: 800 }}>MYLINK</div>
            </div>
            <div style={{ display: "flex", borderRadius: 999, padding: "9px 14px", background: "rgba(255,255,255,0.72)", color: "#3182F6", fontSize: 15, fontWeight: 700 }}>Personal link page</div>
          </div>

          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", width: "48%", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 19 }}>
                <div style={{ display: "flex", width: 112, height: 112, borderRadius: 112, alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #CFE5FF, #8BBCF8)", color: "#1B64DA", fontWeight: 800, fontSize: 47, border: "7px solid rgba(255,255,255,0.75)" }}>{getInitials(name)}</div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", fontSize: 45, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2.4 }}>{name}</div>
                  <div style={{ display: "flex", marginTop: 10, color: "#3182F6", fontSize: 21, fontWeight: 700 }}>{username}</div>
                </div>
              </div>
              <div style={{ display: "flex", marginTop: 26, color: "#4E5968", fontSize: 22, lineHeight: 1.45, letterSpacing: -0.5 }}>{bio.slice(0, 88)}</div>
            </div>

            <div style={{ display: "flex", width: 430, flexDirection: "column", borderRadius: 31, background: "rgba(255,255,255,0.92)", padding: 22, boxShadow: "0 20px 52px rgba(49,130,246,0.18)", border: "1px solid rgba(255,255,255,0.95)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", color: "#6B7684", fontSize: 15, fontWeight: 700 }}>FAVORITE LINKS</div>
                <div style={{ display: "flex", borderRadius: 999, background: "#E8F3FF", padding: "6px 10px", color: "#3182F6", fontSize: 12, fontWeight: 800 }}>MY PICK</div>
              </div>
              {(visibleLinks.length ? visibleLinks : [{ id: "welcome", title: "Welcome to my page", subtitle: "Connect with me" }]).map((link, index) => (
                <div key={link.id} style={{ display: "flex", alignItems: "center", gap: 13, marginTop: 11, padding: "14px 15px", borderRadius: 18, border: "1px solid #EDF0F3", background: "white" }}>
                  <div style={{ display: "flex", width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", background: ["#E8F3FF", "#FFF1D8", "#FDEBF2"][index], color: "#3182F6", fontSize: 15, fontWeight: 800 }}>{index + 1}</div>
                  <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
                    <div style={{ display: "flex", fontSize: 17, fontWeight: 700, letterSpacing: -0.4 }}>{link.title.slice(0, 38)}</div>
                    {link.subtitle ? <div style={{ display: "flex", marginTop: 3, fontSize: 12, color: "#8B95A1" }}>{link.subtitle.slice(0, 48)}</div> : null}
                  </div>
                  <div style={{ display: "flex", color: "#B0B8C1", fontSize: 21 }}>›</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#6B7684", fontSize: 16, fontWeight: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: "#3182F6", fontSize: 20 }}>●</span> One profile, every important link</div>
            <div style={{ display: "flex", color: "#3182F6", fontWeight: 800 }}>mylink</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
