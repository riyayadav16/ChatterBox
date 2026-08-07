import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="px-4 py-2">
      <div className="flex items-center rounded-2xl bg-surface-secondary p-1">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition ${
            activeTab === "chats"
              ? "bg-white text-primary shadow-sm"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Chats
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition ${
            activeTab === "contacts"
              ? "bg-white text-primary shadow-sm"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Contacts
        </button>
      </div>
    </div>
  );
}
export default ActiveTabSwitch;
