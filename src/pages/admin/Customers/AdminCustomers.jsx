import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, RowActions, CBInput, CBModal, CBModalForm, CBTable, CBConfirmModal, CBLoader } from '@/components';
import PageTransition from '@/components/PageTransition/PageTransition';
import { useAdminCustomers } from '@/hooks/admin/customers';
import { formatTableDate } from '@/utils/dateUtils';
import styles from '@/pages/admin/AdminPage.module.css';

export default function AdminCustomers() {
  const {
    customers,
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
  } = useAdminCustomers();

  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader title="Customers" onAdd={openAdd} addLabel="Add Customer" />
      <div className={styles.content} aria-busy={deleteLoading}>
        {deleteLoading && (
          <div className={styles.pageOverlay} aria-live="polite">
            <CBLoader label="Deleting" />
          </div>
        )}
        <CBTable
        columns={[
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Email', dataIndex: 'email', key: 'email' },
          { title: 'Phone', dataIndex: 'phone', key: 'phone' },
          { title: 'Visits', dataIndex: 'visits', key: 'visits' },
          { title: 'Last Visit', key: 'lastVisit', render: (_, c) => formatTableDate(c.lastVisit) },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, c) => (
              <RowActions onEdit={() => openEdit(c)} onDelete={() => handleDelete(c.id, c.name)} />
            ),
          },
        ]}
        dataSource={customers}
      />
      </div>
      <AnimatePresence>
        {modalOpen && (
          <CBModal title={editingId ? 'Edit Customer' : 'Add Customer'} onClose={closeModal} loading={isSubmitting}>
            <CBModalForm
              onSubmit={handleSubmit}
              onCancel={closeModal}
              editing={Boolean(editingId)}
              error={syncError}
              loading={isSubmitting}
              loadingLabel={editingId ? 'Updating customer' : 'Adding customer'}
            >
              <CBInput label="Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Smith" error={fieldErrors.name} required />
              <CBInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. john@email.com" error={fieldErrors.email} required />
              <CBInput label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. (555) 123-4567" error={fieldErrors.phone} required />
            </CBModalForm>
          </CBModal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteConfirmOpen && (
          <CBConfirmModal
            title="Delete customer"
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
