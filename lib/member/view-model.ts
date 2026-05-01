import type { TenantMember } from "@/lib/api/users";

export type MemberStatus = "Active" | "Inactive" | "Pending";
export type MemberTone = "rose" | "sky" | "amber" | "emerald" | "slate";

export type MemberTableRow = {
  id: string;
  serial: number;
  name: string;
  phoneNumber: string;
  email: string;
  dateJoined: string;
  status: MemberStatus;
  tone: MemberTone;
};

export type MemberDetailView = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  dateJoinedLong: string;
  status: MemberStatus;
  tone: MemberTone;
  groupName: string;
  role: string;
};

const MEMBER_TONES: MemberTone[] = [
  "rose",
  "sky",
  "amber",
  "emerald",
  "slate",
];

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function getMemberDisplayName(member: TenantMember) {
  const fullName = `${member.user.firstName} ${member.user.lastName}`.trim();
  return fullName || member.user.email || member.user.phone || "Unknown Member";
}

export function getMemberInitials(name: string) {
  return name
    .split(" ")
    .map((chunk) => chunk[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatMemberShortDate(dateString: string) {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? "-" : shortDateFormatter.format(date);
}

export function formatMemberLongDate(dateString: string) {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? "-" : longDateFormatter.format(date);
}

export function formatMemberRole(role: string) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getMemberTone(seed: string) {
  const hash = Array.from(seed).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );

  return MEMBER_TONES[hash % MEMBER_TONES.length];
}

export function mapTenantMemberToTableRow(
  member: TenantMember,
  index: number,
  page: number,
  pageSize: number,
): MemberTableRow {
  return {
    id: member.id,
    serial: (page - 1) * pageSize + index + 1,
    name: getMemberDisplayName(member),
    phoneNumber: member.user.phone || "-",
    email: member.user.email || "-",
    dateJoined: formatMemberShortDate(member.user.created_at),
    status: "Active",
    tone: getMemberTone(member.user.id || member.id),
  };
}

export function mapTenantMemberToDetailView(
  member: TenantMember,
): MemberDetailView {
  return {
    id: member.id,
    userId: member.user.id,
    name: getMemberDisplayName(member),
    email: member.user.email || "-",
    phoneNumber: member.user.phone || "-",
    dateJoined: formatMemberShortDate(member.user.created_at),
    dateJoinedLong: formatMemberLongDate(member.user.created_at),
    status: "Active",
    tone: getMemberTone(member.user.id || member.id),
    groupName: member.group.name || "-",
    role: formatMemberRole(member.role),
  };
}
