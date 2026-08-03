import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, RowActions, CBInput, CBModal, CBModalForm, CBSelect, CBTable, CBBadge, CBConfirmModal, CBBusyOverlay, CBBookingSchedule } from '@/components';
import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import { APPOINTMENT_STATUS_BADGE_VARIANTS } from '@/constants';
import { useAdminAppointments } from '@/hooks/admin';
import { formatTableDate } from '@/utils/dateUtils';
import { formatTime12 } from '@/utils/scheduleUtils';
import styles from '@/pages/admin/Appointments/AdminAppointments.module.css';
import adminStyles from '@/pages/admin/shared/AdminPage.module.css';

export default function AdminAppointments() {
  const {
    appointments,
    barbers,
    services,
    modalOpen,
    editingId,
    form,
    fieldErrors,
    syncError,
    openAdd,
    openEdit,
    closeModal,
    handleDelete,
    deleteConfirmOpen,
    deleteTargetName,
    closeDeleteConfirm,
    confirmDelete,
    deleteLoading,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleDateChange,
    handleTimeChange,
  } = useAdminAppointments();

  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader title="Appointments" onAdd={openAdd} addLabel="Add Appointment" />

      <FadeIn delay={0.1}>
        <div className={adminStyles.content} aria-busy={deleteLoading}>
          {deleteLoading && <CBBusyOverlay label="Deleting" />}
          <CBTable
          columns={[
            { title: 'Customer', dataIndex: 'name', key: 'name' },
            { title: 'Service', dataIndex: 'service', key: 'service' },
            { title: 'Barber', dataIndex: 'barber', key: 'barber' },
            { title: 'Date', key: 'date', render: (_, appt) => formatTableDate(appt.date) },
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
        />
        </div>
      </FadeIn>

      <AnimatePresence>
        {modalOpen && (
          <CBModal
            title={editingId ? 'Edit Appointment' : 'Add Appointment'}
            onClose={closeModal}
            loading={isSubmitting}
            width={860}
          >
            <CBModalForm
              onSubmit={handleSubmit}
              onCancel={closeModal}
              editing={Boolean(editingId)}
              error={syncError}
              loading={isSubmitting}
              loadingLabel={editingId ? 'Updating appointment' : 'Adding appointment'}
            >
              <CBInput
                label="Customer Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. John Smith"
                error={fieldErrors.name}
                required
              />
              <CBSelect
                label="Service"
                name="service"
                value={form.service}
                onChange={handleChange}
                placeholder="Select Service"
                error={fieldErrors.service}
                required
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </CBSelect>
              <CBSelect label="Barber" name="barber" value={form.barber} onChange={handleChange} placeholder="Select Barber">
                <option value="No preference">No preference</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </CBSelect>
              <CBBookingSchedule
                variant="admin"
                date={form.date}
                time={form.time}
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
                dateError={fieldErrors.date}
                timeError={fieldErrors.time}
              />
              <CBSelect label="Status" name="status" value={form.status} onChange={handleChange}>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </CBSelect>
            </CBModalForm>
          </CBModal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteConfirmOpen && (
          <CBConfirmModal
            title="Delete appointment"
            itemName={deleteTargetName}
            onCancel={closeDeleteConfirm}
            onConfirm={confirmDelete}
            loading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
