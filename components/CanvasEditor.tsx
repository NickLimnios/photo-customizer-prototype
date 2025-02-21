"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { useCartStore } from "@/store/cartStore";
import { v4 as uuidv4 } from "uuid";

const CanvasEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!canvasRef.current) return;

    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#f3f3f3",
    });

    setCanvas(newCanvas);

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

        // Create HTMLImageElement
        const imgElement = new Image();
        imgElement.src = base64Image;

        imgElement.onload = () => {
          // Create fabric.Image from HTMLImageElement
          const fabricImage = new fabric.Image(imgElement, {
            left: 50,
            top: 50,
            scaleX: 0.5,
            scaleY: 0.5,
          });

          newCanvas.add(fabricImage);
          newCanvas.setActiveObject(fabricImage);
          newCanvas.renderAll();
        };

        imgElement.onerror = (err) => {
          console.error("Error loading image:", err);
        };
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    };

    // Attach Event Listener to File Input
    const fileInput = document.getElementById("image-upload");
    fileInput?.addEventListener("change", handleImageUpload);

    return () => {
      newCanvas.dispose();
    };
  }, []);

  const handleAddToCart = () => {
    if (!canvas) return;

    const imageData = canvas.toDataURL();

    addItem({
      id: uuidv4(), // Unique ID for the cart item
      imageData,
    });

    alert("Item added to cart!");
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" id="image-upload" accept="image/*" className="mb-4" />

      <div className="border border-gray-300 shadow-lg rounded-lg p-2 bg-white">
        <canvas ref={canvasRef} className="rounded-md" />
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default CanvasEditor;
