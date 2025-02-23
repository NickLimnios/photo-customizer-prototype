import Link from "next/link";
import Image from "next/image";

const mockProducts = [
  {
    id: 1,
    name: "Photo Book",
    image: "/mock-products/photo-book.jpg",
    path: "/product/album",
  },
  {
    id: 2,
    name: "Custom Mug",
    image: "/mock-products/mug.jpg",
    path: "/product/other/Custom Mug",
  },
  {
    id: 3,
    name: "Canvas Print",
    image: "/mock-products/canvas.jpg",
    path: "/product/other/Canvas Print",
  },
];

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Choose Your Product</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <Link key={product.id} href={`${product.path}`}>
            <div className="border rounded-lg p-4 hover:shadow-lg cursor-pointer">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <h2 className="text-xl mt-2">{product.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
