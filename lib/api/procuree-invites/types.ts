type ApiSuccessResponse<TData> = {
  code: number;
  message: string;
  data: TData;
};

export type GetProcureeInvitePreviewPayload = {
  phone: string;
};

export type CreateProcureeInvitePayload = {
  phone: string;
};

export type CreateProcureeInviteData = {
  inviteId: string;
  token: string;
  groupId: string;
  groupName: string;
  phone: string;
  inviteLink: string;
  expiresAt: string;
  role: string;
};

export type CreateProcureeInviteResponse =
  ApiSuccessResponse<CreateProcureeInviteData>;

export type ProcureeInvitePreviewData = {
  groupId: string;
  groupName: string;
  email: string;
  phone: string;
  inviteLink: string;
  expiresAt: string;
  role: string;
};

export type ProcureeInvitePreviewResponse =
  ApiSuccessResponse<ProcureeInvitePreviewData>;

export type AcceptProcureeInviteSignupPayload = {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type ProcureeMembership = {
  membershipId: string;
  groupId: string;
  groupName: string;
  inviteCode: string;
  role: string;
};

export type AcceptProcureeInviteSignupData = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  groupId: string;
  groupName: string;
  membershipId: string;
  memberships: ProcureeMembership[];
  token: string;
};

export type AcceptProcureeInviteSignupResponse =
  ApiSuccessResponse<AcceptProcureeInviteSignupData>;
