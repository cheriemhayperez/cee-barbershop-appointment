import { Children, isValidElement } from 'react';
import { Input, Select } from 'antd';

import { cn } from '@/utils/cn';
import styles from '@/components/CBInput/CBInput.module.css';

export default function CBInput({
  label,
  error,
  className,
  id,
  variant = 'light',
  size,
  required,
  ...rest
}) {
  const inputId = id || rest.name;
  const isDark = variant === 'dark';

  return (
    <div
      className={cn(
        styles.field,
        isDark ? styles.fieldDark : styles.fieldLight,
        className
      )}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={isDark ? styles.labelDark : styles.labelLight}
        >
          {label}
          {required && (
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className={isDark ? styles.controlDark : styles.controlLight}>
        <Input
          id={inputId}
          size={size || 'middle'}
          status={error ? 'error' : undefined}
          {...rest}
        />
      </div>
      {error && (
        <span className={isDark ? styles.errorDark : styles.errorLight}>
          {error}
        </span>
      )}
    </div>
  );
}

export function CBSelect({
  label,
  error,
  className,
  id,
  children,
  onChange,
  name,
  value,
  placeholder,
  emptyMessage = 'No options available',
  variant = 'light',
  size,
  disabled,
  required,
  ...rest
}) {
  const selectId = id || name;
  const isDark = variant === 'dark';
  const options = Children.toArray(children)
    .filter(isValidElement)
    .filter((child) => child.props.value !== '' && child.props.value != null)
    .map((child) => ({
      value: child.props.value ?? child.props.children,
      label: child.props.children,
      disabled: Boolean(child.props.disabled),
    }));

  const handleChange = (nextValue) => {
    onChange?.({ target: { name, value: nextValue } });
  };

  return (
    <div
      className={cn(
        styles.field,
        isDark ? styles.fieldDark : styles.fieldLight,
        className
      )}
    >
      {label && (
        <label
          htmlFor={selectId}
          className={isDark ? styles.labelDark : styles.labelLight}
        >
          {label}
          {required && (
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className={isDark ? styles.controlDark : styles.controlLight}>
        <Select
          id={selectId}
          className={cn('w-full', isDark ? styles.selectDark : styles.selectLight)}
          size={size || 'middle'}
          classNames={isDark ? { popup: { root: styles.selectDarkPopup } } : undefined}
          popupClassName={isDark ? styles.selectDarkPopup : undefined}
          styles={
            isDark
              ? {
                  popup: {
                    root: {
                      backgroundColor: '#242424',
                      border: '1px solid #333',
                    },
                  },
                }
              : undefined
          }
          status={error ? 'error' : undefined}
          options={options}
          placeholder={placeholder}
          value={value || undefined}
          disabled={disabled}
          aria-required={required || undefined}
          notFoundContent={
            <span className={isDark ? styles.selectEmptyMessage : styles.selectEmptyMessageLight}>
              {emptyMessage}
            </span>
          }
          onChange={handleChange}
          {...rest}
        />
      </div>
      {error && (
        <span className={isDark ? styles.errorDark : styles.errorLight}>
          {error}
        </span>
      )}
    </div>
  );
}
