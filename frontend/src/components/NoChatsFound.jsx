import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-5 px-4">
      <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
        <MessageCircleIcon className="w-7 h-7 text-primary" />
      </div>
      <div>
        <h4 className="text-ink font-semibold mb-1">No conversations yet</h4>
        <p className="text-ink-muted text-sm max-w-[260px]">
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="soft-button"
      >
        Find contacts
      </button>
    </div>
  );
}
export default NoChatsFound;
