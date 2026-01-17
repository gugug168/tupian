import { DetectedItem, CroppedItem } from "../types";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") to get just the base64 string
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const resizeImageFile = (file: File, maxDimension: number = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height *= maxDimension / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width *= maxDimension / height;
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
        }
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as JPEG with 0.85 quality to reduce size but keep details
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
  });
};

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

export const cropItemsFromImage = async (
  imageSrc: string,
  detectedItems: DetectedItem[]
): Promise<CroppedItem[]> => {
  const sourceImage = await loadImage(imageSrc);
  const originalWidth = sourceImage.naturalWidth;
  const originalHeight = sourceImage.naturalHeight;

  const croppedItems: CroppedItem[] = [];

  for (const item of detectedItems) {
    // Gemini returns [ymin, xmin, ymax, xmax] normalized to 1000
    if (!item.box_2d || item.box_2d.length < 4) continue;

    const [ymin, xmin, ymax, xmax] = item.box_2d;

    // Convert normalized coordinates (0-1000) to pixel coordinates
    const pixelY = (ymin / 1000) * originalHeight;
    const pixelX = (xmin / 1000) * originalWidth;
    const pixelBottom = (ymax / 1000) * originalHeight;
    const pixelRight = (xmax / 1000) * originalWidth;

    let width = pixelRight - pixelX;
    let height = pixelBottom - pixelY;

    // Add a tiny bit of padding (optional, helps with tight crops)
    const padding = 5; 
    const sx = Math.max(0, pixelX - padding);
    const sy = Math.max(0, pixelY - padding);
    const sWidth = Math.min(originalWidth - sx, width + (padding * 2));
    const sHeight = Math.min(originalHeight - sy, height + (padding * 2));

    // Safety check for invalid dimensions
    if (sWidth <= 0 || sHeight <= 0) continue;

    const canvas = document.createElement("canvas");
    canvas.width = sWidth;
    canvas.height = sHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        sourceImage,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        sWidth,
        sHeight
      );

      croppedItems.push({
        id: item.id,
        label: item.label,
        imageUrl: canvas.toDataURL("image/png"),
        width: sWidth,
        height: sHeight,
      });
    }
  }

  return croppedItems;
};