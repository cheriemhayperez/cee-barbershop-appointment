import { Trash } from 'iconsax-react';

import CBButton from '@/components/CBButton/CBButton';
import CBModal, { CBModalFooter } from '@/components/CBModal/CBModal';
import styles from '@/components/CBConfirmModal/CBConfirmModal.module.css';

export default function CBConfirmModal({
  open = true,
  title,
  itemName,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <CBModal
      open={open}
      title={title}
      onClose={onCancel}
      width={420}
      footer={
        <CBModalFooter>
          <CBButton variant="cancel" size="small" type="button" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </CBButton>
          <CBButton
            variant="danger"
            size="small"
            type="button"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </CBButton>
        </CBModalFooter>
      }
    >
      <div className={styles.content}>
        <div className={styles.iconWrap} aria-hidden="true">
          <Trash size={20} color="currentColor" variant="Bold" />
        </div>
        <p className={styles.message}>
          {description ?? (
            <>
              Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
            </>
          )}
        </p>
      </div>
    </CBModal>
  );
}
