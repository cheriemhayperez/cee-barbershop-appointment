import { motion } from 'framer-motion';

export default function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  immediate = false,
}) {
  const transition = { duration, delay, ease: 'easeOut' };
  const motionProps = immediate
    ? {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition,
      }
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition,
      };

  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}
