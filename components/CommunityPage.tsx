import React from 'react'
import { AnimatedContainer } from './animations/AnimatedContainer'
import { Button } from './ui/button'
import Link from 'next/link'
import DocumentsEmpty from './empty-states/DocumentsEmpty'
import DocumentCardTitle from './documents/DocumentCardTitle'

const CommunityPage = () => {
    const mockDocuments = Array(6).fill(0);
    return (
        <AnimatedContainer className="container mx-auto py-8 space-y-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Community Documents</h1>
                    <p className="text-muted-foreground">
                        Browse and discuss documents shared by the community
                    </p>
                </div>
                <Button asChild>
                    <Link href="/upload">Upload Document</Link>
                </Button>
            </div>
            {mockDocuments.length === 0 ? <DocumentsEmpty /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockDocuments.map((_, index) => (
                        <DocumentCardTitle key={index} />
                    ))}
                </div>
            )}
        </AnimatedContainer>
    )
}

export default CommunityPage