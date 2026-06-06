import { getInvitationPreviewAction } from "@/actions/invitation.action";
import GroupPreviewClient from "@/components/site/group/group-preview";

interface PageProps {
  params: { id: string };
}

export default async function JoinPage({ params }: PageProps) {
  const { id } = params;

  try {
    const preview = await getInvitationPreviewAction(id);
    return <GroupPreviewClient preview={preview.payload} token={id} />;
  } catch {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-lg font-bold text-gray-800">Invalid or expired invitation link.</p>
          <p className="text-sm text-gray-500">This link may have expired or already been used.</p>
        </div>
      </div>
    );
  }
}