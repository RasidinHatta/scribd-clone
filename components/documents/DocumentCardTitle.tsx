import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import React from 'react'
import { TooltipWrapper } from "../wrappers/TooltipWrapper";
import DocumentTitle from "./DocumentTitle";

const DocumentCardTitle = () => {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="truncate">Sample Document Title</CardTitle>
                <CardDescription className="line-clamp-2">
                    This is a sample description of the document that might be a bit longer to show how truncation works.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center p-4">
                        <div className="text-4xl mb-2">📄</div>
                        <DocumentTitle pdfTitle="pdf document" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-4">
                <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Author Name</span>
                </div>
                <TooltipWrapper content="View document details">
                    <Button asChild size="sm">
                        <Link href={`/documents`}>View</Link>
                    </Button>
                </TooltipWrapper>
            </CardFooter>
        </Card>
    )
}

export default DocumentCardTitle