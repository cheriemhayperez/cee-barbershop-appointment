import { Tag } from 'antd';

import { cn } from '@/utils/cn';
import styles from '@/components/CBBadge/CBBadge.module.css';

const VARIANT_CLASS = {
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  pending: styles.pending,
  info: styles.info,
  neutral: styles.neutral,
  gold: styles.gold,
  primary: styles.primary,
  secondary: styles.secondary,
};

export default function CBBadge({ variant = 'neutral', children, className }) {
  return (
    <Tag
      bordered={false}
      className={cn(styles.badge, VARIANT_CLASS[variant] || styles.neutral, className)}
    >
      {children}
    </Tag>
  );
}
