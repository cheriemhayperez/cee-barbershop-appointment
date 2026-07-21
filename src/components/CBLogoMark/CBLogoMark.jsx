import styles from '@/components/CBLogoMark/CBLogoMark.module.css';

export default function CBLogoMark({ className, size = 'md' }) {
  return (
    <span
      className={`${styles.mark} ${styles[size]} ${className || ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#C9A227" />
        <circle cx="9.5" cy="9.5" r="2.1" stroke="#141414" strokeWidth="1.3" />
        <circle cx="22.5" cy="22.5" r="2.1" stroke="#141414" strokeWidth="1.3" />
        <path
          d="M11 11L21 21"
          stroke="#141414"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
        <circle cx="22.5" cy="9.5" r="2.1" stroke="#141414" strokeWidth="1.3" />
        <circle cx="9.5" cy="22.5" r="2.1" stroke="#141414" strokeWidth="1.3" />
        <path
          d="M21 11L11 21"
          stroke="#141414"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="1.65" fill="#141414" />
        <path
          d="M11.5 24.25C13.2 25.6 14.6 26 16 26C17.4 26 18.8 25.6 20.5 24.25"
          stroke="#141414"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
