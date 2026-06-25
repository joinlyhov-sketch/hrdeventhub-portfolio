import { getPollAction } from "@/actions/poll.action";
import { FeedbackBreadcrumb } from "@/components/dashboard/FeedbackBreadcrumb";
import PollForm from "@/components/feedback/poll/PollForm";

interface Props {
  searchParams: Promise<{ pollId?: string }>;
}

export default async function EditPollPage({ searchParams }: Props) {
  const { pollId } = await searchParams;

  if (!pollId) {
    return (
      <div className="p-8 text-center text-grey-400">
        No poll selected for editing.
      </div>
    );
  }

  const poll = await getPollAction(pollId);

  return (
    <div className="w-full max-w-475 mx-auto">
      <FeedbackBreadcrumb label="Poll Editing" />
      <PollForm
        pollId={poll.pollId}
        initialData={poll}
        workspaceId={poll.workspaceId}
      />
    </div>
  );
}
