import { motion } from "framer-motion";

interface RoleStepProps {
  data: {
    roles: string[];
  };
  updateData: (field: string, value: any) => void;
}

export default function RoleStep({ data, updateData }: RoleStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Choose your Primary Role</h2>
        {/* <p className="text-gray-600">Choose your primary role</p> */}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: "entrepreneur", label: "Entrepreneur", icon: "🚀" },
          { id: "business", label: "Business", icon: "💼" },
          { id: "investor", label: "Investor", icon: "💰" },
          { id: "tech", label: "Technology", icon: "💻" },
          { id: "marketing", label: "Marketing/Sales", icon: "📈" },
          { id: "content", label: "Content Creator", icon: "🎥" },
          { id: "design", label: "Design/Product", icon: "🎨" },
          { id: "student", label: "Tech Enthusiast", icon: "🎓" },
        ].map((role) => (
          <motion.div
            key={role.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                data.roles.includes(role.label)
                  ? "border-primary bg-blue-50"
                  : "border-gray-200 hover:border-blue-200"
              }`}
              onClick={() => updateData("roles", [role.label])}
            >
              <div className="text-2xl mb-2">{role.icon}</div>
              <div className="font-medium">{role.label}</div>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
