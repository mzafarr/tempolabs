import { motion } from "framer-motion";

interface CollabPrefsStepProps {
  data: {
    lookingFor: string;
  };
  updateData: (field: string, value: any) => void;
}

export default function CollabPrefsStep({
  data,
  updateData,
}: CollabPrefsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Collaboration Style 🤝</h2>
        <p className="text-gray-600">How do you prefer to work?</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            value: "remote",
            label: "Remote",
            icon: "🌍",
            description: "Work from anywhere",
          },
          {
            value: "hybrid",
            label: "Hybrid",
            icon: "🏢",
            description: "Mix of remote & office",
          },
          {
            value: "in-person",
            label: "In-person",
            icon: "👥",
            description: "Office-based work",
          },
          {
            value: "flexible",
            label: "Flexible",
            icon: "⚡",
            description: "Adapt to team needs",
          },
        ].map((pref) => (
          <motion.div
            key={pref.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              className={`w-full p-4 rounded-lg border-[1.5px] transition-all ${data.lookingFor === pref.value ? "border-primary bg-blue-50" : "border-gray-200 hover:border-blue-200"}`}
              onClick={() => updateData("lookingFor", pref.value)}
            >
              <div className="text-2xl mb-2">{pref.icon}</div>
              <div className="font-medium">{pref.label}</div>
              <div className="text-sm text-gray-500 mt-1">
                {pref.description}
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
