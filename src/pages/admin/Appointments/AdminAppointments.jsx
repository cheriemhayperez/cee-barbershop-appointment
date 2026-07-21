import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, RowActions, CBInput, CBModal, CBModalForm, CBSelect, CBTable, CBBadge } from '@/components';
import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import { APPOINTMENT_STATUS_BADGE_VARIANTS } from '@/constants/data/appointments.data';
import { useAdminAppointments } from '@/hooks/admin/appointments';
import { formatTime12 } from '@/utils/scheduleUtils';
import styles from '@/pages/admin/Appointments/AdminAppointments.module.css';

export default function AdminAppointments() {
  const {
    appointments,
    barbers,
    services,
    modalOpen,
    editingId,
    form,
    openAdd,
    openEdit,
    closeModal,
    handleDelete,
    handleSubmit,
    handleChange,
  } = useAdminAppointments();

  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader title="Appointments" onAdd={openAdd} addLabel="Add Appointment" />

      <FadeIn delay={0.1}>
        <CBTable
          columns={[
            { title: 'Customer', dataIndex: 'name', key: 'name' },
            { title: 'Service', dataIndex: 'service', key: 'service' },
            { title: 'Barber', dataIndex: 'barber', key: 'barber' },
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Time', key: 'time', render: (_, appt) => formatTime12(appt.time) },
            {
              title: 'Status',
              key: 'status',
              render: (_, appt) => (
                <CBBadge variant={APPOINTMENT_STATUS_BADGE_VARIANTS[appt.status] ?? 'neutral'}>
                  {appt.status}
                </CBBadge>
              ),
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, appt) => (
                <RowActions
                  onEdit={() => openEdit(appt)}
                  onDelete={() => handleDelete(appt.id, appt.name)}
                />
              ),
            },
          ]}
          dataSource={appointments}
          emptyMessage="No appointments yet. Add one to get started."
        />
      </FadeIn>

      <AnimatePresence>
        {modalOpen && (
          <CBModal
            title={editingId ? 'Edit Appointment' : 'Add Appointment'}
            onClose={closeModal}
          >
            <CBModalForm onSubmit={handleSubmit} onCancel={closeModal} editing={Boolean(editingId)}>
              <CBInput label="Customer Name" name="name" value={form.name} onChange={handleChange} required />
              <CBSelect label="Service" name="service" value={form.service} onChange={handleChange}>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </CBSelect>
              <CBSelect label="Barber" name="barber" value={form.barber} onChange={handleChange}>
                <option>No preference</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </CBSelect>
              <CBInput label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
              <CBInput label="Time" name="time" type="time" value={form.time} onChange={handleChange} required />
              <CBSelect label="Status" name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </CBSelect>
            </CBModalForm>
          </CBModal>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
