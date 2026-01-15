
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('app_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCart(prev => {
      const variantId = variant?.id;
      const existing = prev.find(item => item.productId === product.id && item.variantId === variantId);
      
      const price = product.basePrice + (variant?.priceDelta || 0);
      const stockLimit = variant ? variant.stock : product.stock;

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, stockLimit);
        return prev.map(item => 
          (item.productId === product.id && item.variantId === variantId) 
          ? { ...item, quantity: newQty } 
          : item
        );
      }

      const newItem: CartItem = {
        productId: product.id,
        variantId,
        quantity: Math.min(quantity, stockLimit),
        name: `${product.name}${variant ? ` (${variant.name})` : ''}`,
        image: product.images[0],
        price,
        stock: stockLimit
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.variantId === variantId)));
  };

  const updateQuantity = (productId: string, variantId: string | undefined, quantity: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId && item.variantId === variantId) {
        return { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
