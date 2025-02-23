"use client";

import { useAlbumStore } from "@/store/albumStore";

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

  const currentPage = pages[currentPageIndex];

  const handleImageUpload = (slotId: string) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (f) => {
        const imageData = f.target?.result as string;
        addImageToSlot(currentPage.id, slotId, imageData);
      };
      reader.readAsDataURL(file);
    };

    fileInput.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Photo Album Editor</h1>

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
              className="w-80 h-80 border-2 border-dashed flex items-center justify-center relative"
              onClick={() => handleImageUpload(slot.id)}
            >
              {slot.imageData ? (
                <img
                  src={slot.imageData}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Click to Add Image</span>
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
    </div>
  );
};

export default AlbumEditor;
