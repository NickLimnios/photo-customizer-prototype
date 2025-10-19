import PageLayout from "../Layout/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InfoPageProps {
  title: string;
  description: string;
  bullets: string[];
}

const InfoPage = ({ title, description, bullets }: InfoPageProps) => (
  <PageLayout title={title}>
    <Card className="border-muted/60">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-muted-foreground">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </PageLayout>
);

export const AboutPage = () => (
  <InfoPage
    title="About LumiBook"
    description="We build tools that help you transform photos into printed keepsakes."
    bullets={[
      "Premium photobooks shipped worldwide",
      "Professional design tools without the steep learning curve",
      "Secure cloud sync so you can return to any project",
    ]}
  />
);

export const SupportPage = () => (
  <InfoPage
    title="Support"
    description="Need help with your order or photobook project? Our team is here for you."
    bullets={[
      "Email support available 7 days a week",
      "Step-by-step tutorials for the editor and ordering",
      "Real-time order tracking once your book ships",
    ]}
  />
);

export const PrivacyPage = () => (
  <InfoPage
    title="Privacy policy"
    description="Your photos are private by default and protected with industry-standard encryption."
    bullets={[
      "We only store the assets required to render your projects",
      "You can delete projects and associated media at any time",
      "We never sell or share your personal information with third parties",
    ]}
  />
);
