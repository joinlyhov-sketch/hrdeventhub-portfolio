import { MOCK_CURRENT_USER } from "../../data/mock-user";

export function TopBar() {
  return (
    <div className="sticky top-0 bg-background z-100">
      <header className="top-bar flex items-center justify-between p-1 mb-5">
        <div>
          <h1 className="type-title flex items-center gap-1">
            <span className="text-primary">Survey</span>
            <span className="text-action">Feedback</span>
          </h1>
          <p className="type-desc mt-1 text-muted-foreground">
            Monitor participant responses and review insights from completed
            community surveys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <h3 className="type-detail-semibold text-primary">
              {MOCK_CURRENT_USER.name}
            </h3>
            <p className="type-desc-small-semibold mt-1 text-primary-hover">
              {MOCK_CURRENT_USER.email}
            </p>
          </div>
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-linear-to-br from-violet-400 to-purple-600">
            <span className="type-desc-semibold text-white">
              {MOCK_CURRENT_USER.avatarInitials}
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}
