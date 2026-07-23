import PageTransition from '@/components/PageTransition/PageTransition';
import AboutSection from '@/pages/customer/Home/AboutSection';
import styles from '@/pages/customer/CustomerAbout.module.css';

export default function CustomerAbout() {
  return (
    <PageTransition className={styles.page}>
      <AboutSection />
    </PageTransition>
  );
}
