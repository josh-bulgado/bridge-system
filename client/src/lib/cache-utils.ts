/**
 * Utility functions for cache management
 */

import { QueryClient } from '@tanstack/react-query';
import { secureFileCache } from './image-cache';
import { CACHE_INVALIDATION } from './cache-config';

/**
 * Clear all caches (both React Query and file cache)
 * Useful for logout or when user needs to refresh all data
 */
export async function clearAllCaches(queryClient: QueryClient): Promise<void> {
  // Clear React Query cache
  await queryClient.clear();
  
  // Clear file cache
  await secureFileCache.clearAll();
}

/**
 * Selectively clear caches for specific features
 */
export async function clearFeatureCache(
  queryClient: QueryClient,
  feature: 'residents' | 'documentRequests' | 'documents' | 'stats'
): Promise<void> {
  const invalidationKey = CACHE_INVALIDATION[feature]();
  await queryClient.invalidateQueries({ queryKey: invalidationKey });
}

/**
 * Preload files for a resident's verification documents
 * Includes history documents if available
 */
export async function preloadResidentDocuments(resident: {
  governmentIdFrontUrl?: string;
  governmentIdBackUrl?: string;
  proofOfResidencyUrl?: string;
  verificationHistory?: Array<{
    governmentIdFrontUrl?: string;
    governmentIdBackUrl?: string;
    proofOfResidencyUrl?: string;
  }>;
}): Promise<void> {
  const urls: string[] = [];
  
  // Current submission documents
  if (resident.governmentIdFrontUrl) urls.push(resident.governmentIdFrontUrl);
  if (resident.governmentIdBackUrl) urls.push(resident.governmentIdBackUrl);
  if (resident.proofOfResidencyUrl) urls.push(resident.proofOfResidencyUrl);
  
  // History documents
  if (resident.verificationHistory) {
    resident.verificationHistory.forEach((entry) => {
      if (entry.governmentIdFrontUrl) urls.push(entry.governmentIdFrontUrl);
      if (entry.governmentIdBackUrl) urls.push(entry.governmentIdBackUrl);
      if (entry.proofOfResidencyUrl) urls.push(entry.proofOfResidencyUrl);
    });
  }
  
  if (urls.length > 0) {
    await secureFileCache.preloadFiles(urls);
  }
}

/**
 * Preload files for document request attachments
 */
export async function preloadDocumentRequestFiles(request: {
  paymentProofUrl?: string;
  additionalDocumentsUrls?: string[];
}): Promise<void> {
  const urls: string[] = [];
  
  if (request.paymentProofUrl) urls.push(request.paymentProofUrl);
  if (request.additionalDocumentsUrls) urls.push(...request.additionalDocumentsUrls);
  
  if (urls.length > 0) {
    await secureFileCache.preloadFiles(urls);
  }
}
