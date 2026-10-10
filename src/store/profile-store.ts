"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  LocalDatabase,
  UserDatabaseEntry,
  UserProfile,
  ProfileTheme,
  LinkItem,
  LinkCreateInput,
  LinkUpdateInput,
} from "@/types/link";
import fallbackLinksRaw from "@/data/links.json";
import mockDatabaseRaw from "@/data/mock-database.json";
import { trackLinkClick } from "@/lib/mock-api";

// 초기 시드 데이터 조립 (@hong + @sujin)
export function getInitialSeedDatabase(): LocalDatabase {
  const mockDb = mockDatabaseRaw as unknown as LocalDatabase;
  const initialLinks = fallbackLinksRaw as LinkItem[];

  return {
    hong: {
      profile: {
        handle: "hong",
        displayName: "홍길동",
        bio: "복잡한 문제를 단순하고 직관적인 화면으로 해결하는 프론트엔드 엔지니어예요.",
        avatarUrl: "/images/avatar.jpg",
        role: "시니어 프론트엔드 엔지니어",
        location: "서울 · 대한민국",
        email: "hong.gildong@example.com",
        viewsCount: 4280,
        socials: {
          github: "https://github.com/example/hong",
          twitter: "https://x.com/hong_dev",
          linkedin: "https://linkedin.com/in/hong-gildong",
          youtube: "https://youtube.com/@hong_frontend",
        },
      },
      theme: {
        presetId: "toss",
        backgroundColor: "#F2F4F6",
        buttonShape: "rounded",
        buttonStyle: "fill",
      },
      links: [...initialLinks],
    },
    sujin: {
      profile: {
        ...(mockDb.sujin?.profile || {
          handle: "sujin",
          displayName: "이수진",
          bio: "일상을 따뜻한 색감으로 그리는 일러스트레이터 겸 테크 크리에이터예요.",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
          role: "프리랜서 일러스트레이터",
          location: "서울 · 대한민국",
          email: "sujin.illust@example.com",
          viewsCount: 8920,
          socials: {
            instagram: "https://instagram.com/sujin_draws",
            youtube: "https://youtube.com/@sujin_studio",
          },
        }),
      },
      theme: {
        presetId: "minimal",
        backgroundColor: "#FFFFFF",
        buttonShape: "pill",
        buttonStyle: "outline",
      },
      links: mockDb.sujin?.links || [],
    },
  };
}

export interface ProfileStoreState {
  profiles: LocalDatabase;
  currentHandle: string;
  isHydrated: boolean;
}

export interface ProfileStoreActions {
  setHydrated: (val: boolean) => void;
  setCurrentHandle: (handle: string) => void;
  getEntry: (handle?: string) => UserDatabaseEntry;
  updateProfile: (handle: string, data: Partial<UserProfile>) => void;
  updateTheme: (handle: string, theme: Partial<ProfileTheme>) => void;
  addLink: (handle: string, input: LinkCreateInput) => LinkItem;
  updateLink: (handle: string, linkId: string, input: LinkUpdateInput) => void;
  deleteLink: (handle: string, linkId: string) => void;
  toggleLinkActive: (handle: string, linkId: string) => void;
  reorderLinks: (handle: string, orderedLinkIds: string[]) => void;
  trackClick: (handle: string, linkId: string) => void;
  trackView: (handle: string) => void;
  resetToMockData: () => void;
}

