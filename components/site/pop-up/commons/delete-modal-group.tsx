"use client";
import { DeleteModal } from "@/components/site/pop-up/commons/delete-modal";
import { deleteWorkspaceAction } from "@/actions/workspace.action";
import { mutate } from "swr";

interface GroupDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: { title: string; id: string };
}

export function GroupDeleteModal({ isOpen, onClose, group }: GroupDeleteModalProps) {
  const handleConfirm = async () => {
    await deleteWorkspaceAction(group.id);
    await mutate((key) => Array.isArray(key) && key[0] === "workspaces");
  };

  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={onClose}
      title={group.title}
      onConfirm={handleConfirm}
    />
  );
}