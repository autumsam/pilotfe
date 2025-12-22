# Animation System Guide

This guide explains the animation system implemented using Framer Motion for the user dashboard.

## Overview

The animation system is built with:
- **Framer Motion** v12.23.26 - Production-ready animation library
- **Spring-based physics** - Natural, smooth motion
- **Reduced motion support** - Respects user accessibility preferences
- **Performance optimized** - GPU-accelerated transforms

## Core Principles

1. **Subtle & Purposeful** - Animations enhance UX without being distracting
2. **Spring Physics** - Uses spring-based animations for natural feel
3. **Accessibility First** - Respects `prefers-reduced-motion` setting
4. **Performance** - Uses transform and opacity for 60fps animations

## Components

### AnimatedPage
Page-level transitions between routes.

```tsx
import AnimatedPage from '@/components/animations/AnimatedPage';

<AnimatedPage>
  <YourPageContent />
</AnimatedPage>
```

**Features:**
- Fade + slide + scale on entry
- Smooth spring-based transitions
- Exit animations for route changes
- Duration: ~500ms

### AnimatedCard
Staggered card animations with optional hover effects.

```tsx
import AnimatedCard from '@/components/animations/AnimatedCard';

<AnimatedCard delay={0.1} hover={true}>
  <Card>Content</Card>
</AnimatedCard>
```

**Props:**
- `delay?: number` - Stagger delay (default: 0)
- `hover?: boolean` - Enable hover lift effect (default: true)
- `className?: string` - Additional classes

### AnimatedNumber
Animated counting for number displays.

```tsx
import AnimatedNumber from '@/components/animations/AnimatedNumber';

<AnimatedNumber 
  value={12345} 
  format={(n) => n.toLocaleString()}
/>
```

**Props:**
- `value: number` - Target number
- `format?: (n: number) => string` - Formatting function
- `duration?: number` - Animation duration (default: 1.5s)
- `className?: string` - Additional classes

### AnimatedList
Staggered list item animations.

```tsx
import AnimatedList from '@/components/animations/AnimatedList';

<AnimatedList staggerDelay={0.1}>
  {items.map(item => (
    <ListItem key={item.id}>{item.content}</ListItem>
  ))}
</AnimatedList>
```

**Props:**
- `staggerDelay?: number` - Delay between items (default: 0.1)
- `initialDelay?: number` - Delay before first item (default: 0)
- `className?: string` - Additional classes

### AnimatedButton
Button with hover and tap animations.

```tsx
import AnimatedButton from '@/components/animations/AnimatedButton';

<AnimatedButton onClick={handleClick}>
  Click Me
</AnimatedButton>
```

### AnimatedIconButton
Icon button with enhanced interactions.

```tsx
import AnimatedIconButton from '@/components/animations/AnimatedIconButton';

<AnimatedIconButton onClick={handleClick}>
  <RefreshIcon />
</AnimatedIconButton>
```

**Features:**
- Scale + rotate on hover
- Bounce-back on tap
- Spring physics

## useAnimations Hook

Custom hook providing animation utilities and configs.

```tsx
import { useAnimations } from '@/hooks/useAnimations';

const { 
  springConfig, 
  variants, 
  hover, 
  tap,
  shouldReduceMotion 
} = useAnimations();
```

**Available configs:**
- `springConfig` - Standard spring (stiffness: 260, damping: 20)
- `bounceConfig` - Bouncy spring (stiffness: 400, damping: 17)
- `smoothConfig` - Smooth spring (stiffness: 300, damping: 25)
- `snappyConfig` - Quick spring (stiffness: 500, damping: 30)

**Variants:**
- `fadeIn` - Simple opacity fade
- `slideUp` - Slide from below
- `slideRight` - Slide from left
- `scaleIn` - Scale from center
- `popIn` - Bouncy scale entrance

**Hover states:**
- `hover.scale` - Scale to 102%
- `hover.lift` - Lift by 4px
- `hover.glow` - Add shadow glow

**Tap states:**
- `tap.scale` - Scale to 98%
- `tap.shrink` - Scale to 95%

**Stagger configs:**
- `stagger.fast` - 50ms delay
- `stagger.normal` - 100ms delay
- `stagger.slow` - 150ms delay

## Motion Patterns

### 1. Page Transitions
Applied automatically via AnimatedPage wrapper:
- Entry: Fade + slide up + slight scale
- Exit: Fade + slide up (opposite direction)
- Timing: 500ms spring

### 2. Card Staggering
Cards appear sequentially with delays:

```tsx
<AnimatedCard delay={0}>...</AnimatedCard>
<AnimatedCard delay={0.05}>...</AnimatedCard>
<AnimatedCard delay={0.1}>...</AnimatedCard>
```

### 3. Hover Interactions
Elements respond to user interaction:

