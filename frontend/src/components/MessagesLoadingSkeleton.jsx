function MessagesLoadingSkeleton() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`flex animate-pulse ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`h-12 rounded-3xl shadow-soft ${
              index % 2 === 0 ? "w-52 bg-white" : "w-40 bg-primary-light"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default MessagesLoadingSkeleton;
