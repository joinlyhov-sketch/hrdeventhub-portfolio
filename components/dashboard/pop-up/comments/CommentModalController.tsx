"use client";

import { useCommentModalStore } from "../../../../store/useCommentModalStore";
import EditCommentModal from "./modals/EditCommentModal";
import DeleteCommentModal from "./modals/DeleteCommentModal";
import ReplyCommentModal from "./modals/ReplyCommentModal";

export default function CommentModalController() {
  const modalType = useCommentModalStore((state) => state.modalType);

  if (modalType === "edit") return <EditCommentModal />;
  if (modalType === "delete") return <DeleteCommentModal />;
  if (modalType === "reply") return <ReplyCommentModal />;

  return null;
}
