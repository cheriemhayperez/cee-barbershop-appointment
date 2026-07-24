import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, CBAppointmentCalendar, CBBadge, CBBarChart, CBCard, CBButton, CBModal, CBModalFooter, CBTable } from '@/components';
import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import { APPOINTMENT_STATUS_BADGE_VARIANTS } from '@/constants/data/appointments.data';
import { useAdminDashboard } from '@/hooks/admin/dashboard';
import { formatDisplayDate } from '@/utils/dateUtils';
import { formatTime12 } from '@/utils/scheduleUtils';
import styles from '@/pages/admin/Dashboard/AdminDashboard.module.css';

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

  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader title="Dashboard" />

      <div className={styles.stats}>
        {analytics.kpis.map((stat, index) => (
          <FadeIn key={stat.label} delay={index * 0.06}>
            <CBCard className={styles.statCardWrap} padding={false}>
              <div className={styles.statCardInner}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statHint}>{stat.hint}</p>
              </div>
            </CBCard>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.08}>
        <CBCard
          className={styles.overviewCard}
          title="Appointment Calendar"
          extra={<Link to="/admin/appointments" className={styles.cardLink}>Manage all →</Link>}
        >
          <div className={styles.overviewSplit}>
            <div className={styles.calendarPane}>
              <CBAppointmentCalendar
                appointments={appointments}
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
              />
            </div>

            <aside className={styles.statusPane} aria-label="Booking status">
              <h4 className={styles.statusPaneTitle}>Booking Status</h4>
              <div className={styles.statusBar}>
                {analytics.statusBreakdown.map((s) => {
                  const total = analytics.statusBreakdown.reduce((sum, item) => sum + item.count, 0) || 1;
                  return (
                    <div
                      key={s.label}
                      className={styles.statusSegment}
                      style={{ width: `${(s.count / total) * 100}%`, background: s.color }}
                      title={`${s.label}: ${s.count}`}
                    />
                  );
                })}
              </div>
              <div className={styles.statusList}>
                {analytics.statusBreakdown.map((s) => (
                  <div key={s.label} className={styles.statusRow}>
                    <span className={styles.statusDot} style={{ background: s.color }} />
                    <span className={styles.statusLabel}>{s.label}</span>
                    <span className={styles.statusCount}>{s.count}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </CBCard>
      </FadeIn>

      <div className={styles.grid}>
        <FadeIn delay={0.1}>
          <CBCard title="Weekly Appointments">
            <div className={styles.weekChart}>
              {analytics.weeklyTrend.map((day) => (
                <div key={day.date} className={styles.weekCol}>
                  <div className={styles.weekBar} style={{ height: `${(day.count / analytics.maxWeekly) * 100}%` }} />
                  <span className={styles.weekLabel}>{day.label}</span>
                  <span className={styles.weekCount}>{day.count}</span>
                </div>
              ))}
            </div>
          </CBCard>
        </FadeIn>

        <FadeIn delay={0.2}>
          <CBCard title="Popular Services">
            <CBBarChart items={analytics.popularServices} maxValue={analytics.maxService} />
          </CBCard>
        </FadeIn>

        <FadeIn delay={0.25}>
          <CBCard title="Barber Workload">
            {analytics.barberBookings.length ? (
              <CBBarChart items={analytics.barberBookings} maxValue={analytics.maxBarber} labelKey="name" />
            ) : (
              <p className={styles.empty}>No barber assignments yet.</p>
            )}
          </CBCard>
        </FadeIn>
      </div>

      <FadeIn delay={0.3}>
        <CBCard
          title="Upcoming Appointments"
          extra={<Link to="/admin/appointments" className={styles.cardLink}>View all →</Link>}
          padding={false}
        >
          <CBTable
            bordered={false}
            pagination={false}
            minHeight={false}
            columns={[
              { title: 'Customer', dataIndex: 'name', key: 'name' },
              { title: 'Service', dataIndex: 'service', key: 'service' },
              { title: 'Barber', dataIndex: 'barber', key: 'barber' },
              { title: 'Date', dataIndex: 'date', key: 'date' },
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
        </CBCard>
      </FadeIn>

      <AnimatePresence>
        {dayModalOpen && selectedDate && (
          <CBModal
            title={`Appointments — ${formatDisplayDate(selectedDate)}`}
            onClose={closeDayModal}
          >
            {dayAppointments.length === 0 ? (
              <p className={styles.dayModalEmpty}>No appointments scheduled for this date.</p>
            ) : (
              <ul className={styles.dayList}>
                {dayAppointments.map((appt) => (
                  <li key={appt.id} className={styles.dayItem}>
                    <div className={styles.dayItemMain}>
                      <strong>{appt.name}</strong>
                      <span>{formatTime12(appt.time)} · {appt.service}</span>
                    </div>
                    <CBBadge variant={APPOINTMENT_STATUS_BADGE_VARIANTS[appt.status] ?? 'neutral'}>
                      {appt.status}
                    </CBBadge>
                  </li>
                ))}
              </ul>
            )}
            <CBModalFooter>
              <CBButton variant="cancel" size="small" type="button" onClick={closeDayModal}>
                Close
              </CBButton>
              <CBButton variant="primary" size="small" to="/admin/appointments">
                Manage Appointments
              </CBButton>
            </CBModalFooter>
          </CBModal>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
