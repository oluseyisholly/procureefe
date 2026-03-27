export type SignInPayload = {
  email: string;
  password: string;
};

export type CreateAdminPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  groupName: string;
  groupDescription: string;
  phone: string;
  confirmPassword: string;
};

export type SignInData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  groupId: string;
  token: string;
};

export type CreateAdminData = {
  token?: string;
  [key: string]: unknown;
};

export type UniquenessCheckData = {
  isUnique: boolean;
};

export type ApiSuccessResponse<TData> = {
  code: number;
  message: string;
  data: TData;
};

export type SignInResponse = ApiSuccessResponse<SignInData>;
export type CreateAdminResponse = ApiSuccessResponse<CreateAdminData>;
export type CheckEmailUniqueResponse = ApiSuccessResponse<UniquenessCheckData>;
export type CheckPhoneUniqueResponse = ApiSuccessResponse<UniquenessCheckData>;
