import { Table } from 'antd';

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

export default function CBTable({
  columns,
  dataSource = [],
  rowKey = 'id',
  emptyMessage,
  bordered = true,
  className,
  pagination = false,
}) {
  return (
    <div className={styles.wrap}>
      <Table
        className={cn('cb-table', className)}
        columns={normalizeColumns(columns)}
        dataSource={dataSource}
        rowKey={rowKey}
        bordered={bordered}
        pagination={pagination}
        scroll={{ x: 'max-content' }}
        locale={emptyMessage ? { emptyText: emptyMessage } : undefined}
      />
    </div>
  );
}
