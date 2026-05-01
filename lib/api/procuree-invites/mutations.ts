"use client";

import { useMutation } from "@tanstack/react-query";
import { setApiAccessToken, setApiUserProfile } from "@/lib/api/axios";
import {
  acceptProcureeInviteSignup,
  createProcureeInvite,
} from "./service";
import type {
  AcceptProcureeInviteSignupPayload,
  CreateProcureeInvitePayload,
} from "./types";

export function useCreateProcureeInviteMutation() {
  return useMutation({
    mutationFn: (payload: CreateProcureeInvitePayload) =>
      createProcureeInvite(payload),
  });
}

export function useAcceptProcureeInviteSignupMutation() {
  return useMutation({
    mutationFn: (payload: AcceptProcureeInviteSignupPayload) =>
      acceptProcureeInviteSignup(payload),
    onSuccess: (response) => {
      const token = response.data.token;
      if (typeof token === "string" && token.trim()) {
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
