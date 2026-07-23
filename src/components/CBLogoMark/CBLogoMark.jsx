import logoSrc from '@/assets/images/cee-logo.png';
import styles from '@/components/CBLogoMark/CBLogoMark.module.css';

export default function CBLogoMark({ className, size = 'md', alt = 'CEE Barbershop' }) {
  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`${styles.mark} ${styles[size]} ${className || ''}`}
    />
  );
}
