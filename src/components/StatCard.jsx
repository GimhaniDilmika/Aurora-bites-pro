import { motion } from "motion/react";

export default function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <motion.div className="statCard" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <span className="statIcon"><Icon size={22} /></span>
      <small>{label}</small>
      <strong>{value}</strong>
      <em>{helper}</em>
    </motion.div>
  );
}
