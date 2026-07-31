import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Calendar, Clipboard, Profile2User, Scissor, TickCircle } from 'iconsax-react';
import { AdminPageHeader, CBAppointmentCalendar, CBBadge, CBBarChart, CBCard, CBEmptyState, CBModal, CBTable } from '@/components';
import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import { APPOINTMENT_STATUS_BADGE_VARIANTS } from '@/constants/data/appointments.data';
import { useAdminDashboard } from '@/hooks/admin/dashboard';
import { cn } from '@/utils/cn';
import { formatShortDisplayDate, formatTableDate } from '@/utils/dateUtils';
import { formatTime12 } from '@/utils/scheduleUtils';
import styles from '@/pages/admin/Dashboard/AdminDashboard.module.css';

const STAT_ICONS = {
  calendar: Calendar,
  bookings: Clipboard,
  completed: TickCircle,
  customers: Profile2User,
  barbers: Scissor,
};

export default function AdminDashboard() {
  const {
    appointments,
    analytics,
    selectedDate,
    dayModalOpen,
    dayAppointments,
    handleDateSelect,
    closeDayModal,
  } = useAdminDashboard();

  const statusTotal = analytics.statusBreakdown.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader title="Dashboard" />

      <FadeIn delay={0.04} immediate>
        <div className={styles.kpiStrip}>
          {analytics.kpis.map((stat) => {
            const StatIcon = STAT_ICONS[stat.icon];

            return (
              <div
                key={stat.label}
                className={cn(
                  styles.kpiItem,
                  styles[`kpiItem${stat.accent}`],
                )}
              >
                <div className={styles.kpiBody}>
                  <span className={styles.kpiLabel}>{stat.label}</span>
                  <span className={styles.kpiValue}>{stat.value}</span>
                </div>
                <div className={styles.kpiIconWrap} aria-hidden="true">
                  {StatIcon && <StatIcon size={20} color="currentColor" variant="Bold" />}
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>

      <div className={styles.mainGrid}>
        <FadeIn delay={0.08} immediate className={styles.mainGridCell}>
          <CBCard
            className={cn(styles.calendarCard, styles.dashboardCard)}
            title="Appointment Calendar"
            extra={<Link to="/admin/appointments" className={styles.cardLink}>Manage all →</Link>}
          >
            <CBAppointmentCalendar
              appointments={appointments}
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
            />
          </CBCard>
        </FadeIn>

        <FadeIn delay={0.1} immediate className={styles.mainGridCell}>
          <div className={styles.insightsStack}>
            <CBCard className={cn(styles.overviewCard, styles.dashboardCard)} title="Overview">
              <section className={styles.insightsSection} aria-label="Monthly booking status">
                <div className={styles.statusBar}>
                  {analytics.statusBreakdown.map((s) => (
                    <div
                      key={s.label}
                      className={styles.statusSegment}
                      style={{ width: `${(s.count / statusTotal) * 100}%`, background: s.color }}
                      title={`${s.label}: ${s.count}`}
                    />
                  ))}
                </div>
                <div className={styles.statusGrid}>
                  {analytics.statusBreakdown.map((s) => (
                    <div key={s.label} className={styles.statusStat}>
                      <span className={styles.statusStatValue}>{s.count}</span>
                      <span className={styles.statusStatLabel}>
                        <span className={styles.statusDot} style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </CBCard>

            <CBCard className={cn(styles.weekCard, styles.dashboardCard)} title="This Week">
              <section className={styles.chartSection} aria-label="Weekly appointments">
                <div className={styles.weekChart}>
                  {analytics.weeklyTrend.map((entry) => (
                    <div
                      key={entry.date}
                      className={styles.weekCol}
                      aria-label={`${entry.label}: ${entry.count} appointment${entry.count === 1 ? '' : 's'}`}
                    >
                      <span className={styles.weekTooltip}>
                        <strong className={styles.weekTooltipValue}>{entry.count}</strong>
                        <span className={styles.weekTooltipMeta}>
                          {entry.count === 1 ? 'appt' : 'appts'}
                        </span>
                      </span>
                      <div className={styles.weekBarWrap}>
                        <div
                          className={cn(styles.weekBar, entry.count === 0 && styles.weekBarEmpty)}
                          style={{ height: `${Math.max((entry.count / analytics.maxWeekly) * 100, entry.count > 0 ? 10 : 4)}%` }}
                        />
                      </div>
                      <span className={styles.weekLabel}>{entry.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            </CBCard>
          </div>
        </FadeIn>
      </div>

      <div className={styles.grid}>
        <FadeIn delay={0.12} className={styles.gridCell}>
          <CBCard className={cn(styles.dashboardCard, styles.chartCard)} title="Popular Services">
            {analytics.popularServices.length ? (
              <CBBarChart
                items={analytics.popularServices}
                maxValue={analytics.maxService}
                barColor="var(--gold)"
                maxItems={5}
              />
            ) : (
              <div className={styles.chartEmpty}>
                <CBEmptyState className={styles.chartEmptyState} />
              </div>
            )}
          </CBCard>
        </FadeIn>

        <FadeIn delay={0.14} className={styles.gridCell}>
          <CBCard className={cn(styles.dashboardCard, styles.chartCard)} title="Barber Workload">
            {analytics.barberBookings.length ? (
              <CBBarChart
                items={analytics.barberBookings}
                maxValue={analytics.maxBarber}
                labelKey="name"
                barColor="#8a7048"
                maxItems={5}
              />
            ) : (
              <div className={styles.chartEmpty}>
                <CBEmptyState className={styles.chartEmptyState} />
              </div>
            )}
          </CBCard>
        </FadeIn>
      </div>

      <FadeIn delay={0.16}>
        <CBCard
          className={styles.dashboardCard}
          title="Upcoming Appointments"
          extra={<Link to="/admin/appointments" className={styles.cardLink}>View all →</Link>}
          padding={analytics.upcoming.length > 0 ? false : true}
        >
          {analytics.upcoming.length ? (
            <CBTable
              bordered={false}
              pagination={false}
              minHeight={false}
              embedded
              columns={[
                { title: 'Customer', dataIndex: 'name', key: 'name' },
                { title: 'Service', dataIndex: 'service', key: 'service' },
                {
                  title: 'Barber',
                  key: 'barber',
                  render: (_, a) => (
                    <span className={a.barber === 'No preference' ? styles.tableMuted : undefined}>
                      {a.barber}
                    </span>
                  ),
                },
                {
                  title: 'Date',
                  key: 'date',
                  render: (_, a) => formatTableDate(a.date),
                },
                { title: 'Time', key: 'time', render: (_, a) => formatTime12(a.time) },
                {
                  title: 'Status',
                  key: 'status',
                  render: (_, a) => (
                    <CBBadge variant={APPOINTMENT_STATUS_BADGE_VARIANTS[a.status] ?? 'neutral'}>
                      {a.status}
                    </CBBadge>
                  ),
                },
              ]}
              dataSource={analytics.upcoming}
            />
          ) : (
            <div className={styles.tableEmpty}>
              <CBEmptyState className={styles.tableEmptyState} />
            </div>
          )}
        </CBCard>
      </FadeIn>

      <AnimatePresence>
        {dayModalOpen && selectedDate && (
          <CBModal
            title={formatShortDisplayDate(selectedDate)}
            onClose={closeDayModal}
            className={styles.dayModal}
            width={420}
          >
            <div className={styles.dayModalMeta}>
              <span>
                {dayAppointments.length === 0
                  ? 'No appointments'
                  : `${dayAppointments.length} appointment${dayAppointments.length === 1 ? '' : 's'}`}
              </span>
              <Link
                to="/admin/appointments"
                className={styles.dayModalLink}
                onClick={closeDayModal}
              >
                View all →
              </Link>
            </div>

            {dayAppointments.length === 0 ? (
              <CBEmptyState className={styles.dayModalEmptyState} />
            ) : (
              <ul className={styles.dayList}>
                {dayAppointments.map((appt) => (
                  <li key={appt.id} className={styles.dayItem}>
                    <span className={styles.dayItemTime}>{formatTime12(appt.time)}</span>
                    <div className={styles.dayItemContent}>
                      <strong className={styles.dayItemName}>{appt.name}</strong>
                      <span className={styles.dayItemService}>{appt.service}</span>
                    </div>
                    <CBBadge variant={APPOINTMENT_STATUS_BADGE_VARIANTS[appt.status] ?? 'neutral'}>
                      {appt.status}
                    </CBBadge>
                  </li>
                ))}
              </ul>
            )}

          </CBModal>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
