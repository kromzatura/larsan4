export type ColorName =
  | "red"
  | "redLight"
  | "amber"
  | "amberLight"
  | "green"
  | "greenLight"
  | "blue"
  | "blueLight"
  | "indigo"
  | "indigoLight"
  | "purple"
  | "purpleLight"
  | "cyan"
  | "cyanLight"
  | "orange"
  | "orangeLight";

export type ColorType = "bg" | "fill";

// Systematic color mapping using a base colors approach
const baseColors = {
  red: { base: "red-500", light: "red-300" },
  amber: { base: "amber-500", light: "amber-300" },
  green: { base: "green-500", light: "green-300" },
  blue: { base: "blue-500", light: "blue-300" },
  indigo: { base: "indigo-500", light: "indigo-300" },
  purple: { base: "purple-500", light: "purple-300" },
  cyan: { base: "cyan-500", light: "cyan-300" },
  orange: { base: "orange-500", light: "orange-300" },
} as const;

// Generate the full color map from base colors
const colorMap: Record<ColorName, string> = Object.entries(baseColors).reduce(
  (acc, [colorName, variants]) => {
    acc[colorName as keyof typeof baseColors] = variants.base;
    acc[`${colorName}Light` as ColorName] = variants.light;
    return acc;
  },
  {} as Record<ColorName, string>
);

export const getColor = ({
  color,
  type = "bg",
}: {
  color: ColorName;
  type?: ColorType;
}): string => {
  const colorValue = colorMap[color];
  const fallbackColor = "slate-500";

  const finalColor = colorValue || fallbackColor;

  return `${type}-${finalColor}`;
};
