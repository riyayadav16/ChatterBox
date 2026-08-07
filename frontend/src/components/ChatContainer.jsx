import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { axiosInstance } from "../lib/axios";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import SmartReplySuggestions from "./SmartReplySuggestions";
import AiActionMenu from "./AiActionMenu";
import AiActionModal from "./AiActionModal";
import AiLanguageSelector from "./AiLanguageSelector";

function ChatContainer({ onToggleMobileSidebar }) {
  const {
    selectedUser,
    getMessagesByUserId,
    getSmartRepliesByUserId,
    clearSmartReplies,
    messages,
    isMessagesLoading,
    replySuggestions,
    isSuggestionsLoading,
    suggestionsError,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const touchTimerRef = useRef(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [aiMenuVisible, setAiMenuVisible] = useState(false);
  const [aiMenuPosition, setAiMenuPosition] = useState({ left: 0, top: 0 });
  const [activeMessageText, setActiveMessageText] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [aiResult, setAiResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleSuggestionSelect = (suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const closeAiMenu = () => {
    setAiMenuVisible(false);
    setSelectedMessageId(null);
  };

  const openAiMenu = (event, messageId, messageText) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setAiMenuPosition({ left: rect.right + 8, top: rect.top });
    setSelectedMessageId(messageId);
    setActiveMessageText(messageText);
    setAiMenuVisible(true);
  };

  const handleTouchStart = (event, messageId, messageText) => {
    event.persist?.();
    touchTimerRef.current = setTimeout(() => {
      const rect = event.currentTarget.getBoundingClientRect();
      setAiMenuPosition({ left: rect.right + 8, top: rect.top });
      setSelectedMessageId(messageId);
      setActiveMessageText(messageText);
      setAiMenuVisible(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const handleAiAction = async (action) => {
    closeAiMenu();
    setAiError(null);
    setAiResult("");

    if (action === "translate") {
      setShowLanguageSelector(true);
      return;
    }

    try {
      setIsAiLoading(true);
      const res = await axiosInstance.post("/ai/assistant", { action, text: activeMessageText });
      setAiResult(res.data.result);
    } catch (error) {
      setAiError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "AI assistant failed."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleLanguageSelect = async (language) => {
    setShowLanguageSelector(false);
    setAiError(null);
    setAiResult("");

    try {
      setIsAiLoading(true);
      const res = await axiosInstance.post("/ai/assistant", {
        action: "translate",
        text: activeMessageText,
        language,
      });
      setAiResult(res.data.result);
    } catch (error) {
      setAiError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "AI assistant failed."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyResult = async () => {
    await navigator.clipboard.writeText(aiResult || "");
  };

  const handleReplaceDraft = () => {
    setSelectedSuggestion(aiResult);
  };

  const handleModalClose = () => {
    setAiResult("");
    setAiError(null);
  };

  useEffect(() => {
    if (!selectedUser?._id) return undefined;

    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (!selectedUser?._id || isMessagesLoading) return;
    if (messages.length === 0) {
      clearSmartReplies();
      return;
    }
    getSmartRepliesByUserId(selectedUser._id);
  }, [selectedUser?._id, messages.length, getSmartRepliesByUserId, clearSmartReplies, isMessagesLoading]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader onToggleMobileSidebar={onToggleMobileSidebar} />

      <div className="scrollbar-thin flex-1 min-h-0 overflow-y-auto px-4 pt-5 pb-4 sm:px-6 lg:px-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {messages.map((msg) => {
              const isOwnMessage = msg.senderId === authUser._id;

              return (
                <div
                  key={msg._id}
                  className={`message-in flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`relative min-w-0 break-words text-sm leading-relaxed ${
                      isOwnMessage ? "message-bubble-sent" : "message-bubble-received"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="mb-2 max-h-64 w-full rounded-2xl object-cover"
                      />
                    )}
                    {msg.text && <p>{msg.text}</p>}
                    <div className="mt-3 flex items-center justify-between gap-3 text-[11px] opacity-70">
                      <span className="flex items-center gap-1">
                        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => openAiMenu(e, msg._id, msg.text || "")}
                        onContextMenu={(e) => openAiMenu(e, msg._id, msg.text || "")}
                        onTouchStart={(e) => handleTouchStart(e, msg._id, msg.text || "")}
                        onTouchEnd={handleTouchEnd}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-white text-ink transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-[1.05] hover:bg-surface-secondary active:scale-95 active:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        aria-label="Open AI assistant"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {aiMenuVisible && selectedMessageId && (
        <AiActionMenu
          position={aiMenuPosition}
          onSelect={handleAiAction}
          onClose={closeAiMenu}
        />
      )}

      {showLanguageSelector && (
        <AiLanguageSelector
          onSelect={handleLanguageSelect}
          onClose={() => setShowLanguageSelector(false)}
        />
      )}

      {(isAiLoading || aiResult) && (
        <AiActionModal
          result={aiResult}
          loading={isAiLoading}
          onCopy={handleCopyResult}
          onReplaceDraft={handleReplaceDraft}
          onClose={() => {
            setAiResult("");
            setAiError(null);
          }}
        />
      )}

      {aiError && (
        <div className="fixed bottom-24 right-4 z-50 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-lg">
          {aiError}
        </div>
      )}

      <SmartReplySuggestions
        suggestions={replySuggestions}
        loading={isSuggestionsLoading}
        error={suggestionsError}
        onSelect={handleSuggestionSelect}
      />

      <MessageInput
        suggestedText={selectedSuggestion}
        onSuggestedTextUsed={() => setSelectedSuggestion("")}
      />
    </div>
  );
}

export default ChatContainer;
