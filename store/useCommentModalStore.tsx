import { create } from "zustand";
import type { CommentItem } from "../types/comment";

type ModalType = "edit" | "delete" | "reply" | null;

type CommentModalStore = {
  modalType: ModalType;
  selectedComment: CommentItem | null;
  editValue: string;
  replyValue: string;

  openEdit: (comment: CommentItem) => void;
  openDelete: (comment: CommentItem) => void;
  openReply: (comment: CommentItem) => void;

  setEditValue: (value: string) => void;
  setReplyValue: (value: string) => void;
  closeModal: () => void;
};

export const useCommentModalStore = create<CommentModalStore>((set) => ({
  modalType: null,
  selectedComment: null,
  editValue: "",
  replyValue: "",

  openEdit: (comment) =>
    set({
      modalType: "edit",
      selectedComment: comment,
      editValue: comment.comment,
    }),

  openDelete: (comment) =>
    set({
      modalType: "delete",
      selectedComment: comment,
    }),

  openReply: (comment) =>
    set({
      modalType: "reply",
      selectedComment: comment,
      replyValue: "",
    }),

  setEditValue: (value) => set({ editValue: value }),
  setReplyValue: (value) => set({ replyValue: value }),

  closeModal: () =>
    set({
      modalType: null,
      selectedComment: null,
      editValue: "",
      replyValue: "",
    }),
}));
