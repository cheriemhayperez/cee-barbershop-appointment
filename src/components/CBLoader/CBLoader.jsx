import { useId } from 'react';

import { cn } from '@/utils/cn';
import styles from '@/components/CBLoader/CBLoader.module.css';

const SIZE_CLASS = {
  sm: styles.loaderSm,
  md: styles.loaderMd,
  lg: styles.loaderLg,
};

export function CBLoader({ size = 'md', className, label = 'Loading' }) {
  const gradientId = useId();

  return (
    <div
      className={cn(styles.loader, SIZE_CLASS[size], className)}
      role="status"
      aria-label={label}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#d4b48a" />
            <stop offset="100%" stopColor="#9a7a1a" />
          </linearGradient>
        </defs>
        <circle
          className={styles.ring}
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke={`url(#${gradientId})`}
        />
      </svg>
    </div>
  );
}

export function CBLoaderBackdrop({ label = 'Loading', size = 'md' }) {
  return (
    <div className={styles.backdrop} aria-live="polite">
      <CBLoader size={size} label={label} />
      {label ? <p className={styles.label}>{label}</p> : null}
    </div>
  );
}

export function CBLoaderWrapper({ loading, children, label = 'Loading', fullPage = false }) {
  if (!loading) return children;

  if (fullPage) {
    return <CBLoaderBackdrop label={label} />;
  }

  return (
    <div className={styles.inlineWrap} aria-live="polite">
      <CBLoader label={label} />
    </div>
  );
}

export default CBLoader;
