"use client";

import { useMutation } from "@tanstack/react-query";
import { setApiAccessToken, setApiUserProfile } from "@/lib/api/axios";
import {
  checkEmailUnique,
  checkPhoneUnique,
  createAdminUser,
  signInUser,
} from "./service";
import type { CreateAdminPayload, SignInPayload } from "./types";

export function useSignInMutation() {
  return useMutation({
    mutationFn: (payload: SignInPayload) => signInUser(payload),
    onSuccess: (response) => {
      const token = response.data.token;
      if (token) {
        setApiAccessToken(token);
      }

      setApiUserProfile({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phone: response.data.phone,
        role: response.data.role,
        groupId: response.data.groupId,
      });
    },
  });
}

export function useCreateAdminUserMutation() {
  return useMutation({
    mutationFn: (payload: CreateAdminPayload) => createAdminUser(payload),
    onSuccess: (response, payload) => {
      const token = response.data?.token;
      if (typeof token === "string" && token.trim()) {
        setApiAccessToken(token);
      }

      setApiUserProfile({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
      });
    },
  });
}

export function useCheckEmailUniqueMutation() {
  return useMutation({
    mutationFn: (email: string) => checkEmailUnique(email),
  });
}

export function useCheckPhoneUniqueMutation() {
  return useMutation({
    mutationFn: (phone: string) => checkPhoneUnique(phone),
  });
}
