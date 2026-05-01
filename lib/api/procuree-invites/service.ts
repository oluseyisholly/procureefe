import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  AcceptProcureeInviteSignupPayload,
  AcceptProcureeInviteSignupResponse,
  CreateProcureeInvitePayload,
  CreateProcureeInviteResponse,
  GetProcureeInvitePreviewPayload,
  ProcureeInvitePreviewResponse,
} from "./types";

export async function createProcureeInvite(
  payload: CreateProcureeInvitePayload,
): Promise<CreateProcureeInviteResponse> {
  const response = await apiClient.post<CreateProcureeInviteResponse>(
    API_ENDPOINTS.procureeInvites.create,
    payload,
  );

  return response.data;
}

export async function getProcureeInvitePreview(
  payload: GetProcureeInvitePreviewPayload,
): Promise<ProcureeInvitePreviewResponse> {
  const response = await apiClient.get<ProcureeInvitePreviewResponse>(
    API_ENDPOINTS.procureeInvites.preview,
    {
      params: {
        phone: payload.phone,
      },
    },
  );

  return response.data;
}

export async function acceptProcureeInviteSignup(
  payload: AcceptProcureeInviteSignupPayload,
): Promise<AcceptProcureeInviteSignupResponse> {
  const response = await apiClient.post<AcceptProcureeInviteSignupResponse>(
    API_ENDPOINTS.procureeInvites.acceptSignup,
    payload,
  );

  return response.data;
}
