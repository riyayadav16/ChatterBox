import { useEffect } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

function ChatHeader({ onToggleMobileSidebar }) {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between border-b border-stroke bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="secondary-icon-button md:hidden"
          aria-label="Open conversations"
        >
          <MenuIcon className="size-5" />
        </button>

        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="size-12 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-ink">{selectedUser.fullName}</h3>
          <p className="text-sm text-ink-muted">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setSelectedUser(null)}
        className="secondary-icon-button"
        aria-label="Close conversation"
      >
        <XIcon className="size-5" />
      </button>
    </header>
  );
}

export default ChatHeader;
