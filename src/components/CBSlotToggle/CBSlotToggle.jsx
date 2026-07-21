import CBButton from '@/components/CBButton/CBButton';
import { cn } from '@/utils/cn';
import styles from '@/components/CBSlotToggle/CBSlotToggle.module.css';

export default function CBSlotToggle({ label, sublabel, enabled, onClick, className, ...rest }) {
  return (
    <CBButton
      type="button"
      variant="secondary"
      className={cn(styles.toggle, enabled ? styles.on : styles.off, className)}
      onClick={onClick}
      {...rest}
    >
      {label}
      {sublabel && <span>{sublabel}</span>}
    </CBButton>
  );
}
