import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, RowActions, CBBadge, CBInput, CBModal, CBModalForm, CBSelect, CBTable } from '@/components';
import PageTransition from '@/components/PageTransition/PageTransition';
import { useAdminServices } from '@/hooks/admin/services';
import {
  getCategoryLabel,
  SERVICE_CATEGORIES,
} from '@/static/customer/serviceCatalog';
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
      <AnimatePresence>
        {modalOpen && (
          <CBModal title={editingId ? 'Edit Service' : 'Add Service'} onClose={closeModal}>
            <CBModalForm onSubmit={handleSubmit} onCancel={closeModal} editing={Boolean(editingId)}>
              <CBInput label="Service Name" name="name" value={form.name} onChange={handleChange} required />
              <CBSelect label="Category" name="category" value={form.category} onChange={handleChange} required>
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </CBSelect>
              <CBInput label="Price" name="price" value={form.price} onChange={handleChange} placeholder="$25" required />
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
