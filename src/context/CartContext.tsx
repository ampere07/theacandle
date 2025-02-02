import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user?.email) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/cart/${encodeURIComponent(user.email)}`);
      const data = await response.json();
      setCartItems(data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user?.email]);

  const addToCart = async (item: CartItem) => {
    if (!user?.email) return;
    
    try {
      const response = await fetch(`/api/cart/${encodeURIComponent(user.email)}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.id, quantity: 1 })
      });
      const data = await response.json();
      setCartItems(data.items);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user?.email) return;

    try {
      const response = await fetch(`/api/cart/${encodeURIComponent(user.email)}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, quantity })
      });
      const data = await response.json();
      setCartItems(data.items);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (id: string) => {
    await updateQuantity(id, 0);
  };

  const clearCart = async () => {
    if (!user?.email) return;

    try {
      const response = await fetch(`/api/cart/${encodeURIComponent(user.email)}/clear`, {
        method: 'DELETE'
      });
      const data = await response.json();
      setCartItems(data.items);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
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