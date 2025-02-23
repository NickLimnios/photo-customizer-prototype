"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

const CanvasEditor = ({
  onSave,
  onClose,
  canvasRef: externalCanvasRef, //Optional external canvas ref
}: {
  onSave?: (imageData: string) => void;
  onClose?: () => void;
  canvasRef?: React.MutableRefObject<fabric.Canvas | null>;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "#f3f3f3",
    });

    setCanvas(newCanvas);

    if (externalCanvasRef) {
      externalCanvasRef.current = newCanvas;
    }

    const handleImageUpload = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) {
        console.error("No file selected");
        return;
      }

      const reader = new FileReader();

      reader.onload = (f) => {
        const base64Image = f.target?.result as string;

        const imgElement = new Image();
        imgElement.src = base64Image;

        imgElement.onload = () => {
          const fabricImage = new fabric.Image(imgElement, {
            left: 100,
            top: 100,
            scaleX: 0.5,
            scaleY: 0.5,
            selectable: true,
          });

          newCanvas.add(fabricImage);
          newCanvas.setActiveObject(fabricImage);
          newCanvas.renderAll();
        };
      };

      reader.readAsDataURL(file);
    };

    const fileInput = document.getElementById("image-upload");
    fileInput?.addEventListener("change", handleImageUpload);

    return () => {
      newCanvas.dispose();
    };
  }, []);

  const handleSave = () => {
    const activeCanvas = externalCanvasRef?.current || canvas;
    if (!activeCanvas) {
      console.log("No canvas available for saving.");
      return;
    }

    const imageData = activeCanvas.toDataURL();
    if (onSave) {
      onSave(imageData);
    } else {
      console.log("Save action triggered but no onSave handler provided.");
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      console.log("Close action triggered but no onClose handler provided.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" id="image-upload" accept="image/*" className="mb-4" />

      <div className="border border-gray-300 shadow-lg rounded-lg p-2 bg-white">
        <canvas ref={canvasRef} className="rounded-md" />
      </div>

      {/* Conditionally render Save/Cancel buttons if handlers are provided */}
      {(onSave || onClose) && (
        <div className="flex gap-4 mt-4">
          {onSave && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
          )}
          {onClose && (
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-red-600 text-white rounded"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;
