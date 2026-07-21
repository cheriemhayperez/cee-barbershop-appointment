import { Card } from 'antd';

import { cn } from '@/utils/cn';

export default function CBCard({ title, extra, children, className, padding = true }) {
  return (
    <Card
      title={title}
      extra={extra}
      className={cn('rounded-cb border border-cb-border shadow-sm', className)}
      styles={{ body: { padding: padding ? undefined : 0 } }}
    >
      {children}
    </Card>
  );
}
