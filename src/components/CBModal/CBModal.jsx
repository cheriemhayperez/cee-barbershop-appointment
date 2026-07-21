import { Modal } from 'antd';

import { cn } from '@/utils/cn';
import CBButton from '@/components/CBButton/CBButton';
import styles from '@/components/CBModal/CBModal.module.css';

export default function CBModal({
  title,
  onClose,
  children,
  footer,
  open = true,
  className,
  width = 520,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      footer={footer ?? null}
      width={width}
      className={cn(className)}
      destroyOnClose
    >
      {children}
    </Modal>
  );
}

export function CBModalFooter({ children, className }) {
  return <div className={cn(styles.footer, className)}>{children}</div>;
}

export function CBModalForm({
  onSubmit,
  onCancel,
  editing,
  saveLabel,
  cancelLabel = 'Cancel',
  children,
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
      <CBModalFooter>
        <CBButton variant="cancel" size="small" type="button" onClick={onCancel}>
          {cancelLabel}
        </CBButton>
        <CBButton variant="primary" size="small" type="submit">
          {saveLabel ?? (editing ? 'Update' : 'Add')}
        </CBButton>
      </CBModalFooter>
    </form>
  );
}
