import React, { createContext, useState } from 'react'

// Create the context
export const AppContext = createContext()

// Create a provider component
const AppContextProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const [cart, setCart] = useState([])

  // Toggle language between English and Amharic
  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'am' : 'en')
  }

  // Add item to cart
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  // Update item quantity in cart
  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  // Context value
  const contextValue = {
    language,
    toggleLanguage,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartItemCount: cart.reduce((count, item) => count + item.quantity, 0),
    // Add a dummy hasRole function to prevent errors if components try to use it
    hasRole: () => false
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider