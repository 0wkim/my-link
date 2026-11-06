import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LinkItem, LinkCreateInput } from "@/types/link";

/**
 * Firestore 저장 경로 상수
 * users/anonymous/links
 */
export const FIRESTORE_USERS_COLLECTION = "users";
export const FIRESTORE_ANONYMOUS_DOC = "anonymous";
export const FIRESTORE_LINKS_COLLECTION = "links";

/**
 * users/anonymous/links 컬렉션 레퍼런스 반환
 */
export function getAnonymousLinksCollectionRef() {
  return collection(
    db,
    FIRESTORE_USERS_COLLECTION,
    FIRESTORE_ANONYMOUS_DOC,
    FIRESTORE_LINKS_COLLECTION
  );
}

/**
 * Firestore는 undefined 필드 저장을 지원하지 않으므로
 * undefined 필드를 제거하는 헬퍼 함수
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Firestore (경로: users/anonymous/links)에 신규 링크 저장
 *
 * @param input 링크 생성 입력 데이터
 * @param handle 유저 핸들 (기본값: "hong")
 * @returns 생성된 LinkItem
 */
export async function addLinkToFirestore(
  input: LinkCreateInput,
  handle: string = "hong"
): Promise<LinkItem> {
  const collectionRef = getAnonymousLinksCollectionRef();
  // Firestore 자동 ID를 가진 문서 레퍼런스 생성
  const newDocRef = doc(collectionRef);
  const newId = newDocRef.id;
  const now = new Date().toISOString();

  const newLink: LinkItem = {
    id: newId,
    userHandle: handle,
    title: input.title.trim(),
    subtitle: input.subtitle?.trim() || undefined,
    url: input.url.trim(),
    category: input.category || "portfolio",
    iconType: input.iconType || "globe",
    iconBg: input.iconBg || "#E8F3FF",
    iconColor: input.iconColor || "#3182F6",
    badge: input.badge?.trim() || undefined,
    isActive: input.isActive ?? true,
    isPinned: input.isPinned ?? false,
    displayOrder: input.displayOrder ?? 1,
    clickCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  // Firestore 저장용 객체 생성 (undefined 제거 및 서버 타임스탬프 메타데이터 포함 가능)
  const firestoreData = sanitizeForFirestore({
    ...newLink,
    _serverCreatedAt: serverTimestamp(),
  });

  // users/anonymous/links/{newId} 문서 저장
  await setDoc(newDocRef, firestoreData);

  return newLink;
}

/**
 * Firestore (경로: users/anonymous/links)에서 모든 링크 목록 조회
 */
export async function getLinksFromFirestore(): Promise<LinkItem[]> {
  try {
    const collectionRef = getAnonymousLinksCollectionRef();
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const links: LinkItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      links.push({
        id: docSnap.id,
        userHandle: data.userHandle || "hong",
        title: data.title || "",
        subtitle: data.subtitle || undefined,
        url: data.url || "",
        category: data.category || "portfolio",
        iconType: data.iconType || "globe",
        iconBg: data.iconBg || "#E8F3FF",
        iconColor: data.iconColor || "#3182F6",
        badge: data.badge || undefined,
        isActive: data.isActive ?? true,
        isPinned: data.isPinned ?? false,
        displayOrder: data.displayOrder ?? 0,
        clickCount: data.clickCount ?? 0,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      });
    });

    return links;
  } catch (error) {
    console.error("Firestore에서 링크를 불러오는 중 오류 발생:", error);
    return [];
  }
}

/**
 * Firestore (경로: users/anonymous/links) 실시간 링크 목록 구독
 */
export function subscribeToLinksFromFirestore(
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const collectionRef = getAnonymousLinksCollectionRef();
  const q = query(collectionRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const links: LinkItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        links.push({
          id: docSnap.id,
          userHandle: data.userHandle || "hong",
          title: data.title || "",
          subtitle: data.subtitle || undefined,
          url: data.url || "",
          category: data.category || "portfolio",
          iconType: data.iconType || "globe",
          iconBg: data.iconBg || "#E8F3FF",
          iconColor: data.iconColor || "#3182F6",
          badge: data.badge || undefined,
          isActive: data.isActive ?? true,
          isPinned: data.isPinned ?? false,
          displayOrder: data.displayOrder ?? 0,
          clickCount: data.clickCount ?? 0,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      });
      onUpdate(links);
    },
    (error) => {
      console.error("Firestore 실시간 링크 구독 오류:", error);
      onError?.(error);
    }
  );
}
