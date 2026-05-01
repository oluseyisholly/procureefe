"use client";

import { ViewIcon } from "@/components/icons/view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import type { TenantMember } from "@/lib/api/users";
import {
  getMemberInitials,
  mapTenantMemberToTableRow,
  type MemberStatus,
  type MemberTableRow,
  type MemberTone,
} from "@/lib/member/view-model";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Invite } from "../dashboard/invite";
import { SearchIcon } from "../item/search-icon";
import { Modal, ModalBody } from "../ui/modal";

type MembersTablePanelProps = {
  className?: string;
  members: TenantMember[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  isLoading?: boolean;
  isRefreshing?: boolean;
  errorMessage?: string;
  onPageChange: (page: number) => void;
};

const avatarToneStyles: Record<MemberTone, string> = {
  rose: "bg-rose-100 text-rose-700",
  sky: "bg-sky-100 text-sky-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-200 text-slate-700",
};

const statusStyles: Record<
  MemberStatus,
  { wrapper: string; dot: string; text: string }
> = {
  Active: {
    wrapper: "bg-emerald-50",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
  },
  Inactive: {
    wrapper: "bg-red-50",
    dot: "bg-red-500",
    text: "text-red-600",
  },
  Pending: {
    wrapper: "bg-slate-100",
    dot: "bg-slate-500",
    text: "text-slate-600",
  },
};

function MemberAvatar({
  name,
  tone,
}: {
  name: string;
  tone: MemberTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold",
        avatarToneStyles[tone],
      )}
    >
      {getMemberInitials(name)}
    </span>
  );
}

export function MembersTablePanel({
  className,
  members,
  currentPage,
  pageSize,
  totalPages,
  isLoading = false,
  isRefreshing = false,
  errorMessage,
  onPageChange,
}: MembersTablePanelProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const memberRows = useMemo(
    () =>
      members.map((member, index) =>
        mapTenantMemberToTableRow(member, index, currentPage, pageSize),
      ),
    [currentPage, members, pageSize],
  );

  const filteredMembers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return memberRows;
    }

    return memberRows.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.phoneNumber.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.status.toLowerCase().includes(query),
    );
  }, [memberRows, searchTerm]);

  const memberColumns = useMemo<DataTableColumn<MemberTableRow>[]>(
    () => [
      {
        id: "serial",
        header: "S/N",
        accessorKey: "serial",
        headerClassName: "w-[72px]",
        cellClassName: "text-[#667085]",
      },
      {
        id: "name",
        header: "Name",
        cell: (row) => (
          <div className="flex items-center gap-2.5">
            <MemberAvatar name={row.name} tone={row.tone} />
            <span className="font-medium text-[#344054]">{row.name}</span>
          </div>
        ),
        cellClassName: "min-w-[220px]",
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        cellClassName: "min-w-[220px] text-[#475467]",
      },
      {
        id: "phoneNumber",
        header: "Phone Number",
        accessorKey: "phoneNumber",
        cellClassName: "text-[#475467]",
      },
      {
        id: "dateJoined",
        header: "Date Joined",
        accessorKey: "dateJoined",
        cellClassName: "text-[#475467]",
      },
      {
        id: "status",
        header: "Status",
        align: "center",
        cell: (row) => {
          const style = statusStyles[row.status];
          return (
            <span
              className={cn(
                "inline-flex min-w-[84px] items-center justify-center gap-1 rounded-[8px] px-2 py-1 text-xs font-semibold",
                style.wrapper,
                style.text,
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", style.dot)} />
              <span>{row.status}</span>
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Action",
        align: "center",
        cell: (row) => (
          <IconButton
            label={`View ${row.name}`}
            onClick={() => router.push(`/members/${row.id}`)}
            className="text-[#98A2B3] transition-colors hover:text-[#667085]"
          >
            <ViewIcon className="h-4 w-4" />
          </IconButton>
        ),
      },
    ],
    [router],
  );

  return (
    <Card
      className={cn("rounded-[8px] border border-[#E4E7EC] p-4", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-full max-w-[420px]">
          <p className="text-[10px] font-bold uppercase text-[#98A2B3]">
            Members
          </p>
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="search..."
            suffix={<SearchIcon className="h-4 w-4" />}
            className="mt-2 h-9 rounded-[6px] border-[#D0D5DD]"
            aria-label="Search members"
          />
        </div>

        <Button
          onClick={() => setIsInviteModalOpen(true)}
          type="button"
          className="h-10 min-w-[146px] rounded-[8px]"
        >
          Invite Member
        </Button>
      </div>

      {errorMessage ? (
        <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-[8px] bg-white">
        <DataTable
          columns={memberColumns}
          rows={filteredMembers}
          rowKey="id"
          variant="clean"
          pagination={{
            mode: "server",
            currentPage,
            totalPages,
            onPageChange,
            isLoading: isRefreshing,
          }}
          tableClassName="text-xs"
          emptyState={
            isLoading
              ? "Loading members..."
              : searchTerm.trim()
                ? "No members match your search."
                : "No members available yet."
          }
        />
      </div>

      <Modal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Member"
        panelClassName="max-w-[560px]"
        description="To invite someone to your team, simply enter their phone number, and we'll send them an invitation link to register. Alternatively, you can send the link directly to them, and once they register, they'll appear in the community."
      >
        <ModalBody className="space-y-4">
          <Invite setIsInviteModalOpen={setIsInviteModalOpen} />
        </ModalBody>
      </Modal>
    </Card>
  );
}
