import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { SearchIcon } from "lucide-react";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);

  useEffect(() => {
    if (selectedUser) {
      setShowMobileSidebar(false);
    }
  }, [selectedUser]);

  return (
    <div className="relative h-dvh w-full bg-surface p-0 md:p-4">
      <BorderAnimatedContainer>
        <div className="flex h-full min-h-0 w-full bg-surface">
          <aside
            className={`
              fixed inset-y-0 left-0 z-30 w-[min(88vw,22rem)] transform bg-white border-r border-stroke shadow-elevated transition-transform duration-200 ease-in-out md:relative md:z-auto md:translate-x-0 md:w-72 md:shadow-none xl:w-80
              ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"}
            `}
            aria-label="Conversation sidebar"
          >
            <div className="flex flex-col h-full">
              <ProfileHeader />

              <div className="px-4 py-3">
                <div className="relative">
                  <SearchIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full rounded-2xl border border-stroke bg-surface-secondary py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <ActiveTabSwitch />

              <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
                {activeTab === "chats" ? <ChatsList /> : <ContactList />}
              </div>
            </div>
          </aside>

          {showMobileSidebar && (
            <div
              className="fixed inset-0 z-20 bg-black/20 md:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          <main className="flex min-w-0 flex-1 flex-col bg-surface">
            {selectedUser ? (
              <ChatContainer onToggleMobileSidebar={() => setShowMobileSidebar((v) => !v)} />
            ) : (
              <NoConversationPlaceholder onOpenSidebar={() => setShowMobileSidebar(true)} />
            )}
          </main>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
