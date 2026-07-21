import { useMemo } from 'react';

import FadeIn from '@/components/FadeIn/FadeIn';
import {
  CBButton,
  CBCheckbox,
  CBCard,
  CBInput,
  CBSlotToggle,
  CBTable,
} from '@/components';
import { useAdminScheduleMaintenance } from '@/hooks/admin/settings';
import scheduleStyles from '@/pages/admin/Settings/AdminScheduleMaintenance.module.css';

export default function AdminScheduleMaintenance() {
  const {
    schedule,
    blockDate,
    setBlockDate,
    slotDate,
    setSlotDate,
    slotsForManageDate,
    disabledForDate,
    updateDay,
    handleBlockDate,
    removeDisabledDate,
    toggleSlot,
    formatTime12,
    toDateString,
  } = useAdminScheduleMaintenance();

  const weeklyHoursColumns = useMemo(
    () => [
      {
        title: 'Day',
        dataIndex: 'label',
        key: 'label',
      },
      {
        title: 'Open',
        key: 'open',
        render: (_, entry) => (
          <CBInput
            type="time"
            value={entry.open}
            disabled={entry.closed}
            onChange={(e) => updateDay(entry.day, 'open', e.target.value)}
            className={scheduleStyles.tableField}
          />
        ),
      },
      {
        title: 'Close',
        key: 'close',
        render: (_, entry) => (
          <CBInput
            type="time"
            value={entry.close}
            disabled={entry.closed}
            onChange={(e) => updateDay(entry.day, 'close', e.target.value)}
            className={scheduleStyles.tableField}
          />
        ),
      },
      {
        title: 'Closed',
        key: 'closed',
        align: 'center',
        width: 88,
        render: (_, entry) => (
          <CBCheckbox
            checked={entry.closed}
            onChange={(e) => updateDay(entry.day, 'closed', e.target.checked)}
            aria-label={`Mark ${entry.label} as closed`}
            className={scheduleStyles.closedCheckbox}
          />
        ),
      },
    ],
    [updateDay]
  );

  return (
    <FadeIn>
      <p className={scheduleStyles.intro}>
        Maintenance for customer booking — controls which dates and times appear on the book page.
      </p>

      <div className={scheduleStyles.grid}>
        <CBCard title="Weekly business hours" className={scheduleStyles.fullWidth}>
          <p className={scheduleStyles.help}>
            Customers can only book on open days within these hours. Past dates are always disabled.
          </p>
          <div className={scheduleStyles.hoursTableWrap}>
            <CBTable
              columns={weeklyHoursColumns}
              dataSource={schedule.weeklyHours}
              rowKey="day"
              pagination={false}
            />
          </div>
        </CBCard>

        <CBCard title="Block entire dates">
          <p className={scheduleStyles.help}>Holidays, shop closures, or days off.</p>
          <div className={scheduleStyles.row}>
            <CBInput
              label="Date to block"
              type="date"
              value={blockDate}
              min={toDateString(new Date())}
              onChange={(e) => setBlockDate(e.target.value)}
            />
            <CBButton variant="secondary" size="small" type="button" onClick={handleBlockDate}>
              Block date
            </CBButton>
          </div>
          {schedule.disabledDates.length > 0 ? (
            <ul className={scheduleStyles.tagList}>
              {schedule.disabledDates.map((dateStr) => (
                <li key={dateStr} className={scheduleStyles.tag}>
                  {dateStr}
                  <CBButton
                    type="button"
                    variant="inline"
                    size="small"
                    onClick={() => removeDisabledDate(dateStr)}
                    aria-label={`Unblock ${dateStr}`}
                  >
                    ×
                  </CBButton>
                </li>
              ))}
            </ul>
          ) : (
            <p className={scheduleStyles.empty}>No blocked dates.</p>
          )}
        </CBCard>

        <CBCard title="Disable time slots">
          <p className={scheduleStyles.help}>
            Turn off specific times on a date (lunch break, fully booked, etc.).
          </p>
          <CBInput
            label="Manage date"
            type="date"
            value={slotDate}
            min={toDateString(new Date())}
            onChange={(e) => setSlotDate(e.target.value)}
          />
          <div className={scheduleStyles.slotsGrid}>
            {slotsForManageDate.map((time) => {
              const enabled = !disabledForDate.includes(time);
              return (
                <CBSlotToggle
                  key={time}
                  label={formatTime12(time)}
                  sublabel={enabled ? 'Available' : 'Disabled'}
                  enabled={enabled}
                  onClick={() => toggleSlot(slotDate, time)}
                />
              );
            })}
          </div>
          {!slotsForManageDate.length && (
            <p className={scheduleStyles.empty}>Shop is closed on this day.</p>
          )}
        </CBCard>
      </div>
    </FadeIn>
  );
}
