import { useEffect, useRef, useState } from "react";
import { Canvas, Image as FabricImage, Rect } from "fabric";

export type LayoutOption =
  | "no-placeholders"
  | "one-placeholder"
  | "two-placeholders"
  | "three-placeholders"
  | "four-placeholders";

type UploadedImage = {
  id: string;
  url: string;
};

export default function PhotobookEditor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas>();
  const [layout, setLayout] = useState<LayoutOption>("one-placeholder");
  const [images, setImages] = useState<UploadedImage[]>([]);

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const c = new Canvas(canvasRef.current!, {
        width: 600,
        height: 400,
        backgroundColor: "#fff",
      });
      setCanvas(c);
    }
  }, [canvas]);

  // Update placeholders when layout changes
  useEffect(() => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#fff";

    const placeholders: Rect[] = [];
    const gap = 10;

    const createRect = (left: number, top: number, width: number, height: number) => {
      const r = new Rect({
        left,
        top,
        width,
        height,
        fill: "transparent",
        stroke: "#aaa",
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      });
      placeholders.push(r);
      canvas.add(r);
    };

    const w = canvas.getWidth();
    const h = canvas.getHeight();

    switch (layout) {
      case "one-placeholder":
        createRect(gap, gap, w - 2 * gap, h - 2 * gap);
        break;
      case "two-placeholders":
        createRect(gap, gap, (w - 3 * gap) / 2, h - 2 * gap);
        createRect(gap * 2 + (w - 3 * gap) / 2, gap, (w - 3 * gap) / 2, h - 2 * gap);
        break;
      case "three-placeholders":
        createRect(gap, gap, (w - 3 * gap) / 2, (h - 3 * gap) / 2);
        createRect(gap * 2 + (w - 3 * gap) / 2, gap, (w - 3 * gap) / 2, (h - 3 * gap) / 2);
        createRect(gap, gap * 2 + (h - 3 * gap) / 2, w - 2 * gap, (h - 3 * gap) / 2);
        break;
      case "four-placeholders":
        createRect(gap, gap, (w - 3 * gap) / 2, (h - 3 * gap) / 2);
        createRect(gap * 2 + (w - 3 * gap) / 2, gap, (w - 3 * gap) / 2, (h - 3 * gap) / 2);
        createRect(gap, gap * 2 + (h - 3 * gap) / 2, (w - 3 * gap) / 2, (h - 3 * gap) / 2);
        createRect(gap * 2 + (w - 3 * gap) / 2, gap * 2 + (h - 3 * gap) / 2, (w - 3 * gap) / 2, (h - 3 * gap) / 2);
        break;
      case "no-placeholders":
      default:
        // nothing
        break;
    }

    canvas.renderAll();
  }, [canvas, layout]);

  const handleAddImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      const id = crypto.randomUUID();
      setImages((prev) => [...prev, { id, url }]);
    };
    reader.readAsDataURL(file);
  };

  const onDragStart = (e: React.DragEvent<HTMLImageElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!canvas) return;
    const id = e.dataTransfer.getData("text/plain");
    const img = images.find((i) => i.id === id);
    if (!img) return;

    FabricImage.fromURL(img.url)
      .then((image) => {
        const rect = canvas.upperCanvasEl.getBoundingClientRect();
        const left = e.clientX - rect.left;
        const top = e.clientY - rect.top;
        image.set({
          left,
          top,
          originX: "center",
          originY: "center",
        });
        image.setControlsVisibility({ mtr: true });
        canvas.add(image);
        canvas.setActiveObject(image);
      })
      .catch(() => {
        /* ignore */
      });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 items-center">
        <input type="file" accept="image/*" onChange={(e) => e.target.files && handleAddImage(e.target.files[0])} />
        <select value={layout} onChange={(e) => setLayout(e.target.value as LayoutOption)} className="border p-1">
          <option value="one-placeholder">One Placeholder</option>
          <option value="two-placeholders">Two Placeholders</option>
          <option value="three-placeholders">Three Placeholders</option>
          <option value="four-placeholders">Four Placeholders</option>
          <option value="no-placeholders">No Placeholders</option>
        </select>
      </div>
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            draggable
            onDragStart={(e) => onDragStart(e, img.id)}
            className="h-20 w-20 object-cover border"
          />
        ))}
      </div>
      <div ref={containerRef} onDrop={onDrop} onDragOver={onDragOver}>
        <canvas ref={canvasRef} className="border" />
      </div>
    </div>
  );
}
