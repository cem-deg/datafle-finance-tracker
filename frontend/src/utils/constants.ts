/**
 * Application constants.
 */

export const APP_NAME = "Datafle";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
  { label: "Expenses", href: "/expenses", icon: "wallet" },
  { label: "Income", href: "/income", icon: "banknote" },
  { label: "Budgets", href: "/budgets", icon: "target" },
  { label: "Analytics", href: "/analytics", icon: "bar-chart-3" },
  { label: "Insights", href: "/insights", icon: "lightbulb" },
  { label: "Categories", href: "/categories", icon: "tags" },
] as const;

export const CATEGORY_ICON_GROUPS = [
  {
    label: "Food & Drink",
    icons: ["utensils", "coffee", "wine", "cookie", "salad"],
  },
  {
    label: "Transport",
    icons: ["car", "bus", "train-front", "plane", "fuel"],
  },
  {
    label: "Shopping",
    icons: ["shopping-bag", "shopping-cart", "shirt", "gem"],
  },
  {
    label: "Entertainment",
    icons: ["gamepad-2", "music", "film", "tv", "ticket"],
  },
  {
    label: "Health & Fitness",
    icons: ["heart-pulse", "dumbbell", "pill", "baby"],
  },
  {
    label: "Education",
    icons: ["graduation-cap", "book-open", "pen-tool"],
  },
  {
    label: "Home & Living",
    icons: ["home", "sofa", "lamp", "wrench"],
  },
  {
    label: "Finance",
    icons: ["receipt", "credit-card", "piggy-bank", "landmark"],
  },
  {
    label: "Pets",
    icons: ["paw-print", "bone", "fish"],
  },
  {
    label: "Technology",
    icons: ["smartphone", "laptop", "wifi", "headphones"],
  },
  {
    label: "Personal",
    icons: ["scissors", "palette", "gift", "briefcase", "sparkles"],
  },
  {
    label: "Other",
    icons: ["layers", "circle", "star", "zap", "globe"],
  },
] as const;

// Flat list of all icons for backward compatibility
export const CATEGORY_ICONS = CATEGORY_ICON_GROUPS.flatMap((g) => g.icons);

export const CATEGORY_COLORS = [
  "#ff6b6b", "#feca57", "#a29bfe", "#fd79a8", "#00cec9",
  "#00b894", "#6c5ce7", "#636e72", "#e17055", "#74b9ff",
  "#55efc4", "#fab1a0", "#81ecec", "#dfe6e9", "#b2bec3",
] as const;
