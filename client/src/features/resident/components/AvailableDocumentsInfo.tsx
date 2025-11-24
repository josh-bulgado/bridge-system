import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  Loader2,
  AlertCircle,
  PhilippinePeso,
} from "lucide-react";
import { useFetchActiveDocuments } from "@/features/document/hooks/useFetchActiveDocuments";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AvailableDocumentsInfo: React.FC = () => {
  const { data: documents, isLoading, isError } = useFetchActiveDocuments();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Documents</CardTitle>
        <CardDescription>
          Documents you can request once your residency is verified
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load available documents. Please try again later.
            </AlertDescription>
          </Alert>
        ) : !documents || documents.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No documents available at the moment.
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="hover:bg-muted/50 rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="text-muted-foreground h-4 w-4" />
                      <h4 className="font-medium">{doc.name}</h4>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{doc.processingTime}</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <PhilippinePeso className="h-3 w-3" />
                        <span>
                          {doc.price === 0
                            ? "Free"
                            : `₱${doc.price.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="whitespace-nowrap">
                    Requires Verification
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
