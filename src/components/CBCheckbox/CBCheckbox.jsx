import { Checkbox } from 'antd';

import { cn } from '@/utils/cn';

export default function CBCheckbox({
  label,
  checked,
  onChange,
  disabled,
  className,
  id,
  name,
  ...rest
}) {
  const inputId = id || name;

  return (
    <Checkbox
      id={inputId}
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={cn(className)}
      {...rest}
    >
      {label}
    </Checkbox>
  );
}
