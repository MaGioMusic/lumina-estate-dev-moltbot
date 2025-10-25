'use client';

import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

let loaderInitialized = false;

function getApiKey(): string {
  // Prefer env, fallback only for local dev if env not provided
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDy3CyUuZv27r4JDA2xjFD9iZU0MQP6Ikg';
}

export function ensureMapsLoader(): void {
  if (loaderInitialized) return;
  const apiKey = getApiKey();
  // setOptions expects { key, v } in current @googlemaps/js-api-loader types
  setOptions({ key: apiKey, v: 'weekly' });
  loaderInitialized = true;
}

export async function loadMaps() {
  ensureMapsLoader();
  return (await importLibrary('maps')) as google.maps.MapsLibrary;
}

export async function loadMarker() {
  ensureMapsLoader();
  return (await importLibrary('marker')) as google.maps.MarkerLibrary;
}

export async function loadPlaces() {
  ensureMapsLoader();
  return (await importLibrary('places')) as google.maps.PlacesLibrary;
}


