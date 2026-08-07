import { useRef, useState } from "react";
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleToggleSound = () => {
    mouseClickSound.currentTime = 0;
    mouseClickSound.play().catch(() => {});
    toggleSound();
  };

  return (
    <div className="border-b border-stroke p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="avatar online">
            <button
              type="button"
              className="group relative size-12 overflow-hidden rounded-full focus:outline-none focus:ring-4 focus:ring-primary/10"
              onClick={() => fileInputRef.current.click()}
              aria-label="Change profile picture"
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt={authUser.fullName}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-semibold text-white">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="min-w-0">
            <h3 className="max-w-[150px] truncate text-sm font-semibold text-ink">
              {authUser.fullName}
            </h3>
            <p className="text-xs text-ink-muted">Online</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="secondary-icon-button size-10"
            onClick={logout}
            aria-label="Log out"
          >
            <LogOutIcon className="size-5" />
          </button>

          <button
            type="button"
            className="secondary-icon-button size-10"
            onClick={handleToggleSound}
            aria-label={isSoundEnabled ? "Disable sounds" : "Enable sounds"}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
