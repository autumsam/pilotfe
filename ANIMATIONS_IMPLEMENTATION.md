# Framer Motion Animations Implementation Guide

## Overview
This document describes the implementation of smooth, modern page transitions and micro-animations using Framer Motion across the user dashboard.

## Features Implemented

### 1. Page Transitions
- **Subtle fade + slide animations** between routes
- **Spring-based motion** for natural, fluid movement
- **AnimatePresence** wrapper for exit animations
- **Route-level transitions** using Framer Motion

### 2. Bottom Navigation
- **Modern mobile navigation bar** with 5 main sections:
  - Home (Post Activity)
  - Social (Connections)
  - Analytics
  - Performance
  - Settings (Combined Profile + Settings)
- **Active tab indicator** with smooth sliding animation
- **Icon scale animations** on tab selection
- **Tap feedback** for better UX

### 3. Micro-Animations
- **Hover effects** on cards and buttons
- **Stagger animations** for card lists
- **Icon rotation** on hover
- **Loading state animations**
- **Switch toggle animations**

### 4. Accessibility
- **Respects `prefers-reduced-motion`** system preference
- **Graceful degradation** - animations disabled for users who prefer reduced motion
- **Keyboard navigation** fully supported
- **Focus states** preserved

## File Structure

```
src/
├── components/
│   ├── animations/
│   │   ├── AnimatedPage.tsx         # Page-level transition wrapper
│   │   ├── AnimatedCard.tsx         # Card with stagger animation
│   │   ├── AnimatedButton.tsx       # Button with hover/tap effects
│   │   └── AnimatedStatCard.tsx     # Stats card with animations
│   └── navigation/
│       └── BottomNavigation.tsx     # Mobile bottom nav bar
├── hooks/
│   └── useAnimations.ts             # Reusable animation utilities
└── pages/
    └── user/
        ├── PostActivity.tsx         # Home (with animations)
        ├── Socials.tsx              # Social connections
        ├── UserAnalytics.tsx        # Analytics
        ├── PerformanceDashboard.tsx # Performance
        └── Settings.tsx             # Combined Settings + Profile
```

## Component Usage

### AnimatedPage
Wraps entire page content for route transitions:

```tsx
import AnimatedPage from "@/components/animations/AnimatedPage";

const MyPage = () => {
  return (
    <AnimatedPage>
      {/* Page content */}
    </AnimatedPage>
  );
};
```

### AnimatedCard
Used for stagger animations on card lists:

```tsx
import AnimatedCard from "@/components/animations/AnimatedCard";

<AnimatedCard delay={0.1}>
  <Card>
    {/* Card content */}
  </Card>
</AnimatedCard>
```

### BottomNavigation
Automatically included in `UserLayout.tsx`:

```tsx
import BottomNavigation from "@/components/navigation/BottomNavigation";

// In UserLayout
<BottomNavigation />
```

### useAnimations Hook
Provides reusable animation configurations:

```tsx
import { useAnimations } from "@/hooks/useAnimations";

const MyComponent = () => {
  const { shouldReduceMotion, variants, hover, tap } = useAnimations();
  
  return (
    <motion.div
      variants={variants.slideUp}
      whileHover={hover.lift}
      whileTap={tap.scale}
    >
      {/* Content */}
    </motion.div>
  );
};
```

## Animation Specifications

### Page Transitions
- **Duration**: 400ms enter, 300ms exit
- **Easing**: Custom cubic-bezier [0.22, 1, 0.36, 1]
- **Transform**: Fade + 20px vertical slide

### Bottom Navigation
- **Spring stiffness**: 260
- **Spring damping**: 20
- **Active indicator**: Smooth layout animation

### Micro-Animations
- **Hover scale**: 1.02x
- **Tap scale**: 0.98x
- **Card lift**: -4px on hover
- **Icon rotation**: 5° on hover

## Accessibility Implementation

### Reduced Motion Support
All animations check for the `prefers-reduced-motion` media query:

```tsx
const shouldReduceMotion = useReducedMotion();

const variants = {
  initial: {
    opacity: shouldReduceMotion ? 1 : 0,
    y: shouldReduceMotion ? 0 : 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.4,
    },
  },
};
```

### Testing Reduced Motion

**On macOS:**
System Preferences → Accessibility → Display → Reduce motion

**On Windows:**
Settings → Ease of Access → Display → Show animations in Windows

**In Browser DevTools:**
- Chrome: DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion`
- Firefox: about:config → ui.prefersReducedMotion → set to 1

**Testing command:**
```bash
# Test in browser with reduced motion emulation enabled
# Animations should be instant or disabled
```

## Performance Considerations

### Optimizations
1. **Hardware acceleration**: All transforms use GPU-accelerated properties (transform, opacity)
2. **Will-change hints**: Automatically applied by Framer Motion
3. **Layout animations**: Use `layoutId` for efficient shared element transitions
4. **Conditional rendering**: Animations only run when `shouldReduceMotion` is false

### Performance Monitoring
```tsx
// Monitor animation performance
motion.div({
  onAnimationStart: () => console.time('animation'),
  onAnimationComplete: () => console.timeEnd('animation'),
});
```

## Routes Updated

### Main Navigation Routes
- `/home` - Post Activity (Home)
- `/socials` - Social Connections
- `/user-analytics` - Analytics
- `/performance-dashboard` - Performance
- `/user-settings` - Settings (combined Profile + Settings)

### Legacy Routes (Redirected)
- `/user-profile` → `/user-settings`
- `/post-activity` → `/home`

## Browser Support
- Chrome/Edge 88+
- Firefox 87+
- Safari 14.1+
- Mobile browsers with CSS animations support

## Known Limitations
1. AnimatePresence requires unique keys for route animations
2. Some third-party components may not respect reduced motion
3. Nested AnimatePresence contexts require careful management

## Future Enhancements
- [ ] Add shared element transitions between pages
- [ ] Implement skeleton loading states with animations
- [ ] Add haptic feedback for mobile devices
- [ ] Create animation playground for testing
- [ ] Add gesture-based navigation

## Testing Checklist

### Functionality
- [x] Page transitions work smoothly
- [x] Bottom navigation switches pages correctly
- [x] Animations respect reduced motion preference
- [x] All pages load without errors
- [x] Build completes successfully

### Accessibility
- [x] Keyboard navigation works
- [x] Screen readers announce page changes
- [x] Focus states visible
- [x] Reduced motion tested
- [x] No motion-induced discomfort

### Performance
- [x] No janky animations
- [x] Smooth 60fps animations
- [x] No layout shifts
- [x] Fast page loads

## Conclusion
The animation system provides a modern, polished user experience while maintaining excellent performance and accessibility. All animations gracefully degrade for users who prefer reduced motion, ensuring an inclusive experience for all users.
