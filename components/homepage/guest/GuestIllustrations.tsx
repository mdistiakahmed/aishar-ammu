type IllustrationProps = {
  className?: string;
};

export function GuestBabyIllustration({ className }: IllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      role="img"
    >
      <circle cx="48" cy="48" r="46" fill="#FFF5F0" />
      <ellipse cx="48" cy="58" rx="22" ry="24" fill="#F4C4C0" />
      <path
        d="M30 62c4 10 32 10 36 0-2 14-34 14-36 0Z"
        fill="#E8A4A8"
      />
      <circle cx="48" cy="38" r="20" fill="#F7D4C8" />
      <path
        d="M30 34c2-12 14-18 18-18s16 6 18 18c-4-6-12-9-18-9s-14 3-18 9Z"
        fill="#5B3A2E"
      />
      <path
        d="M42 28c2-4 6-6 10-4 1 4-2 8-6 9-3 0-5-2-4-5Z"
        fill="#F3B8C8"
      />
      <circle cx="40.5" cy="38" r="2.2" fill="#4A3428" />
      <circle cx="55.5" cy="38" r="2.2" fill="#4A3428" />
      <path
        d="M44 46c2 2.5 6 2.5 8 0"
        stroke="#C47A72"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="34" cy="42" r="3" fill="#F0A8A0" opacity="0.7" />
      <circle cx="62" cy="42" r="3" fill="#F0A8A0" opacity="0.7" />
      <path
        d="M28 56c-3 2-4 8-1 11 4 2 8-1 9-5"
        stroke="#7AA8D4"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GuestProduceIllustration({
  produceName,
  className,
}: IllustrationProps & { produceName: string }) {
  const key = produceName.trim().toLowerCase();

  if (key.includes("blueberry") || key.includes("berry")) {
    return (
      <svg className={className} viewBox="0 0 96 96" fill="none" aria-hidden="true">
        <circle cx="48" cy="48" r="46" fill="#F4F0FA" />
        <circle cx="48" cy="52" r="22" fill="#5B4F9A" />
        <circle cx="40" cy="44" r="5" fill="#7A6DB8" opacity="0.55" />
        <path
          d="M48 30c0 4 3 7 7 8-4 1-7 4-7 8-1-4-4-7-8-8 4-1 7-4 8-8Z"
          fill="#6F9B5A"
        />
        <circle cx="48" cy="34" r="3.5" fill="#3D2F6E" />
      </svg>
    );
  }

  if (key.includes("grape")) {
    return (
      <svg className={className} viewBox="0 0 96 96" fill="none" aria-hidden="true">
        <circle cx="48" cy="48" r="46" fill="#F4F0FA" />
        <circle cx="40" cy="52" r="10" fill="#7B5EA7" />
        <circle cx="52" cy="46" r="10" fill="#8B6BB8" />
        <circle cx="56" cy="58" r="9" fill="#6A4E96" />
        <path d="M48 28c2 8 8 12 14 14" stroke="#6F9B5A" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (key.includes("lemon") || key.includes("lime")) {
    return (
      <svg className={className} viewBox="0 0 96 96" fill="none" aria-hidden="true">
        <circle cx="48" cy="48" r="46" fill="#F7FAF0" />
        <ellipse cx="48" cy="52" rx="20" ry="16" fill="#C7D96A" transform="rotate(-20 48 52)" />
        <path d="M58 34c2 4 1 8-1 10" stroke="#6F9B5A" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (key.includes("apple") || key.includes("pear") || key.includes("mango")) {
    return (
      <svg className={className} viewBox="0 0 96 96" fill="none" aria-hidden="true">
        <circle cx="48" cy="48" r="46" fill="#FFF5F0" />
        <path
          d="M48 34c-12 0-22 12-22 24 0 12 10 18 22 18s22-6 22-18c0-12-10-24-22-24Z"
          fill="#E07A6A"
        />
        <path d="M48 30c1 6 5 9 10 10" stroke="#6F9B5A" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="40" cy="48" rx="5" ry="8" fill="#F0A090" opacity="0.45" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <circle cx="48" cy="48" r="46" fill="#F3F7F2" />
      <ellipse cx="48" cy="54" rx="18" ry="16" fill="#8FB57A" />
      <path
        d="M48 30c0 6 4 10 9 12-5 1-9 5-9 11-1-6-5-10-10-11 5-2 9-6 10-12Z"
        fill="#6F9B5A"
      />
      <circle cx="42" cy="50" r="4" fill="#B7D49A" opacity="0.7" />
    </svg>
  );
}
