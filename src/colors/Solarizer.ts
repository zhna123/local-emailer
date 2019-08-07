import Colr from "colr";

export interface HexColorMap {
  yellow: string;
  orange: string;
  red: string;
  magenta: string;
  violet: string;
  blue: string;
  cyan: string;
  green: string;
}

export interface HexBaseMap {
  base03: string;
  base02: string;
  base01: string;
  base00: string;
  base0: string;
  base1: string;
  base2: string;
  base3: string;
}

export interface RgbColorMap {
  yellow: [number, number, number];
  orange: [number, number, number];
  red: [number, number, number];
  magenta: [number, number, number];
  violet: [number, number, number];
  blue: [number, number, number];
  cyan: [number, number, number];
  green: [number, number, number];
}

export interface RgbBaseMap {
  base03: [number, number, number];
  base02: [number, number, number];
  base01: [number, number, number];
  base00: [number, number, number];
  base0: [number, number, number];
  base1: [number, number, number];
  base2: [number, number, number];
  base3: [number, number, number];
}

export const hex: HexColorMap & HexBaseMap = {
  base03: "#002b36",
  base02: "#073642",
  base01: "#586e75",
  base00: "#657b83",
  base0: "#839496",
  base1: "#93a1a1",
  base2: "#eee8d5",
  base3: "#fdf6e3",
  yellow: "#b58900",
  orange: "#cb4b16",
  red: "#dc322f",
  magenta: "#d33682",
  violet: "#6c71c4",
  blue: "#268bd2",
  cyan: "#2aa198",
  green: "#859900",
};

export const rgb: RgbColorMap & RgbBaseMap = {
  base03: [0, 43, 54],
  base02: [7, 54, 66],
  base01: [88, 110, 117],
  base00: [101, 123, 131],
  base0: [131, 148, 150],
  base1: [147, 161, 161],
  base2: [238, 232, 213],
  base3: [253, 246, 227],
  yellow: [181, 137, 0],
  orange: [203, 75, 22],
  red: [220, 50, 47],
  magenta: [211, 54, 130],
  violet: [108, 113, 196],
  blue: [38, 139, 210],
  cyan: [42, 161, 152],
  green: [133, 153, 0],
};

export function createBasesFromColor(
  nonBaseColor: [number, number, number],
  correspondingBase: "base03" | "base02" | "base01" | "base00" | "base0" | "base1" | "base2" | "base3",
): RgbBaseMap {
  const baseRgb = rgb[correspondingBase];
  return {
    base03: getRgbDifference(nonBaseColor, getRgbDifference(baseRgb, rgb.base03)),
    base02: getRgbDifference(nonBaseColor, getRgbDifference(baseRgb, rgb.base02)),
    base01: getRgbDifference(nonBaseColor, getRgbDifference(baseRgb, rgb.base01)),
    base00: getRgbDifference(nonBaseColor, getRgbDifference(baseRgb, rgb.base00)),
    base0: getRgbDifference(nonBaseColor, getRgbDifference(baseRgb, rgb.base0)),
    base1: getRgbDifference(nonBaseColor, getRgbDifference(baseRgb, rgb.base1)),
    base2: getRgbDifference(nonBaseColor, getRgbDifference(baseRgb, rgb.base2)),
    base3: getRgbDifference(nonBaseColor, getRgbDifference(baseRgb, rgb.base3)),
  };
}

export function createHexBasesFromColor(
  baseColor: [number, number, number],
  correspondingBase: "base03" | "base02" | "base01" | "base00" | "base0" | "base1" | "base2" | "base3",
): HexBaseMap {
  const rgbMap = createBasesFromColor(baseColor, correspondingBase);
  return {
    base03: Colr.fromRgbArray(rgbMap.base03).toHex(),
    base02: Colr.fromRgbArray(rgbMap.base02).toHex(),
    base01: Colr.fromRgbArray(rgbMap.base01).toHex(),
    base00: Colr.fromRgbArray(rgbMap.base00).toHex(),
    base0: Colr.fromRgbArray(rgbMap.base0).toHex(),
    base1: Colr.fromRgbArray(rgbMap.base1).toHex(),
    base2: Colr.fromRgbArray(rgbMap.base2).toHex(),
    base3: Colr.fromRgbArray(rgbMap.base3).toHex(),
  };
}

export function getRgbDifference(
  originalRgb: [number, number, number],
  targetRgb: [number, number, number],
): [number, number, number] {
  return [
    originalRgb[0] - targetRgb[0],
    originalRgb[1] - targetRgb[1],
    originalRgb[2] - targetRgb[2],
  ];
}
