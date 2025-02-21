import { motion } from "framer-motion";
import InterestAccordion from "./shared/InterestAccordion";

interface TechInterestsStepProps {
  data: {
    interests: string[];
  };
  updateData: (field: string, value: any) => void;
}

const techCategories = [
  {
    name: "Tech & Innovation 🧠",
    interests: [
      "Generative AI & LLMs 🤖",
      "Data Science & Analytics 📊",
      "AI & Machine Learning 🤖",
      "DevTools & Platforms 🛠️",
      "Mobile Apps & SaaS 📱",
      "No-Code / Low-Code 🔧",
      "Web3 & Blockchain ⛓️",
      "Cloud Computing ☁️",
      "Quantum Computing 🔮",
      "AR/VR 🥽",
      "Robotics & IoT 🤖",
      "Cybersecurity 🔒",
      "Enterprise Software 🏢",
    ]
  },
  {
    name: "Business & Startups 🚀",
    interests: ["Startups & Entrepreneurship 💡", "Business Strategy & Operations 📈", "Growth Hacking & Scaling 📊", "Productivity & Workflow Automation ⚡", "Market Research & Trends 📉", "Sales & Lead Generation 💰", "Partnerships & Networking 🤝", "Finance & Investment 💸"]
  },
  {
    name: "Product & Design 🎨",
    interests: ["UI/UX Design ✨", "Product Management 📦", "Design Systems 🎯"]
  },
  {
    name: "Marketing & Content Creation 📣",
    interests: ["Digital Marketing 💻", "Video Production & Editing 🎥", "Blogging & Writing 📝", "Photography 📸", "Podcasting 🎙️", "SEO 📈", "Social Media Strategy 📱", "Brand Building ✨", "Videos/UGC 🎬"]
  },
  {
    name: "Industry-Focused Interests 🏢",
    interests: ["FinTech 💰", "HealthTech 🏥", "EdTech 🎓", "E-Commerce 🛍️", "CleanTech & Sustainability 🌱", "Gaming & Esports 🎮", "Legal ⚖️", "Healthcare 🏥", "Real Estate 🏠", "SpaceTech 🚀", "Venture Capital 💼", "Private Equity 📈", "Angel Investment 😇", "Asset Management 💹"]
  },
  {
    name: "Social & Lifestyle 🌟",
    interests: ["Social Impact & Nonprofits 🤝", "Mental Health & Wellness 🧘", "Sports & Fitness 🏃", "Arts & Culture 🎨", "Travel & Exploration 🌎", "Food & Culinary 🍳", "Self-Improvement 📚", "Public Speaking 🎤", "Skill-Building 💪"]
  }
];

export default function TechInterestsStep({
  data,
  updateData,
}: TechInterestsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">What excites you? ⚡</h2>
        <p className="text-gray-600">Select your tech interests</p>
      </div>
      <InterestAccordion
        categories={techCategories}
        selectedInterests={data.interests}
        onInterestToggle={(interest) => {
          const newInterests = data.interests.includes(interest)
            ? data.interests.filter((i) => i !== interest)
            : [...data.interests, interest];
          updateData("interests", newInterests);
        }}
      />
    </motion.div>
  );
}
