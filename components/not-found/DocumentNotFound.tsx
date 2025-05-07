import { FileText } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const DocumentNotFound = () => {
    return (
        <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Document not found</h3>
            <p className="mt-1 text-muted-foreground">
                The document you are looking for does not exist or has been removed.
            </p>
            <div className="mt-6">
                <Button asChild>
                    <Link href="/community">Browse Documents</Link>
                </Button>
            </div>
        </div>
    )
}

export default DocumentNotFound