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
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  // Subscribe to user's cart in Firestore with error handling and retry logic
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    const setupFirestoreListener = () => {
      const cartRef = doc(db, 'carts', user.uid);
      
      try {
        const unsubscribe = onSnapshot(
          cartRef,
          {
            next: (doc) => {
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
              setIsLoading(false);
              retryCount = 0; // Reset retry count on successful connection
            },
            error: (error) => {
              console.error('Firestore error:', error);
              setIsLoading(false);
              
              // Implement retry logic
              if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
                setTimeout(setupFirestoreListener, retryDelay * retryCount);
              } else {
                console.error('Max retries reached. Please check your connection.');
              }
            }
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up Firestore listener:', error);
        setIsLoading(false);
        return () => {}; // Return empty cleanup function if setup fails
      }
    };

    const unsubscribe = setupFirestoreListener();
    return () => unsubscribe();
  }, [user, authLoading]);

  // Save cart to Firestore with retry logic
  const saveCart = async (items: CartItem[]) => {
    if (!user) return;

    const maxRetries = 3;
    let retryCount = 0;

    const attemptSave = async (): Promise<void> => {
      try {
        await setDoc(doc(db, 'carts', user.uid), {
          items,
          updatedAt: new Date(),
          userId: user.uid,
        });
      } catch (error) {
        console.error('Error saving cart:', error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying save (${retryCount}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          return attemptSave();
        } else {
          throw new Error('Failed to save cart after multiple attempts');
        }
      }
    };

    try {
      await attemptSave();
    } catch (error) {
      console.error('Final error saving cart:', error);
    }
  };

  const addToCart = (item: CartItem) => {
    if (!user) return;
    
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