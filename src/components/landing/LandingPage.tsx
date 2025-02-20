import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Users, Rocket, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Find Your Perfect{" "}
            <span className="text-blue-400">Tech Co-Founder</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Connect with like-minded tech professionals, founders, and mentors.
            Build your next big thing together.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/onboarding")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Smart Matching",
              description:
                "Our AI-powered algorithm finds the perfect co-founder based on your skills, interests, and bio.",
            },
            {
              icon: Target,
              title: "Verified Profiles",
              description:
                "Connect with pre-vetted tech professionals, ensuring quality connections.",
            },
            {
              icon: Rocket,
              title: "Launch Together",
              description:
                "From ideation to execution, find the right partner to build and scale your startup.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700"
            >
              <div className="text-blue-400 mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "1000+", label: "Active Users" },
            { number: "500+", label: "Successful Matches" },
            { number: "50+", label: "Startups Launched" },
            { number: "95%", label: "Match Success Rate" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {stat.number}
              </div>
              <div className="text-slate-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
