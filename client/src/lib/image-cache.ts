/**
 * Secure image and file caching utility
 * Caches images and PDFs with authentication headers in IndexedDB
 * Automatically handles expiration and cleanup
 */

interface CachedFile {
  url: string;
  blob: Blob;
  timestamp: number;
  contentType: string;
  expiresAt: number;
}

const DB_NAME = 'SecureFileCache';
const STORE_NAME = 'files';
const DB_VERSION = 1;

// Cache duration: 15 minutes for images/PDFs
const CACHE_DURATION = 15 * 60 * 1000;

class SecureFileCache {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize IndexedDB
   */
  private async init(): Promise<void> {
    if (this.db) return;
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
          store.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Fetch file with authentication and cache it
   */
  async fetchAndCache(url: string): Promise<string> {
    await this.init();

    // Check cache first
    const cached = await this.getFromCache(url);
    if (cached) {
      return cached;
    }

    // Fetch with authentication
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

      // Store in cache
      await this.storeInCache(url, blob, contentType);

      // Return object URL
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  /**
   * Get file from cache if not expired
   */
  private async getFromCache(url: string): Promise<string | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onsuccess = () => {
        const cached = request.result as CachedFile | undefined;
        
        if (!cached) {
          resolve(null);
          return;
        }

        // Check if expired
        if (Date.now() > cached.expiresAt) {
          // Remove expired entry
          this.removeFromCache(url);
          resolve(null);
          return;
        }

        // Return object URL from cached blob
        resolve(URL.createObjectURL(cached.blob));
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Store file in cache
   */
  private async storeInCache(url: string, blob: Blob, contentType: string): Promise<void> {
    if (!this.db) return;

    const now = Date.now();
    const cachedFile: CachedFile = {
      url,
      blob,
      timestamp: now,
      contentType,
      expiresAt: now + CACHE_DURATION,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(cachedFile);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Remove file from cache
   */
  private async removeFromCache(url: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(url);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all cached files
   */
  async clearAll(): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clean up expired files
   */
  async cleanupExpired(): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('expiresAt');
      const now = Date.now();

      // Get all expired entries
      const range = IDBKeyRange.upperBound(now);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Preload multiple files (for optimization)
   */
  async preloadFiles(urls: string[]): Promise<void> {
    const promises = urls.map(url => 
      this.fetchAndCache(url).catch(err => {
        console.warn(`Failed to preload ${url}:`, err);
      })
    );
    
    await Promise.allSettled(promises);
  }
}

// Export singleton instance
export const secureFileCache = new SecureFileCache();

// Clean up expired files on load
secureFileCache.cleanupExpired().catch(console.error);

// Periodic cleanup (every 5 minutes)
setInterval(() => {
  secureFileCache.cleanupExpired().catch(console.error);
}, 5 * 60 * 1000);

/**
 * Hook for easy usage in React components
 */
export const useCachedFile = (url: string | undefined) => {
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!url) {
      setObjectUrl(null);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    secureFileCache
      .fetchAndCache(url)
      .then(objUrl => {
        if (mounted) {
          setObjectUrl(objUrl);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
      // Cleanup object URL
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  return { objectUrl, loading, error };
};

// Import React for the hook
import * as React from 'react';
