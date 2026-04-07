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
  "#4c6ef5", "#2f8f83", "#2f9e6f", "#bf8825", "#8b6ccf",
  "#4f95d9", "#c17a49", "#8a98ad", "#5c7cfa", "#5fa8a0",
  "#5ca37a", "#c08d58", "#7b8fcf", "#9aa8bd", "#6f7d91",
] as const;
