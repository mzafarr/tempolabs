import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ReviewStepProps {
  data: {
    basicInfo: {
      name: string;
      gender?: string;
      age?: string;
      country?: string;
      languages?: string[];
    };
    roles: string[];
    stage: string;
    interests: string[];
    skills: string[];
    lookingFor: string[];
    bio: string;
    photoUrl: string;
    linkedinUrl: string;
  };
}

export default function ReviewStep({ data }: ReviewStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Review your profile ✨</h2>
        <p className="text-gray-600">Make sure everything looks good!</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={
              data.photoUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=default`
            }
            alt={data.basicInfo.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold">{data.basicInfo.name}</h3>
            {data.roles[0] && (
              <Badge variant="secondary" className="mt-1">
                {data.roles[0]}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">About</h4>
            <p className="text-gray-600">{data.bio || "No bio provided"}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest) => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Looking For</h4>
            <div className="flex flex-wrap gap-2">
              {data.lookingFor
                .filter((item) => !item.includes("same_"))
                .map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>

          {data.linkedinUrl && (
            <div>
              <h4 className="font-medium mb-2">LinkedIn</h4>
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Profile
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
