

export default function GroupHeader({ userRole }: { userRole: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-title font-bold text-primary">
        {userRole === 'admin' ? 'All Groups' : 'My Groups'}
      </h1>
      <p className="text-base text-gray-500">
        Select a group to view upcoming events and connect with members
      </p>
    </div>
  );
}
