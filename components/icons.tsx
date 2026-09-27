type IconProps = {
  className?: string;
};

export function GoogleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.4c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.7Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.9H1.4C.5 8.5 0 10.2 0 12.2c0 2 .5 3.7 1.4 5.3l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.9l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
      />
    </svg>
  );
}

export function LogoMark({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#F8DDE4" />
      <path
        d="M20 29c-5.4-3.4-8.8-6.7-8.8-10.4A4.7 4.7 0 0 1 20 15.2a4.7 4.7 0 0 1 8.8 3.4C28.8 22.3 25.4 25.6 20 29Z"
        fill="#C45C7A"
      />
      <circle cx="26.2" cy="13.2" r="3.1" fill="#E8B86D" />
    </svg>
  );
}
