import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, RowActions, CBBadge, CBInput, CBModal, CBModalForm, CBSelect, CBTable, CBConfirmModal, CBImageUpload, CBBusyOverlay } from '@/components';
import PageTransition from '@/components/PageTransition/PageTransition';
import { useAdminBarbers } from '@/hooks/admin';
import styles from '@/pages/admin/shared/AdminPage.module.css';

export default function AdminBarbers() {
  const {
    barbers,
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
    handlePhotoChange,
    photoError,
  } = useAdminBarbers();

  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader title="Barbers" onAdd={openAdd} addLabel="Add Barber" />

      <div className={styles.content} aria-busy={deleteLoading}>
        {deleteLoading && <CBBusyOverlay label="Deleting" />}
        <CBTable
          columns={[
            {
              title: 'Photo',
              key: 'photo',
              render: (_, barber) => (
                <img src={barber.photo} alt={barber.name} className={styles.tableAvatar} />
              ),
            },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Role', dataIndex: 'role', key: 'role' },
            { title: 'Experience', dataIndex: 'exp', key: 'exp' },
            { title: 'Specialty', dataIndex: 'specialty', key: 'specialty' },
            {
              title: 'Status',
              key: 'status',
              render: (_, barber) => (
                <CBBadge variant={barber.status === 'active' ? 'success' : 'neutral'}>
                  {barber.status}
                </CBBadge>
              ),
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, barber) => (
                <RowActions
                  onEdit={() => openEdit(barber)}
                  onDelete={() => handleDelete(barber.id, barber.name)}
                />
              ),
            },
          ]}
          dataSource={barbers}
        />
      </div>

      <AnimatePresence>
        {modalOpen && (
          <CBModal title={editingId ? 'Edit Barber' : 'Add Barber'} onClose={closeModal} loading={isSubmitting}>
            <CBModalForm
              onSubmit={handleSubmit}
              onCancel={closeModal}
              editing={Boolean(editingId)}
              error={syncError}
              loading={isSubmitting}
              loadingLabel={editingId ? 'Updating barber' : 'Adding barber'}
            >
              <CBImageUpload
                value={form.photo}
                onChange={handlePhotoChange}
                error={photoError}
              />
              <CBInput label="Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Smith" error={fieldErrors.name} required />
              <CBInput label="Role" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Senior Barber" error={fieldErrors.role} required />
              <CBInput label="Experience" name="exp" value={form.exp} onChange={handleChange} placeholder="e.g. 5 yrs" error={fieldErrors.exp} required />
              <CBInput label="Specialty" name="specialty" value={form.specialty} onChange={handleChange} placeholder="e.g. Fade & Beard Trim" error={fieldErrors.specialty} required />
              <CBSelect label="Status" name="status" value={form.status} onChange={handleChange} placeholder="Select Status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CBSelect>
            </CBModalForm>
          </CBModal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteConfirmOpen && (
          <CBConfirmModal
            title="Delete barber"
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