export type ProfileStore = ProfileStoreState & ProfileStoreActions;

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profiles: getInitialSeedDatabase(),
      currentHandle: "hong",
      isHydrated: false,

      setHydrated: (val: boolean) => set({ isHydrated: val }),

      setCurrentHandle: (handle: string) => {
        const cleanHandle = handle.replace(/^@/, "");
        set({ currentHandle: cleanHandle });
      },

      getEntry: (handle?: string) => {
        const targetHandle = (handle || get().currentHandle).replace(/^@/, "");
        const profiles = get().profiles;
        if (profiles[targetHandle]) {
          return profiles[targetHandle];
        }
        // 없으면 기본 hong 계정 반환
        return profiles.hong || getInitialSeedDatabase().hong;
      },

      updateProfile: (handle: string, data: Partial<UserProfile>) => {
        const key = handle.replace(/^@/, "");
        set((state) => {
          const entry = state.profiles[key] || getInitialSeedDatabase().hong;
          return {
            profiles: {
              ...state.profiles,
              [key]: {
                ...entry,
                profile: {
                  ...entry.profile,
                  ...data,
                },
              },
            },
          };
        });
      },

      updateTheme: (handle: string, theme: Partial<ProfileTheme>) => {
        const key = handle.replace(/^@/, "");
        set((state) => {
          const entry = state.profiles[key] || getInitialSeedDatabase().hong;
          return {
            profiles: {
              ...state.profiles,
              [key]: {
                ...entry,
                theme: {
                  ...entry.theme,
                  ...theme,
                },
              },
            },
          };
        });
      },

      addLink: (handle: string, input: LinkCreateInput) => {
        const key = handle.replace(/^@/, "");
        const now = new Date().toISOString();
        const newId = `link-${Date.now().toString(36)}`;
        const entry = get().profiles[key] || getInitialSeedDatabase().hong;

        const newLink: LinkItem = {
          id: newId,
          userHandle: key,
          title: input.title.trim(),
          subtitle: input.subtitle?.trim(),
          url: input.url.trim(),
          category: input.category || "portfolio",
          iconType: input.iconType || "globe",
          iconBg: input.iconBg || "#E8F3FF",
          iconColor: input.iconColor || "#3182F6",
          badge: input.badge?.trim(),
          isActive: input.isActive ?? true,
          isPinned: input.isPinned ?? false,
          displayOrder: input.displayOrder ?? entry.links.length + 1,
          clickCount: 0,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => {
          const currentEntry = state.profiles[key] || getInitialSeedDatabase().hong;
          return {
            profiles: {
              ...state.profiles,
              [key]: {
                ...currentEntry,
                links: [...currentEntry.links, newLink],
              },
            },
          };
        });

        return newLink;
      },

      updateLink: (handle: string, linkId: string, input: LinkUpdateInput) => {
        const key = handle.replace(/^@/, "");
        const now = new Date().toISOString();
        set((state) => {
          const entry = state.profiles[key];
          if (!entry) return state;

          const updatedLinks = entry.links.map((link) => {
            if (link.id !== linkId) return link;
            return {
              ...link,
              ...input,
              updatedAt: now,
            };
          });

          return {
            profiles: {
              ...state.profiles,
              [key]: {
                ...entry,
                links: updatedLinks,
              },
            },
          };
        });
      },

      deleteLink: (handle: string, linkId: string) => {
        const key = handle.replace(/^@/, "");
        set((state) => {
          const entry = state.profiles[key];
          if (!entry) return state;

          return {
            profiles: {
              ...state.profiles,
              [key]: {
                ...entry,
                links: entry.links.filter((l) => l.id !== linkId),
              },
            },
          };
        });
      },

      toggleLinkActive: (handle: string, linkId: string) => {
        const key = handle.replace(/^@/, "");
        set((state) => {
          const entry = state.profiles[key];
          if (!entry) return state;

          const updatedLinks = entry.links.map((link) => {
            if (link.id !== linkId) return link;
            return {
              ...link,
              isActive: !link.isActive,
              updatedAt: new Date().toISOString(),
            };
          });

          return {
            profiles: {
              ...state.profiles,
              [key]: {
                ...entry,
                links: updatedLinks,
              },
            },
          };
        });
      },

      reorderLinks: (handle: string, orderedLinkIds: string[]) => {
        const key = handle.replace(/^@/, "");
        set((state) => {
          const entry = state.profiles[key];
          if (!entry) return state;

          const linkMap = new Map(entry.links.map((l) => [l.id, l]));
          const reordered: LinkItem[] = [];

          orderedLinkIds.forEach((id, index) => {
            const link = linkMap.get(id);
            if (link) {
              reordered.push({
                ...link,
                displayOrder: index + 1,
              });
              linkMap.delete(id);
            }
          });

          // 남아있는 링크는 뒤에 붙임
          linkMap.forEach((link) => {
            reordered.push({
              ...link,
              displayOrder: reordered.length + 1,
            });
          });

          return {
            profiles: {
              ...state.profiles,
              [key]: {
                ...entry,
                links: reordered,
              },
            },
          };
        });
      },

      trackClick: (handle: string, linkId: string) => {
        const key = handle.replace(/^@/, "");
        // 1. 로컬 스토리지 상태 갱신
        set((state) => {
          const entry = state.profiles[key];
          if (!entry) return state;

          const updatedLinks = entry.links.map((link) => {
            if (link.id !== linkId) return link;
            return {
              ...link,
              clickCount: (link.clickCount || 0) + 1,
            };
          });

          return {
            profiles: {
              ...state.profiles,
              [key]: {
                ...entry,
                links: updatedLinks,
              },
            },
          };
        });

        // 2. Mock API 백엔드 호출 (비동기 트래킹)
        trackLinkClick(linkId).catch((err) => {
          console.warn("trackLinkClick background failure:", err);
        });
      },

      trackView: (handle: string) => {
        const key = handle.replace(/^@/, "");
        set((state) => {
          const entry = state.profiles[key];
          if (!entry) return state;

          return {
            profiles: {
              ...state.profiles,
              [key]: {
                ...entry,
                profile: {
                  ...entry.profile,
                  viewsCount: (entry.profile.viewsCount || 0) + 1,
                },
              },
            },
          };
        });
      },

      resetToMockData: () => {
        const fresh = getInitialSeedDatabase();
        set({
          profiles: fresh,
        });
      },
    }),
    {
      name: "mylink_profiles",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
