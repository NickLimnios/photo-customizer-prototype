import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Define Types for Pages and Image Slots
type ImageSlot = {
  id: string;
  imageData?: string; // Base64 string
};

type AlbumPage = {
  id: string;
  imageSlots: ImageSlot[];
};

/**
 * Export album as PDF
 * @param pages Array of pages with image slots
 */
export const exportAlbumAsPDF = async (pages: AlbumPage[]) => {
  const pdf = new jsPDF("landscape", "pt", "a4");

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    if (!ctx) continue;

    // Draw images on canvas
    for (const slot of page.imageSlots) {
      if (slot.imageData) {
        const img = new Image();
        img.src = slot.imageData;
        await new Promise<void>((resolve) => {
          img.onload = () => {
            ctx.drawImage(
              img,
              Math.random() * 300,
              Math.random() * 300,
              150,
              150
            );
            resolve();
          };
        });
      }
    }

    const imgData = canvas.toDataURL("image/png");
    if (i !== 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 20, 20, 800, 600);
  }

  pdf.save("photo_album.pdf");
};

/**
 * Export album as ZIP
 * @param pages Array of pages with image slots
 */
export const exportAlbumAsZIP = async (pages: AlbumPage[]) => {
  const zip = new JSZip();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    if (!ctx) continue;

    // Draw images on canvas
    for (const slot of page.imageSlots) {
      if (slot.imageData) {
        const img = new Image();
        img.src = slot.imageData;
        await new Promise<void>((resolve) => {
          img.onload = () => {
            ctx.drawImage(
              img,
              Math.random() * 300,
              Math.random() * 300,
              150,
              150
            );
            resolve();
          };
        });
      }
    }

    const imgData = canvas.toDataURL("image/png");
    const imgBlob = await (await fetch(imgData)).blob();
    zip.file(`page-${i + 1}.png`, imgBlob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "photo_album.zip");
};
