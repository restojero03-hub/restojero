import { DeleteMessageButton } from "@/components/dashboard/delete-message-button";
import { guardDashboardPage } from "@/lib/auth/guard";
import { setMessageRead } from "@/lib/contact/inbox-actions";
import { getDb, isDatabaseConfigured } from "@/lib/db";

const formatDate = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Manila",
});

export default async function MessagesPage() {
  await guardDashboardPage();

  const messages = isDatabaseConfigured()
    ? await getDb().message.findMany({ orderBy: { createdAt: "desc" }, take: 200 })
    : [];

  return (
    <>
      <h1 className="text-3xl font-bold">Messages</h1>
      {messages.length === 0 && <p className="mt-6">No messages yet. Anything sent through the contact form lands here.</p>}

      <ul className="mt-6 space-y-4">
        {messages.map((message) => (
          <li key={message.id} className="neu-card">
            <article>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-lg font-semibold">
                  {message.name}
                  {!message.readAt && <span className="tag ml-3 inline-block">New</span>}
                </h2>
                <time dateTime={message.createdAt.toISOString()} className="text-sm">
                  {formatDate.format(message.createdAt)}
                </time>
              </div>
              <a href={`mailto:${message.email}`} className="text-link text-sm break-all">
                {message.email}
              </a>
              <p className="mt-3 break-words whitespace-pre-wrap">{message.body}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <form action={setMessageRead.bind(null, message.id, !message.readAt)}>
                  <button type="submit" className="btn min-h-10 px-4 text-xs">
                    {message.readAt ? "Mark as new" : "Mark as read"}
                  </button>
                </form>
                <DeleteMessageButton id={message.id} />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
