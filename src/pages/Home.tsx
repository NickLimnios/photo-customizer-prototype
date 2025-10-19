import { Link } from "react-router-dom";
import {
  Sparkles,
  MousePointerClick,
  LayoutGrid,
  ImagePlus,
  Palette,
  ShoppingCart,
  Eye,
  Save,
  ChevronRight,
} from "lucide-react";

import heroPreview from "../assets/hard-cover-photo-books_2.jpeg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type Template = {
  title: string;
  preview: string;
};

type TemplateGroup = Record<string, Template[]>;

const templates: TemplateGroup = {
  wedding: [
    { title: "Ethereal Blush", preview: "/placeholder.svg" },
    { title: "Gilded Frames", preview: "/placeholder.svg" },
    { title: "Velvet Night", preview: "/placeholder.svg" },
    { title: "Pearl Minimal", preview: "/placeholder.svg" },
  ],
  travel: [
    { title: "Coastal Breeze", preview: "/placeholder.svg" },
    { title: "Desert Sun", preview: "/placeholder.svg" },
    { title: "Urban Lines", preview: "/placeholder.svg" },
    { title: "Forest Path", preview: "/placeholder.svg" },
  ],
  family: [
    { title: "Playful Confetti", preview: "/placeholder.svg" },
    { title: "Pastel Blocks", preview: "/placeholder.svg" },
    { title: "Cloudy Day", preview: "/placeholder.svg" },
    { title: "Home Moments", preview: "/placeholder.svg" },
  ],
  minimal: [
    { title: "Clean Grid", preview: "/placeholder.svg" },
    { title: "Mono Frame", preview: "/placeholder.svg" },
    { title: "Bold Type", preview: "/placeholder.svg" },
    { title: "White Space", preview: "/placeholder.svg" },
  ],
};

function TemplateCard({ title, preview }: Template) {
  return (
    <Link to="/editor" className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-secondary to-accent">
            <img
              src={preview}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <Badge className="bg-white/90 text-slate-900">Template</Badge>
              <span className="text-white drop-shadow font-medium">
                {title}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

const featureList = [
  {
    icon: ImagePlus,
    title: "Upload & arrange",
    description:
      "Import multiple photos at once and place them into layouts with simple drag and drop.",
  },
  {
    icon: Palette,
    title: "Personalize",
    description:
      "Choose styles, fonts, backgrounds and add text and stickers to any page.",
  },
  {
    icon: Eye,
    title: "Preview & order",
    description:
      "Review the final photobook, add to cart, checkout, and track delivery.",
  },
];

const Home = () => (
  <div className="min-h-screen bg-background">
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
      </div>
      <div className="container max-w-6xl py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <Badge className="bg-primary/15 text-primary">New</Badge>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Craft elegant photobooks with effortless drag and drop
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Upload photos, choose layouts, add text and stickers, and preview
              the final result. Save your progress or add to cart and order in
              minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="px-6">
                <Link to="/editor">
                  <Sparkles className="mr-2 h-4 w-4" /> Start a photobook
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-6">
                <Link to="/templates">
                  <LayoutGrid className="mr-2 h-4 w-4" /> Browse templates
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MousePointerClick className="h-4 w-4" /> Drag & drop editor
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" /> Styles & fonts
              </div>
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save for later
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
              <div className="aspect-[4/3] w-full">
                <img
                  src={heroPreview}
                  alt="Photobook preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Sunny Weekend</div>
                  <div className="text-xs text-muted-foreground">
                    12 pages · Glossy
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button asChild size="sm">
                    <Link to="/editor">
                      <ImagePlus className="mr-2 h-4 w-4" /> Continue editing
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/cart">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-t bg-gradient-to-b from-background to-secondary/30">
      <div className="container max-w-6xl py-14 md:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Start from a beautiful template
            </h2>
            <p className="mt-2 text-muted-foreground">
              Pick a style to jumpstart your photobook design. Fully
              customizable.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link to="/templates">
              See all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Tabs defaultValue="wedding">
          <TabsList className="mb-6">
            <TabsTrigger value="wedding">Wedding</TabsTrigger>
            <TabsTrigger value="travel">Travel</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="minimal">Minimal</TabsTrigger>
          </TabsList>
          {Object.entries(templates).map(([key, group]) => (
            <TabsContent key={key} value={key}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {group.map((template) => (
                  <TemplateCard
                    key={`${key}-${template.title}`}
                    title={template.title}
                    preview={template.preview}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>

    <section>
      <div className="container max-w-6xl py-14 md:py-20">
        <h2 className="mb-10 text-2xl font-bold md:text-3xl">
          Design. Preview. Order.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {featureList.map((feature) => (
            <Card key={feature.title} className="border-muted/60">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="mb-1 font-semibold">{feature.title}</div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link to="/editor">
              Start designing now <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
