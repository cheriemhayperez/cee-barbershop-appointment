import { Card } from 'antd';

import { cn } from '@/utils/cn';

import styles from '@/components/CBCard/CBCard.module.css';

export default function CBCard({ title, extra, children, className, padding = true }) {
  return (
    <Card
      title={title}
      extra={extra}
      variant="borderless"
      className={cn(styles.card, className)}
      styles={{ body: { padding: padding ? undefined : 0 } }}
    >
      {children}
    </Card>
  );
}
