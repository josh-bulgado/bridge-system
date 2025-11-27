/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Clock,
  PhilippinePeso,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useFetchActiveDocuments } from "@/features/document/hooks/useFetchActiveDocuments";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnhancedAvailableDocumentsProps {
  isVerified?: boolean;
  onRequestDocument?: (documentId: string) => void;
}

export const EnhancedAvailableDocuments: React.FC<EnhancedAvailableDocumentsProps> = ({
  isVerified = false,
  onRequestDocument,
}) => {
  const { data: documents, isLoading, isError } = useFetchActiveDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "time">("name");

  // Filter and sort documents
  const filteredAndSortedDocuments = React.useMemo(() => {
    if (!documents) return [];

    const filtered = documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "time":
          return a.processingTime.localeCompare(b.processingTime);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [documents, searchQuery, sortBy]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Available Documents</CardTitle>
            <CardDescription className="mt-1">
              {isVerified
                ? "Request any document you need"
                : "Documents available after verification"}
            </CardDescription>
          </div>
          {documents && documents.length > 0 && (
            <Badge variant="secondary" className="w-fit">
              {documents.length} {documents.length === 1 ? "Document" : "Documents"}
            </Badge>
          )}
        </div>

        {/* Search and Filter */}
        {documents && documents.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-40 h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="time">Sort by Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load available documents. Please try again later.
            </AlertDescription>
          </Alert>
        ) : !documents || documents.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No documents available at the moment.</p>
          </div>
        ) : filteredAndSortedDocuments.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No documents match your search.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedDocuments.map((doc) => (
              <Card
                key={doc.id}
                className={cn(
                  "relative overflow-hidden transition-colors duration-200",
                  "hover:border-green-500 dark:hover:border-green-500",
                  !isVerified && "opacity-70"
                )}
              >
                <CardContent className="p-5">
                  {/* Document Icon/Badge */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-lg bg-green-100 dark:bg-green-950 p-3">
                      <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    {!isVerified && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                      >
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </div>

                  {/* Document Name */}
                  <h3 className="font-semibold text-base mb-3 line-clamp-2">
                    {doc.name}
                  </h3>

                  {/* Document Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{doc.processingTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <PhilippinePeso className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="font-semibold">
                        {doc.price === 0 ? (
                          <span className="text-green-600 dark:text-green-400">Free</span>
                        ) : (
                          `₱${doc.price.toFixed(2)}`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    size="default"
                    variant={isVerified ? "default" : "outline"}
                    disabled={!isVerified}
                    onClick={() => isVerified && onRequestDocument?.(doc.id)}
                  >
                    {isVerified ? (
                      <>
                        Request Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Verification Required
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
