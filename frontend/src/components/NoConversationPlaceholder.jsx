import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = ({ onOpenSidebar }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary-light">
        <MessageCircleIcon className="size-10 text-primary" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-ink">Select a conversation</h3>
      <p className="max-w-md text-sm leading-relaxed text-ink-muted">
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>
      <button type="button" onClick={onOpenSidebar} className="soft-button mt-6 md:hidden">
        Browse conversations
      </button>
    </div>
  );
};

export default NoConversationPlaceholder;
