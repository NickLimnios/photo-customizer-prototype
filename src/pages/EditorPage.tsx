import { useEffect, useMemo, useState } from "react";
import type { DragEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ImagePlus,
  Save,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCart, calculateUnitPrice } from "@/lib/cart";
import { toast } from "sonner";

type Upload = { id: string; src: string };

type LayoutType = "one" | "two" | "three";

type Sticker = { id: string; emoji: string; x: number; y: number };

type Page = {
  id: number;
  layout: LayoutType;
  slots: Record<string, string | null>; // slotId -> uploadId
  caption: string;
  stickers: Sticker[];
};

type Draft = {
  uploads: Upload[];
  pages: Page[];
  active: number;
  style: "classic" | "minimal" | "playful";
  font: "inter" | "playfair";
  title: string;
  size: "8x8" | "10x10" | "A4";
  paper: "Matte" | "Glossy";
  qty: number;
};

const DRAFT_KEY = "photobook-draft-v1";

const initialPages = (count: number): Page[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: i,
    layout: (i % 3 === 0 ? "one" : i % 3 === 1 ? "two" : "three") as LayoutType,
    slots: { a: null, b: null, c: null },
    caption: "",
    stickers: [],
  }));

function uid() {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID)
    return (crypto as any).randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function EditorPage() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [pages, setPages] = useState<Page[]>(() => initialPages(8));
  const [active, setActive] = useState(0);
  const [style, setStyle] = useState<Draft["style"]>("minimal");
  const [font, setFont] = useState<Draft["font"]>("inter");
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState<string>("My Photobook");
  const [size, setSize] = useState<Draft["size"]>("8x8");
  const [paper, setPaper] = useState<Draft["paper"]>("Matte");
  const [qty, setQty] = useState<number>(1);
  const stickersPalette = ["🌸", "⭐️", "🎉", "❤️", "📌", "✨"];

  // Load draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Draft;
      setUploads(draft.uploads ?? []);
      setPages(draft.pages?.length ? draft.pages : initialPages(8));
      setActive(Math.min(draft.active ?? 0, (draft.pages?.length || 1) - 1));
      setStyle(draft.style ?? "minimal");
      setFont(draft.font ?? "inter");
      setTitle(draft.title ?? "My Photobook");
      setSize(draft.size ?? "8x8");
      setPaper(draft.paper ?? "Matte");
      setQty(draft.qty ?? 1);
    } catch {}
  }, []);

  const saveDraft = () => {
    const draft: Draft = {
      uploads,
      pages,
      active,
      style,
      font,
      title,
      size,
      paper,
      qty,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Upload[] = [];
    for (const file of Array.from(files)) {
      const id = uid();
      const src = URL.createObjectURL(file);
      next.push({ id, src });
    }
    setUploads((u) => [...next, ...u]);
  };

  const activePage = pages[active];

  const setLayout = (layout: LayoutType) => {
    setPages((p) => p.map((pg, i) => (i === active ? { ...pg, layout } : pg)));
  };

  const setCaption = (v: string) => {
    setPages((p) =>
      p.map((pg, i) => (i === active ? { ...pg, caption: v } : pg)),
    );
  };

  const addSticker = (emoji: string) => {
    setPages((p) =>
      p.map((pg, i) =>
        i === active
          ? {
              ...pg,
              stickers: [
                ...pg.stickers,
                {
                  id: uid(),
                  emoji,
                  x: 50 + Math.random() * 100,
                  y: 50 + Math.random() * 80,
                },
              ],
            }
          : pg,
      ),
    );
  };

  const removeUpload = (id: string) => {
    setUploads((u) => u.filter((x) => x.id !== id));
    setPages((p) =>
      p.map((pg) => {
        const slots: Record<string, string | null> = {};
        for (const [k, v] of Object.entries(pg.slots))
          slots[k] = v === id ? null : v;
        return { ...pg, slots };
      }),
    );
  };

  const onDropSlot = (slot: string, e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    setPages((p) =>
      p.map((pg, i) =>
        i === active ? { ...pg, slots: { ...pg.slots, [slot]: id } } : pg,
      ),
    );
  };

  const pageBg = useMemo(() => {
    if (style === "classic") return "bg-white";
    if (style === "playful")
      return "bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.12),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_60%)]";
    return "bg-secondary"; // minimal
  }, [style]);

  const pageFont = font === "playfair" ? "font-serif" : "font-sans";

  const changePages = (count: number) => {
    setPages((p) => {
      if (count === p.length) return p;
      if (count > p.length)
        return [
          ...p,
          ...initialPages(count - p.length).map((x, i) => ({
            ...x,
            id: p.length + i,
          })),
        ];
      const trimmed = p.slice(0, count);
      if (active >= count) setActive(count - 1);
      return trimmed;
    });
  };

  return (
    <div className="container max-w-7xl py-8">
      {/* Top controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActive((a) => Math.max(0, a - 1))}
          >
            <ChevronLeft className="mr-2" /> Prev
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {active + 1} / {pages.length}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActive((a) => Math.min(pages.length - 1, a + 1))}
          >
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setPreview((p) => !p)}>
            {preview ? (
              <>
                <EyeOff className="mr-2" /> Exit preview
              </>
            ) : (
              <>
                <Eye className="mr-2" /> Preview
              </>
            )}
          </Button>
          <Button variant="secondary" onClick={saveDraft}>
            <Save className="mr-2" /> Save draft
          </Button>
          <Button
            onClick={() => {
              const cover = (() => {
                const all = pages
                  .flatMap((pg) => Object.values(pg.slots))
                  .filter(Boolean) as string[];
                const first = all[0];
                if (first) {
                  const u = uploads.find((x) => x.id === first);
                  if (u) return u.src;
                }
                return "/placeholder.svg";
              })();
              const unitPrice = calculateUnitPrice(pages.length, size, paper);
              addToCart({
                title: title || "My Photobook",
                cover,
                pages: pages.length,
                style,
                size,
                paper,
                qty,
                unitPrice,
              });
              toast.success("Added to cart", {
                description: `${qty} × ${title}`,
              });
              navigate("/cart");
            }}
          >
            <ShoppingCart className="mr-2" /> Add to cart
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-6",
          preview ? "grid-cols-1" : "lg:grid-cols-12",
        )}
      >
        {!preview && (
          <aside className="lg:col-span-4 space-y-6">
            <Card className="p-4 space-y-3">
              <div className="font-semibold">Project</div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Photobook title"
              />
            </Card>

            <Card className="p-4">
              <div className="mb-3 font-semibold">Uploads</div>
              <label className="flex items-center justify-center rounded-md border border-dashed py-8 text-sm text-muted-foreground hover:bg-accent/50 cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => onFiles(e.target.files)}
                  className="hidden"
                />
                <ImagePlus className="mr-2" /> Upload photos
              </label>
              <div className="mt-4 grid grid-cols-4 gap-2 max-h-48 overflow-auto pr-1">
                {uploads.map((u) => (
                  <div
                    key={u.id}
                    className="group relative aspect-square overflow-hidden rounded border"
                  >
                    <img
                      src={u.src}
                      alt="upload"
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text/plain", u.id)
                      }
                      className="h-full w-full object-cover"
                    />
                    <button
                      className="absolute right-1 top-1 rounded bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => removeUpload(u.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <div className="font-semibold">Layout</div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "one", label: "1" },
                    { id: "two", label: "2" },
                    { id: "three", label: "3" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setLayout(opt.id)}
                    className={cn(
                      "rounded-md border p-3 text-sm hover:bg-accent",
                      activePage.layout === opt.id
                        ? "border-primary"
                        : "border-muted",
                    )}
                  >
                    <div className="mb-2 text-xs text-muted-foreground">
                      {opt.label} image{opt.id !== "one" ? "s" : ""}
                    </div>
                    <div className="grid h-12 w-full grid-cols-2 gap-1 rounded bg-muted p-1">
                      {opt.id === "one" && (
                        <div className="col-span-2 rounded bg-white" />
                      )}
                      {opt.id === "two" && (
                        <>
                          <div className="rounded bg-white" />
                          <div className="rounded bg-white" />
                        </>
                      )}
                      {opt.id === "three" && (
                        <>
                          <div className="rounded bg-white" />
                          <div className="rounded bg-white" />
                          <div
                            className="rounded bg-white col-span-2 h-0.5"
                            style={{ display: "none" }}
                          />
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <div className="font-semibold">Order options</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">Size</div>
                  <Select
                    value={size}
                    onValueChange={(v) => setSize(v as Draft["size"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8x8">8×8 in</SelectItem>
                      <SelectItem value="10x10">10×10 in</SelectItem>
                      <SelectItem value="A4">A4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">
                    Paper
                  </div>
                  <Select
                    value={paper}
                    onValueChange={(v) => setPaper(v as Draft["paper"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Matte">Matte</SelectItem>
                      <SelectItem value="Glossy">Glossy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">
                    Quantity
                  </div>
                  <Select
                    value={String(qty)}
                    onValueChange={(v) => setQty(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="self-end">
                  <div className="text-xs text-muted-foreground">
                    Estimated price
                  </div>
                  <div className="font-semibold">
                    $
                    {(
                      calculateUnitPrice(pages.length, size, paper) / 100
                    ).toFixed(2)}{" "}
                    / book
                  </div>
                </div>
              </div>

              <div className="font-semibold">Style</div>
              <Tabs
                value={style}
                onValueChange={(v) => setStyle(v as Draft["style"])}
              >
                <TabsList>
                  <TabsTrigger value="minimal">Minimal</TabsTrigger>
                  <TabsTrigger value="classic">Classic</TabsTrigger>
                  <TabsTrigger value="playful">Playful</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="font-semibold">Font</div>
              <Select
                value={font}
                onValueChange={(v) => setFont(v as Draft["font"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="playfair">Playfair Display</SelectItem>
                </SelectContent>
              </Select>
              <div className="font-semibold">Pages</div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePages(Math.max(4, pages.length - 2))}
                >
                  -2
                </Button>
                <Badge variant="secondary">{pages.length}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePages(Math.min(40, pages.length + 2))}
                >
                  +2
                </Button>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <div className="font-semibold">Caption</div>
              <Input
                value={activePage.caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a page caption"
              />
            </Card>

            <Card className="p-4">
              <div className="mb-3 font-semibold">Stickers</div>
              <div className="flex flex-wrap gap-2">
                {stickersPalette.map((s) => (
                  <button
                    key={s}
                    onClick={() => addSticker(s)}
                    className="rounded-md border bg-white px-3 py-2 text-xl shadow-sm hover:shadow"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Card>
          </aside>
        )}

        {/* Canvas */}
        <section className={cn(preview ? "col-span-1" : "lg:col-span-8")}>
          <div
            className={cn(
              "relative mx-auto aspect-[4/3] max-w-3xl overflow-hidden rounded-xl border shadow-lg",
              pageBg,
            )}
          >
            <PageCanvas
              page={activePage}
              uploads={uploads}
              font={pageFont}
              onDropSlot={onDropSlot}
            />
          </div>
          {!preview && (
            <div className="mx-auto mt-4 flex max-w-3xl items-center justify-between text-xs text-muted-foreground">
              <div>Drag a photo from uploads into a slot.</div>
              <div>
                Tip: Save draft anytime, changes persist in your browser.
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Thumbnails */}
      <div className="mt-8 overflow-x-auto">
        <div className="flex items-center gap-3">
          {pages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded border bg-secondary",
                active === i
                  ? "ring-2 ring-primary"
                  : "opacity-80 hover:opacity-100",
              )}
            >
              <MiniPage page={p} uploads={uploads} />
              <span className="absolute bottom-1 right-1 rounded bg-black/50 px-1 text-[10px] text-white">
                {i + 1}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageCanvas({
  page,
  uploads,
  font,
  onDropSlot,
}: {
  page: Page;
  uploads: Upload[];
  font: string;
  onDropSlot: (slot: string, e: DragEvent<HTMLDivElement>) => void;
}) {
  const getSrc = (slot: string) =>
    uploads.find((u) => u.id === page.slots[slot])?.src;
  return (
    <div className={cn("relative h-full w-full p-6", font)}>
      <div className="grid h-full w-full grid-cols-2 gap-3">
        {page.layout === "one" && (
          <DropSlot onDrop={(e) => onDropSlot("a", e)}>
            {getSrc("a") && (
              <img
                src={getSrc("a")!}
                className="h-full w-full object-cover"
                alt="slot"
              />
            )}
          </DropSlot>
        )}
        {page.layout === "two" && (
          <>
            <DropSlot onDrop={(e) => onDropSlot("a", e)}>
              {getSrc("a") && (
                <img
                  src={getSrc("a")!}
                  className="h-full w-full object-cover"
                  alt="slot"
                />
              )}
            </DropSlot>
            <DropSlot onDrop={(e) => onDropSlot("b", e)}>
              {getSrc("b") && (
                <img
                  src={getSrc("b")!}
                  className="h-full w-full object-cover"
                  alt="slot"
                />
              )}
            </DropSlot>
          </>
        )}
        {page.layout === "three" && (
          <>
            <DropSlot className="col-span-2" onDrop={(e) => onDropSlot("a", e)}>
              {getSrc("a") && (
                <img
                  src={getSrc("a")!}
                  className="h-full w-full object-cover"
                  alt="slot"
                />
              )}
            </DropSlot>
            <DropSlot onDrop={(e) => onDropSlot("b", e)}>
              {getSrc("b") && (
                <img
                  src={getSrc("b")!}
                  className="h-full w-full object-cover"
                  alt="slot"
                />
              )}
            </DropSlot>
            <DropSlot onDrop={(e) => onDropSlot("c", e)}>
              {getSrc("c") && (
                <img
                  src={getSrc("c")!}
                  className="h-full w-full object-cover"
                  alt="slot"
                />
              )}
            </DropSlot>
          </>
        )}
      </div>
      {page.caption && (
        <div className="pointer-events-none absolute bottom-4 left-6 right-6 text-center text-base font-medium text-foreground/90">
          {page.caption}
        </div>
      )}
      {page.stickers.map((s) => (
        <span
          key={s.id}
          className="absolute select-none"
          style={{ left: s.x, top: s.y }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
}

function DropSlot({
  children,
  onDrop,
  className,
}: {
  children?: ReactNode;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  className?: string;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-white",
        over ? "ring-2 ring-primary" : "",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        setOver(false);
        onDrop(e);
      }}
    >
      {!children && (
        <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
          Drag photo here
        </div>
      )}
      {children}
    </div>
  );
}

function MiniPage({ page, uploads }: { page: Page; uploads: Upload[] }) {
  const getSrc = (slot: string) =>
    uploads.find((u) => u.id === page.slots[slot])?.src;
  return (
    <div className="grid h-full w-full grid-cols-2 gap-0.5 p-0.5">
      {page.layout === "one" && (
        <div className="col-span-2 overflow-hidden rounded bg-white">
          {getSrc("a") && (
            <img
              src={getSrc("a")!}
              className="h-full w-full object-cover"
              alt="slot"
            />
          )}
        </div>
      )}
      {page.layout === "two" && (
        <>
          <div className="overflow-hidden rounded bg-white">
            {getSrc("a") && (
              <img
                src={getSrc("a")!}
                className="h-full w-full object-cover"
                alt="slot"
              />
            )}
          </div>
          <div className="overflow-hidden rounded bg-white">
            {getSrc("b") && (
              <img
                src={getSrc("b")!}
                className="h-full w-full object-cover"
                alt="slot"
              />
            )}
          </div>
        </>
      )}
      {page.layout === "three" && (
        <>
          <div className="col-span-2 overflow-hidden rounded bg-white">
            {getSrc("a") && (
              <img
                src={getSrc("a")!}
                className="h-full w-full object-cover"
                alt="slot"
              />
            )}
          </div>
          <div className="overflow-hidden rounded bg-white">
            {getSrc("b") && (
              <img
                src={getSrc("b")!}
                className="h-full w-full object-cover"
                alt="slot"
              />
            )}
          </div>
          <div className="overflow-hidden rounded bg-white">
            {getSrc("c") && (
              <img
                src={getSrc("c")!}
                className="h-full w-full object-cover"
                alt="slot"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
