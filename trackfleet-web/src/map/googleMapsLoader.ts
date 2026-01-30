let googleMapsPromise: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise(async (resolve, reject) => {
    try {
      if (!window.google || !window.google.maps) {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          reject(new Error("Google Maps API key not found"));
          return;
        }

        await new Promise<void>((res, rej) => {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
          script.async = true;
          script.defer = true;
          script.onload = () => res();
          script.onerror = rej;
          document.head.appendChild(script);
        });
      }

      // ✅ IMPORTAÇÃO MODULAR CORRETA
      await google.maps.importLibrary("maps");
      await google.maps.importLibrary("marker");
      await google.maps.importLibrary("geometry");

      // 🔒 validação final
      if (
        !google.maps.marker?.AdvancedMarkerElement ||
        !google.maps.geometry?.spherical
      ) {
        reject(
          new Error(
            "Google Maps libraries loaded, but AdvancedMarker or Geometry not available"
          )
        );
        return;
      }

      resolve();
    } catch (err) {
      reject(err);
    }
  });

  return googleMapsPromise;
}
