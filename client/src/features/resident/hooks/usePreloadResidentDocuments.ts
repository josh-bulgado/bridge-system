import { useEffect } from 'react';
import { secureFileCache } from '@/lib/image-cache';

interface VerificationHistoryItem {
  governmentIdFrontUrl?: string;
  governmentIdBackUrl?: string;
  proofOfResidencyUrl?: string;
}

interface ResidentWithDocuments {
  governmentIdFrontUrl?: string;
  governmentIdBackUrl?: string;
  proofOfResidencyUrl?: string;
  verificationHistory?: VerificationHistoryItem[];
}

/**
 * Hook to preload resident verification documents
 * Call this when opening resident details modal to improve performance
 * Now includes history documents for instant loading
 */
export function usePreloadResidentDocuments(resident: ResidentWithDocuments | null, enabled = true) {
  useEffect(() => {
    if (!enabled || !resident) return;

    const urls: string[] = [];
    
    // Preload current submission documents
    if (resident.governmentIdFrontUrl) urls.push(resident.governmentIdFrontUrl);
    if (resident.governmentIdBackUrl) urls.push(resident.governmentIdBackUrl);
    if (resident.proofOfResidencyUrl) urls.push(resident.proofOfResidencyUrl);
    
    // Preload history documents
    if (resident.verificationHistory && resident.verificationHistory.length > 0) {
      resident.verificationHistory.forEach((entry) => {
        if (entry.governmentIdFrontUrl) urls.push(entry.governmentIdFrontUrl);
        if (entry.governmentIdBackUrl) urls.push(entry.governmentIdBackUrl);
        if (entry.proofOfResidencyUrl) urls.push(entry.proofOfResidencyUrl);
      });
    }
    
    if (urls.length > 0) {
      secureFileCache.preloadFiles(urls).catch(err => {
        console.warn('Failed to preload resident documents:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    resident?.governmentIdFrontUrl, 
    resident?.governmentIdBackUrl, 
    resident?.proofOfResidencyUrl,
    resident?.verificationHistory?.length,
    enabled
  ]);
}
