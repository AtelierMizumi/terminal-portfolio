# Phase 7: Mobile Optimization (Planning)

This document outlines the strategy for bringing the full Terminal Portfolio OS experience to mobile devices. 

Currently, the application relies heavily on desktop-centric paradigms:
- Dragging physics (`framer-motion` optimized for mouse coordinates)
- Absolute positioning for windows
- Complex keyboard interactions (Terminal)
- A dense top bar and taskbar structure

## Goals for Mobile
1. **Responsive Viewport:** Ensure no horizontal scrolling or broken flex layouts on narrow screens.
2. **Touch-Friendly Physics:** Refactor draggable windows to support touch events or implement a mobile-specific window management system (e.g., full screen modal or tabbed views instead of floating windows).
3. **Mobile Terminal Interface:** Add a virtual keyboard helper or mobile-optimized command suggestions toolbar since typing on a mobile virtual keyboard is tedious.
4. **Adaptive UI Elements:** Simplify the TopBar and Arch Menu to fit on small screens. Use a hamburger menu or bottom navigation bar if necessary.

## Implementation Ideas

### 1. Window Management Rewrite for Touch
Instead of free-floating dragging (which takes up too much screen real estate and is annoying to resize on a phone), if the screen width is below `md` (768px), we should:
- Open windows in **fullscreen mode** by default.
- Use a swipe gesture or a prominent "Close" / "Minimize" button at the top to navigate between active windows.
- Disable `framer-motion` drag attributes if `window.innerWidth < 768`.

### 2. The Mobile Terminal
- Shrink the `xterm.js` font size.
- Include quick-action buttons above the mobile keyboard (e.g., `open music`, `help`, `coffee`, `Tab / Autocomplete`).

### 3. Desktop Icons Layout
- Move from absolute pixel coordinates to a flexible grid (e.g., CSS Grid) for icons so they wrap correctly on narrow screens without overlapping.

## Next Steps when ready
- [ ] Implement a `useIsMobile()` hook utilizing `window.matchMedia`.
- [ ] Refactor `WindowManager` to handle mobile layouts.
- [ ] Rework desktop icon physics for touch boundaries.
- [ ] Adapt music player and other dense UI components.
