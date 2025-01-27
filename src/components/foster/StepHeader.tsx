import { motion } from "framer-motion";
import { siteConfig } from "@/config/theme";

export const StepHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
        {siteConfig.name}
      </h1>
      <p className="text-xl text-muted-foreground">
        {siteConfig.description}
      </p>
    </motion.div>
  );
};