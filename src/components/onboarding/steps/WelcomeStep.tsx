import { motion } from "framer-motion";

export default function WelcomeStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <h2 className="text-2xl font-bold">Welcome to Tech Founder Matching</h2>
      <p className="text-gray-600">
        Find your perfect co-founder or mentor match
      </p>
      <img
        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
        alt="Welcome"
        className="rounded-lg w-full h-48 object-cover"
      />
    </motion.div>
  );
}
