"use client";

import { MembersSummaryPanel } from "@/components/member/members-summary-panel";
import { MembersTablePanel } from "@/components/member/members-table-panel";
import { useMembersQuery } from "@/lib/api/users";
import { useState } from "react";

const MEMBERS_PAGE_SIZE = 7;

export default function MembersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const membersQuery = useMembersQuery({
    page: currentPage,
    pageSize: MEMBERS_PAGE_SIZE,
  });
  const membersData = membersQuery.data?.data;
  const members = membersData?.data ?? [];
  const totalMembers = membersData?.total ?? 0;
  const totalPages = membersData?.totalPages ?? 1;

  return (
    <>
      <div>
        <h3 className="text-xl font-semibold leading-7 text-[#1F2933]">Members</h3>
        <p className="text-base font-medium leading-6 text-[#1F2933]">
          Manage Members, send invitations, and configure member access
        </p>
      </div>

      <div className="mt-[20px] grid grid-cols-1 gap-3 lg:grid-cols-8">
        <MembersTablePanel
          className="lg:col-span-6"
          members={members}
          currentPage={membersData?.page ?? currentPage}
          pageSize={membersData?.pageSize ?? MEMBERS_PAGE_SIZE}
          totalPages={totalPages}
          isLoading={membersQuery.isPending}
          isRefreshing={membersQuery.isFetching}
          errorMessage={
            membersQuery.isError ? "Unable to load members right now." : undefined
          }
          onPageChange={setCurrentPage}
        />
        <MembersSummaryPanel
          className="lg:col-span-2"
          totalMembers={totalMembers}
          activeMembers={totalMembers}
          inactiveMembers={0}
          pendingInvites={0}
          averageParticipation="--"
          isLoading={membersQuery.isPending}
        />
      </div>
    </>
  );
}
