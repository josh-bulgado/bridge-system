import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { StatCard } from '@/components/ui/stat-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Download,
  Eye,
  QrCode,
  CheckCircle,
  Clock,
  Smartphone,
  Building2,
  User,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  DocumentRequest,
  GeneratedDocument,
  DocumentGenerationStats,
  ClaimVerification,
} from '../types/document';

// Mock data
const mockStats: DocumentGenerationStats = {
  readyForRelease: { count: 12, change: 8 },
  generatedToday: { count: 45, change: 15 },
  digitalDownloads: { count: 128, change: 22 },
};

const mockReadyForRelease: DocumentRequest[] = [
  {
    id: '1',
    trackingNumber: 'BR-2024-001',
    documentType: 'Barangay Clearance',
    residentName: 'Juan Dela Cruz',
    purpose: 'Employment',
    amount: 150,
    approvalDate: new Date('2024-01-15'),
    preferredDelivery: 'digital',
    status: 'ready_for_release',
  },
  {
    id: '2',
    trackingNumber: 'CR-2024-002',
    documentType: 'Certificate of Residency',
    residentName: 'Maria Santos',
    purpose: 'Bank Account Opening',
    amount: 100,
    approvalDate: new Date('2024-01-14'),
    preferredDelivery: 'physical',
    status: 'ready_for_release',
  },
  {
    id: '3',
    trackingNumber: 'CI-2024-003',
    documentType: 'Certificate of Indigency',
    residentName: 'Pedro Garcia',
    purpose: 'Medical Assistance',
    amount: 50,
    approvalDate: new Date('2024-01-13'),
    preferredDelivery: 'digital',
    status: 'ready_for_release',
  },
];

const mockGeneratedDocuments: GeneratedDocument[] = [
  {
    id: '1',
    documentId: 'DOC-2024-001',
    trackingNumber: 'BR-2024-001',
    documentType: 'Barangay Clearance',
    residentName: 'Ana Rodriguez',
    generatedAt: new Date('2024-01-15T10:30:00'),
    deliveryMethod: 'digital',
    status: 'completed',
    downloadCount: 3,
  },
  {
    id: '2',
    documentId: 'DOC-2024-002',
    trackingNumber: 'CR-2024-002',
    documentType: 'Certificate of Residency',
    residentName: 'Carlos Mendoza',
    generatedAt: new Date('2024-01-15T09:15:00'),
    deliveryMethod: 'physical',
    status: 'ready_for_pickup',
  },
  {
    id: '3',
    documentId: 'DOC-2024-003',
    trackingNumber: 'CI-2024-003',
    documentType: 'Certificate of Indigency',
    residentName: 'Elena Vasquez',
    generatedAt: new Date('2024-01-14T16:45:00'),
    deliveryMethod: 'digital',
    status: 'completed',
    downloadCount: 1,
  },
  {
    id: '4',
    documentId: 'DOC-2024-004',
    trackingNumber: 'BR-2024-004',
    documentType: 'Barangay Clearance',
    residentName: 'Miguel Torres',
    generatedAt: new Date('2024-01-14T14:20:00'),
    deliveryMethod: 'physical',
    status: 'ready_for_pickup',
  },
];

// Radio Group Component
interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ value, onValueChange, children, className }) => {
  return (
    <div className={cn("space-y-3", className)} role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            selectedValue: value, 
            onValueChange 
          } as any);
        }
        return child;
      })}
    </div>
  );
};

interface RadioGroupItemProps {
  value: string;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ 
  value, 
  selectedValue, 
  onValueChange, 
  children, 
  className 
}) => {
  const isSelected = selectedValue === value;
  
  return (
    <label 
      className={cn(
        "flex items-start space-x-3 cursor-pointer p-4 rounded-lg border transition-colors",
        isSelected ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50",
        className
      )}
    >
      <input
        type="radio"
        value={value}
        checked={isSelected}
        onChange={() => onValueChange?.(value)}
        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <div className="flex-1">{children}</div>
    </label>
  );
};

