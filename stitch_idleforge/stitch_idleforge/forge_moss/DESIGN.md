# Design System Strategy: The Alchemical Interface

## 1. Overview & Creative North Star: "Digital Craftsmanship"
This design system is built on the collision of two worlds: the rustic, tactile warmth of Pipa’s forge and the cold, precise luminosity of Moss AI’s digital core. Our Creative North Star is **Digital Craftsmanship**. We move away from the "flatness" of modern SaaS and embrace a high-end editorial game aesthetic that feels both hand-forged and hyper-advanced.

To break the "template" look, we utilize **Intentional Asymmetry**. Layouts should never feel perfectly mirrored. We use overlapping elements—such as pixel-art icons breaking the bounds of glassmorphic containers—to create a sense of depth and "object-ness." This is not a website; it is a specialized toolset.

## 2. Colors: The Forge and The Core
Our palette is a high-contrast dialogue between thermal energy and cooling systems.

*   **Primary Forge (#ffb77d / #ff8c00):** Used for kinetic energy. Use `primary` for interactive elements and `primary_container` for high-importance focal points like active forging states.
*   **Moss Blue (#3a4b5d / #111316):** The "Hardcore Tech" foundation. `surface` and `secondary_container` provide the deep, cinematic backdrop required for glowing accents to pop.
*   **Tertiary Glow (#5dd9d0):** Reserved exclusively for Moss AI interventions, data streams, and "Success" states.

### The "No-Line" Rule
**Strict Mandate:** Prohibit 1px solid borders for sectioning. We define space through tonal shifts. A `surface_container_low` sidebar sitting against a `surface` background is sufficient. If a container needs more definition, use a `surface_bright` subtle inner glow rather than an outer stroke.

### The "Glass & Gradient" Rule
To bridge the gap between "Storybook" and "Tech," use `surface_variant` at 60% opacity with a `20px` backdrop blur for Moss AI panels. For Pipa’s manual controls, apply a subtle linear gradient from `primary` to `primary_container` (at a 135-degree angle) to mimic the flicker of molten metal.

## 3. Typography: The Dual Narrative
We employ a typographic hierarchy that reflects our two protagonists.

*   **The Technical Layer (Space Grotesk):** Our `display` and `headline` scales use Space Grotesk. Its wide apertures and geometric construction feel like high-end terminal data. Use `display-lg` for major milestone numbers and `headline-sm` for Agent names.
*   **The Human Layer (Manrope):** All `body` and `title` text uses Manrope. It provides a clean, neutral balance to the aggressive tech fonts, ensuring long-form story elements remain legible.
*   **Narrative Stylization:** For story-specific flavor text, use an italicized `title-sm` with an increased letter-spacing of `0.05rem` to mimic a typewriter’s cadence without sacrificing the system's modern integrity.

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines; we use light and density.

*   **The Layering Principle:** 
    *   **Base:** `surface_dim` (The Forge floor).
    *   **Level 1:** `surface_container_low` (General UI housing).
    *   **Level 2:** `surface_container_high` (Active Agent cards).
    *   **Level 3:** `surface_bright` (Active modal/floating tooltips).
*   **Ambient Shadows:** For floating isometric items, use a shadow tinted with `on_secondary` at 8% opacity. Blur radius should be 2x the elevation height (e.g., 24px blur for a 12px offset) to create a soft, atmospheric "lift."
*   **The Ghost Border:** If accessibility requires a border, use `outline_variant` at 15% opacity. It should feel like a suggestion of an edge, not a cage.

## 5. Components: The Artifacts

### Buttons (The Kinetic Triggers)
*   **Primary:** A solid `primary` fill with a `0.25rem` (DEFAULT) roundedness. Add a `primary_fixed_dim` 1px inner top-highlight to give it a "pressed metal" feel.
*   **Secondary (Moss Tech):** `secondary_container` with a `tertiary` (Moss Blue) outer glow (4px blur) when hovered.
*   **Tertiary:** Text-only using `label-md` in `primary`, strictly for low-priority navigation.

### Progress Bars (The Heat Gauge)
*   **Track:** `surface_container_highest`.
*   **Fill:** A gradient from `primary` to `primary_container`.
*   **The "Glow State":** When a forge reaches 90% completion, add a `primary` drop shadow to the fill bar to simulate heat radiance.

### Agent Status Cards
*   **Structure:** No borders. Use `surface_container_low`. 
*   **Header:** Use `headline-sm` in `on_surface`.
*   **Asymmetry:** Place pixel-art Agent portraits so they slightly overlap the top-left corner of the card, breaking the rectangular grid.
*   **Spacing:** Use `spacing-4` (0.9rem) for internal padding to maintain an editorial "airy" feel despite the "hardcore" theme.

### Tooltips & Overlays
*   Use the **Glassmorphism** rule. `surface_container_highest` at 80% opacity + `backdrop-blur`. This ensures the game world is never fully obscured, maintaining immersion.

## 6. Do's and Don'ts

### Do
*   **Do** mix isometric pixel art with high-res typography. The contrast is the point.
*   **Do** use `spacing-10` and `spacing-12` to create "Editorial Silences" in the UI, allowing the art to breathe.
*   **Do** use `tertiary` (Success Green) sparingly—only for Moss AI's "perfect" calculations or completed tasks.

### Don't
*   **Don't** use pure black (#000000). Always use `surface_container_lowest` for the deepest shadows to keep the "warmth" of the forge alive.
*   **Don't** use standard "Material" ripples. Use subtle opacity fades or "glitch" transitions for AI-related buttons.
*   **Don't** use 1px dividers. Use a `spacing-2` vertical gap or a color shift to `surface_container_high`.