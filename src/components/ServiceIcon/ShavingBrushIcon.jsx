/** Shaving brush — refined line art (Tabler has no barber brush). */
export function ShavingBrushIcon({ size = 52, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21v-6.5" />
      <path d="M9.5 21h5" />
      <path d="M10 14.5h4" />
      <path d="M8.5 10.5c0-3.03 1.57-5.5 3.5-5.5s3.5 2.47 3.5 5.5" />
      <path d="M9 8.25c.55-.95 1.45-1.5 2.5-1.5s1.95.55 2.5 1.5" />
      <path d="M9.75 6.1c.45-.55 1.05-.85 1.75-.85s1.3.3 1.75.85" />
    </svg>
  );
}
