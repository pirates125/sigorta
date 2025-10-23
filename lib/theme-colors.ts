export type ThemeColor =
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "gray";

export interface ColorPalette {
  id: ThemeColor;
  name: string;
  emoji: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  gradient: string;
}

export const themeColors: Record<ThemeColor, ColorPalette> = {
  blue: {
    id: "blue",
    name: "Mavi",
    emoji: "💙",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    primaryLight: "#dbeafe",
    primaryDark: "#1e40af",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  },
  purple: {
    id: "purple",
    name: "Mor",
    emoji: "💜",
    primary: "#a855f7",
    primaryHover: "#9333ea",
    primaryLight: "#f3e8ff",
    primaryDark: "#7e22ce",
    gradient: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
  },
  pink: {
    id: "pink",
    name: "Pembe",
    emoji: "💗",
    primary: "#ec4899",
    primaryHover: "#db2777",
    primaryLight: "#fce7f3",
    primaryDark: "#be185d",
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  },
  red: {
    id: "red",
    name: "Kırmızı",
    emoji: "❤️",
    primary: "#ef4444",
    primaryHover: "#dc2626",
    primaryLight: "#fee2e2",
    primaryDark: "#b91c1c",
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  },
  orange: {
    id: "orange",
    name: "Turuncu",
    emoji: "🧡",
    primary: "#f97316",
    primaryHover: "#ea580c",
    primaryLight: "#ffedd5",
    primaryDark: "#c2410c",
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  },
  yellow: {
    id: "yellow",
    name: "Sarı",
    emoji: "💛",
    primary: "#eab308",
    primaryHover: "#ca8a04",
    primaryLight: "#fef9c3",
    primaryDark: "#a16207",
    gradient: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
  },
  green: {
    id: "green",
    name: "Yeşil",
    emoji: "💚",
    primary: "#22c55e",
    primaryHover: "#16a34a",
    primaryLight: "#dcfce7",
    primaryDark: "#15803d",
    gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  },
  teal: {
    id: "teal",
    name: "Turkuaz",
    emoji: "🩵",
    primary: "#14b8a6",
    primaryHover: "#0d9488",
    primaryLight: "#ccfbf1",
    primaryDark: "#0f766e",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
  },
  gray: {
    id: "gray",
    name: "Gri",
    emoji: "🤍",
    primary: "#6b7280",
    primaryHover: "#4b5563",
    primaryLight: "#f3f4f6",
    primaryDark: "#374151",
    gradient: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
  },
};

export const defaultTheme: ThemeColor = "blue";
