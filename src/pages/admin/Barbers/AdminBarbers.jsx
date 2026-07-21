import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, CardActions, CBBadge, CBInput, CBModal, CBModalForm, CBSelect, CBCard } from '@/components';
import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import { useAdminBarbers } from '@/hooks/admin/barbers';
import styles from '@/pages/admin/AdminPage.module.css';

export default function AdminBarbers() {
  const {
    barbers,
    modalOpen,
    editingId,
    form,
    openAdd,
    openEdit,
    closeModal,
    handleDelete,
    handleSubmit,
    handleChange,
  } = useAdminBarbers();

  return (
    <PageTransition className={styles.page}>
      <AdminPageHeader title="Barbers" onAdd={openAdd} addLabel="Add Barber" />

      <div className={styles.grid}>
        {barbers.map((barber, index) => (
          <FadeIn key={barber.id} delay={index * 0.08}>
            <CBCard key={barber.id} className={styles.barberCard}>
              <img src={barber.photo} alt={barber.name} className={styles.avatar} />
              <h3>{barber.name}</h3>
              <p className={styles.meta}>{barber.role} · {barber.exp}</p>
              <p className={styles.desc}>{barber.specialty}</p>
              <CBBadge variant={barber.status === 'active' ? 'success' : 'neutral'}>{barber.status}</CBBadge>
              <CardActions onEdit={() => openEdit(barber)} onDelete={() => handleDelete(barber.id, barber.name)} />
            </CBCard>
          </FadeIn>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <CBModal title={editingId ? 'Edit Barber' : 'Add Barber'} onClose={closeModal}>
            <CBModalForm onSubmit={handleSubmit} onCancel={closeModal} editing={Boolean(editingId)}>
              <CBInput label="Name" name="name" value={form.name} onChange={handleChange} required />
              <CBInput label="Role" name="role" value={form.role} onChange={handleChange} required />
              <CBInput label="Experience" name="exp" value={form.exp} onChange={handleChange} placeholder="5 yrs" required />
              <CBInput label="Specialty" name="specialty" value={form.specialty} onChange={handleChange} required />
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
