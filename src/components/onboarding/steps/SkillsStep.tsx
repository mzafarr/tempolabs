import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

interface SkillsStepProps {
  data: {
    skills: string[];
  };
  updateData: (field: string, value: any) => void;
}

const skillCategories = {
  "Business/Management": [
    "Project Management",
    "Business Strategy",
    "Finance",
    "Leadership",
    "Operations",
    "Consulting",
  ],
  "Technology/Engineering": [
    "Python",
    "JavaScript",
    "Data Science",
    "AI",
    "Machine Learning",
    "Frontend",
    "Backend",
    "DevOps",
    "No-Code",
    "Automations",
    "Cybersecurity",
    "Cloud Computing",
  ],
  "Content Creator": [
    "Blogging",
    "YouTube",
    "TikTok",
    "Podcasting",
    "Content Strategy",
    "Video Editing",
  ],
  "Design/Product": [
    "UI/UX",
    "Product Development",
    "Graphic Design",
    "User Research",
    "Prototyping",
  ],
  Investor: [
    "Angel Investor",
    "Venture Capitalist",
    "Crowdfunding Expert",
    "Financial Analysis",
  ],
  "Marketing/Sales": [
    "Facebook Ads",
    "Copywriting",
    "Lead Generation",
    "SEO/SEM",
    "Social Media Marketing",
    "Email Marketing",
  ],
};

export default function SkillsStep({ data, updateData }: SkillsStepProps) {
  const [customSkills, setCustomSkills] = useState<{ [key: string]: string }>(
    {},
  );

  const handleSkillToggle = (skill: string) => {
    const newSkills = data.skills.includes(skill)
      ? data.skills.filter((s) => s !== skill)
      : [...data.skills, skill];
    updateData("skills", newSkills);
  };

  const handleAddCustomSkill = (category: string) => {
    if (customSkills[category]?.trim()) {
      const newSkill = `${category}:${customSkills[category].trim()}`;
      if (!data.skills.includes(newSkill)) {
        updateData("skills", [...data.skills, newSkill]);
      }
      setCustomSkills({ ...customSkills, [category]: "" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">What are your skills? 🎯</h2>
        <p className="text-gray-600">Select all that apply</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {Object.entries(skillCategories).map(([category, skills]) => (
          <AccordionItem value={category} key={category}>
            <AccordionTrigger className="text-left hover:no-underline hover:bg-slate-50 rounded-lg px-4">
              <div className="flex items-center gap-2">
                <span>{category}</span>
                {data.skills.some(
                  (s) => s.startsWith(category + ":") || skills.includes(s),
                ) && (
                  <Badge variant="secondary" className="ml-2">
                    {
                      data.skills.filter(
                        (s) =>
                          s.startsWith(category + ":") || skills.includes(s),
                      ).length
                    }
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="pt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant={
                        data.skills.includes(skill) ? "default" : "outline"
                      }
                      className="cursor-pointer text-sm py-1 px-3"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom skill"
                    value={customSkills[category] || ""}
                    onChange={(e) =>
                      setCustomSkills({
                        ...customSkills,
                        [category]: e.target.value,
                      })
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddCustomSkill(category);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleAddCustomSkill(category)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {data.skills.length > 0 && (
        <div className="pt-4">
          <Label>Selected Skills</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.skills.map((skill) => (
              <Badge
                key={skill}
                variant="default"
                className="cursor-pointer text-sm py-1 px-3"
                onClick={() => handleSkillToggle(skill)}
              >
                {skill.includes(":") ? skill.split(":")[1] : skill}
                <button
                  className="ml-2 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSkillToggle(skill);
                  }}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
