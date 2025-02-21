"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

const CheckoutPage = () => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      return;
    }

    setIsProcessing(true);

    // Mock API call delay
    setTimeout(() => {
      clearCart(); // Clear cart after checkout
      setIsProcessing(false);
      router.push("/order-confirmation"); // Redirect to confirmation page
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

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
                <Image
                  src={item.imageData}
                  alt="Customized Product"
                  className="w-full h-48 object-contain"
                  width={300}
                  height={200}
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            className={`mt-6 px-6 py-2 ${
              isProcessing ? "bg-gray-400" : "bg-green-600"
            } text-white rounded`}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
