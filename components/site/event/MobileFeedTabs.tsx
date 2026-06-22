"use client";
import { useState, useRef, useEffect } from "react";
import FilteredFeed from "./FilteredFeed";
import UpComingEventCard from "./UpComingEventCard";
import GroupMemberCard from "./GroupMemberCard";
import { cn } from "@/libs/utils";

interface Props {
  groupid: string;
  deepLinkPostId?: string;
  deepLinkType?: string;
}

const TABS = ["Feed", "Upcoming", "Members"] as const;
type Tab = (typeof TABS)[number];

export default function MobileFeedTabs({
  groupid,
  deepLinkPostId,
  deepLinkType,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Feed");
  const [visible, setVisible] = useState(true);
  const pillRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const movePill = (btn: HTMLButtonElement) => {
    if (!pillRef.current) return;
    pillRef.current.style.left = `${btn.offsetLeft}px`;
    pillRef.current.style.width = `${btn.offsetWidth}px`;
  };

  useEffect(() => {
    const activeIndex = TABS.indexOf(activeTab);
    const btn = btnRefs.current[activeIndex];
    if (btn) movePill(btn);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      const activeIndex = TABS.indexOf(activeTab);
      const btn = btnRefs.current[activeIndex];
      if (btn) movePill(btn);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  useEffect(() => {
    const THRESHOLD = 6;
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (Math.abs(delta) > THRESHOLD) {
          setVisible(delta < 0 || currentY < 60);
        }
        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "xl:hidden sticky top-30 md:top-16 z-10 px-1 py-0.5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 transition-all duration-300 ease-in-out will-change-transform",
          visible ? "translate-y-0 opacity-100" : "-translate-y-[110%] opacity-0"
        )}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div
          role="tablist"
          className="relative flex w-full rounded-xl p-[3px]"
          style={{
            background: "rgba(120,120,128,0.12)",
            border: "0.5px solid rgba(120,120,128,0.18)",
          }}
        >
          <div
            ref={pillRef}
            className="absolute top-[3px] h-[calc(100%-6px)] rounded-[9px] z-0"
            style={{
              background: "white",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)",
              transition:
                "left 250ms cubic-bezier(0.4,0,0.2,1), width 250ms cubic-bezier(0.4,0,0.2,1)",
            }}
          />
          {TABS.map((tab, i) => (
            <button
              key={tab}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative z-10 flex-1 py-1.5 px-1 rounded-[9px] text-[13px] font-medium transition-colors duration-200 whitespace-nowrap border-none bg-transparent cursor-pointer",
                activeTab === tab ? "text-[#1c4d8d]" : "text-gray-500"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="xl:hidden mt-2">
        <div className={activeTab === "Feed" ? "block" : "hidden"}>
          <FilteredFeed
            groupid={groupid}
            deepLinkPostId={deepLinkPostId}
            deepLinkType={deepLinkType}
          />
        </div>
        <div className={activeTab === "Upcoming" ? "block" : "hidden"}>
          <UpComingEventCard groupid={groupid} />
        </div>
        <div className={activeTab === "Members" ? "block" : "hidden"}>
          <GroupMemberCard groupid={groupid} />
        </div>
      </div>
    </>
  );
}