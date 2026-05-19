interface HeaderProps {
  titlePrimary: string;
  titleSecondary?: string;
  description: string;
}

const MOCK_CURRENT_USER = {
  name: "Alex Morgan",
  email: "alex@community.org",
  avatarInitials: "AM",
};

export default function Header({
  titlePrimary,
  titleSecondary,
  description,
}: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white lg:pr-12 lg:pl-12">
      <header className="top-bar mb-5 flex items-center justify-between p-1">
        <div>
          <h1 className="type-title flex items-center gap-1">
            <span className="text-primary">{titlePrimary}</span>
            {titleSecondary && (
              <span className="text-action">{titleSecondary}</span>
            )}
          </h1>
          <p className="type-desc mt-1 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h3 className="type-detail-semibold text-primary">
                {MOCK_CURRENT_USER.name}
              </h3>
              <p className="type-desc-small-semibold mt-1 text-primary-hover">
                {MOCK_CURRENT_USER.email}
              </p>
            </div>
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-600">
              <span className="type-desc-semibold text-white">
                {MOCK_CURRENT_USER.avatarInitials}
              </span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}