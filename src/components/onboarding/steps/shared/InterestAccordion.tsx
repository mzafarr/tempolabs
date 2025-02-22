import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// interface Category {
//   name: string;
//   interests: string[];
// }

interface InterestAccordionProps {
  // categories: Category[];
  selectedInterests: string[];
  onInterestToggle: (interest: string) => void;
}

const categories = [
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

export default function InterestAccordion({
  // categories,
  selectedInterests,
  onInterestToggle,
}: InterestAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {categories.map((category) => (
        <AccordionItem value={category.name} key={category.name}>
          <AccordionTrigger className="text-left hover:no-underline hover:bg-slate-50 rounded-lg px-4">
            <div className="flex items-center gap-2">
              <span>{category.name}</span>
              {selectedInterests.some((i) =>
                category.interests.includes(i)
              ) && (
                <Badge
                  variant="secondary"
                  className={`ml-2 bg-primary/10 hover:bg-primary/20 border-primary/5 text-primary font-normal`}
                >
                  {
                    selectedInterests.filter((i) =>
                      category.interests.includes(i)
                    ).length
                  }
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
                    variant={
                      selectedInterests.includes(interest)
                        ? "default"
                        : "outline"
                    }
                    className={`cursor-pointer font-normal text-[13.5px] py-0.5 px-3 ${
                      selectedInterests.includes(interest) &&
                      "bg-primary/10 hover:bg-primary/20 border-primary/5"
                    } text-primary`}
                    onClick={() => onInterestToggle(interest)}
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
  );
}
