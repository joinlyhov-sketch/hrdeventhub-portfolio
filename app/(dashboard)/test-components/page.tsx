"use client";

import CommentDemo from "@/components/site/comment/CommentDemo";
import { AlertDialogDestructive } from "@/components/site/commons/DeleteModal";
import { DropdownMenuDemo } from "@/components/site/commons/DropDown";
import LogoutModal from "@/components/site/commons/LogoutModal";
import ContentTypePopover from "@/components/site/contents/pop-over-content";
import PaymentModal from "@/components/site/payment/PaymentModal";
import { Button } from "@/components/ui/button";
import { usePaymentModalStore } from "@/store/usePaymentModalStore";
import SelectedContentDemo from "@/components/site/commons/SelectModal";
import SurveyOptionsDemo from "@/components/site/survey/sub-option";
import { useState } from "react";

export default function Page() {
  const openPaymentModal = usePaymentModalStore((s) => s.openPaymentModal);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <main className="p-10 gap-5 flex flex-col items-start">
      <button
        className="border w-35 rounded-full cursor-pointer "
        onClick={() => openPaymentModal("register")}
      >
        Register Event
      </button>

      <button
        className="border w-25 rounded-full cursor-pointer "
        onClick={() => openPaymentModal("donation")}
      >
        Donate
      </button>

      <PaymentModal />

      <DropdownMenuDemo />

      <Button variant="destructive" onClick={() => setLogoutOpen(true)}>
        Test Logout Modal
      </Button>

      <LogoutModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => {
          console.log("Logout confirmed");

          setLogoutOpen(false);
        }}
      />
      <AlertDialogDestructive />

      <ContentTypePopover />
      <SurveyOptionsDemo />
      <h1 className="type-title text-secondary">Comment Feature</h1>
      <div className="mt-6 max-w-[700px]">
        <CommentDemo />
      </div>

      <SelectedContentDemo />
    </main>
  );
}
