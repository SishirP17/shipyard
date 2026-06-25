"use client";

import { motion } from "framer-motion";

/**
 * Page transition. Wraps every route and re-mounts on navigation, so moving
 * between the home page and case studies gets a smooth fade.
 *
 * Opacity-only on purpose: a transform/filter here would create a containing
 * block and break the fixed top nav. Opacity is safe.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
