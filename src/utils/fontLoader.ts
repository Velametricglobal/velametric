// Utility to dynamically load Google Fonts into the document head
// This ensures fonts are available for PDF generation via window.print()

const loadedFonts = new Set<string>();

export const loadGoogleFont = (fontFamily: string, weights: number[] = [400, 500, 600, 700]): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Basic sanitization
    const cleanFontName = fontFamily.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
    if (!cleanFontName) {
      resolve();
      return;
    }

    const fontKey = `${cleanFontName}-${weights.join(',')}`;
    
    // Check cache
    if (loadedFonts.has(fontKey)) {
      resolve();
      return;
    }

    // Format for Google Fonts API: e.g., 'Open Sans' -> 'Open+Sans'
    const formattedName = cleanFontName.replace(/\s+/g, '+');
    const weightString = weights.join(';');
    
    const url = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@${weightString}&display=swap`;

    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    
    link.onload = () => {
      loadedFonts.add(fontKey);
      resolve();
    };
    
    link.onerror = () => {
      console.warn(`Failed to load font: ${fontFamily}`);
      // Resolve anyway so we don't break the app, it will fallback to sans-serif
      resolve();
    };

    document.head.appendChild(link);
  });
};
