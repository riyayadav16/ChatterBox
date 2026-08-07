import { LoaderIcon } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-soft-blue">
          C
        </div>
        <LoaderIcon className="size-5 text-primary animate-spin" />
      </div>
    </div>
  );
}
export default PageLoader;
