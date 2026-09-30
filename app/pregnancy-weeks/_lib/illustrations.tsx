type ArtProps = {
  className?: string;
};

function Heart({
  x,
  y,
  color,
  scale = 1,
}: {
  x: number;
  y: number;
  color: string;
  scale?: number;
}) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0 3.2C0 .8 2.2-.2 3.6 1.2 5-.2 7.2.8 7.2 3.2 7.2 6.2 3.6 8.4 3.6 8.4S0 6.2 0 3.2Z"
      fill={color}
    />
  );
}

function Flower({ x, y, petal, center }: { x: number; y: number; petal: string; center: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="0" cy="-8" rx="4.2" ry="7" fill={petal} transform={`rotate(${deg})`} />
      ))}
      <circle r="3.4" fill={center} />
    </g>
  );
}

export function ExpectingIllustration({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 280 230" fill="none" aria-hidden="true">
      <ellipse cx="168" cy="150" rx="108" ry="86" fill="#FFF6F8" />
      <Heart x={28} y={36} color="#F7A8B8" scale={1.7} />
      <Heart x={58} y={78} color="#F8C2CE" scale={1.15} />
      <Heart x={214} y={28} color="#F4B4C2" scale={1.25} />

      <ellipse cx="46" cy="196" rx="34" ry="12" fill="#9FCBAB" transform="rotate(-28 46 196)" />
      <ellipse cx="78" cy="208" rx="30" ry="11" fill="#7FB592" transform="rotate(18 78 208)" />
      <ellipse cx="230" cy="200" rx="32" ry="11" fill="#8FC4A0" transform="rotate(24 230 200)" />
      <Flower x={34} y={188} petal="#F7B6C4" center="#F6D788" />
      <Flower x={248} y={186} petal="#E9A9C6" center="#F3D27A" />

      <path
        d="M118 214c18-46 78-58 112-28 6 6 8 16 4 24-28 6-86 10-116 4Z"
        fill="#F7A9BB"
      />
      <circle cx="142" cy="148" r="46" fill="#F8C3D0" />
      <circle cx="134" cy="146" r="34" fill="#FBE3EA" />
      <path
        d="M168 118c22 8 36 28 38 50 1 16-8 30-22 38-6-28-20-50-42-64 8-12 16-20 26-24Z"
        fill="#F48BAA"
      />
      {[
        [154, 132],
        [168, 154],
        [148, 162],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#F7D0DC" />
      ))}
      <path
        d="M126 132c-6 16 4 28 16 32"
        stroke="#E07A98"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="122" cy="126" r="7" fill="#F6C6B0" />

      <circle cx="186" cy="78" r="28" fill="#F6C6B0" />
      <path
        d="M168 68c2-22 24-34 40-26 8 4 12 12 12 20-10 4-22-2-30-8-6 10-14 16-22 14Z"
        fill="#5C3A32"
      />
      <circle cx="214" cy="52" r="14" fill="#4E342E" />
      <circle cx="174" cy="76" r="2.2" fill="#4A342C" />
      <path d="M170 88c4 3 10 3 14 0" stroke="#C48474" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M164 82c-2 6 1 10 6 10" stroke="#E7B0A2" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function FetusShape({ stage }: { stage: number }) {
  if (stage <= 0) {
    return (
      <>
        <circle cx="36" cy="36" r="14" fill="#F7B7C6" />
        <circle cx="36" cy="36" r="7" fill="#FDE8EE" />
        <circle cx="32" cy="32" r="2.2" fill="#fff" opacity="0.9" />
      </>
    );
  }

  if (stage === 1) {
    return (
      <path
        d="M42 20c8 1 14 8 13 16-1 7-6 11-6 16 0 6-6 12-13 11-8-1-12-8-10-15 1-5-2-9-1-14 1-7 9-15 17-14Z"
        fill="#F4A8BA"
      />
    );
  }

  if (stage === 2) {
    return (
      <>
        <path
          d="M40 18c10 0 16 8 15 16-1 6-5 9-4 15 1 7-6 14-15 13-9-1-14-8-12-16 1-5-3-8-2-14 2-8 9-14 18-14Z"
          fill="#F3A4B8"
        />
        <circle cx="44" cy="26" r="7" fill="#F8C9D4" />
      </>
    );
  }

  const scale = 0.78 + Math.min(stage, 9) * 0.035;
  return (
    <g transform={`translate(36 38) scale(${scale}) translate(-36 -38)`}>
      <path
        d="M46 18c9 1 16 9 15 18-.4 5-3 8-2 12 2 8-4 16-14 18-11 2-20-4-22-14-1-6 2-10 1-15-2-8 4-16 12-18 3-1 7-1 10-1Z"
        fill="#F3A3B7"
      />
      <circle cx="48" cy="26" r="9" fill="#F8C6D2" />
      <path
        d="M34 40c7 6 16 6 22 0"
        stroke="#E888A0"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M30 34c-4 4-4 10 0 14"
        stroke="#E888A0"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {stage >= 6 ? (
        <path
          d="M52 46c6 2 8 8 5 12"
          stroke="#E888A0"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ) : null}
    </g>
  );
}

export function FetusMark({ stage, className }: ArtProps & { stage: number }) {
  return (
    <svg className={className} viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="34" fill="#fff" />
      <circle cx="36" cy="36" r="30" fill="#FFF5F7" />
      <FetusShape stage={stage} />
    </svg>
  );
}
