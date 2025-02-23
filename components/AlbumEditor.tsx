"use client";

import { useState } from "react";
import { useAlbumStore } from "@/store/albumStore";
import CanvasEditor from "@/components/CanvasEditor";
import { exportAlbumAsPDF, exportAlbumAsZIP } from "@/utils/exportAlbum";
import { useCartStore } from "@/store/cartStore";
import { v4 as uuidv4 } from "uuid";

const AlbumEditor = () => {
  const {
    pages,
    currentPageIndex,
    addPage,
    removePage,
    setCurrentPage,
    changeLayout,
    addImageToSlot,
  } = useAlbumStore();

  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  const currentPage = pages[currentPageIndex];

  const handleImageUpload = (slotId: string) => {
    setEditingSlotId(slotId); // Open CanvasEditor for this slot
  };

  const handleSaveEditedImage = (imageData: string) => {
    if (editingSlotId) {
      addImageToSlot(currentPage.id, editingSlotId, imageData);
      setEditingSlotId(null); // Close CanvasEditor after saving
    }
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddAlbumToCart = () => {
    const albumId = uuidv4();

    addItem({
      id: albumId,
      type: "album",
      albumData: {
        pages,
      },
    });

    alert("Album added to cart!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Photo Album Editor</h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => exportAlbumAsPDF(pages)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Export as PDF
        </button>

        <button
          onClick={() => exportAlbumAsZIP(pages)}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Export as ZIP
        </button>

        <button
          onClick={handleAddAlbumToCart}
          className="px-6 py-2 bg-green-600 text-white rounded"
        >
          Add Album to Cart
        </button>
      </div>

      <div className="mb-4">
        <button
          onClick={() => addPage("2x2")}
          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
        >
          Add 2x2 Page
        </button>

        <button
          onClick={() => addPage("customGrid")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Custom Grid Page
        </button>
      </div>

      <div className="flex gap-4">
        {pages.map((page, idx) => (
          <button
            key={page.id}
            onClick={() => setCurrentPage(idx)}
            className={`px-3 py-1 rounded ${
              idx === currentPageIndex
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Page {idx + 1}
          </button>
        ))}
      </div>

      <div className="mt-6 border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Editing Page</h2>
        <div className="grid grid-cols-2 gap-4">
          {currentPage.imageSlots.map((slot) => (
            <div
              key={slot.id}
              className="w-80 h-80 border-2 border-dashed flex items-center justify-center relative cursor-pointer"
              onClick={() => handleImageUpload(slot.id)}
            >
              {slot.imageData ? (
                <img
                  src={slot.imageData}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Click to Add/Edit Image</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            changeLayout(
              currentPage.id,
              currentPage.layout === "2x2" ? "customGrid" : "2x2"
            )
          }
          className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Change Layout
        </button>

        <button
          onClick={() => removePage(currentPage.id)}
          className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Remove Page
        </button>
      </div>

      {/* CanvasEditor Modal */}
      {editingSlotId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <CanvasEditor
              onSave={handleSaveEditedImage}
              onClose={() => setEditingSlotId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumEditor;
