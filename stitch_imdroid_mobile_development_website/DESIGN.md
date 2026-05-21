---
name: Kinetic Glass
colors:
  surface: '#15121b'
  surface-dim: '#15121b'
  surface-bright: '#3c3742'
  surface-container-lowest: '#100d16'
  surface-container-low: '#1d1a24'
  surface-container: '#221e28'
  surface-container-high: '#2c2833'
  surface-container-highest: '#37333e'
  on-surface: '#e8dfee'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e8dfee'
  inverse-on-surface: '#332f39'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#ffb690'
  on-tertiary: '#552100'
  tertiary-container: '#aa4900'
  on-tertiary-container: '#ffdecf'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783200'
  background: '#15121b'
  on-background: '#e8dfee'
  surface-variant: '#37333e'
typography:
  display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

The design system is built to reflect a "Playful Tech" personality—merging the precision of high-end mobile engineering with the approachable, vibrant energy of a creative studio. It is designed for a tech-savvy audience that values both innovation and ease of use.

The aesthetic blends **Corporate Modern** structure with **Glassmorphism** accents. It utilizes generous whitespace to let high-contrast gradients and technical details breathe. The visual language is defined by fluid transitions, semi-transparent layers, and "soft-tech" geometry that mirrors the rounded, friendly silhouette of the brand's robotic mascot. The goal is to evoke a sense of future-readiness that is sophisticated yet entirely accessible.

## Colors

The palette is derived directly from the spectrum found in the mascot’s gradient. It centers on a deep, sophisticated "Deep Slate" and "Midnight" foundation to allow vibrant accents to pop with high-tech intensity.

- **Primary & Secondary:** A core duo of Electric Purple and Royal Blue, often used together in linear gradients (45-degree angles) to represent connectivity and flow.
- **Tertiary:** Sunset Orange is reserved for high-priority calls to action and "playful" interruptions in the UI.
- **Accent:** A "Cyber Cyan" taken from the focal point of the mascot (the eye), used for success states and interactive indicators.
- **Surface Strategy:** Backgrounds use a dark-to-darker vertical gradient to create perceived depth, while foreground elements utilize semi-transparent fills to achieve the glass effect.

## Typography

This design system uses **Inter** exclusively to maintain a clean, systematic, and utilitarian feel that balances the expressive color palette. 

Typography follows a strict hierarchical scale. **Display** and **Large Headlines** should use tighter letter spacing and heavier weights to create a "locked-in" professional look. **Labels** are set in Medium or Semi-bold weights with slight tracking increases to ensure legibility against dark, vibrant backgrounds. For mobile, headline sizes are aggressively scaled down to ensure that the "generous whitespace" philosophy is maintained even on small viewports.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop and a **4-column fluid grid** for mobile. The layout philosophy is "Space as a Feature," where large margins and paddings are used to isolate functional groups and reduce cognitive load.

- **Rhythm:** A 4px base unit governs all spatial decisions. 
- **Containment:** Content is typically centered in a max-width container of 1280px for desktop. 
- **Reflow:** On tablet and mobile, vertical spacing (stacking) increases slightly to compensate for the smaller horizontal field, maintaining the airy, premium feel. 
- **Alignment:** Strict adherence to the grid is required for structural elements (cards, text blocks), while decorative "glass" orbs or gradient blurs may break the grid to create a sense of organic movement.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Backdrop Blurs** rather than traditional heavy shadows.

- **Level 0 (Background):** Deepest slate, solid or subtle radial gradient.
- **Level 1 (Cards/Containers):** Glassmorphism effect. Uses a background blur of 20px, a 10% white fill, and a 1px "inner glow" stroke (white at 15% opacity) to define edges.
- **Level 2 (Popovers/Modals):** Increased blur (40px) and a subtle ambient shadow tinted with the primary purple (#7C3AED) at 20% opacity to suggest the element is floating.
- **Interactive Depth:** When an element is hovered, the "inner glow" stroke brightness increases, and the background blur slightly intensifies, mimicking a physical glass surface moving closer to the light source.

## Shapes

The shape language is consistently rounded to echo the "Imdroid" mascot's friendly form. 

- **Containers:** Standard cards use `rounded-lg` (1rem/16px) for a modern, approachable feel.
- **Buttons & Chips:** These utilize a "Pill" style (fully rounded) to contrast against the more structured grid-based cards.
- **Inputs:** Use the same `rounded-lg` as containers to maintain a cohesive field language. 
- **Icons:** Should feature rounded terminals and a consistent 2px stroke weight to match the refined weight of the Inter typeface.

## Components

### Buttons
- **Primary:** Pill-shaped with a linear gradient (Purple to Blue). Text is white with a subtle drop shadow for legibility.
- **Secondary:** Transparent background with a 1.5px gradient border. 
- **Ghost:** No border or fill, Purple text, becomes a low-opacity Purple fill on hover.

### Cards
- Always use the Level 1 Elevation (Glassmorphism). 
- Content within cards should have a padding of at least `md` (24px).
- Headings inside cards are always `headline-md`.

### Input Fields
- Backgrounds are a darker shade than the surface they sit on.
- Bottom-border focus state: A 2px gradient line (Purple to Orange) animates from the center outward upon focus.

### Chips & Tags
- Used for categories or status. Small, pill-shaped, with a subtle solid background (15% opacity of the accent color) and high-contrast text.

### Progress Indicators
- Use the primary gradient (Purple to Blue). For "playful" loading states, use an animated version of the mascot's circular "eye" icon.

### Navigation
- A floating "Glass" dock for mobile or a top-aligned transparent header for desktop. Navigation links use `label-md` and show a small gradient dot underneath when active.