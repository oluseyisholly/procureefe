import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CheckEmailUniqueResponse,
  CheckPhoneUniqueResponse,
  CreateAdminPayload,
  CreateAdminResponse,
  SignInPayload,
  SignInResponse,
} from "./types";

export async function signInUser(payload: SignInPayload): Promise<SignInResponse> {
  const response = await apiClient.post<SignInResponse>(
    API_ENDPOINTS.users.signIn,
    payload,
  );
  return response.data;
}

export async function createAdminUser(
  payload: CreateAdminPayload,
): Promise<CreateAdminResponse> {
  const response = await apiClient.post<CreateAdminResponse>(
    API_ENDPOINTS.users.createAdmin,
    payload,
  );
  return response.data;
}

export async function checkEmailUnique(
  email: string,
): Promise<CheckEmailUniqueResponse> {
  const response = await apiClient.get<CheckEmailUniqueResponse>(
    API_ENDPOINTS.users.checkEmail,
    {
      params: {
        email,
      },
    },
  );

  return response.data;
}

export async function checkPhoneUnique(
  phone: string,
): Promise<CheckPhoneUniqueResponse> {
  const response = await apiClient.get<CheckPhoneUniqueResponse>(
    API_ENDPOINTS.users.checkPhone,
    {
      params: {
        phone,
      },
    },
  );

  return response.data;
}
