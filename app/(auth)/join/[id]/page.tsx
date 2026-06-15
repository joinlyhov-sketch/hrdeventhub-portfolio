import { getInvitationPreviewAction } from "@/actions/invitation.action";
import GroupPreviewClient from "@/components/site/group/group-preview";
import { InvitationPreview } from "@/types/invitation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JoinPage({ params }: PageProps) {
  const { id } = await params;

  let preview: InvitationPreview | null = null;
  try {
    const result = await getInvitationPreviewAction(id);
    preview = result.payload;
  } catch (error) {
    console.log("Preview fetch error:", error);
  }

  if (!preview) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6 bg-slate-50/50">
        <div className="text-center space-y-3 p-8 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-sm w-full">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">!</div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-slate-900">Invalid link</p>
            <p className="text-sm text-slate-500 leading-relaxed">This invitation link may have expired or already been used.</p>
          </div>
        </div>
      </div>
    );
  }

  return <GroupPreviewClient preview={preview} token={id} />;
}