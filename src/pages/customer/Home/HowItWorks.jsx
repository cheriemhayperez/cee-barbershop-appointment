import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn/FadeIn";
import styles from "@/pages/customer/Home/HowItWorks.module.css";

const steps = [
  {
    step: "01",
    title: "Choose a Service",
    desc: "Pick from cuts, shaves, beard trims, and packages.",
  },
  {
    step: "02",
    title: "Pick Date & Time",
    desc: "Select a slot that works for your schedule.",
  },
  {
    step: "03",
    title: "Confirm Booking",
    desc: "Get instant confirmation via email.",
  },
  {
    step: "04",
    title: "Show Up & Relax",
    desc: "Walk in, sit back, and leave looking sharp.",
  },
];

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className={`${styles.section} ${styles.sectionAlt}`}
    >
      <svg
        className={styles.topWave}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,64L48,80C96,96,192,128,288,117.3C384,107,480,53,576,48C672,43,768,85,864,96C960,107,1056,85,1152,69.3C1248,53,1344,43,1392,37.3L1440,32L1440,120L0,120Z" />
      </svg>
      <div className={styles.sectionInner}>
        <FadeIn>
          <p className={styles.eyebrow}>How It Works</p>
          <h2 className={styles.sectionTitle}>Book in 4 easy steps</h2>
        </FadeIn>

        <div className={styles.timeline}>
          <motion.div
            className={styles.lineHorizontal}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className={styles.lineVertical}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.ol
            className={styles.stepsList}
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {steps.map((item) => (
              <motion.li
                key={item.step}
                className={styles.stepItem}
                variants={itemVariants}
              >
                <motion.div className={styles.stepNode} variants={dotVariants}>
                  <span className={styles.stepDot}>{item.step}</span>
                </motion.div>

                <motion.article
                  className={styles.stepCard}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.article>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
