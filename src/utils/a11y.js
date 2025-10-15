/**
 * Accessibility utilities for the Tele-Pharmacy application
 */

/**
 * Focus trap utility to keep focus within a modal or dialog
 * @param {HTMLElement} container - The container element to trap focus within
 * @param {HTMLElement} triggerElement - The element that opened the modal (to return focus to)
 */
export const trapFocus = (container, triggerElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements[focusableElements.length - 1]
  
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          e.preventDefault()
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          e.preventDefault()
        }
      }
    }
    
    // Escape key to close modal
    if (e.key === 'Escape') {
      if (triggerElement) {
        triggerElement.focus()
      }
    }
  }
  
  container.addEventListener('keydown', handleKeyDown)
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} [priority='polite'] - The priority ('polite' or 'assertive')
 */
export const announce = (message, priority = 'polite') => {
  // Create or get the announcement element
  let announcementEl = document.getElementById('a11y-announcement')
  
  if (!announcementEl) {
    announcementEl = document.createElement('div')
    announcementEl.setAttribute('id', 'a11y-announcement')
    announcementEl.setAttribute('aria-live', priority)
    announcementEl.setAttribute('aria-atomic', 'true')
    announcementEl.className = 'sr-only'
    document.body.appendChild(announcementEl)
  }
  
  // Set the message
  announcementEl.textContent = message
  
  // Clear the message after a short delay to allow for re-announcements
  setTimeout(() => {
    announcementEl.textContent = ''
  }, 1000)
}

/**
 * Ensure sufficient color contrast for accessibility
 * @param {string} backgroundColor - Background color in hex format
 * @param {string} textColor - Text color in hex format
 * @returns {boolean} - True if contrast ratio is sufficient
 */
export const checkContrast = (backgroundColor, textColor) => {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  // Calculate relative luminance
  const getLuminance = (rgb) => {
    const a = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }
  
  const bgRgb = hexToRgb(backgroundColor)
  const textRgb = hexToRgb(textColor)
  
  if (!bgRgb || !textRgb) return false
  
  const bgLuminance = getLuminance(bgRgb)
  const textLuminance = getLuminance(textRgb)
  
  const ratio = bgLuminance > textLuminance
    ? (bgLuminance + 0.05) / (textLuminance + 0.05)
    : (textLuminance + 0.05) / (bgLuminance + 0.05)
  
  // WCAG AA standard requires a ratio of at least 4.5:1 for normal text
  return ratio >= 4.5
}

/**
 * Skip to main content link for keyboard users
 */
export const createSkipLink = () => {
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.textContent = 'Skip to main content'
  skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:ring-2 focus:ring-primary'
  
  // Add to beginning of body
  document.body.insertBefore(skipLink, document.body.firstChild)
  
  return skipLink
}

/**
 * Add keyboard navigation support to dropdown menus
 * @param {HTMLElement} dropdown - The dropdown container element
 * @param {HTMLElement} toggleButton - The button that toggles the dropdown
 */
export const enhanceDropdownKeyboardNav = (dropdown, toggleButton) => {
  const menuItems = dropdown.querySelectorAll('[role="menuitem"]')
  
  const handleKeyDown = (e) => {
    // Close dropdown with Escape
    if (e.key === 'Escape') {
      dropdown.classList.add('hidden')
      toggleButton.focus()
      return
    }
    
    // Navigate with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const currentIndex = Array.from(menuItems).indexOf(document.activeElement)
      
      if (e.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % menuItems.length
        menuItems[nextIndex].focus()
      } else {
        const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length
        menuItems[prevIndex].focus()
      }
    }
  }
  
  toggleButton.addEventListener('keydown', handleKeyDown)
  menuItems.forEach(item => {
    item.addEventListener('keydown', handleKeyDown)
  })
  
  // Return cleanup function
  return () => {
    toggleButton.removeEventListener('keydown', handleKeyDown)
    menuItems.forEach(item => {
      item.removeEventListener('keydown', handleKeyDown)
    })
  }
}

// Export all utilities
export default {
  trapFocus,
  announce,
  checkContrast,
  createSkipLink,
  enhanceDropdownKeyboardNav
}