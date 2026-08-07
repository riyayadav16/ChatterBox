function UsersLoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="animate-pulse rounded-2xl bg-white px-3 py-2.5">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-surface-secondary" />
            <div className="flex-1">
              <div className="mb-2 h-4 w-3/4 rounded bg-surface-secondary" />
              <div className="h-3 w-1/2 rounded bg-surface-secondary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersLoadingSkeleton;
