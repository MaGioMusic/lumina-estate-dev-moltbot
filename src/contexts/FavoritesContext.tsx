'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

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

const readFavoritesFromStorage = (): FavoriteProperty[] => {
  if (typeof window === 'undefined') return [];
  try {
    const savedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!savedFavorites) return [];
    const parsed = JSON.parse(savedFavorites);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item.id === 'string');
    }
    return [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    try { window.localStorage.removeItem(FAVORITES_STORAGE_KEY); } catch {}
    return [];
  }
};

// Provider component
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const favorites = readFavoritesFromStorage();
    if (favorites.length > 0) {
      dispatch({ type: 'LOAD_FAVORITES', payload: favorites });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
    setHydrated(true);
  }, []);

  // Cross-tab sync with lightweight debounce
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let syncTimer: number | null = null;
    const scheduleSync = () => {
      if (syncTimer) window.clearTimeout(syncTimer);
      syncTimer = window.setTimeout(() => {
        dispatch({ type: 'LOAD_FAVORITES', payload: readFavoritesFromStorage() });
      }, 50);
    };
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === FAVORITES_STORAGE_KEY) {
        scheduleSync();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      if (syncTimer) window.clearTimeout(syncTimer);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (!state.isLoading && hydrated) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites));
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
      }
    }
  }, [hydrated, state.favorites, state.isLoading]);

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
      {hydrated ? children : null}
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