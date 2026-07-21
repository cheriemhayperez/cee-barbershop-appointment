import styles from '@/components/CBBarChart/CBBarChart.module.css';

export default function CBBarChart({
  items,
  maxValue,
  valueKey = 'count',
  labelKey = 'name',
}) {
  return (
    <div className={styles.barChart}>
      {items.map((item) => (
        <div key={item[labelKey]} className={styles.barRow}>
          <span className={styles.barLabel}>{item[labelKey]}</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
            />
          </div>
          <span className={styles.barValue}>{item[valueKey]}</span>
        </div>
      ))}
    </div>
  );
}
