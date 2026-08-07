import { useEffect, useRef, useState } from "react";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";

function MessageInput({ suggestedText = "", onSuggestedTextUsed = () => {} }) {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onSuggestedTextUsed();
  };

  useEffect(() => {
    if (suggestedText) {
      setText(suggestedText);
    }
  }, [suggestedText]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="sticky bottom-0 shrink-0 border-t border-stroke bg-white/95 p-3 backdrop-blur sm:p-4">
      {imagePreview && (
        <div className="mx-auto mb-3 flex max-w-3xl items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 rounded-2xl border border-stroke object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-ink text-white shadow-soft transition hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/10"
              type="button"
              aria-label="Remove image"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="mx-auto flex max-w-3xl gap-2 sm:gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (isSoundEnabled) playRandomKeyStrokeSound();
          }}
          className="min-w-0 flex-1 rounded-2xl border border-stroke bg-surface-secondary px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
          placeholder="Type your message..."
          aria-label="Message"
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`secondary-icon-button ${
            imagePreview ? "border-primary/20 bg-primary-light text-primary" : ""
          }`}
          aria-label="Attach image"
        >
          <ImageIcon className="size-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="primary-icon-button"
          aria-label="Send message"
        >
          <SendIcon className="size-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
