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

    let filtered = documents.filter((doc) =>
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
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Available Documents</CardTitle>
            <CardDescription>
              {isVerified
                ? "Request any document you need"
                : "Documents available after verification"}
            </CardDescription>
          </div>
          {documents && documents.length > 0 && (
            <Badge variant="secondary" className="w-fit text-xs py-0">
              {documents.length} {documents.length === 1 ? "Doc" : "Docs"}
            </Badge>
          )}
        </div>

        {/* Search and Filter */}
        {documents && documents.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm bg-background border-border/60"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[160px] h-9">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedDocuments.map((doc) => (
              <Card
                key={doc.id}
                className={cn(
                  "group relative overflow-hidden transition-all duration-200",
                  "border-border/40 hover:border-primary/50",
                  "hover:shadow-md",
                  !isVerified && "opacity-75"
                )}
              >
                <CardContent className="p-3">
                  {/* Document Icon/Badge */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    {!isVerified && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 text-[10px] py-0"
                      >
                        <ShieldAlert className="h-3 w-3 mr-0.5" />
                        Locked
                      </Badge>
                    )}
                  </div>

                  {/* Document Name */}
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {doc.name}
                  </h3>

                  {/* Document Info */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{doc.processingTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <PhilippinePeso className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium">
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
                    className="w-full h-8"
                    size="sm"
                    variant={isVerified ? "default" : "outline"}
                    disabled={!isVerified}
                    onClick={() => isVerified && onRequestDocument?.(doc.id)}
                  >
                    {isVerified ? (
                      <>
                        Request
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
                        Locked
                      </>
                    )}
                  </Button>
                </CardContent>

                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
