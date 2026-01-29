// src/map/googleMapsLoader.ts

let googleMapsPromise: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    if ((window as any).google?.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject("Erro ao carregar Google Maps");

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
