export default function TopBar() {
  return (
    <div className="bg-white pt-3 lg:pr-12 lg:pl-12">
      <header className="mb-5 flex items-center justify-between p-1">
        <div>
          <h1 className="type-title flex items-center gap-1">
            <span className="text-primary">Calendar</span>
          </h1>
          <p className="type-desc mt-1 text-muted-foreground">
            Review all of the event in this page
          </p>
        </div>
      </header>
    </div>
  );
}
