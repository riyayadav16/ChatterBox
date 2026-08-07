import { MessageCircleIcon } from "lucide-react";

const NoChatHistoryPlaceholder = ({ name }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary-light">
        <MessageCircleIcon className="size-8 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-ink">Start your conversation with {name}</h3>
      <p className="mb-5 max-w-md text-sm leading-relaxed text-ink-muted">
        This is the beginning of your conversation. Send a message to start chatting!
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button className="rounded-full bg-primary-light px-4 py-2 text-xs font-semibold text-primary transition hover:bg-blue-100">
          Say hello
        </button>
        <button className="rounded-full bg-primary-light px-4 py-2 text-xs font-semibold text-primary transition hover:bg-blue-100">
          How are you?
        </button>
        <button className="rounded-full bg-primary-light px-4 py-2 text-xs font-semibold text-primary transition hover:bg-blue-100">
          Meet up soon?
        </button>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
