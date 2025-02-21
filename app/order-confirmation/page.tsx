import Link from "next/link";

const OrderConfirmation = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p>Your customized products will be processed shortly.</p>

      <Link
        href="/"
        className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default OrderConfirmation;
