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
      try { setCart(JSON.parse(savedCart)); } catch (e) { setCart([]); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, variant?: ProductVariant, quantity: number = 1) => {
    if (!product) return;

    setCart(prev => {
      const pId = product.id || product._id;
      const vId = variant?.id || 'default';
      const existing = prev.find(item => item.productId === pId && item.variantId === vId);
      
      // LẤY GIÁ THÔNG MINH: Kiểm tra cả 2 trường price và basePrice
      const rawPrice = product.price || product.basePrice || 0;
      const finalPrice = Number(rawPrice) + (variant?.priceDelta || 0);
      
      const stockLimit = variant ? variant.stock : (product.stock || 0);

      // LẤY ẢNH THÔNG MINH: Kiểm tra cả image (chuỗi) và images (mảng)
      const itemImage = product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/150';

      if (existing) {
        return prev.map(item => 
          (item.productId === pId && item.variantId === vId) 
          ? { ...item, quantity: Math.min(item.quantity + quantity, stockLimit), price: finalPrice } 
          : item
        );
      }

      const newItem: CartItem = {
        productId: pId,
        variantId: vId,
        quantity: Math.min(quantity, stockLimit),
        name: product.name,
        variantName: variant?.name || 'Mặc định', 
        image: itemImage,
        price: finalPrice,
        stock: stockLimit
      };
      
      return [...prev, newItem];
    });
  };

  const removeFromCart = (pId: string, vId?: string) => {
    const variantId = vId || 'default';
    setCart(prev => prev.filter(item => !(item.productId === pId && item.variantId === variantId)));
  };

  const updateQuantity = (pId: string, vId: string | undefined, qty: number) => {
    const variantId = vId || 'default';
    setCart(prev => prev.map(item => 
      (item.productId === pId && item.variantId === variantId) 
      ? { ...item, quantity: Math.max(1, Math.min(qty, item.stock)) } 
      : item
    ));
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
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};