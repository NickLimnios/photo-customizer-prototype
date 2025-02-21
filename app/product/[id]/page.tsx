"use client";

import { useParams } from "next/navigation";
import CanvasEditor from "@/components/CanvasEditor";

const ProductPage = () => {
  const params = useParams();
  const id = decodeURI(params?.id as string);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customize {id}</h1>
      <CanvasEditor />
    </div>
  );
};

export default ProductPage;
