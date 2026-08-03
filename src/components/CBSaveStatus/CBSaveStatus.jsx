import { cn } from '@/utils/cn';
import styles from '@/components/CBSaveStatus/CBSaveStatus.module.css';

const SAVE_STATUS_LABELS = {
  saving: 'Saving changes…',
  saved: 'Changes saved',
  error: 'Save failed',
};

export default function CBSaveStatus({ status = 'idle', error, className }) {
  if (status === 'idle') return null;

  return (
    <div
      className={cn(
        styles.saveStatus,
        status === 'saving' && styles.saveStatusSaving,
        status === 'saved' && styles.saveStatusSaved,
        status === 'error' && styles.saveStatusError,
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {status === 'saving' && <span className={styles.saveStatusDot} aria-hidden="true" />}
      <span>{status === 'error' && error ? error : SAVE_STATUS_LABELS[status]}</span>
    </div>
  );
}
