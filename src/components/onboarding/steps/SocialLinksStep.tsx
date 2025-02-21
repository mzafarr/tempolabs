import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Globe, Github, Linkedin, Twitter, Youtube, Instagram, Link } from "lucide-react";
import React from "react";

interface SocialLinksStepProps {
  data: {
    websiteUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    tiktokUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    otherUrl?: string;
  };
  updateData: (field: string, value: any) => void;
}

interface SocialLink {
  name: string;
  icon: React.ComponentType;
  field: string;
  placeholder: string;
}

export default function SocialLinksStep({ data, updateData }: SocialLinksStepProps) {
  const socialLinks: SocialLink[] = [
    {
      name: "Website",
      icon: Globe,
      field: "websiteUrl",
      placeholder: "https://your-website.com",
    },
    {
      name: "GitHub",
      icon: Github,
      field: "githubUrl",
      placeholder: "https://github.com/username",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      field: "linkedinUrl",
      placeholder: "https://linkedin.com/in/profile",
    },
    {
      name: "Twitter",
      icon: Twitter,
      field: "twitterUrl",
      placeholder: "https://twitter.com/username",
    },
    {
      name: "Instagram",
      icon: Instagram,
      field: "instagramUrl",
      placeholder: "https://instagram.com/username",
    },
    {
      name: "YouTube",
      icon: Youtube,
      field: "youtubeUrl",
      placeholder: "https://youtube.com/@channel",
    },
    {
      name: "Other",
      icon: Link,
      field: "otherUrl",
      placeholder: "https://other-platform.com/profile",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Add your social links 🔗</h2>
        <p className="text-gray-600">
          Help others connect with you across different platforms
        </p>
      </div>

      <div className="space-y-4">
        {socialLinks.map((social) => (
          <div key={social.field} className="flex items-center space-x-2">
              {/* @ts-ignore */}
              <social.icon className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <Input
                type="url"
                placeholder={social.placeholder}
                value={data[social.field as keyof typeof data] || ""}
                onChange={(e) => updateData(social.field, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
