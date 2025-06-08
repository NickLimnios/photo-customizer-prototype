import { useEffect, useRef, useState } from "react";
import { Canvas, FabricImage, Rect } from "fabric";
import { ChevronDown } from "lucide-react";

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
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [layout, setLayout] = useState<LayoutOption>("one-placeholder");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [placeholders, setPlaceholders] = useState<Rect[]>([]);
  const [uploadStatus, setUploadStatus] = useState({
    total: 0,
    current: 0,
    visible: false,
  });

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
        backgroundColor: "#fff",
        preserveObjectStacking: true,
      });
      setCanvas(c);
    }
  }, [canvas, size]);

  useEffect(() => {
    if (canvas) {
      canvas.setWidth(size.width);
      canvas.setHeight(size.height);
    }
  }, [size, canvas]);

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
  }, [canvas, layout, size]);

  const handleAddImages = (files: FileList) => {
    const total = files.length;
    if (total === 0) return;
    setUploadStatus({ total, current: 0, visible: true });

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        const id = crypto.randomUUID();
        setImages((prev) => [...prev, { id, url }]);
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
      return;
    }

    FabricImage.fromURL(img.url).then((image: FabricImage) => {
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
    <div className="flex h-full p-4 gap-4">
      <div className="w-48 tablet:w-64 space-y-4">
        <label className="cursor-pointer flex items-center justify-center bg-accent-bluegray text-white rounded px-4 py-2 shadow hover:bg-accent-bluegray/80">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleAddImages(e.target.files)}
            className="hidden"
          />
          Upload Images
        </label>

        <div className="grid grid-cols-2 tablet:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              draggable
              onDragStart={(e) => onDragStart(e, img.id)}
              className="w-full h-24 object-cover border rounded cursor-move"
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <div className="relative inline-block self-start">
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value as LayoutOption)}
            className="appearance-none border rounded px-3 py-2 pr-8 bg-surface shadow focus:outline-none focus:ring-2 focus:ring-accent-bluegray w-full"
          >
            <option value="one-placeholder">One Placeholder</option>
            <option value="two-placeholders">Two Placeholders</option>
            <option value="three-placeholders">Three Placeholders</option>
            <option value="four-placeholders">Four Placeholders</option>
            <option value="no-placeholders">No Placeholders</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div
            ref={containerRef}
            className="border relative w-full"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <canvas ref={canvasRef} className="pointer-events-auto w-full h-full" tabIndex={0} />
          </div>
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