```tsx
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  <Card>...</Card>
</motion.div>
```

### 4. Icon Animations
Icons have playful interactions:

```tsx
<motion.div
  whileHover={{ scale: 1.1, rotate: 5 }}
  transition={{ type: "spring", stiffness: 400, damping: 10 }}
>
  <Icon />
</motion.div>
```

### 5. Number Counting
Numbers animate when values change:

```tsx
<AnimatedNumber 
  value={count}
  format={(n) => n.toFixed(2) + '%'}
/>
```

## Micro-Interactions

### Buttons
- **Hover**: Scale to 105%
- **Tap**: Scale to 95%
- **Transition**: Spring (400/17)

### Cards
- **Entry**: Fade + slide up + scale
- **Hover**: Lift -4px + scale 1.01
- **Transition**: Spring (400/17)

### Icons
- **Hover**: Scale 1.1 + rotate 5°
- **Transition**: Spring (400/10)

### Tabs/Nav
- **Hover**: Slide up -2px
- **Tap**: Scale 98%
- **Active**: Border animation

## Best Practices

### 1. Use Appropriate Delays
Stagger cards for visual flow:
```tsx
// Good
cards.map((card, i) => (
  <AnimatedCard key={card.id} delay={i * 0.05}>
    {card.content}
  </AnimatedCard>
))

// Avoid
<AnimatedCard delay={5}> // Too long!
```

### 2. Respect Reduced Motion
Always check shouldReduceMotion:
```tsx
const shouldReduceMotion = useReducedMotion();

<motion.div
  animate={shouldReduceMotion ? {} : { scale: 1.1 }}
>
```

### 3. Use Spring Physics
Prefer springs over duration/ease:
```tsx
// Good
transition={{ type: "spring", stiffness: 260, damping: 20 }}

// Avoid
transition={{ duration: 0.3, ease: "easeOut" }}
```

### 4. Optimize Performance
- Use `transform` and `opacity` (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly

### 5. Keep It Subtle
- Scale changes: 2-5% max
- Movement: 4-8px max
- Duration: 200-500ms typical

## Animation Timing

| Animation Type | Duration | Easing |
|---------------|----------|---------|
| Page transition | 500ms | Spring (260/20) |
| Card entrance | 500ms | Spring (260/20) |
| Hover effect | 200ms | Spring (400/17) |
| Button tap | 150ms | Spring (400/17) |
| Number count | 1500ms | Spring (100/30) |
| Icon rotate | 300ms | Spring (400/10) |

## Accessibility

The system automatically respects `prefers-reduced-motion`:

```tsx
// Automatically handled by components
const shouldReduceMotion = useReducedMotion();

// All animations are disabled when user prefers reduced motion
// Transitions happen instantly (duration: 0)
// No scale, rotation, or position changes
```

## Performance Tips

1. **Batch Animations**: Group related animations together
2. **Use AnimatePresence**: For exit animations and lists
3. **Lazy Load**: Don't animate offscreen elements
4. **Debounce**: For hover effects on many items
5. **Use Keys**: Proper keys for list animations

## Examples

### Complete Card with All Features
```tsx
<AnimatedCard delay={0.1} hover={true}>
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <motion.div 
          className="bg-primary/10 p-2 rounded-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon />
        </motion.div>
        <AnimatedNumber value={1234} />
      </CardContent>
    </Card>
  </motion.div>
</AnimatedCard>
```

### Button with Rotation on Hover
```tsx
<motion.div
  whileHover={{ scale: 1.05, rotate: 180 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  <Button>
    <RefreshIcon />
  </Button>
</motion.div>
```

### Staggered List
```tsx
<AnimatedList staggerDelay={0.08}>
  {items.map(item => (
    <motion.div
      key={item.id}
      whileHover={{ x: 4 }}
    >
      <ListItem>{item.text}</ListItem>
    </motion.div>
  ))}
</AnimatedList>
```

## Implementation Status

✅ **Completed Pages:**
- Home (PostActivity)
- Social (Socials)
- Analytics (UserAnalytics)
- Performance (PerformanceDashboard)

✅ **Completed Features:**
- Page-level transitions
- Card stagger animations
- Button hover/tap effects
- Icon micro-interactions
- Number counting animations
- Stat card animations
- Tab navigation animations
- Reduced motion support

## Future Enhancements

Potential additions for the future:
- Skeleton loading animations
- Pull-to-refresh animations
- Swipe gestures
- Drag & drop with physics
- Modal entrance/exit animations
- Toast notification animations
- Progress bar animations

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Principles](https://www.framer.com/motion/animation/)
- [Spring Animations](https://www.framer.com/motion/transition/)
- [Accessibility](https://www.framer.com/motion/guide-accessibility/)
