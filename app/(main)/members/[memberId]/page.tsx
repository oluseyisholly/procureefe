"use client";

import { BackIcon } from "@/components/icons/back";
import { MembersNavIcon } from "@/components/icons/members-nav-icon";
import { MoneyIcon } from "@/components/icons/money";
import { OrdersIcon } from "@/components/icons/orders-icon";
import { Card } from "@/components/ui/card";
import { IconWrapper } from "@/components/ui/iconwrapper";
import { useMembersQuery } from "@/lib/api/users";
import type { PurchaseStatus } from "@/lib/member/data";
import {
  getMemberInitials,
  mapTenantMemberToDetailView,
  type MemberStatus,
  type MemberTone,
} from "@/lib/member/view-model";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, type ReactNode } from "react";

const DETAIL_PAGE_SIZE = 1000;

type PurchaseHistoryItem = {
  id: string;
  marketRunLabel: string;
  itemsLabel: string;
  dateLabel: string;
  amount: number;
  status: PurchaseStatus;
};

const avatarToneStyles: Record<MemberTone, string> = {
  rose: "bg-rose-100 text-rose-700",
  sky: "bg-sky-100 text-sky-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-200 text-slate-700",
};

const memberStatusStyles: Record<
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

const purchaseStatusStyles: Record<
  PurchaseStatus,
  { wrapper: string; dot: string; text: string }
> = {
  Pending: {
    wrapper: "bg-slate-100",
    dot: "bg-slate-500",
    text: "text-slate-600",
  },
  Reconciled: {
    wrapper: "bg-[#EAF2FF]",
    dot: "bg-[#155EEF]",
    text: "text-[#155EEF]",
  },
};

