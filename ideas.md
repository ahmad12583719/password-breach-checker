# Password & Breach Health Checker — Design Directions

## Three Approaches

### 1. Quiet Security Ledger
**Very Brief Intro:** A calm, editorially influenced safety tool that treats password health as a private personal record rather than an alarm panel. It uses warm paper tones, precise type, and restrained green status ink to make a stressful task feel manageable.

**Probability:** 0.037

### 2. Prism Signal Console
**Very Brief Intro:** A technical control surface with translucent graphite panels, vivid spectral scoring, and data-signal references. It feels like a modern security workstation without drifting into cyberpunk cliché.

**Probability:** 0.064

### 3. Harbor Checkpoint
**Very Brief Intro:** A confident, human-centered utility inspired by maritime wayfinding: dark ink, salt-paper lightness, and a single high-visibility safety accent. The interface has the clarity of a checklist and the poise of a trusted public service.

**Probability:** 0.021

---

## Chosen Direction — Harbor Checkpoint

### Design Movement
**Contemporary civic wayfinding** translated into a private security utility. The experience favors competent clarity over intimidation, borrowing the visual certainty of trustworthy travel and public-service systems.

### Core Principles
1. **Privacy made visible:** Every major surface should reinforce that analysis starts and stays on the device.
2. **Calm hierarchy:** A single primary action and a legible status sequence reduce cognitive load.
3. **Measured confidence:** Rich navy structure, quiet paper backgrounds, and sparse safety accents communicate seriousness without panic.
4. **Action after assessment:** Results always pair a diagnosis with a practical next step.

### Color Philosophy
The visual ground is a pale mineral paper, which is less stark than pure white and makes the tool feel reassuringly tactile. Deep harbor navy anchors navigation and critical text. **Tide Teal** is the ownable signal of protected action and positive health; amber and coral appear only when a result needs attention, so meaning is never diluted.

### Layout Paradigm
The interface behaves like a **security checkpoint lane**, not a centered card. A narrow left rail holds the brand, the protection promise, and navigation anchors. The main assessment lane carries the password input, measured status band, and results in a deliberate vertical flow. On small screens, this becomes a stacked, linear route with the privacy promise retained above the action.

### Signature Elements
1. **Tide line:** A thin, segmented horizontal status rule that expands according to password strength.
2. **Verification stamp:** A circular, offset security emblem used for trusted/local states, echoing a checkpoint seal.
3. **Coordinate labels:** Small uppercase labels with dot separators such as `LOCAL • PRIVATE • ON-DEVICE` to frame technical facts in accessible language.

### Interaction Philosophy
Interaction should always convey control. Password visibility is a deliberate toggle with an explicit accessible label. The primary check action offers a precise loading state, the meter transitions smoothly but briefly, and failure to reach the breach service remains a transparent, recoverable state rather than an ambiguous warning.

### Animation
The status line may lengthen or shift color over 180–240 ms using transform and opacity only. Result panels may enter with a subtle upward settle from 6 px and 0.96 scale, staggered by 50 ms. The verification stamp has no looping animation. Motion is disabled or reduced under `prefers-reduced-motion`.

### Typography System
**DM Serif Display** is reserved for the product wordmark and high-value results, bringing humane credibility to the tool. **Manrope** carries body copy, labels, and controls for numerical clarity. Headlines use strong but not oversized display faces; labels use uppercase Manrope at tight tracking; body copy remains comfortably readable at 15–17 px.

### Brand Essence
**A private, plain-spoken password health checkpoint for people who want a clear next move without giving up their secret.**

Personality: **Steady, candid, protective.**

### Brand Voice
The product speaks plainly and decisively, without jargon or fear tactics. Headlines describe the user’s current position; calls to action say exactly what will happen.

> “Check the signal, not your secrets.”

> “Only a five-character hash prefix leaves this device.”

### Wordmark & Logo
The wordmark pairs a compact harbor-gate symbol with high-contrast serif lettering. The mark itself is a bold, text-free **split shield-and-horizon**: a circular seal interrupted by a single protected vertical gate, suggesting a password that remains behind a boundary.

### Signature Brand Color
**Tide Teal — `#0B8A7A`**

## Style Decisions

- **Tide Line:** The segmented Tide Teal status rule is the primary recurring assessment motif. It visibly links the password entry lane, local strength reading, breach lookup, and current verdict.
- **Brand Seal:** The split shield-and-horizon mark functions as Harbor Checkpoint’s verification stamp and appears whenever the interface asserts local, private, or trusted status.
- **Imagery Direction:** Harbor/checkpoint primitives—lanes, gates, boundaries, seals, and coordinate labels—take precedence over generic cybersecurity imagery.
