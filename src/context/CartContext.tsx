import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, setDoc, enableNetwork, disableNetwork } from 'firebase/firestore';
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
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const [isOffline, setIsOffline] = useState(false);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      enableNetwork(db).catch(console.error);
    };

    const handleOffline = () => {
      setIsOffline(true);
      disableNetwork(db).catch(console.error);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save cart to Firestore with improved error handling
  const saveCart = useCallback(async (items: CartItem[]) => {
    if (!user || isOffline) return;

    const maxRetries = 3;
    const retryDelay = 1000;
    let retryCount = 0;

    const attemptSave = async (): Promise<void> => {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        await setDoc(cartRef, {
          items,
          updatedAt: new Date(),
          userId: user.uid,
        }, { merge: true });
      } catch (error) {
        console.error('Error saving cart:', error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
          return attemptSave();
        }
        throw error;
      }
    };

    try {
      await attemptSave();
    } catch (error) {
      console.error('Final error saving cart:', error);
      // Handle offline state
      if (!navigator.onLine) {
        setIsOffline(true);
      }
    }
  }, [user, isOffline]);

  // Subscribe to user's cart in Firestore
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let unsubscribe: () => void;

    const setupListener = async () => {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        unsubscribe = onSnapshot(
          cartRef,
          {
            next: (doc) => {
              if (doc.exists()) {
                setCartItems(doc.data().items || []);
              } else {
                setDoc(cartRef, {
                  items: [],
                  updatedAt: new Date(),
                  userId: user.uid,
                }, { merge: true }).catch(console.error);
                setCartItems([]);
              }
              setIsLoading(false);
            },
            error: (error) => {
              console.error('Firestore subscription error:', error);
              setIsLoading(false);
              if (!navigator.onLine) {
                setIsOffline(true);
              }
            }
          }
        );
      } catch (error) {
        console.error('Error setting up Firestore listener:', error);
        setIsLoading(false);
      }
    };

    setupListener();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, authLoading]);

  const addToCart = async (item: CartItem) => {
    if (!user) return;
    
    const newItems = [...cartItems];
    const existingItem = newItems.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newItems.push({ ...item, quantity: 1 });
    }
    
    setCartItems(newItems);
    await saveCart(newItems);
  };

  const removeFromCart = async (id: string) => {
    if (!user) return;

    const newItems = cartItems.filter(item => item.id !== id);
    setCartItems(newItems);
    await saveCart(newItems);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) return;

    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }

    const newItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(newItems);
    await saveCart(newItems);
  };

  const clearCart = async () => {
    if (!user) return;
    
    setCartItems([]);
    await saveCart([]);
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        isLoading
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