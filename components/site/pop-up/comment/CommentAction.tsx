"use client";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  onReply: () => void;
};

export default function CommentActions({ onEdit, onDelete, onReply }: Props) {
  return (
    <div className="flex gap-2">
      <button onClick={onEdit} className="type-detail-medium text-primary">
        Edit
      </button>
      <button
        onClick={onDelete}
        className="type-detail-medium text-destructive"
      >
        Delete
      </button>
      <button onClick={onReply} className="type-detail-medium text-primary">
        Reply
      </button>
    </div>
  );
}
