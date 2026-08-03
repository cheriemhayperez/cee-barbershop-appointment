import { useMemo } from 'react';

import {
  CBButton,
  CBCheckbox,
  CBCard,
  CBDateCalendar,
  CBEmptyState,
  CBInput,
  CBLoader,
  CBSaveStatus,
  CBSlotToggle,
  CBTable,
} from '@/components';
import { cn } from '@/utils/cn';
import { formatShortDisplayDate, formatTableDate } from '@/utils/dateUtils';
import { useAdminScheduleMaintenance } from '@/hooks/admin/settings';
import scheduleStyles from '@/pages/admin/Settings/AdminScheduleMaintenance.module.css';

export default function AdminScheduleMaintenance() {
  const {
    schedule,
    loaded,
    isSaving,
    saveStatus,
    saveError,
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
  } = useAdminScheduleMaintenance();

  const weeklyHoursColumns = useMemo(
    () => [
      {
        title: 'Day',
        dataIndex: 'label',
        key: 'label',
      },
      {
        title: 'Start',
        key: 'open',
        render: (_, entry) => (
          <CBInput
            type="time"
            value={entry.open}
            disabled={entry.closed || isSaving}
            onChange={(e) => updateDay(entry.day, 'open', e.target.value)}
            className={scheduleStyles.tableField}
          />
        ),
      },
      {
        title: 'End',
        key: 'close',
        render: (_, entry) => (
          <CBInput
            type="time"
            value={entry.close}
            disabled={entry.closed || isSaving}
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
            disabled={isSaving}
            onChange={(e) => updateDay(entry.day, 'closed', e.target.checked)}
            aria-label={`Mark ${entry.label} as closed`}
            className={scheduleStyles.closedCheckbox}
          />
        ),
      },
    ],
    [isSaving, updateDay]
  );

  if (!loaded) {
    return (
      <div className={scheduleStyles.loadingWrap} aria-live="polite">
        <CBLoader size="md" label="Loading schedule" />
        <p className={scheduleStyles.loadingText}>Loading schedule…</p>
      </div>
    );
  }

  return (
    <>
      <div className={scheduleStyles.introRow}>
        <p className={scheduleStyles.intro}>
          Maintenance for customer booking — controls which dates and times appear on the book page.
        </p>
        <CBSaveStatus status={saveStatus} error={saveError} />
      </div>

      <div className={scheduleStyles.content} aria-busy={isSaving}>
        {isSaving && (
          <div className={scheduleStyles.pageOverlay} aria-live="polite">
            <CBLoader size="sm" label="Saving schedule" />
            <p className={scheduleStyles.overlayText}>Saving schedule…</p>
          </div>
        )}

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
                minHeight={false}
              />
            </div>
          </CBCard>

          <CBCard title="Block entire dates">
            <p className={scheduleStyles.help}>Holidays, shop closures, or days off.</p>
            <CBDateCalendar
              compact
              value={blockDate}
              disabled={isSaving}
              blockedDates={schedule.disabledDates}
              isDateDisabled={(dateStr) => schedule.disabledDates.includes(dateStr)}
              onChange={setBlockDate}
              aria-label="Choose a date to block"
            />
            <div className={scheduleStyles.calendarActions}>
              {blockDate ? (
                <div className={scheduleStyles.selectedBlock}>
                  <div className={scheduleStyles.selectedRow}>
                    <div className={scheduleStyles.selectedMeta}>
                      <span className={scheduleStyles.selectedLabel}>Selected</span>
                      <strong className={scheduleStyles.selectedValue}>
                        {formatShortDisplayDate(blockDate)}
                      </strong>
                    </div>
                  </div>
                  <div className={scheduleStyles.selectedActions}>
                    <CBButton
                      variant="cancel"
                      size="small"
                      type="button"
                      className={scheduleStyles.cancelDateBtn}
                      disabled={isSaving}
                      onClick={() => setBlockDate('')}
                    >
                      Cancel
                    </CBButton>
                    <CBButton
                      variant="primary"
                      size="small"
                      type="button"
                      className={scheduleStyles.blockDateBtn}
                      loading={isSaving}
                      disabled={isSaving}
                      onClick={handleBlockDate}
                    >
                      Block date
                    </CBButton>
                  </div>
                </div>
              ) : (
                <p className={scheduleStyles.selectedDateMuted}>Pick a date on the calendar to block it</p>
              )}
            </div>
            {schedule.disabledDates.length > 0 ? (
              <div className={scheduleStyles.blockedSection}>
                <p className={scheduleStyles.blockedHeading}>Blocked dates</p>
                <ul className={scheduleStyles.tagList}>
                  {schedule.disabledDates.map((dateStr) => (
                    <li key={dateStr} className={scheduleStyles.tag}>
                      <span>{formatTableDate(dateStr)}</span>
                      <CBButton
                        type="button"
                        variant="inline"
                        size="small"
                        className={scheduleStyles.tagRemove}
                        disabled={isSaving}
                        onClick={() => removeDisabledDate(dateStr)}
                        aria-label={`Unblock ${formatTableDate(dateStr)}`}
                      >
                        ×
                      </CBButton>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <CBEmptyState className={scheduleStyles.blockedEmpty} message="No blocked dates." />
            )}
          </CBCard>

          <CBCard title="Disable time slots">
            <p className={scheduleStyles.help}>
              Turn off specific times on a date (lunch break, fully booked, etc.).
            </p>
            <CBDateCalendar
              compact
              value={slotDate}
              disabled={isSaving}
              blockedDates={schedule.disabledDates}
              onChange={setSlotDate}
              aria-label="Choose a date to manage time slots"
            />
            <p className={scheduleStyles.selectedDate}>
              Managing: <strong>{formatShortDisplayDate(slotDate)}</strong>
            </p>
            {slotsForManageDate.length > 0 ? (
              <div className={scheduleStyles.slotsSection}>
                <div className={scheduleStyles.slotsLegend}>
                  <span className={scheduleStyles.legendItem}>
                    <span className={cn(scheduleStyles.legendSwatch, scheduleStyles.legendAvailable)} />
                    Available
                  </span>
                  <span className={scheduleStyles.legendItem}>
                    <span className={cn(scheduleStyles.legendSwatch, scheduleStyles.legendDisabled)} />
                    Disabled
                  </span>
                </div>
                <div className={scheduleStyles.slotsGrid}>
                  {slotsForManageDate.map((time) => {
                    const enabled = !disabledForDate.includes(time);
                    return (
                      <CBSlotToggle
                        key={time}
                        label={formatTime12(time)}
                        sublabel={enabled ? 'Available' : 'Disabled'}
                        enabled={enabled}
                        disabled={isSaving}
                        onClick={() => toggleSlot(slotDate, time)}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className={scheduleStyles.closedDay}>Shop is closed on this day.</p>
            )}
          </CBCard>
        </div>
      </div>
    </>
  );
}
