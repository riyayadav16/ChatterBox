function ChatBubbleIllustration({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      role="img"
      aria-label="Messaging illustration"
    >
      <rect x="18" y="30" width="124" height="92" rx="28" fill="#dbeafe" />
      <path d="M52 119L32 138V108L52 119Z" fill="#dbeafe" />
      <rect x="44" y="58" width="72" height="10" rx="5" fill="#2563eb" />
      <rect x="44" y="78" width="48" height="10" rx="5" fill="#93c5fd" />
      <circle cx="122" cy="112" r="22" fill="#2563eb" />
      <path
        d="M113 112.5L120 119L132 105"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PeopleChatIllustration({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      role="img"
      aria-label="People chatting illustration"
    >
      <circle cx="56" cy="57" r="24" fill="#bfdbfe" />
      <circle cx="104" cy="57" r="24" fill="#93c5fd" />
      <path d="M24 128C29 103 42 91 58 91C73 91 84 103 88 128H24Z" fill="#2563eb" />
      <path d="M72 128C77 103 90 91 106 91C121 91 132 103 136 128H72Z" fill="#1d4ed8" />
      <rect x="72" y="22" width="52" height="32" rx="16" fill="white" stroke="#dbe4ef" strokeWidth="4" />
      <circle cx="88" cy="38" r="4" fill="#2563eb" />
      <circle cx="100" cy="38" r="4" fill="#2563eb" />
      <circle cx="112" cy="38" r="4" fill="#2563eb" />
    </svg>
  );
}

export { ChatBubbleIllustration, PeopleChatIllustration };
