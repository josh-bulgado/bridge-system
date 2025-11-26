import { useState, useEffect } from 'react';
import { secureFileCache } from '@/lib/image-cache';

/**
 * Hook to fetch and cache images/PDFs with authentication
 * Returns a local object URL that can be used directly in img/iframe tags
 */
export const useCachedImage = (url: string | undefined | null) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setObjectUrl(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    let currentObjectUrl: string | null = null;

    setLoading(true);
    setError(null);

    secureFileCache
      .fetchAndCache(url)
      .then((objUrl) => {
        if (mounted) {
          currentObjectUrl = objUrl;
          setObjectUrl(objUrl);
          setLoading(false);
        } else {
          // Component unmounted, clean up immediately
          URL.revokeObjectURL(objUrl);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
      // Cleanup object URL when component unmounts or URL changes
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [url]);

  return { objectUrl, loading, error };
};

/**
 * Hook to preload multiple images/files for better UX
 * Useful when you know user will likely view certain files
 */
export const usePreloadFiles = (urls: (string | undefined | null)[]) => {
  const [preloading, setPreloading] = useState(false);

  useEffect(() => {
    const validUrls = urls.filter((url): url is string => !!url);
    
    if (validUrls.length === 0) return;

    setPreloading(true);

    secureFileCache
      .preloadFiles(validUrls)
      .then(() => setPreloading(false))
      .catch((err) => {
        console.warn('Some files failed to preload:', err);
        setPreloading(false);
      });
  }, [urls.join(',')]);

  return { preloading };
};
