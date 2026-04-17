# Project Rules

## Project Goal
A clean, professional, and easy-to-use financial tracking application.

The UI must feel:
- clear
- premium
- calm
- modern

---

## Tech Stack (DO NOT CHANGE)

- Frontend: Next.js + React
- Styling: Tailwind CSS
- Backend: (keep existing, do not modify unless asked)

---

## Core Principles

- Do NOT break working features
- Do NOT introduce unnecessary complexity
- Keep everything simple and maintainable
- Prefer consistency over cleverness

---

## UI / UX Rules

### Visual Style

- Clean and minimal
- No visual noise
- No unnecessary gradients or effects
- Consistent spacing and typography

### Colors

- Light mode must have proper contrast
- No gray text on white background (low contrast forbidden)
- Avoid random color usage

### Components

- Reusable components preferred
- Avoid inline styles unless necessary
- Keep layout predictable

---

## Frontend Rules

- Do NOT rewrite entire pages unless requested
- Prefer incremental improvement
- Avoid breaking layout structure
- Keep responsiveness intact

---

## Data & Logic Rules

- Do NOT change business logic without instruction
- Do NOT touch API contracts unless required
- Do NOT introduce breaking changes

---

## Performance Rules

- Avoid unnecessary re-renders
- Avoid heavy computations in UI
- Prefer efficient state updates

---

## Code Organization

- Follow existing folder structure
- Do NOT create random new folders
- Do NOT duplicate logic

---

## Naming

- Use clear, readable names
- No short or cryptic variable names
- Keep naming consistent across files

---

## When Making Changes

Always:
1. Understand current code
2. Make minimal change
3. Keep consistency
4. Avoid side effects

---

## Forbidden Actions

- Large refactors without permission
- Changing multiple systems at once
- Mixing UI + logic changes in one task
- Introducing new libraries without approval

---

## Definition of Done

A task is done when:
- It works correctly
- It does not break anything
- It follows project rules
- It is clean and understandable
---

## Design System Rules (CRITICAL)

This project uses a unified design system.

### Single Visual System

- The entire product must feel like ONE product
- Landing, dashboard, auth, and all pages must belong to the same visual family
- No parallel or competing UI styles allowed

---

### Token System (Source of Truth)

- All reusable visual values must come from the central token system
- Tokens include:
  - colors
  - surfaces
  - borders
  - shadows
  - radius
  - spacing
  - typography

Rules:

- Do NOT hardcode reusable rgba/hex values
- Do NOT duplicate visual logic across components
- Always prefer semantic tokens (e.g. surface, border, shadow)

---

### Styling Architecture

- Global styles must be minimal
- Component-level styling must be modular
- Each component should own its styling when possible
- Avoid page-level styling dominance

Forbidden:

- Giant CSS files (3000+ lines)
- Styling everything from globals.css
- Mixing multiple styling systems

---

### Controlled Exceptions

Some visual elements may remain local:

- environment backgrounds (page ambient, hero background)
- landing-specific art direction
- subtle one-off visual effects

BUT:

- These must be intentional
- These must NOT become a second system

---

### Dashboard vs Landing

- Dashboard = primary product surface
- Landing = marketing surface

Rules:

- They MUST share the same material system
- Landing can be more expressive, but not inconsistent
- Dashboard defines the base system direction

---

### Light Mode Quality

- Light mode must feel as premium as dark mode
- No washed-out blue backgrounds
- No low-contrast gray text
- No flat white surfaces

---

### Migration Discipline

This project evolves through controlled phases.

Rules:

- Do NOT skip phases
- Do NOT mix multiple system changes at once
- Do NOT perform large rewrites without explicit instruction
- Prefer incremental, safe migration

---

### Anti-Patterns (FORBIDDEN)

- Creating a second design system
- Hardcoding reusable visual values
- Page-specific styling hacks
- Mixing old and new styling logic randomly
- Large uncontrolled UI rewrites