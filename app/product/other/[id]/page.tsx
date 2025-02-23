"use client";

import { useRef } from "react";
import CanvasEditor from "@/components/CanvasEditor";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { v4 as uuidv4 } from "uuid";
import fabric from "fabric";

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const id = decodeURI(params?.id as string);

  const canvasRef = useRef<fabric.Canvas | null>(null);

  const handleSave = () => {
    if (!canvasRef.current) return;

    const imageData = canvasRef.current.toDataURL();

    addItem({
      id: uuidv4(),
      type: "single",
      imageData,
    });

    alert("Product added to cart!");
  };

  const handleClose = () => {
    router.push("/"); // Navigate back or to a desired page on close
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customize {id}</h1>

      <CanvasEditor canvasRef={canvasRef} />

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-green-600 text-white rounded"
        >
          Add to Cart
        </button>

        <button
          onClick={handleClose}
          className="px-6 py-2 bg-red-600 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
