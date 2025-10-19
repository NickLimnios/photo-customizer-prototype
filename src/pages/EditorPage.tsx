import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Download, Save } from "lucide-react";

import PhotobookEditorPro from "../components/PhotobookEditorPro";

const EditorPage = () => (
  <div className="min-h-screen bg-background">
    <section className="border-b bg-muted/40">
      <div className="container max-w-6xl py-10 md:py-14">
        <Badge className="bg-primary/15 text-primary">Editor</Badge>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Design your photobook in minutes
            </h1>
            <p className="text-muted-foreground">
              Drag photos into smart layouts, tweak backgrounds and typography,
              and export a polished photobook ready for print.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground md:items-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-muted px-3 py-1">
              <Save className="h-4 w-4 text-primary" />
              Changes are saved locally inside the editor toolbar.
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-muted px-3 py-1">
              <Download className="h-4 w-4 text-primary" />
              Export options live in the right-hand panel.
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-muted px-3 py-1">
              <Sparkles className="h-4 w-4 text-primary" />
              Templates can be loaded from the home page.
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div className="container max-w-6xl py-8 md:py-12">
        <Card className="overflow-hidden border-muted/60">
          <CardContent className="p-0">
            <div className="h-[70vh] w-full md:h-[75vh]">
              <PhotobookEditorPro />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
);

export default EditorPage;
