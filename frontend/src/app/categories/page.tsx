"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  Baby,
  Bone,
  BookOpen,
  Briefcase,
  Bus,
  Car,
  Circle,
  Coffee,
  Cookie,
  CreditCard,
  Dumbbell,
  Edit3,
  Film,
  Fish,
  Fuel,
  Gamepad2,
  Gem,
  Gift,
  Globe,
  GraduationCap,
  Headphones,
  HeartPulse,
  Home,
  Lamp,
  Landmark,
  Laptop,
  Layers,
  Music,
  Palette,
  PawPrint,
  PenTool,
  Pill,
  Plane,
  Plus,
  Receipt,
  Salad,
  Scissors,
  Search,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Star,
  Ticket,
  TrainFront,
  Trash2,
  Tv,
  Utensils,
  Wifi,
  Wine,
  Wrench,
  Zap,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import InlineMessage from "@/components/ui/InlineMessage";
import LoadingList from "@/components/ui/LoadingList";
import ModalShell from "@/components/ui/ModalShell";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { useCategories } from "@/hooks/useData";
import { categoryApi } from "@/services/api";
import { CATEGORY_COLORS, CATEGORY_ICON_GROUPS } from "@/utils/constants";

const ICON_MAP: Record<string, ReactNode> = {
  utensils: <Utensils size={18} />,
  coffee: <Coffee size={18} />,
  wine: <Wine size={18} />,
  cookie: <Cookie size={18} />,
  salad: <Salad size={18} />,
  car: <Car size={18} />,
  bus: <Bus size={18} />,
  "train-front": <TrainFront size={18} />,
  plane: <Plane size={18} />,
  fuel: <Fuel size={18} />,
  "shopping-bag": <ShoppingBag size={18} />,
  "shopping-cart": <ShoppingCart size={18} />,
  shirt: <Shirt size={18} />,
  gem: <Gem size={18} />,
  "gamepad-2": <Gamepad2 size={18} />,
  music: <Music size={18} />,
  film: <Film size={18} />,
  tv: <Tv size={18} />,
  ticket: <Ticket size={18} />,
  "heart-pulse": <HeartPulse size={18} />,
  dumbbell: <Dumbbell size={18} />,
  pill: <Pill size={18} />,
  baby: <Baby size={18} />,
  "graduation-cap": <GraduationCap size={18} />,
  "book-open": <BookOpen size={18} />,
  "pen-tool": <PenTool size={18} />,
  home: <Home size={18} />,
  sofa: <Sofa size={18} />,
  lamp: <Lamp size={18} />,
  wrench: <Wrench size={18} />,
  receipt: <Receipt size={18} />,
  "credit-card": <CreditCard size={18} />,
  landmark: <Landmark size={18} />,
  "paw-print": <PawPrint size={18} />,
  bone: <Bone size={18} />,
  fish: <Fish size={18} />,
  smartphone: <Smartphone size={18} />,
  laptop: <Laptop size={18} />,
  wifi: <Wifi size={18} />,
  headphones: <Headphones size={18} />,
  scissors: <Scissors size={18} />,
  palette: <Palette size={18} />,
  gift: <Gift size={18} />,
  briefcase: <Briefcase size={18} />,
  sparkles: <Sparkles size={18} />,
  layers: <Layers size={18} />,
  circle: <Circle size={18} />,
  star: <Star size={18} />,
  zap: <Zap size={18} />,
  globe: <Globe size={18} />,
};

interface CategoryFormState {
  name: string;
  icon: string;
  color: string;
}

const initialFormState = (): CategoryFormState => ({
  name: "",
  icon: "circle",
  color: "#6c5ce7",
});

