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
import {
  addLinkToFirestore,
  getLinksFromFirestore,
  subscribeToLinksFromFirestore,
} from "@/lib/firestore-links";
import type { Unsubscribe } from "firebase/firestore";

// 초기 시드 데이터 조립 (@hong)
export function getInitialSeedDatabase(): LocalDatabase {
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
  addLink: (handle: string, input: LinkCreateInput) => Promise<LinkItem>;
  syncFirestoreLinks: (handle?: string) => Promise<void>;
  subscribeFirestoreLinks: (handle?: string) => Unsubscribe;
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

      addLink: async (handle: string, input: LinkCreateInput) => {
        const key = handle.replace(/^@/, "");
        const entry = get().profiles[key] || getInitialSeedDatabase().hong;
        const displayOrder = input.displayOrder ?? entry.links.length + 1;

        let createdLink: LinkItem;
        try {
          // Firestore 경로 users/anonymous/links 에 저장
          createdLink = await addLinkToFirestore(
            {
              ...input,
              displayOrder,
            },
            key
          );
        } catch (error) {
          console.error("Firestore 링크 저장 실패, 로컬 폴백 생성:", error);
          const now = new Date().toISOString();
          const fallbackId = `link-${Date.now().toString(36)}`;
          createdLink = {
            id: fallbackId,
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
            displayOrder,
            clickCount: 0,
            createdAt: now,
            updatedAt: now,
          };
        }

        set((state) => {
          const currentEntry = state.profiles[key] || getInitialSeedDatabase().hong;
          const filteredLinks = currentEntry.links.filter((l) => l.id !== createdLink.id);
          return {
            profiles: {
              ...state.profiles,
              [key]: {
                ...currentEntry,
                links: [...filteredLinks, createdLink],
              },
            },
          };
        });

        return createdLink;
      },

      syncFirestoreLinks: async (handle?: string) => {
        const targetHandle = (handle || get().currentHandle).replace(/^@/, "");
        try {
          // createdAt desc 순으로 정렬된 링크 조회
          const firestoreLinks = await getLinksFromFirestore();
          // Firestore에 데이터가 없으면 로컬 상태 유지
          if (!firestoreLinks || firestoreLinks.length === 0) return;

          set((state) => {
            const entry = state.profiles[targetHandle] || getInitialSeedDatabase().hong;
            return {
              profiles: {
                ...state.profiles,
                [targetHandle]: {
                  ...entry,
                  // Firestore를 단일 소스로: 반환된 목록으로 교체
                  links: firestoreLinks,
                },
              },
            };
          });
        } catch (error) {
          console.error("Firestore 링크 동기화 오류:", error);
        }
      },

      /**
       * Firestore (users/anonymous/links)를 실시간 구독합니다.
       * createdAt 내림차순으로 정렬된 링크를 받아 스토어를 교체합니다.
       * 반환된 Unsubscribe 함수를 호출해 구독을 해제하세요.
       */
      subscribeFirestoreLinks: (handle?: string): Unsubscribe => {
        const targetHandle = (handle || get().currentHandle).replace(/^@/, "");

        return subscribeToLinksFromFirestore(
          (firestoreLinks) => {
            set((state) => {
              const entry =
                state.profiles[targetHandle] || getInitialSeedDatabase().hong;

              return {
                profiles: {
                  ...state.profiles,
                  [targetHandle]: {
                    ...entry,
                    // Firestore가 createdAt desc 정렬로 반환하므로 그대로 사용
                    links: firestoreLinks,
                  },
                },
              };
            });
          },
          (error) => {
            console.error("Firestore 실시간 구독 오류:", error);
          }
        );
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
