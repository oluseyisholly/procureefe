"use client";

import DashBoardCard from "@/components/dashboard/card";
import { DashboardSidePanel } from "@/components/dashboard/dashboard-side-panel";
import { ItemsNavIcon } from "@/components/icons/items-nav-icon";
import { MarketRunNavIcon } from "@/components/icons/market-run-nav-icon";
import { MembersNavIcon } from "@/components/icons/members-nav-icon";
import { TotalCostNav } from "@/components/icons/total-cost-icon";
import { ViewIcon } from "@/components/icons/view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { getApiUserProfile } from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { DashboardStatusFilter, MarketRunRow } from "@/store";
import {
  useDashboardFilters,
  useDashboardRows,
} from "@/store/hooks/use-dashboard-store";

const DASHBOARD_WELCOME_STORAGE_KEY = "procureefe_dashboard_welcome_seen";

const STATUS_FILTER_OPTIONS: Array<{
  label: string;
  value: DashboardStatusFilter;
}> = [
  { label: "All Status", value: "all" },
  { label: "Open", value: "Open" },
  { label: "Closed", value: "Closed" },
];

const columns: DataTableColumn<MarketRunRow>[] = [
  { id: "date", header: "Date", accessorKey: "date" },
  { id: "description", header: "Description", accessorKey: "description" },
  { id: "items", header: "Items", accessorKey: "items" },
  { id: "members", header: "Members", accessorKey: "members" },
  { id: "status", header: "Status", accessorKey: "status" },
  { id: "totalAmount", header: "Total Amount", accessorKey: "totalAmount" },
  {
    id: "actions",
    header: "Actions",
    align: "center",
    cellClassName: "text-slate-500",
    cell: (row) => (
      <IconButton
        label={`View ${row.description} market run`}
        className="inline-flex items-center justify-center text-slate-500 transition-colors hover:text-slate-700"
      >
        <ViewIcon className="h-4 w-4" />
      </IconButton>
    ),
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const rows = useDashboardRows();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const currentUserProfile = getApiUserProfile();
  const firstName = currentUserProfile?.firstName ?? "there";

  useEffect(() => {
    const hasSeenWelcome = window.localStorage.getItem(
      DASHBOARD_WELCOME_STORAGE_KEY,
    );
    if (hasSeenWelcome === "1") {
      return;
    }

    setShowWelcomeModal(true);
  }, []);

  function closeWelcomeModal() {
    window.localStorage.setItem(DASHBOARD_WELCOME_STORAGE_KEY, "1");
    setShowWelcomeModal(false);
  }

  return (
    <>
      <div>
        <h3 className="text-xl font-semibold leading-7 text-[#1F2933]">
          Dashboard
        </h3>
        <p className={"text-base font-medium leading-6 text-[#1F2933]"}>
          {`Hello ${firstName}!`}
        </p>
      </div>
      <div className="grid grid-cols-8 gap-[24px] mt-[20px]">
        <div className="col-span-6 mb-[0px]">
          <div className="grid grid-cols-4 pb-[22px] gap-[35px]">
            <DashBoardCard
              className="col-span-1"
              value={"₦ 123,992.00"}
              text={"Total Est. Cost"}
              icon={<TotalCostNav />}
            />
            <DashBoardCard
              className="col-span-1"
              value={"12"}
              text={"Total Market Runs"}
              icon={<MarketRunNavIcon />}
            />
            <DashBoardCard
              className="col-span-1"
              value={"77"}
              text={"Total Items"}
              icon={<ItemsNavIcon />}
            />
            <DashBoardCard
              className="col-span-1"
              value={"14"}
              text={"Total Members"}
              icon={<MembersNavIcon />}
            />
          </div>
          <Card className="px-[22px] py-[29px]">
            <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
              <Button
                type="button"
                onClick={() => router.push("/market-run/details")}
              >
                Create Market Runs
              </Button>
            </div>

            <DataTable
              columns={columns}
              rows={rows}
              rowKey="id"
              pagination={{ pageSize: 6 }}
              emptyState="No market runs match your filters."
            />
          </Card>
        </div>

        <Card className="col-span-2 p-4">
          <DashboardSidePanel/>
        </Card>
      </div>

      <Modal
        open={showWelcomeModal}
        onClose={closeWelcomeModal}
        showCloseButton={false}
        closeOnBackdropClick={false}
        panelClassName="max-w-[384px] rounded-[10px] border border-[#D0D5DD] sm:px-[89px] py-12"
      >
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-[28px] font-[600] text-[#1F2933]">
              Welcome to MarketRuns
            </h2>
            <p className="text-[16px] font-[500] text-[#9CA3AF]">
              Your admin account is all set up. Let&apos;s get your first market
              run started.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                iconSrc: "/welcome-build-items.svg",
                title: "Build your Items catalogue",
                subtitle: "Add products, units, and Conversion",
              },
              {
                iconSrc: "/welcome-invite-members.svg",
                title: "Invite team members",
                subtitle: "Invite members into the system",
              },
              {
                iconSrc: "/welcome-create-market-run.svg",
                title: "Create your first market run",
                subtitle: "Set dates and invite Procurees to start requesting",
              },
              {
                iconSrc: "/welcome-review-plan.svg",
                title: "Review & plan your market visit",
                subtitle: "See aggregated demand and estimated costs",
              },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <img
                  src={step.iconSrc}
                  alt=""
                  width={30}
                  height={30}
                  className="mt-0.5 h-[30px] w-[30px] shrink-0"
                  aria-hidden
                />
                <div>
                  <p className="text-[12px] font-[500] text-[#1F2933]">{step.title}</p>
                  <p className="text-[11px] font-[400] text-[#9CA3AF]">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full" onClick={closeWelcomeModal}>
            Proceed to Dashboard
          </Button>
        </div>
      </Modal>
    </>
  );
}
