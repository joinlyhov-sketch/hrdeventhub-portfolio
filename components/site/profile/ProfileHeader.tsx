interface HeaderProps {
  titlePrimary: string;
  titleSecondary?: string;
  description: string;
}
 
export default function ProfileHeader({
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
      </header>
    </div>
  );
}