import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipWrapper } from "../wrappers/TooltipWrapper";
import { FileText } from "lucide-react"; // Using Lucide icon for PDF

interface PDFCardProps {
  id: string; // Add document ID
  title: string;
  description?: string | null;
  author: string;
  authorImage?: string | null;
  pageCount?: number | null;
  lastUpdated?: string | null;
}

const PDFCard = ({
  id,
  title,
  description,
  author,
  authorImage,
  pageCount,
  lastUpdated,
}: PDFCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description || "No description provided."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <div className="h-48 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-2">
          <div className="text-center p-4">
            <FileText className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400" />
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {pageCount && `${pageCount} pages`}
              {lastUpdated && ` • Updated ${new Date(lastUpdated).toLocaleDateString()}`}
              {!lastUpdated && !pageCount && <span className="text-gray-400">No details available</span>}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={authorImage || "/default-avatar.png"} />
            <AvatarFallback>
              {author.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{author}</span>
        </div>

        <TooltipWrapper content="View PDF document">
          <Button asChild size="sm" variant="outline">
            {/* Link to the document's detail page */}
            <Link href={`/documents/${id}`}>
              View PDF
            </Link>
          </Button>
        </TooltipWrapper>
      </CardFooter>
    </Card>
  );
};

export default PDFCard;
