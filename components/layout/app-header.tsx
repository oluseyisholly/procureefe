"use client";

import { ProcureeLogo } from "@/components/icons/procuree-logo";
import { getApiUserProfile, type ApiUserProfile } from "@/lib/api/axios";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "../ui/icon-button";
import { ArrowDownIcon } from "../icons/arrowDown";
import { NotificationLogo } from "../icons/notification";
import { AppHeaderNav } from "./app-header-nav";
import { NotificationPane } from "./notification-pane";

type AppHeaderProps = {
  activePath: string;
};

export function AppHeader({ activePath }: AppHeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<ApiUserProfile | null>(
    null,
  );
  const notificationAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUserProfile(getApiUserProfile());

    const handleStorageUpdate = (event: StorageEvent) => {
      if (event.key !== null && event.key !== "procureefe_user_profile") {
        return;
      }
      setCurrentUserProfile(getApiUserProfile());
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  useEffect(() => {
    if (!isNotificationOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!notificationAreaRef.current?.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNotificationOpen]);

  return (
    <header className="sticky top-0 z-[2000] flex items-center justify-between border-b border-emerald-100 bg-white/80 px-[40px] py-[16px] backdrop-blur">
      <div className="flex items-center">
        <ProcureeLogo className="h-8 sm:h-9" />
      </div>

      <AppHeaderNav activePath={activePath} />

      <div className="flex gap-[24px]">
        <div ref={notificationAreaRef} className="relative z-[2100]">
          <IconButton
            label="Open notifications"
            aria-expanded={isNotificationOpen}
            onClick={() => setIsNotificationOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-[8px] p-1 text-slate-700 transition-colors hover:bg-slate-100"
          >
            <NotificationLogo />
          </IconButton>
          {isNotificationOpen ? (
            <NotificationPane className="absolute right-0 top-[calc(100%+14px)]" />
          ) : null}
        </div>

        <div className="flex items-center gap-[10px] px-[10px] py-[3px]">
          {currentUserProfile
            ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`
            : "User"}
          <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#B4D1C4]">
            <img src="/avatar.svg" alt="User avatar" />
          </div>
          <ArrowDownIcon />
        </div>
      </div>
    </header>
  );
}
