import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, RowActions, CBBadge, CBInput, CBModal, CBModalForm, CBSelect, CBTable } from '@/components';
import PageTransition from '@/components/PageTransition/PageTransition';
import { useAdminServices } from '@/hooks/admin/services';
import styles from '@/pages/admin/AdminPage.module.css';

export default function AdminServices() {
  const {
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
  } = useAdminServices();

  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader title="Services" onAdd={openAdd} addLabel="Add Service" />
      <CBTable
        columns={[
          { title: 'Service', dataIndex: 'name', key: 'name' },
          { title: 'Price', dataIndex: 'price', key: 'price' },
          { title: 'Duration', dataIndex: 'duration', key: 'duration' },
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
      <AnimatePresence>
        {modalOpen && (
          <CBModal title={editingId ? 'Edit Service' : 'Add Service'} onClose={closeModal}>
            <CBModalForm onSubmit={handleSubmit} onCancel={closeModal} editing={Boolean(editingId)}>
              <CBInput label="Service Name" name="name" value={form.name} onChange={handleChange} required />
              <CBInput label="Price" name="price" value={form.price} onChange={handleChange} placeholder="$25" required />
              <CBInput label="Duration" name="duration" value={form.duration} onChange={handleChange} placeholder="30 min" required />
              <CBSelect label="Status" name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CBSelect>
            </CBModalForm>
          </CBModal>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
