"use client";

import { deleteMessage } from "@/lib/contact/inbox-actions";

export function DeleteMessageButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="btn min-h-10 px-4 text-xs"
      onClick={() => {
        if (window.confirm("Delete this message for good?")) void deleteMessage(id);
      }}
    >
      Delete
    </button>
  );
}
