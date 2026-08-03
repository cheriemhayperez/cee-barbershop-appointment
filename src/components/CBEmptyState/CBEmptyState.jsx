import { DocumentText } from 'iconsax-react';

import { ADMIN_EMPTY_MESSAGE } from '@/constants';
import { cn } from '@/utils/cn';
import styles from '@/components/CBEmptyState/CBEmptyState.module.css';

export default function CBEmptyState({ message = ADMIN_EMPTY_MESSAGE, className }) {
  return (
    <div className={cn(styles.emptyState, className)}>
      <span className={styles.emptyIconWrap} aria-hidden="true">
        <DocumentText size={28} color="currentColor" variant="Bulk" />
      </span>
      <p className={styles.emptyText}>{message}</p>
    </div>
  );
}
