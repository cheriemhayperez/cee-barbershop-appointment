import { Space, Tooltip } from 'antd';

import { cn } from '@/utils/cn';
import { IconAdd, IconEdit, IconTrash } from '@/components/CBIcon/CBIcon';
import CBButton from '@/components/CBButton/CBButton';
import styles from '@/components/CBToolbar/CBToolbar.module.css';

export function AdminPageHeader({ title, subtitle, onAdd, addLabel = 'Add New' }) {
  return (
    <div className="mb-5 flex flex-col gap-3.5">
      <div>
        <h1 className="m-0 text-2xl font-bold leading-tight text-cb-dark">{title}</h1>
        {subtitle && <p className="mb-0 mt-1 text-sm text-cb-muted">{subtitle}</p>}
      </div>
      {onAdd && (
        <div className="flex justify-end">
          <CBButton
            variant="add"
            size="small"
            onClick={onAdd}
            icon={<IconAdd />}
            className={styles.addBtn}
          >
            {addLabel}
          </CBButton>
        </div>
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
