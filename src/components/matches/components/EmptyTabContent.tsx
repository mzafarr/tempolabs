import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyTabContentProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function EmptyTabContent({
  title,
  description,
  buttonText = "Start Discovering",
  onButtonClick = () => window.location.href = "/discover",
}: EmptyTabContentProps) {
  return (
    <Card className="p-6 text-center">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-500 mb-4">{description}</p>
      <Button onClick={onButtonClick}>{buttonText}</Button>
    </Card>
  );
}