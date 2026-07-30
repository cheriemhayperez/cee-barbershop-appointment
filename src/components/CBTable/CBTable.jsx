import { Table } from 'antd';

import CBEmptyState from '@/components/CBEmptyState/CBEmptyState';
import { ADMIN_EMPTY_MESSAGE } from '@/constants/admin/messages';
import { cn } from '@/utils/cn';
import styles from '@/components/CBTable/CBTable.module.css';

function normalizeColumns(columns) {
  return columns.map((column) => {
    if (typeof column === 'string') {
      const key = column.toLowerCase().replace(/\s+/g, '_');
      return { title: column, dataIndex: key, key };
    }
    return column;
  });
}

function renderEmptyText(emptyMessage) {
  if (!emptyMessage) return undefined;

  if (typeof emptyMessage === 'string') {
    return <CBEmptyState message={emptyMessage} />;
  }

  return emptyMessage;
}

export default function CBTable({
  columns,
  dataSource = [],
  rowKey = 'id',
  emptyMessage = ADMIN_EMPTY_MESSAGE,
  bordered = false,
  className,
  pagination = false,
  minHeight = true,
  embedded = false,
}) {
  return (
    <div className={cn(styles.wrap, minHeight && styles.wrapMinHeight, embedded && styles.wrapEmbedded)}>
      <Table
        className={cn('cb-table', className)}
        columns={normalizeColumns(columns)}
        dataSource={dataSource}
        rowKey={rowKey}
        bordered={bordered}
        pagination={pagination}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: renderEmptyText(emptyMessage) }}
      />
    </div>
  );
}
