import { cn } from '@/utils/cn';

import styles from '@/components/CBBarChart/CBBarChart.module.css';

export default function CBBarChart({
  items,
  maxValue,
  valueKey = 'count',
  labelKey = 'name',
  barColor = 'var(--gold)',
  minRows = 0,
  maxItems = 0,
  className,
}) {
  const safeMax = Math.max(maxValue, 1);
  const limitedItems = maxItems > 0 ? items.slice(0, maxItems) : items;
  const rows = limitedItems.map((item) => ({ ...item, isPlaceholder: false }));

  while (rows.length < minRows) {
    rows.push({
      [labelKey]: '',
      [valueKey]: 0,
      isPlaceholder: true,
      id: `placeholder-${rows.length}`,
    });
  }

  return (
    <div
      className={cn(styles.barChart, minRows > 0 && styles.barChartFixed, className)}
      style={{
        '--bar-fill-color': barColor,
        '--bar-min-rows': minRows,
      }}
    >
      {rows.map((item, index) => {
        const rowKey = item.isPlaceholder ? item.id : item[labelKey];
        const value = item[valueKey] ?? 0;

        return (
          <div
            key={rowKey ?? index}
            className={cn(styles.barRow, item.isPlaceholder && styles.barRowPlaceholder)}
          >
            <span className={styles.barLabel}>{item[labelKey]}</span>
            <div className={styles.barTrack}>
              {!item.isPlaceholder && value > 0 && (
                <div
                  className={styles.barFill}
                  style={{ width: `${(value / safeMax) * 100}%` }}
                />
              )}
            </div>
            <span className={styles.barValue}>{item.isPlaceholder ? '' : value}</span>
          </div>
        );
      })}
    </div>
  );
}
