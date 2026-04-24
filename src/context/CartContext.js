import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

const initialState = {
  cartItems: [],
};

// The Reducer handles all the state updates based on the 'action.type'
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, cartItems: action.payload };

    case 'ADD_TO_CART':
      const existingIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        const updatedItems = [...state.cartItems];
        updatedItems[existingIndex].quantity += 1;
        return { ...state, cartItems: updatedItems };
      }
      return { ...state, cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }] };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, item.quantity + action.payload.amount) }
            : item
        ),
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload),
      };

    case 'CLEAR_CART':
      return { ...state, cartItems: [] };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 1. Load cart from AsyncStorage when the app starts
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          dispatch({ type: 'LOAD_CART', payload: JSON.parse(storedCart) });
        }
      } catch (error) {
        console.error("Failed to load cart", error);
      }
    };
    loadCart();
  }, []);

  // 2. Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(state.cartItems));
      } catch (error) {
        console.error("Failed to save cart", error);
      }
    };
    saveCart();
  }, [state.cartItems]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);