import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

type LayoutType = "2x2" | "customGrid";

interface ImageSlot {
  id: string;
  imageData?: string; // Base64 or URL
}

interface AlbumPage {
  id: string;
  layout: LayoutType;
  imageSlots: ImageSlot[];
}

interface AlbumState {
  pages: AlbumPage[];
  currentPageIndex: number;
  addPage: (layout: LayoutType) => void;
  removePage: (pageId: string) => void;
  setCurrentPage: (index: number) => void;
  changeLayout: (pageId: string, newLayout: LayoutType) => void;
  addImageToSlot: (pageId: string, slotId: string, imageData: string) => void;
  removeImageFromSlot: (pageId: string, slotId: string) => void;
}

export const useAlbumStore = create<AlbumState>((set) => ({
  pages: [
    {
      id: uuidv4(),
      layout: "2x2",
      imageSlots: Array.from({ length: 4 }, () => ({
        id: uuidv4(),
      })),
    },
  ],
  currentPageIndex: 0,

  // Add a new page with a specific layout
  addPage: (layout) =>
    set((state) => ({
      pages: [
        ...state.pages,
        {
          id: uuidv4(),
          layout,
          imageSlots:
            layout === "2x2"
              ? Array.from({ length: 4 }, () => ({ id: uuidv4() }))
              : [{ id: uuidv4() }, { id: uuidv4() }, { id: uuidv4() }], // Custom grid has 3 slots
        },
      ],
      currentPageIndex: state.pages.length, // Set new page as active
    })),

  // Remove a page
  removePage: (pageId) =>
    set((state) => ({
      pages: state.pages.filter((page) => page.id !== pageId),
      currentPageIndex:
        state.currentPageIndex > 0 ? state.currentPageIndex - 1 : 0,
    })),

  // Set current page index
  setCurrentPage: (index) =>
    set(() => ({
      currentPageIndex: index,
    })),

  // Change layout of a specific page
  changeLayout: (pageId, newLayout) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              layout: newLayout,
              imageSlots:
                newLayout === "2x2"
                  ? Array.from({ length: 4 }, () => ({ id: uuidv4() }))
                  : [{ id: uuidv4() }, { id: uuidv4() }, { id: uuidv4() }],
            }
          : page
      ),
    })),

  // Add image to a specific slot
  addImageToSlot: (pageId, slotId, imageData) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              imageSlots: page.imageSlots.map((slot) =>
                slot.id === slotId ? { ...slot, imageData } : slot
              ),
            }
          : page
      ),
    })),

  // Remove image from a specific slot
  removeImageFromSlot: (pageId, slotId) =>
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              imageSlots: page.imageSlots.map((slot) =>
                slot.id === slotId ? { ...slot, imageData: undefined } : slot
              ),
            }
          : page
      ),
    })),
}));
