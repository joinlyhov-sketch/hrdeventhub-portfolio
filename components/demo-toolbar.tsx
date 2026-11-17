"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const pages = [
  ["Groups", "/group"], ["Community feed", "/group/hrd-community"],
  ["Calendar", "/calendar"], ["Chat", "/chat"], ["Notifications", "/notifications"],
  ["My profile", "/profile/demo-admin"], ["Edit profile", "/profile/demo-admin/edit-profile"],
  ["Settings", "/profile/demo-admin/setting"], ["Events", "/event-management"],
  ["Create event", "/event-management/creation/event"], ["Create article", "/event-management/creation/article"],
  ["Create announcement", "/event-management/creation/announcement"], ["Create poll", "/event-management/creation/poll"],
  ["Surveys", "/feedback/survey"], ["Survey feedback", "/feedback/survey-feedback"],
  ["Transactions", "/transaction-history"], ["Users", "/user-management"], ["Check-in", "/check-in"],
  ["Landing page", "/"], ["Login", "/login"], ["Sign up", "/sign-up"],
];

export function DemoToolbar() {
  const [open, setOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  async function reset() {
    setResetting(true);
    try {
      const response = await fetch("/api/v5/demo/reset", { method: "POST" });
      if (!response.ok) throw new Error("Could not reset the demo");
      for (const key of ["hrd-chat-v1", "notification-storage"]) localStorage.removeItem(key);
      window.location.assign("/group");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reset the demo");
      setResetting(false);
    }
  }
  return <aside className="fixed bottom-20 md:bottom-4 right-3 z-[60] text-sm">
    {open && <div id="demo-pages" className="mb-2 w-72 max-h-[65vh] overflow-y-auto rounded-xl border bg-card p-4 text-card-foreground shadow-xl">
      <p className="font-semibold">Explore the demo</p>
      <p className="mt-1 mb-3 text-xs text-muted-foreground">Sample data · Admin access · Changes stay in this browser for 24 hours. Image uploads use a sample picture. Registration is free; payments, document uploads, and external connections are unavailable.</p>
      <nav aria-label="Demo pages" className="grid grid-cols-2 gap-1">{pages.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-muted focus-visible:outline-2">{label}</Link>)}</nav>
      <button onClick={reset} disabled={resetting} className="mt-3 w-full rounded-md border px-3 py-2 disabled:opacity-50">{resetting ? "Resetting…" : "Reset demo"}</button>
    </div>}
    <button aria-expanded={open} aria-controls="demo-pages" onClick={() => setOpen(!open)} className="rounded-full border bg-primary px-4 py-2 font-medium text-primary-foreground shadow-lg">{open ? "Close demo menu" : "Explore demo"}</button>
  </aside>;
}
