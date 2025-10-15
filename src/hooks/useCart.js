import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

// Custom hook to access cart functionality from AppContext
const useCart = () => {
  const context = useContext(AppContext)
  
  if (!context) {
    throw new Error('useCart must be used within an AppContextProvider')
  }
  
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartItemCount 
  } = context
  
  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartItemCount
  }
}

export default useCart