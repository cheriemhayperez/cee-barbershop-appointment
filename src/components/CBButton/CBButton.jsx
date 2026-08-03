import { Button } from 'antd';
import { Link } from 'react-router-dom';

import { cn } from '@/utils/cn';

const VARIANT_MAP = {
  primary: 'primary',
  secondary: 'default',
  outline: 'default',
  ghost: 'text',
  danger: 'primary',
  success: 'primary',
  cancel: 'default',
  dark: 'primary',
  add: 'primary',
  inline: 'text',
};

const VARIANT_CLASS = {
  primary: cn(
    '!bg-gold !border-gold !text-white',
    'hover:!bg-gold-hover hover:!border-gold-hover hover:!text-white',
    'disabled:!bg-[rgba(196,161,114,0.35)] disabled:!border-transparent disabled:!text-white disabled:!opacity-100'
  ),
  outline: 'border-gold text-gold bg-transparent hover:!border-gold hover:!text-gold',
  danger: '!bg-red-700 hover:!bg-red-800 border-red-700',
  success: '!bg-green-700 hover:!bg-green-800 border-green-700',
  cancel: 'border-gray-300 text-gray-600',
  dark: '!bg-cb-dark hover:!bg-black border-cb-dark',
  add: cn(
    'inline-flex h-[2.625rem] min-h-[2.625rem] items-center gap-2.5 rounded-[10px] border border-gold',
    'bg-gold px-4 pl-2.5 text-sm font-semibold text-white',
    'shadow-none transition-colors',
    'hover:bg-gold-hover hover:border-gold-hover hover:!text-white hover:!shadow-none'
  ),
  inline: '!h-auto !min-h-0 !p-0 !shadow-none !border-0 bg-transparent text-inherit hover:!bg-transparent',
};

const SIZE_MAP = {
  small: 'small',
  medium: 'middle',
  large: 'large',
};

export default function CBButton({
  variant = 'primary',
  size = 'medium',
  className,
  disabled,
  isLoading,
  loading,
  type = 'button',
  onClick,
  to,
  href,
  children,
  ...rest
}) {
  const antType = VARIANT_MAP[variant] || 'default';
  const antSize = SIZE_MAP[size] || 'middle';
  const classes = cn(
    variant === 'outline' && 'rounded-full',
    variant === 'primary' && 'rounded-full font-semibold',
    VARIANT_CLASS[variant],
    className
  );

  const content = children;
  const isBtnLoading = isLoading || loading;

  if (to) {
    return (
      <Link to={to} className={cn('inline-flex no-underline', className)} {...rest}>
        <Button type={antType} size={antSize} className={classes} disabled={disabled} loading={isBtnLoading}>
          {content}
        </Button>
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={cn('inline-flex no-underline', className)} {...rest}>
        <Button type={antType} size={antSize} className={classes} disabled={disabled} loading={isBtnLoading}>
          {content}
        </Button>
      </a>
    );
  }

  return (
    <Button
      type={antType}
      size={antSize}
      htmlType={type === 'submit' ? 'submit' : 'button'}
      className={classes}
      disabled={disabled}
      loading={isBtnLoading}
      onClick={onClick}
      danger={variant === 'danger'}
      ghost={variant === 'outline'}
      {...rest}
    >
      {content}
    </Button>
  );
}
