import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import NoChatsFound from "./NoChatsFound";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-1.5">
      {chats.map((chat) => {
        const isOnline = onlineUsers.includes(chat._id);

        return (
          <button
            key={chat._id}
            type="button"
            className="sidebar-item"
            onClick={() => setSelectedUser(chat)}
          >
            <div className={`avatar ${isOnline ? "online" : "offline"}`}>
              <div className="size-11 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-semibold text-ink">{chat.fullName}</h4>
              <p className="truncate text-xs text-ink-muted">
                {isOnline ? "Online" : "Tap to continue chatting"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ChatsList;
