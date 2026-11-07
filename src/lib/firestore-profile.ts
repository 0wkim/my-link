import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import type { UserProfileData } from "@/types/link";

export const FIRESTORE_USERS_COLLECTION = "users";
export const FIRESTORE_PROFILE_COLLECTION = "profile";
export const FIRESTORE_PROFILE_DOC = "profile";
export const FIRESTORE_USERNAMES_COLLECTION = "usernames";

/**
 * undefined 필드를 Firestore 저장 전 제거하는 유틸리티
 */
function sanitize<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * username 중복 체크
 * 현재 사용자(currentUserId) 외의 다른 사용자가 해당 username을 점유하고 있는지 확인
 * @returns true면 사용 가능(중복 없음), false면 이미 사용 중(중복)
 */
export async function checkUsernameAvailable(
  username: string,
  currentUserId: string
): Promise<boolean> {
  const clean = username.trim().toLowerCase();
  if (!clean) return false;

  try {
    // 1. usernames/{username} 고유 매핑 문서 확인
    const usernameDocRef = doc(db, FIRESTORE_USERNAMES_COLLECTION, clean);
    const usernameSnap = await getDoc(usernameDocRef);
    if (usernameSnap.exists()) {
      const data = usernameSnap.data();
      if (data?.uid && data.uid !== currentUserId) {
        return false;
      }
    }

    // 2. users 컬렉션에서 username 필드 쿼리 확인
    const usersRef = collection(db, FIRESTORE_USERS_COLLECTION);
    const q = query(usersRef, where("username", "==", clean));
    const querySnap = await getDocs(q);

    for (const d of querySnap.docs) {
      if (d.id !== currentUserId) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("username 중복 확인 중 오류:", error);
    // 보안 규칙이나 네트워크 오류 시에도 보수적으로 체크 지속 가능
    return true;
  }
}

/**
 * users/{userId}/profile 경로에서 프로필 조회
 */
export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  if (!userId || userId === "anonymous") return null;

  try {
    // 1. users/{userId}/profile/profile 서브컬렉션 문서 조회
    const profileDocRef = doc(
      db,
      FIRESTORE_USERS_COLLECTION,
      userId,
      FIRESTORE_PROFILE_COLLECTION,
      FIRESTORE_PROFILE_DOC
    );
    const profileSnap = await getDoc(profileDocRef);

    if (profileSnap.exists()) {
      const data = profileSnap.data() as UserProfileData;
      return {
        ...data,
        uid: userId,
      };
    }

    // 2. users/{userId} 상위 문서 조회 (호환성 및 fallback)
    const userDocRef = doc(db, FIRESTORE_USERS_COLLECTION, userId);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      const data = userSnap.data() as UserProfileData;
      if (data.username || data.displayName) {
        return {
          ...data,
          uid: userId,
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`users/${userId}/profile 조회 실패:`, error);
    return null;
  }
}

/**
 * 사용자가 로그인했을 때 프로필을 가져오거나, 없으면 자동 생성하여 Firestore에 저장
 * - username: 이메일 앞부분으로 자동 생성 (중복 시 숫자 접미사 부여)
 * - displayName: 구글 이름을 기본값으로
 * - bio: 기본 소개글
 * - 저장 위치: users/{userId}/profile
 */
export async function getOrCreateUserProfile(user: User): Promise<UserProfileData> {
  // 기존 프로필이 있으면 반환
  const existing = await getUserProfile(user.uid);
  if (existing) {
    return existing;
  }

  // 이메일 앞부분으로 기본 username 생성
  const emailPrefix = user.email
    ? user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "")
    : "user";
  const googleName = user.displayName || emailPrefix || "사용자";

  let initialUsername = emailPrefix || "user";
  const isAvailable = await checkUsernameAvailable(initialUsername, user.uid);
  if (!isAvailable) {
    initialUsername = `${emailPrefix}_${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const now = new Date().toISOString();
  const newProfile: UserProfileData = {
    uid: user.uid,
    username: initialUsername,
    displayName: googleName,
    bio: `${googleName}님의 마이링크 공간이에요.`,
    email: user.email || undefined,
    avatarUrl: user.photoURL || undefined,
    role: "마이링크 멤버",
    createdAt: now,
    updatedAt: now,
  };

  await saveUserProfile(user.uid, newProfile);
  return newProfile;
}

/**
 * 프로필 저장 함수
 * - users/{userId}/profile에 저장
 * - users/{userId}에도 동기화하여 displayName/username 기반 빠른 유저 검색 지원
 * - usernames/{username} 고유 매핑 문서 갱신
 */
export async function saveUserProfile(
  userId: string,
  data: {
    username: string;
    displayName: string;
    bio: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
  },
  previousUsername?: string
): Promise<UserProfileData> {
  const cleanUsername = data.username.trim().toLowerCase();
  const cleanDisplayName = data.displayName.trim();
  const cleanBio = data.bio.trim();

  if (!cleanUsername) {
    throw new Error("username을 입력해 주세요.");
  }
  if (!cleanDisplayName) {
    throw new Error("displayName(표시 이름)을 입력해 주세요.");
  }

  // username이 변경된 경우 중복 체크
  if (previousUsername && cleanUsername !== previousUsername.trim().toLowerCase()) {
    const isAvailable = await checkUsernameAvailable(cleanUsername, userId);
    if (!isAvailable) {
      throw new Error("이미 사용 중인 username입니다.");
    }
  }

  const now = new Date().toISOString();
  const profileData: UserProfileData = {
    uid: userId,
    username: cleanUsername,
    displayName: cleanDisplayName,
    bio: cleanBio,
    email: data.email,
    avatarUrl: data.avatarUrl,
    role: data.role || "마이링크 멤버",
    updatedAt: now,
  };

  const payload = sanitize({
    ...profileData,
    _serverUpdatedAt: serverTimestamp(),
  });

  // 1. users/{userId}/profile 저장 (서브컬렉션 문서)
  const profileDocRef = doc(
    db,
    FIRESTORE_USERS_COLLECTION,
    userId,
    FIRESTORE_PROFILE_COLLECTION,
    FIRESTORE_PROFILE_DOC
  );
  await setDoc(profileDocRef, payload, { merge: true });

  // 2. users/{userId} 메인 문서 저장 (빠른 검색 및 보안 규칙 지원)
  const userDocRef = doc(db, FIRESTORE_USERS_COLLECTION, userId);
  await setDoc(userDocRef, payload, { merge: true });

  // 3. 이전 username 매핑 정리 및 새 username 매핑 등록
  try {
    if (previousUsername && cleanUsername !== previousUsername.trim().toLowerCase()) {
      const oldDocRef = doc(db, FIRESTORE_USERNAMES_COLLECTION, previousUsername.trim().toLowerCase());
      await deleteDoc(oldDocRef);
    }
    const usernameDocRef = doc(db, FIRESTORE_USERNAMES_COLLECTION, cleanUsername);
    await setDoc(usernameDocRef, {
      uid: userId,
      username: cleanUsername,
      updatedAt: now,
    });
  } catch (err) {
    console.warn("usernames mapping update failed:", err);
  }

  return profileData;
}

/**
 * displayName 또는 username으로 유저 프로필 검색 (동적 라우팅 /[displayName] 지원)
 */
export async function findUserByDisplayNameOrUsername(
  queryParam: string
): Promise<UserProfileData | null> {
  const cleanParam = decodeURIComponent(queryParam).trim().replace(/^@/, "");
  if (!cleanParam) return null;

  try {
    // 1. users 컬렉션에서 displayName 검색 (정확히 일치)
    const usersRef = collection(db, FIRESTORE_USERS_COLLECTION);
    const qDisplayName = query(usersRef, where("displayName", "==", cleanParam));
    const snapDisplay = await getDocs(qDisplayName);

    if (!snapDisplay.empty) {
      const d = snapDisplay.docs[0];
      const data = d.data() as UserProfileData;
      return {
        ...data,
        uid: d.id,
      };
    }

    // 2. users 컬렉션에서 username 검색 (소문자 일치)
    const qUsername = query(usersRef, where("username", "==", cleanParam.toLowerCase()));
    const snapUser = await getDocs(qUsername);

    if (!snapUser.empty) {
      const d = snapUser.docs[0];
      const data = d.data() as UserProfileData;
      return {
        ...data,
        uid: d.id,
      };
    }

    // 3. usernames 매핑 컬렉션에서 uid 역조회
    const usernameDocRef = doc(db, FIRESTORE_USERNAMES_COLLECTION, cleanParam.toLowerCase());
    const usernameSnap = await getDoc(usernameDocRef);
    if (usernameSnap.exists()) {
      const uid = usernameSnap.data()?.uid;
      if (uid) {
        return await getUserProfile(uid);
      }
    }

    return null;
  } catch (error) {
    console.error(`유저 검색(${cleanParam}) 중 오류 발생:`, error);
    return null;
  }
}
