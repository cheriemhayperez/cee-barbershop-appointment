import FadeIn from '@/components/FadeIn/FadeIn';
import PageTransition from '@/components/PageTransition/PageTransition';
import ServiceIcon from '@/components/ServiceIcon/ServiceIcon';
import { useCustomerServices } from '@/hooks/customer';
import sectionStyles from '@/pages/customer/shared/SectionLayout.module.css';
import { formatServicePrice } from '@/utils/formatServicePrice';
import styles from '@/pages/customer/Services/CustomerServices.module.css';

export default function CustomerServices() {
  const { categories, hasServices } = useCustomerServices();

  return (
    <PageTransition className={styles.page}>
      <section className={`${sectionStyles.section} ${sectionStyles.sectionLight} ${styles.section}`}>
        <div className={sectionStyles.sectionInner}>
          <FadeIn>
            <p className={sectionStyles.eyebrow}>Services</p>
            <h1 className={sectionStyles.sectionTitle}>Our service menu</h1>
          </FadeIn>

          {hasServices ? (
            <div className={styles.menuPanel}>
              {categories.map((category, index) => (
                <FadeIn key={category.value} delay={index * 0.08}>
                  <div className={styles.menuColumn}>
                    <h2 className={styles.menuHeading}>{category.label}</h2>
                    <ul className={styles.menuList}>
                      {category.services.map((service) => (
                        <li key={service.id ?? service.name} className={styles.menuRow}>
                          <span className={styles.menuIcon}>
                            <ServiceIcon icon={service.icon} size={40} />
                          </span>
                          <div className={styles.menuCopy}>
                            <span className={styles.menuName}>{service.name}</span>
                          </div>
                          <span className={styles.menuDots} aria-hidden="true" />
                          <span className={styles.menuPrice}>
                            {formatServicePrice(service.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              ))}
            </div>
          ) : (
            <FadeIn delay={0.1}>
              <p className={styles.emptyState}>
                Services and pricing will appear here once added in admin.
              </p>
            </FadeIn>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
