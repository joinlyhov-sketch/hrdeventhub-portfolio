import UserManagementSkeleton from "@/components/dashboard/user-management/UserManagementSkeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-475 mx-auto">
      <UserManagementSkeleton />
    </div>
  );
}
