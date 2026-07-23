import PageTransition from '@/components/PageTransition/PageTransition';
import ContactSection from '@/pages/customer/Home/ContactSection';
import styles from '@/pages/customer/CustomerContact.module.css';

export default function CustomerContact() {
  return (
    <PageTransition className={styles.page}>
      <ContactSection />
    </PageTransition>
  );
}
