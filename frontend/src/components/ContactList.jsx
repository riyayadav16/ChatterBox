import { useEffect } from "react";
import { UserRoundPlusIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  if (allContacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary-light text-primary">
          <UserRoundPlusIcon className="size-6" />
        </div>
        <h4 className="mb-1 font-semibold text-ink">No contacts found</h4>
        <p className="max-w-56 text-sm leading-relaxed text-ink-muted">
          New people will appear here as they join ChatterBox.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {allContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);

        return (
          <button
            key={contact._id}
            type="button"
            className="sidebar-item"
            onClick={() => setSelectedUser(contact)}
          >
            <div className={`avatar ${isOnline ? "online" : "offline"}`}>
              <div className="size-11 rounded-full">
                <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-semibold text-ink">{contact.fullName}</h4>
              <p className="truncate text-xs text-ink-muted">
                {isOnline ? "Online" : "Available to message"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ContactList;