export default function CategoriesPage() {
  const { categories, loading, error, refetch } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryFormState>(initialFormState);
  const [formError, setFormError] = useState("");
  const [pageMessage, setPageMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  useFlashMessage(pageMessage, setPageMessage);

  const filteredGroups = useMemo(
    () =>
      iconSearch
        ? CATEGORY_ICON_GROUPS.map((group) => ({
            ...group,
            icons: group.icons.filter((icon) => icon.includes(iconSearch.toLowerCase())),
          })).filter((group) => group.icons.length > 0)
        : CATEGORY_ICON_GROUPS,
    [iconSearch]
  );

  function updateForm<K extends keyof CategoryFormState>(field: K, value: CategoryFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(initialFormState());
    setFormError("");
    setEditId(null);
    setIconSearch("");
  }

  function closeModal() {
    setShowModal(false);
    resetForm();
  }

  function openCreate() {
    resetForm();
    setShowModal(true);
  }

  function openEdit(category: { id: number; name: string; icon: string; color: string }) {
    setForm({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
    setEditId(category.id);
    setFormError("");
    setShowModal(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setFormError("Category name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { name, icon: form.icon, color: form.color };
      if (editId) {
        await categoryApi.update(editId, payload);
        setPageMessage("Category updated.");
      } else {
        await categoryApi.create(payload);
        setPageMessage("Category created.");
      }

      closeModal();
      await refetch();
    } catch (submitError: unknown) {
      setFormError(submitError instanceof Error ? submitError.message : "Failed to save category.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this category? Categories with expenses cannot be deleted.")) return;

    setPageMessage(null);
    try {
      await categoryApi.delete(id);
      setPageMessage("Category deleted.");
      await refetch();
    } catch (deleteError: unknown) {
      setPageMessage(deleteError instanceof Error ? deleteError.message : "Failed to delete category.");
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Categories"
        description="Organize your expenses with custom categories"
        actions={
          <button className="btn btn-primary" onClick={openCreate} id="add-category-btn" type="button">
            <Plus size={18} /> Add Category
          </button>
        }
      />

      <PageFeedback
        successMessage={pageMessage}
        onDismissSuccess={() => setPageMessage(null)}
        errorMessages={[error]}
      />

      <div className="category-grid animate-in animate-in-delay-1">
        {loading ? (
          <LoadingList count={8} height={68} />
        ) : error ? (
          <div style={{ gridColumn: "1 / -1" }}>
            <EmptyState
              title="Could not load categories"
              description="Try refreshing the page or checking the backend connection."
              actionLabel="Retry"
              onAction={() => void refetch()}
              icon="!"
            />
          </div>
        ) : categories.length === 0 ? (
          <div style={{ gridColumn: "1 / -1" }}>
            <EmptyState
              title="No categories yet"
              description="Create categories to organize your expenses."
              actionLabel="Add Category"
              onAction={openCreate}
              icon="#"
            />
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="category-item">
              <div className="category-color" style={{ background: category.color }}>
                {ICON_MAP[category.icon] || <Circle size={18} />}
              </div>
              <span className="category-name">{category.name}</span>
              <div className="category-actions">
                <button
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={() => openEdit(category)}
                  title="Edit"
                  type="button"
                >
                  <Edit3 size={14} />
                </button>
                {!category.is_default ? (
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => void handleDelete(category.id)}
                    title="Delete"
                    type="button"
                    style={{ color: "var(--accent-danger)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal ? (
        <ModalShell title={editId ? "Edit Category" : "New Category"} onClose={closeModal}>
          {formError ? <InlineMessage message={formError} className="modal-message" /> : null}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="cat-name">
                Name
              </label>
              <input
                id="cat-name"
                type="text"
                className="form-input"
                placeholder="e.g., Groceries"
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                maxLength={60}
                required
              />
              <span className="form-help">Keep names short and specific so they are easy to scan in reports.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {CATEGORY_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-swatch ${form.color === color ? "selected" : ""}`}
                    style={{ background: color }}
                    onClick={() => updateForm("color", color)}
                    aria-label={`Choose ${color} as the category color`}
                  />
                ))}
              </div>
              <span className="form-help">Use a distinct color so charts and lists stay easy to read.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Icon</label>
              <div style={{ position: "relative", marginBottom: "var(--space-sm)" }}>
                <Search
                  size={14}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-tertiary)",
                  }}
                />
                <input
                  className="form-input"
                  style={{ padding: "8px 12px 8px 32px", fontSize: "var(--font-xs)" }}
                  placeholder="Search icons..."
                  value={iconSearch}
                  onChange={(event) => setIconSearch(event.target.value)}
                />
              </div>
              <span className="form-help">Pick a simple icon that is recognizable at a glance.</span>
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                {filteredGroups.length === 0 ? (
                  <EmptyState
                    title="No icons found"
                    description="Try a shorter search term."
                    icon="?"
                    compact
                  />
                ) : (
                  filteredGroups.map((group) => (
                    <div key={group.label} className="icon-group">
                      <div className="icon-group-title">{group.label}</div>
                      <div className="icon-group-grid">
                        {group.icons.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => updateForm("icon", icon)}
                            title={icon}
                            aria-label={`Use ${icon} icon`}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "var(--radius-sm)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: form.icon === icon ? form.color : "var(--bg-elevated)",
                              color: form.icon === icon ? "white" : "var(--text-secondary)",
                              cursor: "pointer",
                              border:
                                form.icon === icon
                                  ? `2px solid ${form.color}`
                                  : "2px solid transparent",
                              transition: "all 150ms ease",
                            }}
                          >
                            {ICON_MAP[icon] || <Circle size={18} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : editId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </ModalShell>
      ) : null}
    </AppShell>
  );
}
