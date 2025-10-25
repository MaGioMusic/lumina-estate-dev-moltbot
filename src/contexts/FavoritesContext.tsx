'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Property interface (simplified version for favorites)
export interface FavoriteProperty {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  type?: string;
}

// Favorites state interface
interface FavoritesState {
  favorites: FavoriteProperty[];
  isLoading: boolean;
}

// Action types
type FavoritesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_FAVORITES'; payload: FavoriteProperty[] }
  | { type: 'ADD_FAVORITE'; payload: FavoriteProperty }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' };

// Initial state
const initialState: FavoritesState = {
  favorites: [],
  isLoading: true,
};

// Reducer
function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'LOAD_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
        isLoading: false,
      };
    
    case 'ADD_FAVORITE':
      const updatedFavoritesAdd = [...state.favorites, action.payload];
      return {
        ...state,
        favorites: updatedFavoritesAdd,
      };
    
    case 'REMOVE_FAVORITE':
      const updatedFavoritesRemove = state.favorites.filter(
        property => property.id !== action.payload
      );
      return {
        ...state,
        favorites: updatedFavoritesRemove,
      };
    
    case 'CLEAR_FAVORITES':
      return {
        ...state,
        favorites: [],
      };
    
    default:
      return state;
  }
}

// Context interface
interface FavoritesContextType {
  state: FavoritesState;
  addToFavorites: (property: FavoriteProperty) => void;
  removeFromFavorites: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  clearFavorites: () => void;
  getFavoritesCount: () => number;
}

// Create context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Local storage key
const FAVORITES_STORAGE_KEY = 'lumina_estate_favorites';

// Provider component
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites) as FavoriteProperty[];
        dispatch({ type: 'LOAD_FAVORITES', payload: favorites });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [state.favorites, state.isLoading]);

  // Add property to favorites
  const addToFavorites = (property: FavoriteProperty) => {
    if (!isFavorite(property.id)) {
      dispatch({ type: 'ADD_FAVORITE', payload: property });
    }
  };

  // Remove property from favorites
  const removeFromFavorites = (propertyId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: propertyId });
  };

  // Check if property is in favorites
  const isFavorite = (propertyId: string): boolean => {
    return state.favorites.some(property => property.id === propertyId);
  };

  // Clear all favorites
  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  };

  // Get favorites count
  const getFavoritesCount = (): number => {
    return state.favorites.length;
  };

  const value: FavoritesContextType = {
    state,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    getFavoritesCount,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook to use favorites context
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 