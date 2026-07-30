import { useId, useRef } from 'react';

import { cn } from '@/utils/cn';
import styles from '@/components/CBImageUpload/CBImageUpload.module.css';

export default function CBImageUpload({
  label = 'Photo',
  value,
  onChange,
  error,
  required = false,
  className,
}) {
  const inputId = useId();
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    onChange?.(file);
    event.target.value = '';
  };

  const handleRemove = () => {
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className={styles.uploadArea}>
        <div className={styles.previewWrap}>
          {value ? (
            <img src={value} alt="" className={styles.preview} />
          ) : (
            <div className={styles.previewPlaceholder}>No photo</div>
          )}
        </div>

        <div className={styles.actions}>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => inputRef.current?.click()}
          >
            {value ? 'Change photo' : 'Upload photo'}
          </button>
          {value && (
            <button type="button" className={styles.removeBtn} onClick={handleRemove}>
              Remove
            </button>
          )}
          <p className={styles.hint}>JPG, PNG, or WEBP up to 5 MB.</p>
        </div>
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
