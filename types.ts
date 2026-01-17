export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectedItem {
  id: string;
  label: string;
  box_2d: number[]; // [ymin, xmin, ymax, xmax] from Gemini (0-1000 scale)
}

export interface CroppedItem {
  id: string;
  label: string;
  imageUrl: string; // Base64 data URL
  width: number;
  height: number;
}
