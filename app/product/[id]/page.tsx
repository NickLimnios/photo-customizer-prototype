"use client";

import AlbumEditor from "@/components/AlbumEditor";
import CanvasEditor from "@/components/CanvasEditor";
import { useParams } from "next/navigation";

const ProductPage = () => {
  const params = useParams();
  const id = decodeURI(params?.id as string);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customize {id}</h1>
      {id === "Photo Book" ? <AlbumEditor /> : <CanvasEditor />}
    </div>
  );
};

export default ProductPage;
