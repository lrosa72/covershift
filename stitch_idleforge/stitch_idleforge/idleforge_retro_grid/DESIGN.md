# Engineering the Forge: A High-End Pixel Architecture

## 1. Overview & Creative North Star
The Creative North Star for this system is **"Industrial Nostalgia."** 

We are not merely mimicking a retro game; we are constructing a high-fidelity simulation of a mechanical terminal. This design system rejects the "flat" modern web in favor of tactical, "crunchy" depth. By blending the mathematical precision of **Space Grotesk** with the raw, aliased soul of **Pixel Typography**, we create a tension between modern performance and 16-bit heritage. 

To move beyond the "template" look, designers must embrace **Intentional Asymmetry**. Mechanical components in a forge aren't perfectly centered; they are functional. Use overlapping panels, dithered transitions, and scanline overlays to create a UI that feels like it’s humming with electrical current.

---

## 2. Colors: The Neon & The Stone
Our palette is rooted in the high-contrast relationship between deep silicate minerals and ionized gas.

*   **Primary (#FF8C00 / `primary_container`):** Represents heat, molten metal, and active energy. Use this for high-priority actions.
*   **Secondary (#00FFFF / `secondary_container`):** Represents cooling, electricity, and digital precision. Use this for data readouts and interactive highlights.
*   **The "No-Line" Rule:** Do not use 1px solid CSS borders to separate sections. In a pixel-art world, boundaries are defined by **beveled light and shadow** or hard shifts in surface value.
*   **Surface Hierarchy:** 
    *   **Base:** `surface` (#121416) acts as the deep background.
    *   **Panels:** `surface_container_low` (#1a1c1e) for recessed areas.
    *   **Modules:** `surface_container_highest` (#333537) for elevated, interactive modules.
*   **The Dithered Gradient:** Instead of smooth CSS linear-gradients, use **Dithered PNG Patterns**. Transition from `primary` to `primary_container` using a 50% checkerboard pixel pattern to create that "soulful" 16-bit texture.

---

## 3. Typography: Digital Brutalism
This system utilizes a dual-engine typographic approach to handle complex technical data and Chinese localization.

*   **The Display Logic:** All Headlines (`display-lg` down to `headline-sm`) and Chinese characters must use a pixel-exact font (Zpix / Silver). This honors the 8-bit aesthetic.
*   **The Functional Logic:** All Body text and Labels (`body-lg` to `label-sm`) use **Space Grotesk**. Its wide apertures and geometric construction provide a "NASA-spec" technical feel that balances the "crunch" of the pixel font.
*   **Visual Hierarchy:** Use `headline-lg` (2rem) in Cyan for module titles to suggest a glowing CRT monitor effect. All secondary technical data should be in `label-md` using `on_surface_variant` (#ddc1ae) to mimic aged parchment or copper.

---

## 4. Elevation & Depth: The Tonal Layering
We achieve depth not through shadows, but through **Mechanical Stacking**.

*   **The Layering Principle:** Treat the UI as a physical assembly line. A `surface_container_highest` card sitting on a `surface` background creates a "raised metal plate" effect.
*   **Ambient Glow (The "Ghost" Shadow):** Standard drop shadows are forbidden. If an element must "float" (like a tooltip), use a `secondary` (Cyan) glow with a large blur (20px+) and very low opacity (10%). It should look like light emitting from a screen, not a shadow cast by a sun.
*   **The Bevel Fallback:** Instead of borders, use a 2px "Inner Highlight" on the top and left edges (using `surface_bright`) and a 2px "Inner Shadow" on the bottom and right (using `surface_container_lowest`). This creates the "Beveled Pixel" look essential to the Forge.
*   **Scanline Overlays:** Apply a fixed, semi-transparent (3% opacity) horizontal stripe pattern across the entire viewport to unify the layers into a single "monitor" experience.

---

## 5. Components: Industrial Modules

### Buttons
*   **Primary:** Solid `primary_container` (#FF8C00) with a 2px black bottom-border. On hover, the background shifts to `primary` (#ffb77d).
*   **Secondary:** Ghost style. No fill. `outline` (#a48c7a) 2px beveled border with Cyan `secondary` text.
*   **States:** Use a "Pressed" state where the entire component shifts 2px down and to the right, simulating a physical mechanical switch.

### Inputs & Fields
*   **The Recessed Bay:** Inputs must use `surface_container_lowest` (#0c0e10) to look carved into the dashboard.
*   **Focus State:** Instead of a blue ring, a focused input should trigger a flickering `secondary` (Cyan) scanline animation within the field.

### Progress Bars (Heat Gauges)
*   **The Dither Fill:** Progress is indicated by a dithered gradient from Cyan to Orange. 
*   **Forbid Dividers:** Use a 4px gap (`spacing-2`) between segments rather than a line.

### Cards & Lists
*   **Zero Dividers:** Never use a line to separate list items. Use alternating backgrounds (`surface_container_low` vs `surface_container`) or a 0.4rem (`spacing-2`) vertical gap.
*   **Factory-Themed Icons:** Icons must be 16x16 or 32x32 pixel-perfect assets. Use mechanical motifs: gears, pipes, and lightning bolts.

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use **Space Grotesk** for all numbers and technical values. Its legibility is superior for "Idle" game mechanics.
*   **DO** embrace the "crunch." If an image or icon looks too smooth, downsample it.
*   **DO** align everything to a 4px grid to ensure pixel-perfect rendering across different screen resolutions.

### Don’t:
*   **DON’T** use rounded corners (`border-radius: 0px` is mandatory). The Forge is built of hard stone and cold steel.
*   **DON’T** use pure white (#FFFFFF) for body text. Use `on_surface` (#e2e2e5) to reduce eye strain and maintain the "aged" terminal feel.
*   **DON’T** use standard easing functions. Use "Steps" in your CSS transitions (`transition-timing-function: steps(4)`) to simulate the jerky, intentional movement of retro hardware.

---

## 7. Localization: The CJK Exception
When rendering **Traditional or Simplified Chinese**, the pixel font must be set to a size that is a multiple of its native resolution (usually 12px or 16px) to avoid "blurring" the pixels. If the Chinese text becomes unreadable at small sizes, switch to a high-contrast Sans-Serif, but keep the `on_primary` or `on_secondary` color tokens to maintain thematic consistency.