const DocumentGeneration: React.FC = () => {
  const [readyForRelease] = useState<DocumentRequest[]>(mockReadyForRelease);
  const [generatedDocuments] = useState<GeneratedDocument[]>(mockGeneratedDocuments);
  const [stats] = useState<DocumentGenerationStats>(mockStats);
  
  // Modal states
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<GeneratedDocument | null>(null);
  
  // Form states
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<'digital' | 'physical'>('digital');
  const [claimVerification, setClaimVerification] = useState<Partial<ClaimVerification>>({
    validIdPresented: '',
    claimerType: 'requester',
    claimerName: '',
    relationship: '',
    staffNotes: '',
    identityVerified: false,
  });
  const [, setAuthFile] = useState<File | null>(null);

  const handleGenerateRelease = (request: DocumentRequest) => {
    setSelectedRequest(request);
    setSelectedDeliveryMethod(request.preferredDelivery);
    setDeliveryModalOpen(true);
  };

  const handleMarkAsClaimed = (document: GeneratedDocument) => {
    setSelectedDocument(document);
    setClaimModalOpen(true);
  };

  const handleConfirmGeneration = () => {
    if (selectedRequest) {
      console.log('Generating document:', {
        request: selectedRequest,
        deliveryMethod: selectedDeliveryMethod,
      });
      setDeliveryModalOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleConfirmClaim = () => {
    if (selectedDocument && claimVerification.identityVerified) {
      console.log('Marking as claimed:', {
        document: selectedDocument,
        verification: claimVerification,
        staffName: 'Current Staff Member',
        claimedAt: new Date(),
      });
      setClaimModalOpen(false);
      setSelectedDocument(null);
      setClaimVerification({
        validIdPresented: '',
        claimerType: 'requester',
        claimerName: '',
        relationship: '',
        staffNotes: '',
        identityVerified: false,
      });
      setAuthFile(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Ready for Release"
          value={stats.readyForRelease.count}
          change={stats.readyForRelease.change}
          icon={<Clock className="h-6 w-6" />}
          color="orange"
        />
        <StatCard
          title="Generated Today"
          value={stats.generatedToday.count}
          change={stats.generatedToday.change}
          icon={<CheckCircle className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Digital Downloads"
          value={stats.digitalDownloads.count}
          change={stats.digitalDownloads.change}
          icon={<Download className="h-6 w-6" />}
          color="blue"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Ready for Release */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Ready for Document Release
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {readyForRelease.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg border bg-amber-50 border-amber-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {request.documentType}
                        </h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          PAID
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.residentName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {request.preferredDelivery === 'digital' ? (
                        <>
                          <Smartphone className="h-3 w-3" />
                          Digital
                        </>
                      ) : (
                        <>
                          <Building2 className="h-3 w-3" />
                          Physical
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Tracking:</span>
                      <p className="font-medium">{request.trackingNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Purpose:</span>
                      <p className="font-medium">{request.purpose}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-medium">₱{request.amount}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Approved:</span>
                      <p className="font-medium">{formatDate(request.approvalDate)}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleGenerateRelease(request)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Generate & Release
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recently Generated */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recently Generated Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    doc.deliveryMethod === 'digital'
                      ? "bg-blue-50 border-blue-200"
                      : "bg-purple-50 border-purple-200"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {doc.documentType}
                        </h4>
                        <Badge 
                          className={cn(
                            doc.status === 'completed' 
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-orange-100 text-orange-800 border-orange-200"
                          )}
                        >
                          {doc.status === 'completed' ? 'Completed' : 'Ready for Pickup'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {doc.residentName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span>Tracking:</span>
                      <span className="font-medium">{doc.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Document ID:</span>
                      <span className="font-medium">{doc.documentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Generated:</span>
                      <span className="font-medium">
                        {formatDate(doc.generatedAt)} at {formatTime(doc.generatedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className="font-medium capitalize">
                        {doc.deliveryMethod === 'digital' ? 'Digital Download' : 'Physical Pickup'}
                      </span>
                    </div>
                    {doc.deliveryMethod === 'digital' && doc.downloadCount !== undefined && (
                      <div className="flex justify-between">
                        <span>Downloads:</span>
                        <span className="font-medium">Downloaded {doc.downloadCount} times</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <QrCode className="h-3 w-3 mr-1" />
                      QR Code
                    </Button>
                    {doc.deliveryMethod === 'physical' && doc.status === 'ready_for_pickup' && (
                      <Button 
                        onClick={() => handleMarkAsClaimed(doc)}
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        Mark as Claimed
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delivery Method Modal */}
      <Dialog open={deliveryModalOpen} onOpenChange={setDeliveryModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose Delivery Method</DialogTitle>
            <DialogDescription>
              Select how the document should be delivered to the resident.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Request Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Document:</span>
                    <p className="font-medium">{selectedRequest.documentType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Resident:</span>
                    <p className="font-medium">{selectedRequest.residentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tracking:</span>
                    <p className="font-medium">{selectedRequest.trackingNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Purpose:</span>
                    <p className="font-medium">{selectedRequest.purpose}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Delivery Method
                </Label>
                <RadioGroup
                  value={selectedDeliveryMethod}
                  onValueChange={(value) => setSelectedDeliveryMethod(value as 'digital' | 'physical')}
                >
                  <RadioGroupItem value="digital">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 mt-0.5 text-blue-600" />
                      <div>
                        <div className="font-medium">Digital Download</div>
                        <div className="text-sm text-gray-500 mt-1">
                          • Instant delivery via email/SMS
                          • Secure download link with QR code
                          • Environmentally friendly
                          • Accessible anytime, anywhere
                        </div>
                      </div>
                    </div>
                  </RadioGroupItem>
                  
                  <RadioGroupItem value="physical">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 mt-0.5 text-purple-600" />
                      <div>
                        <div className="font-medium">Physical Pickup</div>
                        <div className="text-sm text-gray-500 mt-1">
                          • Official printed document
                          • Requires in-person pickup
                          • Valid ID verification required
                          • Barangay office hours: 8AM-5PM
                        </div>
                      </div>
                    </div>
                  </RadioGroupItem>
                </RadioGroup>
              </div>

              {/* Resident Preference Note */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700">
                    Resident's preference: 
                    <span className="font-medium ml-1 capitalize">
                      {selectedRequest.preferredDelivery}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeliveryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmGeneration}>
              Generate Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Claimed Modal */}
      <Dialog open={claimModalOpen} onOpenChange={setClaimModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mark Document as Claimed</DialogTitle>
            <DialogDescription>
              Verify the identity of the person claiming the document.
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-6">
              {/* Document Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Document Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Document:</span>
                    <p className="font-medium">{selectedDocument.documentType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Resident:</span>
                    <p className="font-medium">{selectedDocument.residentName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Document ID:</span>
                    <p className="font-medium">{selectedDocument.documentId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tracking:</span>
                    <p className="font-medium">{selectedDocument.trackingNumber}</p>
                  </div>
                </div>
              </div>

              {/* ID Verification */}
              <div className="space-y-4">
                <h4 className="font-semibold">ID Verification</h4>
                
                <div>
                  <Label htmlFor="validId">Valid ID Presented *</Label>
                  <Input
                    id="validId"
                    value={claimVerification.validIdPresented || ''}
                    onChange={(e) => setClaimVerification(prev => ({
                      ...prev,
                      validIdPresented: e.target.value
                    }))}
                    placeholder="e.g., Driver's License, UMID, SSS ID"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Claimer
                  </Label>
                  <RadioGroup
                    value={claimVerification.claimerType || 'requester'}
                    onValueChange={(value) => setClaimVerification(prev => ({
                      ...prev,
                      claimerType: value as 'requester' | 'representative'
                    }))}
                  >
                    <RadioGroupItem value="requester">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Original Requester</span>
                      </div>
                    </RadioGroupItem>
                    
                    <RadioGroupItem value="representative">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Authorized Representative</span>
                      </div>
                    </RadioGroupItem>
                  </RadioGroup>
                </div>

                {claimVerification.claimerType === 'representative' && (
                  <div className="space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <Label htmlFor="claimerName">Representative Name *</Label>
                      <Input
                        id="claimerName"
                        value={claimVerification.claimerName || ''}
                        onChange={(e) => setClaimVerification(prev => ({
                          ...prev,
                          claimerName: e.target.value
                        }))}
                        placeholder="Full name of representative"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="relationship">Relationship to Requester *</Label>
                      <Input
                        id="relationship"
                        value={claimVerification.relationship || ''}
                        onChange={(e) => setClaimVerification(prev => ({
                          ...prev,
                          relationship: e.target.value
                        }))}
                        placeholder="e.g., Spouse, Child, Sibling"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="authLetter">Authorization Letter *</Label>
                      <div className="mt-1">
                        <Input
                          id="authLetter"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setAuthFile(file);
                          }}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Upload signed authorization letter (PDF, JPG, PNG)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="staffNotes">Staff Notes (Optional)</Label>
                  <Textarea
                    id="staffNotes"
                    value={claimVerification.staffNotes || ''}
                    onChange={(e) => setClaimVerification(prev => ({
                      ...prev,
                      staffNotes: e.target.value
                    }))}
                    placeholder="Any additional observations or notes..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="identityVerified"
                    checked={claimVerification.identityVerified || false}
                    onCheckedChange={(checked) => setClaimVerification(prev => ({
                      ...prev,
                      identityVerified: Boolean(checked)
                    }))}
                  />
                  <Label htmlFor="identityVerified" className="text-sm font-medium">
                    I have verified the claimer's identity and authorization
                  </Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setClaimModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmClaim}
              disabled={!claimVerification.identityVerified || !claimVerification.validIdPresented}
            >
              Confirm Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentGeneration;