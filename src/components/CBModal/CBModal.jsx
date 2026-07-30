import { Modal } from 'antd';

import { cn } from '@/utils/cn';
import CBButton from '@/components/CBButton/CBButton';
import { CBLoader } from '@/components/CBLoader/CBLoader';
import styles from '@/components/CBModal/CBModal.module.css';

export default function CBModal({
  title,
  onClose,
  children,
  footer,
  open = true,
  className,
  width = 520,
  loading = false,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={loading ? undefined : onClose}
      footer={footer ?? null}
      width={width}
      wrapClassName={cn(styles.modalWrap, width !== 520 && styles.modalWrapWide)}
      className={cn(styles.modal, className)}
      style={width !== 520 ? { '--cb-modal-width': `${width}px` } : undefined}
      destroyOnClose
      centered
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
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
  error,
  loading = false,
  loadingLabel = 'Saving',
  children,
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-busy={loading}>
      {loading && (
        <div className={styles.formOverlay} aria-live="polite">
          <CBLoader size="sm" label={loadingLabel} />
        </div>
      )}
      {error && <p className={styles.formError}>{error}</p>}
      <div className={styles.formScroll}>
        <fieldset className={styles.formFields} disabled={loading}>
          {children}
        </fieldset>
      </div>
      <CBModalFooter>
        <CBButton variant="cancel" size="small" type="button" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </CBButton>
        <CBButton variant="primary" size="small" type="submit" loading={loading} disabled={loading}>
          {saveLabel ?? (editing ? 'Update' : 'Add')}
        </CBButton>
      </CBModalFooter>
    </form>
  );
}
