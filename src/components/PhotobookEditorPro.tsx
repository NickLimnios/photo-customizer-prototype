import React, { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, FabricImage, Rect, Textbox } from "fabric";
import { v4 as uuidv4 } from "uuid";
import type { FabricObject } from "fabric";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ImagePlus,
  Save,
  Trash2,
  Undo2,
  Redo2,
  FilePlus2,
  Copy,
  RotateCcw,
  RotateCw,
} from "lucide-react";

/**
 * PhotobookEditorPro (Fabric v6 compatible)
 * - Multi-page spreads (add/duplicate/delete)
 * - Layout frames (masked drop zones)
 * - Drag & drop images into frames (cover/contain fit)
 * - Image edit mode: pan/zoom inside frame
 * - Text boxes
 * - Background color + guides
 * - Undo/Redo
 * - Save/Load (localStorage)
 * - Export PNG
 */

// ---------- Types ----------
export type LayoutOption =
  | "no-placeholders"
  | "one-placeholder"
  | "two-placeholders"
  | "three-placeholders"
  | "four-placeholders";

type UploadedImage = { id: string; url: string; name?: string };

type FrameMeta = {
  id: string;
  type: "frame";
  fit: "cover" | "contain";
};

type Page = {
  id: string;
  name: string;
  json: unknown | null; // fabric JSON for this page/spread
  layout: LayoutOption;
  bg: string;
};

// ---------- Helpers ----------
const STORAGE_KEY = "photobook.project.v1";

function coverFitScale(
  imgW: number,
  imgH: number,
  frameW: number,
  frameH: number
) {
  return Math.max(frameW / imgW, frameH / imgH);
}
function containFitScale(
  imgW: number,
  imgH: number,
  frameW: number,
  frameH: number
) {
  return Math.min(frameW / imgW, frameH / imgH);
}

function isFrame(obj: unknown): obj is Rect & {
  data?: { _frame?: { type: string; fit: "cover" | "contain" } };
} {
  return Boolean((obj as any)?.data?._frame?.type === "frame");
}

