"use client";

import CommentSection from "../../../components/dashboard/pop-up/comments/CommentSection";
import { mockComments } from "../../../data/commentData";
import DeleteModal from "../../../components/dashboard/pop-up/common/deleteModal";

export default function Page() {
  return (
    <main className="p-10">
      <CommentSection comments={mockComments} />
      <DeleteModal />
    </main>
  );
}
