import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, RowActions, CBInput, CBModal, CBModalForm, CBTable } from '@/components';
import PageTransition from '@/components/PageTransition/PageTransition';
import { useAdminCustomers } from '@/hooks/admin/customers';
import styles from '@/pages/admin/AdminPage.module.css';

export default function AdminCustomers() {
  const {
    customers,
    modalOpen,
    editingId,
    form,
    openAdd,
    openEdit,
    closeModal,
    handleDelete,
    handleSubmit,
    handleChange,
  } = useAdminCustomers();

  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader title="Customers" onAdd={openAdd} addLabel="Add Customer" />
      <CBTable
        columns={[
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Email', dataIndex: 'email', key: 'email' },
          { title: 'Phone', dataIndex: 'phone', key: 'phone' },
          { title: 'Visits', dataIndex: 'visits', key: 'visits' },
          { title: 'Last Visit', dataIndex: 'lastVisit', key: 'lastVisit' },
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
      <AnimatePresence>
        {modalOpen && (
          <CBModal title={editingId ? 'Edit Customer' : 'Add Customer'} onClose={closeModal}>
            <CBModalForm onSubmit={handleSubmit} onCancel={closeModal} editing={Boolean(editingId)}>
              <CBInput label="Name" name="name" value={form.name} onChange={handleChange} required />
              <CBInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
              <CBInput label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
              <CBInput label="Visits" name="visits" type="number" min="0" value={form.visits} onChange={handleChange} />
              <CBInput label="Last Visit" name="lastVisit" type="date" value={form.lastVisit} onChange={handleChange} />
            </CBModalForm>
          </CBModal>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
