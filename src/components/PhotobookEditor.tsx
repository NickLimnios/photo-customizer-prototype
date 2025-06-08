import { useEffect, useRef, useState } from "react";
import { Canvas, FabricImage, Rect } from "fabric";

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
  const [placeholders, setPlaceholders] = useState<Rect[]>([]);

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const c = new Canvas(canvasRef.current, {
        width: 600,
        height: 400,
        backgroundColor: "#fff",
        preserveObjectStacking: true,
      });
      setCanvas(c);
    }
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    const w = canvas.getWidth();
    const h = canvas.getHeight();
    const gap = 10;

    canvas.clear();
    canvas.backgroundColor = "#fff";

    const newPlaceholders: Rect[] = [];

    const createPlaceholder = (
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
        stroke: "#aaa",
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
      });
      canvas.add(rect);
      newPlaceholders.push(rect);
    };

    const halfW = (w - 3 * gap) / 2;
    const halfH = (h - 3 * gap) / 2;

    switch (layout) {
      case "one-placeholder":
        createPlaceholder(gap, gap, w - 2 * gap, h - 2 * gap);
        break;
      case "two-placeholders":
        createPlaceholder(gap, gap, halfW, h - 2 * gap);
        createPlaceholder(gap * 2 + halfW, gap, halfW, h - 2 * gap);
        break;
      case "three-placeholders":
        createPlaceholder(gap, gap, halfW, halfH);
        createPlaceholder(gap * 2 + halfW, gap, halfW, halfH);
        createPlaceholder(gap, gap * 2 + halfH, w - 2 * gap, halfH);
        break;
      case "four-placeholders":
        createPlaceholder(gap, gap, halfW, halfH);
        createPlaceholder(gap * 2 + halfW, gap, halfW, halfH);
        createPlaceholder(gap, gap * 2 + halfH, halfW, halfH);
        createPlaceholder(gap * 2 + halfW, gap * 2 + halfH, halfW, halfH);
        break;
      case "no-placeholders":
      default:
        break;
    }

    setPlaceholders(newPlaceholders);
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
    console.log("Drag start:", id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer?.getData("text/plain");
    const img = images.find((i) => i.id === id);
    if (!img || !canvas || !canvasRef.current) return;

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const dropX = e.clientX - canvasBounds.left;
    const dropY = e.clientY - canvasBounds.top;

    const target = placeholders.find((ph) => {
      const bounds = ph.getBoundingRect();
      return (
        dropX >= bounds.left &&
        dropX <= bounds.left + bounds.width &&
        dropY >= bounds.top &&
        dropY <= bounds.top + bounds.height
      );
    });

    if (!target) {
      console.log("No placeholder under drop point");
      return;
    }

    FabricImage.fromURL(img.url, {}, (image: FabricImage) => {
      if (!image) {
        console.error("Image could not be loaded");
        return;
      }

      const { left, top, width, height } = target;
      const scaleX = width / image.width!;
      const scaleY = height / image.height!;
      const scale = Math.min(scaleX, scaleY);

      image.set({
        left: left + width / 2,
        top: top + height / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
      });

      image.setControlsVisibility({ mtr: true });
      canvas.add(image);

      canvas.setActiveObject(image);
      canvas.renderAll();
    });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex space-x-2 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleAddImage(e.target.files[0])}
          className="border px-2 py-1"
        />
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value as LayoutOption)}
          className="border p-1"
        >
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
            className="h-20 w-20 object-cover border cursor-move"
          />
        ))}
      </div>

      <div
        ref={containerRef}
        className="border inline-block relative"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <canvas ref={canvasRef} className="pointer-events-auto" tabIndex={0} />
      </div>
    </div>
  );
}