// ---------- Component ----------
export default function PhotobookEditorPro() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas>();
  const [size, setSize] = useState({ width: 900, height: 600 });

  // Project State
  const [pages, setPages] = useState<Page[]>(() => [
    {
      id: uuidv4(),
      name: "Page 1",
      json: null,
      layout: "one-placeholder",
      bg: "#ffffff",
    },
  ]);
  const [pageIndex, setPageIndex] = useState(0);
  const currentPage = pages[pageIndex];

  // Assets
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadStatus, setUploadStatus] = useState({
    total: 0,
    current: 0,
    visible: false,
  });

  // UI State
  const [layout, setLayout] = useState<LayoutOption>("one-placeholder");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [showGuides, setShowGuides] = useState(true);
  const [editImageMode, setEditImageMode] = useState(false);

  // Undo/Redo
  const undoStack = useRef<unknown[]>([]);
  const redoStack = useRef<unknown[]>([]);

  // ---------- Effects: Canvas init & resize ----------
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = Math.round((w * 2) / 3);
        setSize({ width: w, height: h });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const c = new Canvas(canvasRef.current, {
        width: size.width,
        height: size.height,
        backgroundColor: bgColor,
        preserveObjectStacking: true,
        selection: true,
      });
      setCanvas(c);
    }
    // include bgColor so first init matches state
  }, [canvas, size.width, size.height, bgColor]);

  useEffect(() => {
    if (canvas) {
      canvas.setWidth(size.width);
      canvas.setHeight(size.height);
      canvas.requestRenderAll();
    }
  }, [size, canvas]);

  // ---------- Page load/save handling ----------
  const saveCanvasToPage = useCallback(() => {
    if (!canvas) return;
    const json = canvas.toJSON();
    setPages((prev) =>
      prev.map((p, i) =>
        i === pageIndex ? { ...p, json, layout, bg: bgColor } : p
      )
    );
  }, [canvas, pageIndex, layout, bgColor]);

  const pushUndo = useCallback(() => {
    if (!canvas) return;
    const snapshot = canvas.toJSON();
    undoStack.current.push(snapshot);
    redoStack.current = [];
  }, [canvas]);

  const loadPageToCanvas = useCallback(
    async (p: Page) => {
      if (!canvas) return;
      canvas.clear();
      canvas.backgroundColor = p.bg || "#ffffff";
      setBgColor(p.bg || "#ffffff");

      if (p.json) {
        await canvas.loadFromJSON(p.json as object);
        canvas.getObjects().forEach((o: any) => {
          if (isFrame(o) && (o as any).clipPath) {
            (o as any).clipPath = undefined;
          }
        });
        canvas.renderAll();
      } else {
        // use the page's own layout when there is no JSON
        buildLayoutFrames(canvas, p.layout || "one-placeholder");
      }
      pushUndo();
    },
    [canvas, pushUndo]
  );

  useEffect(() => {
    if (!canvas) return;
    // when switching pages, sync the UI layout with the page’s saved layout
    setLayout(currentPage.layout);
    loadPageToCanvas(currentPage);
  }, [canvas, currentPage, loadPageToCanvas]);

  // ---------- Undo/Redo ----------
  const undo = useCallback(async () => {
    if (!canvas) return;
    if (undoStack.current.length <= 1) return;
    const current = undoStack.current.pop();
    redoStack.current.push(current as unknown);
    const prev = undoStack.current[undoStack.current.length - 1];
    await canvas.loadFromJSON(prev as object);
    canvas.renderAll();
  }, [canvas]);

  const redo = useCallback(async () => {
    if (!canvas) return;
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push(next);
    await canvas.loadFromJSON(next as object);
    canvas.renderAll();
  }, [canvas]);

  // ---------- Guides ----------
  const drawGuides = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const w = size.width;
      const h = size.height;
      const bleed = Math.round(Math.min(w, h) * 0.02);
      const margin = Math.round(Math.min(w, h) * 0.05);

      ctx.save();
      ctx.strokeStyle = "#e5e7eb";
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);

      ctx.strokeStyle = "#94a3b8";
      ctx.setLineDash([2, 4]);
      ctx.strokeRect(bleed, bleed, w - bleed * 2, h - bleed * 2);
      ctx.restore();
    },
    [size.width, size.height]
  );

  useEffect(() => {
    if (!canvas) return;
    const onAfter = () => {
      if (!showGuides) return;
      const ctx = (canvas as any).contextTop as
        | CanvasRenderingContext2D
        | undefined;
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
      drawGuides(ctx);
    };
    canvas.on("after:render", onAfter);
    canvas.renderAll();
    return () => {
      canvas.off("after:render", onAfter);
    };
  }, [canvas, showGuides, drawGuides]);

  // ---------- Layout frames ----------
  const removeAllFramesAndClips = (c: Canvas) => {
    // 1) strip clipPaths from existing images
    c.getObjects().forEach((o: any) => {
      if (o.type === "image" && o.clipPath) {
        o.clipPath = undefined;
      }
    });

    // 2) remove previous frame rects
    const frames = c.getObjects().filter(isFrame);
    frames.forEach((f) => c.remove(f));
  };

  const rebuildLayout = useCallback(() => {
    if (!canvas) return;

    // don't clear whole canvas—preserve images/text
    removeAllFramesAndClips(canvas);

    canvas.backgroundColor = bgColor;
    buildLayoutFrames(canvas, layout);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    pushUndo();
  }, [canvas, layout, bgColor, pushUndo]);

  useEffect(() => {
    rebuildLayout();
  }, [rebuildLayout]);

  // ---------- Image upload & tray ----------
  const handleAddImages = (files: FileList) => {
    const total = files.length;
    if (total === 0) return;
    setUploadStatus({ total, current: 0, visible: true });

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        const id = uuidv4();
        setImages((prev) => [...prev, { id, url, name: file.name }]);
        setUploadStatus((prev) => ({ ...prev, current: prev.current + 1 }));
        if (index === total - 1) {
          setTimeout(
            () => setUploadStatus({ total: 0, current: 0, visible: false }),
            300
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onDragStart = (e: React.DragEvent<HTMLImageElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const findFrameAtPoint = useCallback(
    (x: number, y: number) => {
      if (!canvas) return undefined;
      const frames = canvas.getObjects().filter(isFrame) as Rect[];

      return frames.find((ph) => {
        // Use transformed/absolute bounding rect
        const b = ph.getBoundingRect();
        return (
          x >= b.left &&
          x <= b.left + b.width &&
          y >= b.top &&
          y <= b.top + b.height
        );
      }) as (Rect & { data?: { _frame?: FrameMeta } }) | undefined;
    },
    [canvas]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!canvas) return;

    const id = e.dataTransfer?.getData("text/plain");
    const img = images.find((i) => i.id === id);
    if (!img) return;

    // 1) Translate browser event => Fabric coordinates (handles DPR/zoom)
    const { x, y } = canvas.getPointer(e.nativeEvent as unknown as MouseEvent);

    const frame = findFrameAtPoint(x, y);
    if (!frame) return;

    FabricImage.fromURL(img.url).then((image: FabricImage) => {
      if (!image) return;

      // 2) Use the frame's transformed bounding box for sizing & clipping
      const fb = frame.getBoundingRect();
      const frameW = fb.width;
      const frameH = fb.height;

      const fit = (frame as any).data?._frame?.fit ?? "cover";
      const scale =
        fit === "cover"
          ? coverFitScale(image.width!, image.height!, frameW, frameH)
          : containFitScale(image.width!, image.height!, frameW, frameH);

      image.set({
        left: fb.left + frameW / 2,
        top: fb.top + frameH / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
        selectable: true,
        hasControls: true,
        objectCaching: false, // avoids some clip caching artifacts
      });

      // 3) Absolutely positioned clip in canvas space
      const clip = new Rect({
        left: fb.left,
        top: fb.top,
        width: frameW,
        height: frameH,
        originX: "left",
        originY: "top",
      }) as any;
      clip.absolutePositioned = true;

      (image as any).clipPath = clip;

      image.setControlsVisibility({ mtr: true });
      canvas.add(image);
      canvas.setActiveObject(image);
      image.setCoords();
      canvas.requestRenderAll();
      pushUndo();
    });
  };

  // ---------- Text handling ----------
  const addTextBox = () => {
    if (!canvas) return;
    const tb = new Textbox("Double click to edit", {
      left: size.width / 2,
      top: size.height / 2,
      originX: "center",
      originY: "center",
      fontSize: 24,
      fill: "#111827",
      fontFamily: "Inter, ui-sans-serif, system-ui",
      textAlign: "center",
      editable: true,
    });
    canvas.add(tb);
    canvas.setActiveObject(tb);
    canvas.renderAll();
    pushUndo();
  };

  // ---------- Active object utilities ----------

  const removeActive = useCallback(() => {
    const a = canvas?.getActiveObject() as any;
    if (!canvas || !a) return;
    canvas.remove(a);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    pushUndo();
  }, [canvas, pushUndo]);

  const rotateLeft = useCallback(() => {
    const a = canvas?.getActiveObject() as any;
    if (!canvas || !a) return;
    a.rotate(((a.angle || 0) - 90) % 360);
    canvas.requestRenderAll();
    pushUndo();
  }, [canvas, pushUndo]);

  const rotateRight = useCallback(() => {
    const a = canvas?.getActiveObject() as any;
    if (!canvas || !a) return;
    a.rotate((((a.angle ?? 0) as number) + 90) % 360);
    canvas.requestRenderAll();
    pushUndo();
  }, [canvas, pushUndo]);

  const bringToFront = useCallback(() => {
    if (!canvas) return;
    const obj = canvas.getActiveObject() as FabricObject | undefined;
    if (!obj) return;

    // Fabric object API (present at runtime in v6)
    (obj as any).bringToFront?.();
    canvas.requestRenderAll();
    pushUndo();
  }, [canvas, pushUndo]);

  const sendToBack = useCallback(() => {
    if (!canvas) return;
    const obj = canvas.getActiveObject() as FabricObject | undefined;
    if (!obj) return;

    (obj as any).sendToBack?.();
    canvas.requestRenderAll();
    pushUndo();
  }, [canvas, pushUndo]);

  // Image edit (pan/zoom within frame with wheel/drag when editImageMode)
  useEffect(() => {
    if (!canvas) return;
    const onMouseWheel = (opt: any) => {
      if (!editImageMode) return;
      const a = canvas.getActiveObject() as any;
      if (!a || a.type !== "image") return;
      const delta = opt.e.deltaY;
      const zoom = a.scaleX + (delta > 0 ? -0.05 : 0.05);
      a.scaleX = Math.max(0.05, zoom);
      a.scaleY = Math.max(0.05, zoom);
      canvas.requestRenderAll();
      opt.e.preventDefault();
      opt.e.stopPropagation();
    };
    canvas.on("mouse:wheel", onMouseWheel);
    return () => canvas.off("mouse:wheel", onMouseWheel);
  }, [canvas, editImageMode, pushUndo]);

  // ---------- Export ----------
  const exportPNG = useCallback(() => {
    if (!canvas) return;
    const url = canvas.toDataURL({ multiplier: 1, format: "png", quality: 1 });
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentPage.name.replace(/\s+/g, "_")}.png`;
    a.click();
  }, [canvas, currentPage?.name]);

  // ---------- Save/Load project ----------
  const saveProject = useCallback(() => {
    saveCanvasToPage();
    const payload = { pages };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [pages, saveCanvasToPage]);

  const loadProject = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const payload = JSON.parse(raw);
    if (!payload?.pages) return;
    setPages(payload.pages);
    setPageIndex(0);
  }, []);

  // ---------- Page ops ----------
  const addPage = () => {
    saveCanvasToPage();
    const p: Page = {
      id: uuidv4(),
      name: `Page ${pages.length + 1}`,
      json: null,
      layout: "one-placeholder",
      bg: "#ffffff",
    };
    setPages((prev) => [...prev, p]);
    setPageIndex(pages.length);
  };

  const duplicatePage = () => {
    saveCanvasToPage();
    const cur = pages[pageIndex];
    const dup: Page = {
      id: uuidv4(),
      name: `${cur.name} Copy`,
      json: cur.json,
      layout: cur.layout,
      bg: cur.bg,
    };
    setPages((prev) => {
      const arr = [...prev];
      arr.splice(pageIndex + 1, 0, dup);
      return arr;
    });
    setPageIndex(pageIndex + 1);
  };

  const deletePage = () => {
    if (pages.length === 1) return;
    const nextIndex = Math.max(0, pageIndex - 1);
    setPages((prev) => prev.filter((_, i) => i !== pageIndex));
    setPageIndex(nextIndex);
  };

  // ---------- Keyboard shortcuts ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === "z") {
          e.preventDefault();
          if (e.shiftKey) void redo();
          else void undo();
        }
        if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          void redo();
        }
        if (e.key.toLowerCase() === "s") {
          e.preventDefault();
          saveProject();
        }
        if (e.key.toLowerCase() === "e") {
          e.preventDefault();
          exportPNG();
        }
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        removeActive();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, saveProject, exportPNG, removeActive]);

  // ---------- Render ----------
  return (
    <div className="flex h-full p-4 gap-4">
      {/* Left: Assets panel */}
      <div className="w-56 tablet:w-72 space-y-4">
        <label className="cursor-pointer flex items-center justify-center bg-accent-bluegray text-white rounded px-4 py-2 shadow hover:bg-accent-bluegray/80">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleAddImages(e.target.files)}
            className="hidden"
          />
          <ImagePlus className="mr-2 h-4 w-4" /> Upload Images
        </label>

        <div className="grid grid-cols-2 tablet:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              draggable
              onDragStart={(e) => onDragStart(e, img.id)}
              className="w-full h-24 object-cover border rounded cursor-move"
              title={img.name || ""}
            />
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t">
          <button
            onClick={addTextBox}
            className="w-full border rounded px-3 py-2 bg-surface shadow hover:bg-surface/80"
          >
            Add Text
          </button>
          <button
            onClick={removeActive}
            className="w-full border rounded px-3 py-2 bg-surface shadow flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </button>
          <div className="flex gap-2">
            <button
              onClick={bringToFront}
              className="flex-1 border rounded px-3 py-2 bg-surface shadow"
            >
              Front
            </button>
            <button
              onClick={sendToBack}
              className="flex-1 border rounded px-3 py-2 bg-surface shadow"
            >
              Back
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={rotateLeft}
              className="flex-1 border rounded px-3 py-2 bg-surface shadow flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              90°
            </button>
            <button
              onClick={rotateRight}
              className="flex-1 border rounded px-3 py-2 bg-surface shadow flex items-center justify-center gap-2"
            >
              <RotateCw className="h-4 w-4" />
              90°
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editImageMode}
              onChange={(e) => setEditImageMode(e.target.checked)}
            />{" "}
            Edit image: pan/zoom
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showGuides}
              onChange={(e) => setShowGuides(e.target.checked)}
            />{" "}
            Show guides
          </label>
        </div>
      </div>

      {/* Center: Canvas + toolbar */}
      <div className="flex-1 flex flex-col space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative inline-block">
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value as LayoutOption)}
              className="appearance-none border rounded px-3 py-2 pr-8 bg-surface shadow focus:outline-none focus:ring-2 focus:ring-accent-bluegray"
            >
              <option value="one-placeholder">One Placeholder</option>
              <option value="two-placeholders">Two Placeholders</option>
              <option value="three-placeholders">Three Placeholders</option>
              <option value="four-placeholders">Four Placeholders</option>
              <option value="no-placeholders">No Placeholders</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">BG</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => {
                const color = e.target.value;
                setBgColor(color);
                if (canvas) {
                  canvas.backgroundColor = color;
                  canvas.renderAll();
                  pushUndo();
                }
              }}
            />
          </div>

          <div className="ml-auto flex gap-2">
            <button
              className="border rounded px-3 py-2 bg-surface shadow flex items-center gap-2"
              onClick={undo}
            >
              <Undo2 className="h-4 w-4" />
              Undo
            </button>
            <button
              className="border rounded px-3 py-2 bg-surface shadow flex items-center gap-2"
              onClick={redo}
            >
              <Redo2 className="h-4 w-4" />
              Redo
            </button>
            <button
              className="border rounded px-3 py-2 bg-surface shadow flex items-center gap-2"
              onClick={saveProject}
            >
              <Save className="h-4 w-4" />
              Save
            </button>
            <button
              className="border rounded px-3 py-2 bg-surface shadow"
              onClick={loadProject}
            >
              Load
            </button>
            <button
              className="border rounded px-3 py-2 bg-surface shadow flex items-center gap-2"
              onClick={exportPNG}
            >
              <Download className="h-4 w-4" />
              Export PNG
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            ref={containerRef}
            className="border relative w-full"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <canvas
              ref={canvasRef}
              className="pointer-events-auto w-full h-full"
              tabIndex={0}
            />
          </div>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              saveCanvasToPage();
              setPageIndex(Math.max(0, pageIndex - 1));
            }}
            className="border rounded px-3 py-2 bg-surface shadow flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <div className="text-sm">{currentPage?.name}</div>
          <button
            onClick={() => {
              saveCanvasToPage();
              setPageIndex(Math.min(pages.length - 1, pageIndex + 1));
            }}
            className="border rounded px-3 py-2 bg-surface shadow flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="ml-4 flex gap-2">
            <button
              onClick={addPage}
              className="border rounded px-3 py-2 bg-surface shadow flex items-center gap-2"
            >
              <FilePlus2 className="h-4 w-4" />
              Add Page
            </button>
            <button
              onClick={duplicatePage}
              className="border rounded px-3 py-2 bg-surface shadow flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </button>
            <button
              onClick={deletePage}
              className="border rounded px-3 py-2 bg-surface shadow flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>

          <div className="ml-auto text-sm text-text-secondary">
            Pages: {pages.length}
          </div>
        </div>
      </div>

      {/* Right: contextual help */}
      <div className="w-56 space-y-3">
        <div className="border rounded p-3 bg-surface shadow">
          <div className="font-medium mb-1">Tips</div>
          <ul className="list-disc ml-4 text-sm space-y-1">
            <li>Drag an image into a dashed frame to place it.</li>
            <li>
              Toggle "Edit image" to pan/zoom inside the frame (mouse wheel &
              drag).
            </li>
            <li>Ctrl/Cmd+Z to Undo, Ctrl/Cmd+Shift+Z or +Y to Redo.</li>
            <li>
              Double click a text box to edit. Use the selection handles to
              resize/rotate.
            </li>
          </ul>
        </div>
      </div>

      {uploadStatus.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded px-4 py-3 shadow">
            Uploading {uploadStatus.current} / {uploadStatus.total}...
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Frame builder ----------
function buildLayoutFrames(canvas: Canvas, layout: LayoutOption) {
  const w = canvas.getWidth();
  const h = canvas.getHeight();
  const gap = 10;

  const createFrame = (
    left: number,
    top: number,
    width: number,
    height: number
  ) => {
    const rect = new Rect({
      left,
      top,
      width,
      height,
      fill: "transparent",
      stroke: "#94a3b8",
      strokeDashArray: [6, 4],
      selectable: false,
      evented: false,
    }) as Rect & { data?: any };
    rect.data = { _frame: { id: uuidv4(), type: "frame", fit: "cover" } };
    canvas.add(rect);
  };

  const halfW = (w - 3 * gap) / 2;
  const halfH = (h - 3 * gap) / 2;

  switch (layout) {
    case "one-placeholder":
      createFrame(gap, gap, w - 2 * gap, h - 2 * gap);
      break;
    case "two-placeholders":
      createFrame(gap, gap, halfW, h - 2 * gap);
      createFrame(gap * 2 + halfW, gap, halfW, h - 2 * gap);
      break;
    case "three-placeholders":
      createFrame(gap, gap, halfW, halfH);
      createFrame(gap * 2 + halfW, gap, halfW, halfH);
      createFrame(gap, gap * 2 + halfH, w - 2 * gap, halfH);
      break;
    case "four-placeholders":
      createFrame(gap, gap, halfW, halfH);
      createFrame(gap * 2 + halfW, gap, halfW, halfH);
      createFrame(gap, gap * 2 + halfH, halfW, halfH);
      createFrame(gap * 2 + halfW, gap * 2 + halfH, halfW, halfH);
      break;
    case "no-placeholders":
    default:
      break;
  }

  canvas.requestRenderAll();
}
