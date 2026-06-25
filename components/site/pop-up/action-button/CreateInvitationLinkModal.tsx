"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-payments/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Copy, Check } from "lucide-react";
import { createInvitationAction } from "@/actions/invitation.action";
import { Workspace } from "@/types/workspace-type/group";
import { useGenerations } from "@/hooks/use-generation";

interface CreateInvitationLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace;
}

export default function CreateInvitationLinkModal({
  isOpen,
  onClose,
  workspace,
}: CreateInvitationLinkModalProps) {
  const [ttlDays, setTtlDays] = React.useState<string>("1");
  const [inviteLink, setInviteLink] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState("");

  const { generations } = useGenerations();

  const generationId = React.useMemo(() => {
    if (workspace.generationId) return workspace.generationId;
    if (workspace.generationName && generations.length > 0) {
      const matched = generations.find((g) => g.name === workspace.generationName);
      return matched?.generationId ?? "";
    }
    return "";
  }, [workspace, generations]);

  const handleCreate = async () => {
    const days = parseInt(ttlDays);
    if (!ttlDays || isNaN(days) || days < 1) {
      setError("Please enter a valid number of days (minimum 1).");
      return;
    }

    setError("");

    try {
      setIsSubmitting(true);
      const result = await createInvitationAction({
        workspaceId: workspace.workspaceId,
        generationId,
        ttlDays: days,
      });

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      const fullLink = `${baseUrl}${result.payload.inviteLink}`;
      setInviteLink(fullLink);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invitation link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setTtlDays("1");
    setInviteLink("");
    setError("");
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[720px] w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
        <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[26px] font-bold text-[#1e3a8a]">
              Create Invitation Link
            </DialogTitle>
            <DialogDescription className="text-[15px] text-gray-500 font-normal">
              Generate a secure link for <span className="font-semibold text-gray-700">{workspace.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={handleClose}
            className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6 bg-white">
          <div className="space-y-2.5">
            <label className="text-[17px] font-bold text-[#1e3a8a] block">
              Expire in (days)
            </label>
            <div className="flex gap-3 items-start">
              <div className="flex-1 space-y-1">
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 1, 7, 30"
                  value={ttlDays}
                  onChange={(e) => {
                    setTtlDays(e.target.value);
                    if (error) setError("");
                  }}
                  className={`h-[52px] px-4 rounded-xl border bg-white text-[15px] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all ${error ? "border-red-400" : "border-blue-100"}`}
                />
                {error && <p className="text-red-500 text-[13px]">{error}</p>}
              </div>
              <Button
                onClick={handleCreate}
                disabled={isSubmitting}
                className="h-[52px] px-8 bg-[#2b4c8c] hover:bg-[#1e3563] text-white font-semibold rounded-xl text-[15px] shadow-sm transition-colors shrink-0 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Link"}
              </Button>
            </div>
          </div>

          {inviteLink && (
            <div className="space-y-2.5">
              <label className="text-[17px] font-bold text-[#1e3a8a] block">
                Invite URL
              </label>
              <div className="relative flex items-center">
                <Input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="h-[52px] pr-12 px-4 rounded-xl border border-blue-100 bg-white text-[15px] text-gray-500 select-all focus-visible:ring-1 focus-visible:ring-blue-400 transition-all"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-4 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                  title="Copy link"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end items-end bg-[#f8fafc] px-8 py-5 border-t border-gray-50">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-[44px] px-8 border border-gray-300 text-gray-700 hover:bg-primary font-semibold rounded-xl text-[15px] transition-colors"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}