/**
 * Centralized cache configuration for React Query
 * Defines cache times and strategies for different data types
 */

export const CACHE_TIMES = {
  // Short-lived cache for frequently changing data
  SHORT: 30 * 1000, // 30 seconds
  
  // Medium-lived cache for moderately stable data
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  
  // Long-lived cache for stable data
  LONG: 15 * 60 * 1000, // 15 minutes
  
  // Very long cache for rarely changing data
  VERY_LONG: 30 * 60 * 1000, // 30 minutes
} as const;

export const GC_TIMES = {
  // Garbage collection times - how long unused data stays in cache
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 10 * 60 * 1000, // 10 minutes
  VERY_LONG: 30 * 60 * 1000, // 30 minutes
} as const;

/**
 * Cache strategies for different data types
 */
export const CACHE_STRATEGIES = {
  // Document requests - moderate caching
  DOCUMENT_REQUESTS: {
    staleTime: CACHE_TIMES.SHORT,
    gcTime: GC_TIMES.MEDIUM,
  },
  
  // Single document request details - longer cache
  DOCUMENT_REQUEST_DETAIL: {
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: GC_TIMES.LONG,
  },
  
  // Resident list - moderate caching
  RESIDENTS: {
    staleTime: CACHE_TIMES.MEDIUM,
    gcTime: GC_TIMES.LONG,
  },
  
  // Single resident details - longer cache
  RESIDENT_DETAIL: {
    staleTime: CACHE_TIMES.LONG,
    gcTime: GC_TIMES.VERY_LONG,
  },
  
  // Documents/Templates - long cache (rarely change)
  DOCUMENTS: {
    staleTime: CACHE_TIMES.LONG,
    gcTime: GC_TIMES.VERY_LONG,
  },
  
  // Configuration data - very long cache
  CONFIG: {
    staleTime: CACHE_TIMES.VERY_LONG,
    gcTime: GC_TIMES.VERY_LONG,
  },
  
  // Stats/Dashboard data - short cache (frequently updated)
  STATS: {
    staleTime: CACHE_TIMES.SHORT,
    gcTime: GC_TIMES.SHORT,
  },
} as const;

/**
 * Query key factories for consistent cache keys
 * Helps with cache invalidation and management
 */
export const QUERY_KEYS = {
  // Resident-related keys
  residents: ['residents'] as const,
  residentList: () => [...QUERY_KEYS.residents, 'list'] as const,
  residentDetail: (id: string) => [...QUERY_KEYS.residents, 'detail', id] as const,
  residentsByStatus: (status: string) => [...QUERY_KEYS.residents, 'status', status] as const,
  residentSearch: (query: string) => [...QUERY_KEYS.residents, 'search', query] as const,
  
  // Document request keys
  documentRequests: ['documentRequests'] as const,
  documentRequestList: (params?: Record<string, any>) => 
    [...QUERY_KEYS.documentRequests, 'list', params] as const,
  documentRequestDetail: (id: string) => 
    [...QUERY_KEYS.documentRequests, 'detail', id] as const,
  myDocumentRequests: (params?: Record<string, any>) => 
    [...QUERY_KEYS.documentRequests, 'my', params] as const,
  
  // Document/Template keys
  documents: ['documents'] as const,
  documentList: () => [...QUERY_KEYS.documents, 'list'] as const,
  documentDetail: (id: string) => [...QUERY_KEYS.documents, 'detail', id] as const,
  activeDocuments: () => [...QUERY_KEYS.documents, 'active'] as const,
  
  // Stats keys
  stats: ['stats'] as const,
  residentStats: () => [...QUERY_KEYS.stats, 'resident'] as const,
  staffStats: () => [...QUERY_KEYS.stats, 'staff'] as const,
  
  // Config keys
  config: ['config'] as const,
  barangayConfig: () => [...QUERY_KEYS.config, 'barangay'] as const,
  gcashConfig: () => [...QUERY_KEYS.config, 'gcash'] as const,
} as const;

/**
 * Cache invalidation helpers
 */
export const CACHE_INVALIDATION = {
  // Invalidate all resident-related queries
  residents: () => QUERY_KEYS.residents,
  
  // Invalidate all document request queries
  documentRequests: () => QUERY_KEYS.documentRequests,
  
  // Invalidate all document queries
  documents: () => QUERY_KEYS.documents,
  
  // Invalidate all stats
  stats: () => QUERY_KEYS.stats,
} as const;