function formatNaira(value: number) {
  return `₦${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function MemberDetailsPage() {
  const params = useParams<{ memberId: string }>();
  const memberId =
    typeof params.memberId === "string" ? params.memberId : params.memberId?.[0] ?? "";
  const membersQuery = useMembersQuery(
    {
      page: 1,
      pageSize: DETAIL_PAGE_SIZE,
    },
    {
      enabled: Boolean(memberId),
    },
  );

  const member = useMemo(
    () =>
      membersQuery.data?.data.data.find((tenantMember) => tenantMember.id === memberId),
    [memberId, membersQuery.data],
  );

  const memberView = member ? mapTenantMemberToDetailView(member) : null;
  const purchaseHistory: PurchaseHistoryItem[] = [];

  if (membersQuery.isPending) {
    return (
      <div className="space-y-4">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-[16px] font-[500] text-[#475467] hover:text-[#344054]"
        >
          <BackIcon />
          Back
        </Link>

        <Card className="rounded-[8px] border border-[#E4E7EC] p-6 shadow-none">
          <p className="text-sm font-medium text-[#667085]">
            Loading member details...
          </p>
        </Card>
      </div>
    );
  }

  if (membersQuery.isError || !memberView) {
    return (
      <div className="space-y-4">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-[16px] font-[500] text-[#475467] hover:text-[#344054]"
        >
          <BackIcon />
          Back
        </Link>

        <Card className="rounded-[8px] border border-[#E4E7EC] p-6 shadow-none">
          <p className="text-sm font-medium text-[#667085]">
            {membersQuery.isError
              ? "Unable to load this member right now."
              : "Member not found."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href="/members"
        className="inline-flex items-center gap-2 text-[16px] font-[500] text-[#475467] hover:text-[#344054]"
      >
        <BackIcon />
        Back
      </Link>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[350px_minmax(0,1fr)]">
        <Card className="rounded-[8px] border border-[#E4E7EC] p-4 shadow-none">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "inline-flex h-[80px] w-[80px] items-center justify-center rounded-full text-sm font-semibold",
                avatarToneStyles[memberView.tone],
              )}
            >
              {getMemberInitials(memberView.name)}
            </span>
            <p className="mt-2 text-base font-semibold text-[#1F2933]">
              {memberView.name}
            </p>
          </div>

          <div className="mt-4 border-t border-[#E5E7EB] pt-3">
            <p className="text-[13px] font-semibold uppercase text-[#9CA3AF]">
              Contact Information
            </p>

            <DetailField label="Phone Number" value={memberView.phoneNumber} />
            <DetailField label="Email Address" value={memberView.email} />
            <DetailField label="Contact Address" value="--" />
          </div>

          <div className="mt-4 border-t border-[#E5E7EB] pt-3">
            <p className="text-[13px] font-semibold uppercase text-[#9CA3AF]">
              System Information
            </p>

            <DetailField label="Date Joined" value={memberView.dateJoinedLong} />
            <div className="mt-2">
              <p className="text-[10px] text-[#98A2B3]">Status</p>
              <MemberStatusPill status={memberView.status} className="mt-1" />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="h-[44px] w-full rounded-[8px] bg-[#DC262608] text-[14px] font-medium text-[#DC2626]"
            >
              Remove Member
            </button>
          </div>
        </Card>

        <Card className="rounded-[8px] border border-[#E4E7EC] p-4 shadow-none">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            <MetricCard
              label="Total Orders"
              value="--"
              icon={<OrdersIcon />}
            />
            <MetricCard
              label="Total Spents"
              value="--"
              icon={<MoneyIcon />}
            />
            <MetricCard
              label="Referrals"
              value="--"
              icon={<MembersNavIcon />}
            />
          </div>

          <div className="mt-5">
            <p className="text-[13px] font-semibold uppercase text-[#9CA3AF]">
              Purchase History
            </p>

            <div className="mt-2 max-h-[365px] space-y-2 overflow-y-auto pr-1">
              {purchaseHistory.length > 0 ? (
                purchaseHistory.map((historyItem) => (
                  <div
                    key={historyItem.id}
                    className="flex items-center justify-between rounded-[8px] border border-[#F9FAFB] px-[20px] py-[10px] py-3 last:border-b-0"
                  >
                    <div>
                      <p className="text-[14px] font-[500] text-[#000000]">
                        {historyItem.marketRunLabel}
                      </p>
                      <p className="mt-1 text-[11px] text-[#98A2B3]">
                        {historyItem.itemsLabel} • {historyItem.dateLabel}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[14px] font-[500] text-[#000000]">
                        {formatNaira(historyItem.amount)}
                      </p>
                      <PurchaseStatusPill
                        status={historyItem.status}
                        className="mt-1 ml-auto"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[8px] border border-[#F3F4F6] px-[20px] py-6">
                  <p className="text-[14px] font-[500] text-[#000000]">
                    No purchase history available
                  </p>
                  <p className="mt-1 text-[11px] text-[#98A2B3]">
                    Purchase data has not been connected for this member yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <p className="text-[11px] font-[400] text-[#9CA3AF]">{label}</p>
      <p className="text-[14px] font-[400] text-[#1F2933]">{value}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <Card className="rounded-[8px] !bg-[#F9FAFB] border !border-[#E5E7EB] p-4 py-7 shadow-none">
      <div className="flex items-center gap-3">
        <IconWrapper size="lg" className="!rounded-full">
          <span className="inline-flex">{icon}</span>
        </IconWrapper>
        <div>
          <p className="text-[10px] font-[500] text-[#9CA3AF]">{label}</p>
          <p className="mt-1 text-[20px] leading-8 font-[400] text-[#1F2933]">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

function MemberStatusPill({
  status,
  className,
}: {
  status: MemberStatus;
  className?: string;
}) {
  const style = memberStatusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-xs font-semibold",
        style.wrapper,
        style.text,
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", style.dot)} />
      {status}
    </span>
  );
}

function PurchaseStatusPill({
  status,
  className,
}: {
  status: PurchaseStatus;
  className?: string;
}) {
  const style = purchaseStatusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-xs font-semibold",
        style.wrapper,
        style.text,
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", style.dot)} />
      {status}
    </span>
  );
}
