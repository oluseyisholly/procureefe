"use client";

import { Card } from "@/components/ui/card";
import { IconWrapper } from "@/components/ui/iconwrapper";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ActiveMemberIcon } from "../icons/active-member";
import { InActiveMemberIcon } from "../icons/inactive-member";
import { PendingMemberIcon } from "../icons/pending-member";
import {
  AverageParticipationIcon,
} from "../icons/average-participation";

type SummaryItem = {
  id: string;
  label: string;
  value: string;
  icon: ReactNode;
};

type MembersSummaryPanelProps = {
  className?: string;
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  pendingInvites: number;
  averageParticipation: string;
  isLoading?: boolean;
};

export function MembersSummaryPanel({
  className,
  totalMembers,
  activeMembers,
  inactiveMembers,
  pendingInvites,
  averageParticipation,
  isLoading = false,
}: MembersSummaryPanelProps) {
  const summaryItems: SummaryItem[] = [
    {
      id: "total",
      label: "Total Member",
      value: isLoading ? "..." : String(totalMembers),
      icon: <ActiveMemberIcon />,
    },
    {
      id: "active",
      label: "Total Active Member",
      value: isLoading ? "..." : String(activeMembers),
      icon: <ActiveMemberIcon />,
    },
    {
      id: "inactive",
      label: "Total Inactive Member",
      value: isLoading ? "..." : String(inactiveMembers),
      icon: <InActiveMemberIcon />,
    },
    {
      id: "pending",
      label: "Pending Invites",
      value: isLoading ? "..." : String(pendingInvites),
      icon: <PendingMemberIcon />,
    },
    {
      id: "avg",
      label: "Average Participation",
      value: isLoading ? "..." : averageParticipation,
      icon: <AverageParticipationIcon />,
    },
  ];

  return (
    <Card
      className={cn(
        "h-fit rounded-[8px] border border-[#E4E7EC] p-3.5",
        className,
      )}
    >
      <div className="space-y-3">
        {summaryItems.map((item) => (
          <Card
            key={item.id}
            className="rounded-[8px] border border-[#E4E7EC] p-4 shadow-none"
          >
            <div className="flex items-center gap-3">
              <IconWrapper size="lg" className="!rounded-full">
                <span className={cn("inline-flex")}>{item.icon}</span>
              </IconWrapper>

              <div>
                <p className="text-[10px] font-medium text-[#9CA3AF]">
                  {item.label}
                </p>
                <p className="mt-1 text-[20px] leading-8 font-normal text-[#1F2933]">
                  {item.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
