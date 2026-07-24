import { Space, Tooltip } from 'antd';

import { cn } from '@/utils/cn';
import { IconAdd, IconEdit, IconTrash } from '@/components/CBIcon/CBIcon';
import CBButton from '@/components/CBButton/CBButton';
import styles from '@/components/CBToolbar/CBToolbar.module.css';

export function AdminPageHeader({ title, subtitle, onAdd, addLabel = 'Add New' }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="m-0 text-xl font-bold leading-tight text-cb-dark sm:text-2xl">{title}</h1>
        {subtitle && <p className="mb-0 mt-1 text-sm text-cb-muted">{subtitle}</p>}
      </div>
      {onAdd && (
        <CBButton
          variant="add"
          size="small"
          onClick={onAdd}
          icon={<IconAdd />}
          className={cn(styles.addBtn, 'w-full shrink-0 sm:w-auto')}
        >
          {addLabel}
        </CBButton>
      )}
    </div>
  );
}

const iconActionClass = cn(
  styles.iconAction,
  'flex h-8 w-8 min-w-8 items-center justify-center rounded-lg p-0'
);

export function RowActions({ onEdit, onDelete }) {
  return (
    <Space size={4} className="inline-flex items-center">
      <Tooltip title="Edit">
        <CBButton
          variant="ghost"
          size="small"
          icon={<IconEdit />}
          onClick={onEdit}
          aria-label="Edit"
          className={cn(iconActionClass, 'text-cb-muted hover:bg-gold-light hover:text-gold')}
        />
      </Tooltip>
      <Tooltip title="Delete">
        <CBButton
          variant="ghost"
          size="small"
          icon={<IconTrash />}
          onClick={onDelete}
          aria-label="Delete"
          className={cn(iconActionClass, 'text-[#c62828] hover:bg-red-50 hover:text-[#b71c1c]')}
        />
      </Tooltip>
    </Space>
  );
}

export function CardActions({ onEdit, onDelete }) {
  return (
    <Space size={4} className="mt-3 inline-flex items-center">
      <Tooltip title="Edit">
        <CBButton
          variant="ghost"
          size="small"
          icon={<IconEdit />}
          onClick={onEdit}
          aria-label="Edit"
          className={cn(iconActionClass, 'text-cb-muted hover:bg-gold-light hover:text-gold')}
        />
      </Tooltip>
      <Tooltip title="Delete">
        <CBButton
          variant="ghost"
          size="small"
          icon={<IconTrash />}
          onClick={onDelete}
          aria-label="Delete"
          className={cn(iconActionClass, 'text-[#c62828] hover:bg-red-50 hover:text-[#b71c1c]')}
        />
      </Tooltip>
    </Space>
  );
}
