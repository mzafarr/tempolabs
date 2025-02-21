import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      <Accordion type="single" collapsible className="w-full space-y-2">
        {techCategories.map((category) => (
          <AccordionItem value={category.name} key={category.name}>
            <AccordionTrigger className="text-left hover:no-underline hover:bg-slate-50 rounded-lg px-4">
              <div className="flex items-center gap-2">
                <span>{category.name}</span>
                {data.interests.some((i) => category.interests.includes(i)) && (
                  <Badge variant="secondary" className="ml-2">
                    {data.interests.filter((i) => category.interests.includes(i)).length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {category.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={data.interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer font-medium text-sm py-1 px-3 rounded-full"
                      onClick={() => {
                        const newInterests = data.interests.includes(interest)
                          ? data.interests.filter((i) => i !== interest)
                          : [...data.interests, interest];
                        updateData("interests", newInterests);
                      }}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
