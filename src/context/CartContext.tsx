import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Subscribe to user's cart in Firestore
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'carts', user.uid),
      (doc) => {
        if (doc.exists()) {
          setCartItems(doc.data().items || []);
        } else {
          setCartItems([]);
        }
      },
      (error) => {
        console.error('Error fetching cart:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Save cart to Firestore
  const saveCart = async (items: CartItem[]) => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'carts', user.uid), {
        items,
        updatedAt: new Date(),
        userId: user.uid,
      });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      const newItems = existingItem
        ? prev.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...item, quantity: 1 }];
      
      saveCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setCartItems(prev => {
      const newItems = prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      saveCart([]);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
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