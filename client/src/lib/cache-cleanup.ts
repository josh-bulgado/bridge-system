/**
 * Cache cleanup utilities
 * Automatically clears caches on specific events (logout, session end, etc.)
 */

import { QueryClient } from '@tanstack/react-query';
import { secureFileCache } from './image-cache';

/**
 * Clear all application caches
 * Should be called on:
 * - User logout
 * - Session expiration
 * - Manual cache clear request
 */
export async function clearAllApplicationCaches(queryClient: QueryClient): Promise<void> {
  try {
    // Clear React Query cache
    queryClient.clear();
    
    // Clear secure file cache
    await secureFileCache.clearAll();
    
    console.log('All application caches cleared successfully');
  } catch (error) {
    console.error('Error clearing application caches:', error);
  }
}

/**
 * Setup cache cleanup listeners
 * Automatically clears cache on logout and session events
 */
export function setupCacheCleanupListeners(queryClient: QueryClient): void {
  // Listen for logout events
  window.addEventListener('logout', async () => {
    await clearAllApplicationCaches(queryClient);
  });

  // Listen for storage changes (logout in another tab)
  window.addEventListener('storage', async (event) => {
    if (event.key === 'auth_token' && event.newValue === null) {
      // Token removed, clear caches
      await clearAllApplicationCaches(queryClient);
    }
  });

  // Clear expired file cache periodically (every 5 minutes)
  setInterval(() => {
    secureFileCache.cleanupExpired().catch((err) => {
      console.error('Error during periodic cache cleanup:', err);
    });
  }, 5 * 60 * 1000);
}

/**
 * Trigger logout event
 * Call this when user logs out to ensure all caches are cleared
 */
export function triggerLogoutEvent(): void {
  window.dispatchEvent(new Event('logout'));
}
