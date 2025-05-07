import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import DocumentViewer from "./DocumentViewer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DocumentCardProps {
    title: string;
    description?: string | null;
    url: string;
    author: string;
    authorImage?: string | null;
}

const DocumentCard = ({
    title,
    description,
    url,
    author,
    authorImage,
}: DocumentCardProps) => {
    return (
        <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
                <CardTitle className="truncate">{title}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {description || "No description provided."}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0 flex-1">
                <DocumentViewer pdfPath={url} />
            </CardContent>

            <CardFooter className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={authorImage || undefined} />
                        <AvatarFallback>
                            {author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{author}</span>
                </div>

                <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="gap-1"
                >
                    <a href={url} download>
                        <Download className="w-4 h-4" />
                        Download
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DocumentCard;
