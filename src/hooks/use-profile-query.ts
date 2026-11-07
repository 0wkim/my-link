"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "firebase/auth";
import {
  getUserProfile,
  getOrCreateUserProfile,
  saveUserProfile,
  checkUsernameAvailable,
} from "@/lib/firestore-profile";
import {
  getLinksFromFirestore,
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
} from "@/lib/firestore-links";
import type { UserProfileData, LinkItem, LinkCreateInput, LinkUpdateInput } from "@/types/link";

/**
 * 로그인한 사용자의 Firestore 프로필 조회/생성 쿼리 (실시간 리스너 없음)
 */
export function useUserProfileQuery(currentUser: User | null) {
  return useQuery<UserProfileData | null>({
    queryKey: ["profile", currentUser?.uid],
    queryFn: async () => {
      if (!currentUser) return null;
      return await getOrCreateUserProfile(currentUser);
    },
    enabled: !!currentUser,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
}

/**
 * 특정 userId의 프로필 조회 쿼리 (단건 조회)
 */
export function useProfileByUserIdQuery(userId: string | undefined) {
  return useQuery<UserProfileData | null>({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      return await getUserProfile(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 낙관적 업데이트(Optimistic Update)가 적용된 프로필 수정 뮤테이션
 */
export function useUpdateProfileMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      previousUsername,
    }: {
      data: {
        username: string;
        displayName: string;
        bio: string;
        email?: string;
        avatarUrl?: string;
      };
      previousUsername?: string;
    }) => {
      if (!userId) throw new Error("로그인이 필요합니다.");
      return await saveUserProfile(userId, data, previousUsername);
    },
    // 낙관적 업데이트 실행
    onMutate: async ({ data }) => {
      if (!userId) return;

      // 1. 발신 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["profile", userId] });

      // 2. 롤백을 위한 이전 값 스냅샷
      const previousProfile = queryClient.getQueryData<UserProfileData>(["profile", userId]);

      // 3. 캐시에 낙관적 업데이트 선반영
      if (previousProfile) {
        queryClient.setQueryData<UserProfileData>(["profile", userId], {
          ...previousProfile,
          username: data.username.trim().toLowerCase(),
          displayName: data.displayName.trim(),
          bio: data.bio.trim(),
          email: data.email || previousProfile.email,
          avatarUrl: data.avatarUrl || previousProfile.avatarUrl,
        });
      }

      // 4. 에러 발생 시 롤백에 사용할 컨텍스트 반환
      return { previousProfile };
    },
    onError: (err, newVariables, context) => {
      // 에러 발생 시 낙관적 업데이트 롤백
      if (userId && context?.previousProfile) {
        queryClient.setQueryData(["profile", userId], context.previousProfile);
      }
    },
    onSettled: () => {
      // 성공/실패 여부와 관계없이 서버 데이터와 동기화
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      }
    },
  });
}

/**
 * Firestore users/{userId}/links 목록 조회 쿼리 (실시간 리스너 없이 TanStack Query 사용)
 */
export function useUserLinksQuery(userId: string | undefined) {
  return useQuery<LinkItem[]>({
    queryKey: ["links", userId],
    queryFn: async () => {
      if (!userId) return [];
      return await getLinksFromFirestore(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2분
  });
}

/**
 * Firestore users/{userId}/links 새 링크 추가 뮤테이션
 */
export function useAddLinkMutation(userId: string | undefined, userHandle: string = "user") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LinkCreateInput) => {
      const targetUserId = userId || "anonymous";
      return await addLinkToFirestore(input, userHandle, targetUserId);
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["links", userId] });
      }
    },
  });
}

/**
 * Firestore users/{userId}/links 링크 수정 뮤테이션
 */
export function useUpdateLinkMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      linkId,
      input,
    }: {
      linkId: string;
      input: LinkUpdateInput;
    }) => {
      const targetUserId = userId || "anonymous";
      return await updateLinkInFirestore(linkId, input, targetUserId);
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["links", userId] });
      }
    },
  });
}

/**
 * Firestore users/{userId}/links 링크 삭제 뮤테이션
 */
export function useDeleteLinkMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      const targetUserId = userId || "anonymous";
      return await deleteLinkFromFirestore(linkId, targetUserId);
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["links", userId] });
      }
    },
  });
}
