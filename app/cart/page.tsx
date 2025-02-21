"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import Image from "next/image";

const base64ToBlob = (base64: string, mimeType = "image/png") => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const [imageURLs, setImageURLs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Convert Base64 to Blob URLs for display
    const urls: { [key: string]: string } = {};
    items.forEach((item) => {
      const blob = base64ToBlob(item.imageData);
      urls[item.id] = URL.createObjectURL(blob);
    });
    setImageURLs(urls);

    // Cleanup Blob URLs when component unmounts
    return () => {
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [items]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 shadow-md relative"
              >
                {imageURLs[item.id] ? (
                  <Image
                    src={imageURLs[item.id]}
                    alt="Customized Product"
                    className="w-full h-48 object-contain"
                    width={300}
                    height={200}
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <p>Loading image...</p>
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded"
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
