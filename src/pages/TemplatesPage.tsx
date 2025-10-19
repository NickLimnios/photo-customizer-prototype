import { Link } from "react-router-dom";
import { LayoutGrid, Sparkles } from "lucide-react";

import PageLayout from "../Layout/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const templates = [
  {
    title: "Ethereal Blush",
    description: "Romantic typography and soft gradients perfect for weddings.",
    category: "Wedding",
  },
  {
    title: "Coastal Breeze",
    description: "A breezy, travel-inspired layout with airy spacing.",
    category: "Travel",
  },
  {
    title: "Playful Confetti",
    description: "Bright colors and rounded frames for family adventures.",
    category: "Family",
  },
  {
    title: "Mono Frame",
    description: "Minimal monochrome accents for artful storytelling.",
    category: "Minimal",
  },
  {
    title: "Velvet Night",
    description: "Deep tones and elegant serif typography for dramatic spreads.",
    category: "Wedding",
  },
  {
    title: "Urban Lines",
    description: "Bold grids and clean sans-serif type for modern albums.",
    category: "Travel",
  },
];

const TemplatesPage = () => (
  <PageLayout title="Start from a beautiful template">
    <p className="text-muted-foreground">
      Choose a layout crafted by our design team and make it yours in the
      editor. Every template is fully customizable.
    </p>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.title} className="overflow-hidden border-muted/60">
          <CardHeader className="p-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-secondary via-accent/50 to-primary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <LayoutGrid className="h-10 w-10 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{template.category}</Badge>
              <CardTitle className="text-xl">{template.title}</CardTitle>
            </div>
            <CardDescription>{template.description}</CardDescription>
          </CardContent>
          <CardFooter className="justify-between border-t bg-muted/40">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              12 - 40 pages
            </span>
            <Button asChild size="sm" variant="outline">
              <Link to="/editor">
                <Sparkles className="mr-2 h-4 w-4" /> Use template
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </PageLayout>
);

export default TemplatesPage;
