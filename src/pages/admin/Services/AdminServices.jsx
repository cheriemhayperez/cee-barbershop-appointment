import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, RowActions, CBBadge, CBInput, CBModal, CBModalForm, CBSelect, CBTable, CBConfirmModal, CBBusyOverlay } from '@/components';
import PageTransition from '@/components/PageTransition/PageTransition';
import { useAdminServices } from '@/hooks/admin';
import {
  getCategoryLabel,
  SERVICE_CATEGORIES,
} from '@/constants';
import styles from '@/pages/admin/shared/AdminPage.module.css';

export default function AdminServices() {
  const {
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
  } = useAdminServices();

  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader title="Services" onAdd={openAdd} addLabel="Add Service" />
      <div className={styles.content} aria-busy={deleteLoading}>
        {deleteLoading && <CBBusyOverlay label="Deleting" />}
        <CBTable
        columns={[
          { title: 'Service', dataIndex: 'name', key: 'name' },
          {
            title: 'Category',
            key: 'category',
            render: (_, s) => getCategoryLabel(s.category),
          },
          { title: 'Price', dataIndex: 'price', key: 'price' },
          {
            title: 'Status',
            key: 'status',
            render: (_, s) => (
              <CBBadge variant={s.status === 'active' ? 'success' : 'neutral'}>{s.status}</CBBadge>
            ),
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, s) => (
              <RowActions onEdit={() => openEdit(s)} onDelete={() => handleDelete(s.id, s.name)} />
            ),
          },
        ]}
        dataSource={services}
      />
      </div>
      <AnimatePresence>
        {modalOpen && (
          <CBModal title={editingId ? 'Edit Service' : 'Add Service'} onClose={closeModal} loading={isSubmitting}>
            <CBModalForm
              onSubmit={handleSubmit}
              onCancel={closeModal}
              editing={Boolean(editingId)}
              error={syncError}
              loading={isSubmitting}
              loadingLabel={editingId ? 'Updating service' : 'Adding service'}
            >
              <CBInput label="Service Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Head Shave" error={fieldErrors.name} required />
              <CBSelect label="Category" name="category" value={form.category} onChange={handleChange} placeholder="Select Category" error={fieldErrors.category} required>
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </CBSelect>
              <CBInput label="Price" name="price" value={form.price} onChange={handleChange} placeholder="e.g. $25" error={fieldErrors.price} required />
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
            title="Delete service"
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
