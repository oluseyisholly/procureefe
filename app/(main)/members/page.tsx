"use client";

import { MembersSummaryPanel } from "@/components/member/members-summary-panel";
import { MembersTablePanel } from "@/components/member/members-table-panel";

export default function MembersPage() {
  return (
    <>
      <div>
        <h3 className="text-xl font-semibold leading-7 text-[#1F2933]">Members</h3>
        <p className="text-base font-medium leading-6 text-[#1F2933]">
          Manage Members, send invitations, and configure member access
        </p>
      </div>

      <div className="mt-[20px] grid grid-cols-1 gap-3 lg:grid-cols-8">
        <MembersTablePanel className="lg:col-span-6" />
        <MembersSummaryPanel className="lg:col-span-2" />
      </div>
    </>
  );
}
