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
  isLoading: boolean; // Add loading state
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { user, loading: authLoading } = useAuth();

  // Subscribe to user's cart in Firestore
  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize
    
    if (!user) {
      setCartItems([]);
      setIsLoading(false); // Set loading to false when no user
      return;
    }

    setIsLoading(true); // Set loading to true when starting to fetch

    // Get initial cart data
    const cartRef = doc(db, 'carts', user.uid);
    
    const unsubscribe = onSnapshot(
      cartRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setCartItems(data.items || []);
        } else {
          // Initialize empty cart document for new users
          setDoc(cartRef, {
            items: [],
            updatedAt: new Date(),
            userId: user.uid,
          }).catch(error => {
            console.error('Error initializing cart:', error);
          });
          setCartItems([]);
        }
        setIsLoading(false); // Set loading to false after data is fetched
      },
      (error) => {
        console.error('Error fetching cart:', error);
        setIsLoading(false); // Set loading to false on error
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

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
    if (!user) return; // Prevent adding items when not logged in
    
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
    if (!user) return;

    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (!user) return;

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
    if (!user) return;
    
    setCartItems([]);
    saveCart([]);
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        isLoading // Expose loading state
      }}
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