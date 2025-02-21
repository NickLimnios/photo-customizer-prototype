import Link from "next/link";

const Navbar = () => (
  <nav className="bg-gray-800 p-4 text-white">
    <div className="container mx-auto flex justify-between">
      <Link href="/" className="text-xl font-bold">
        PhotoCustomizer
      </Link>
      <div>
        <Link href="/cart" className="mr-4">
          Cart
        </Link>
        <Link href="/checkout">Checkout</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
