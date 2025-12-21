
import * as React from "react"

// Updated with multiple breakpoint options
const MOBILE_BREAKPOINT = 640  // Changed from 768 to 640 for better mobile experience
const TABLET_BREAKPOINT = 1024
const DESKTOP_BREAKPOINT = 1280

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    window.addEventListener("resize", checkMobile)
    checkMobile()
    
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean>(
    typeof window !== 'undefined' ? 
      window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT 
      : false
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
    }
    
    window.addEventListener("resize", checkTablet)
    checkTablet()
    
    return () => window.removeEventListener("resize", checkTablet)
  }, [])

  return isTablet
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop' | 'sm-mobile'>(
    typeof window !== 'undefined' ?
      window.innerWidth < 480 ? 'sm-mobile' :
      window.innerWidth < MOBILE_BREAKPOINT ? 'mobile' :
      window.innerWidth < TABLET_BREAKPOINT ? 'tablet' : 'desktop'
      : 'desktop' // Default for SSR
  )

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkBreakpoint = () => {
      const width = window.innerWidth
      if (width < 480) {
        setBreakpoint('sm-mobile')
      } else if (width < MOBILE_BREAKPOINT) {
        setBreakpoint('mobile')
      } else if (width < TABLET_BREAKPOINT) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }
    
    window.addEventListener("resize", checkBreakpoint)
    checkBreakpoint()
    
    return () => window.removeEventListener("resize", checkBreakpoint)
  }, [])

  return breakpoint
}
