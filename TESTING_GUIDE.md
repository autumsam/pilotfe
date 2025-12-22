# Testing Guide: Animations & Bottom Navigation

## Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to User Dashboard
1. Open browser to http://localhost:5173
2. Login with credentials
3. You'll be redirected to `/home`

## What to Test

### 🎯 Page Transitions

**Steps:**
1. Click through bottom navigation tabs (mobile view or resize browser < 768px)
2. Observe smooth fade + slide animations between pages
3. Animations should complete in ~400ms

**Expected Behavior:**
- ✓ Smooth fade-in as new page appears
- ✓ Slight upward slide (20px) on enter
- ✓ Slight downward slide on exit
- ✓ No jarring jumps or flashes

### 📱 Bottom Navigation (Mobile)

**Steps:**
1. Resize browser to mobile width (< 768px) or use mobile device
2. See fixed bottom navigation bar with 5 icons
3. Tap each tab and watch animations

**Expected Behavior:**
- ✓ Active tab has blue indicator bar at top
- ✓ Blue bar slides smoothly to active tab
- ✓ Active icon scales up slightly (1.1x)
- ✓ Icon and label change color to primary
- ✓ Tap feedback (slight scale down 0.98x)

**Navigation Tabs:**
```
Home → Social → Analytics → Performance → Settings
 🏠      👥         📊           ⚡            ⚙️
```

### 🎨 Micro-Animations

#### Stats Cards
**Location:** Home, Analytics, Performance pages

**Steps:**
1. Hover over stats cards
2. Watch cards lift up slightly

**Expected:**
- ✓ Card rises -4px on hover
- ✓ Shadow increases
- ✓ Smooth spring transition

#### Social Connection Cards
**Location:** Social page

**Steps:**
1. Scroll through platform cards
2. Watch stagger animation on load
3. Hover over cards

**Expected:**
- ✓ Cards appear sequentially (50ms delay between each)
- ✓ Fade + slide up animation
- ✓ Hover effect lifts card

#### Settings Page
**Location:** Settings page (Bottom nav → Settings icon)

**Steps:**
1. Switch between tabs (Profile, Account, Security, Notifications)
2. Click "Edit Profile" button
3. Toggle notification switches

**Expected:**
- ✓ Tab content fades in smoothly
- ✓ Edit mode transitions smoothly
- ✓ Switches have smooth toggle animation
- ✓ Notification items slide on hover

### ♿ Accessibility Testing

#### Reduced Motion Test

**macOS:**
```
System Preferences → Accessibility → Display → ☑ Reduce motion
```

**Windows:**
```
Settings → Ease of Access → Display → ☐ Show animations in Windows
```

**Browser DevTools (Chrome):**
```
1. Open DevTools (F12)
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "Show Rendering"
4. Find "Emulate CSS media feature prefers-reduced-motion"
5. Select "prefers-reduced-motion: reduce"
```

**Expected Behavior with Reduced Motion:**
- ✓ Page transitions instant (no fade/slide)
- ✓ Card animations disabled
- ✓ Bottom nav indicator still works but instant
- ✓ All hover effects disabled or instant
- ✓ Functionality unchanged

#### Keyboard Navigation
**Steps:**
1. Use Tab key to navigate
2. Use Arrow keys in bottom nav
3. Use Enter/Space to activate

**Expected:**
- ✓ Focus indicators visible
- ✓ Tab order logical
- ✓ Enter/Space activates buttons
- ✓ No keyboard traps

### 🖥️ Desktop View

**Steps:**
1. Resize browser to desktop width (≥ 768px)
2. Bottom navigation should hide
3. Traditional sidebar should show
4. Page transitions still work

**Expected:**
- ✓ Bottom nav hidden on desktop
- ✓ Sidebar navigation visible
- ✓ Page animations still smooth
- ✓ Desktop layout unchanged

## Performance Testing

### Frame Rate Check

**Chrome DevTools:**
```
1. Open DevTools → Performance tab
2. Click Record
3. Navigate between pages
4. Stop recording
5. Check FPS graph
```

**Expected:**
- ✓ 60fps during animations
- ✓ No frame drops
- ✓ Smooth green line in FPS graph

### Network Throttling

**Test on 3G:**
```
DevTools → Network tab → Throttling → Fast 3G
```

**Expected:**
- ✓ Animations still smooth
- ✓ No blocking on animation load
- ✓ Graceful degradation if needed

## Common Issues & Solutions

### Issue: Animations not working
**Solution:**
1. Check browser console for errors
2. Verify framer-motion installed: `npm list framer-motion`
3. Clear browser cache and reload

### Issue: Bottom nav not showing
**Solution:**
1. Resize browser to mobile width (< 768px)
2. Check responsive design mode in DevTools
3. Verify UserLayout includes BottomNavigation

### Issue: Page transitions janky
**Solution:**
1. Check CPU usage
2. Disable browser extensions
3. Test in incognito mode
4. Check for console errors

### Issue: Reduced motion not working
**Solution:**
1. Verify system setting is enabled
2. Refresh browser after changing setting
3. Check useReducedMotion hook is imported

## Visual Checklist

### Home Page (Post Activity)
- [ ] Page fades in on load
- [ ] Stats cards visible
- [ ] Bottom nav active on "Home" tab
- [ ] Stats cards hover effect works

### Social Page
- [ ] Cards stagger in (each platform)
- [ ] Platform icons animated
- [ ] Cards lift on hover
- [ ] Connect buttons have tap effect

### Analytics Page
- [ ] Charts fade in
- [ ] Stats cards animate in sequence
- [ ] Tab switching smooth
- [ ] Tables render correctly

### Performance Page
- [ ] Tabs switch smoothly
- [ ] Charts animate on render
- [ ] Platform cards expand/collapse smoothly
- [ ] View type switcher animated

### Settings Page
- [ ] Tab switching works (Profile/Account/Security/Notifications)
- [ ] Edit mode transitions smoothly
- [ ] Avatar upload button animated
- [ ] Save buttons have hover/tap effects
- [ ] Notification switches toggle smoothly

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Sign Off

### Functionality
- [ ] All pages load correctly
- [ ] Bottom navigation works
- [ ] Page transitions smooth
- [ ] Micro-animations present
- [ ] No console errors

### Accessibility
- [ ] Keyboard navigation works
- [ ] Reduced motion respected
- [ ] Focus states visible
- [ ] Screen reader friendly

### Performance
- [ ] 60fps animations
- [ ] No layout shifts
- [ ] Fast page loads
- [ ] Smooth on mobile

### User Experience
- [ ] Animations feel natural
- [ ] Not distracting
- [ ] Enhances usability
- [ ] Professional appearance

---

## Need Help?

**Documentation:**
- See `ANIMATIONS_IMPLEMENTATION.md` for technical details
- See `IMPLEMENTATION_SUMMARY.md` for overview

**Debug Mode:**
```tsx
// Add to any page for animation debugging
import { motion } from "framer-motion";

motion.div({
  onAnimationStart: () => console.log('Animation started'),
  onAnimationComplete: () => console.log('Animation completed'),
});
```

**Framer Motion DevTools:**
```bash
npm install @framer-motion/devtools
```

Add to your app:
```tsx
import { AnimationDevTools } from "@framer-motion/devtools";

<AnimationDevTools />
```

---

Happy Testing! 🚀
