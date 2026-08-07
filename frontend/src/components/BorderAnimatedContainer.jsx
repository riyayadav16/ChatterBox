function BorderAnimatedContainer({ children }) {
  return (
    <div className="flex h-full w-full overflow-hidden rounded-3xl border border-stroke bg-white shadow-elevated">
      {children}
    </div>
  );
}

export default BorderAnimatedContainer;
