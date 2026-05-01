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

export type GetMembersPayload = {
  page?: number;
  pageSize?: number;
};

export type TenantMemberUser = {
  id: string;
  created_at: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type TenantMemberGroup = {
  id: string;
  name: string;
};

export type TenantMember = {
  id: string;
  role: string;
  user: TenantMemberUser;
  group: TenantMemberGroup;
};

export type GetMembersData = {
  data: TenantMember[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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
export type GetMembersResponse = ApiSuccessResponse<GetMembersData>;
