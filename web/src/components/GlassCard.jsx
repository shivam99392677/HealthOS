import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 hover:border-white/20 transition-colors ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;