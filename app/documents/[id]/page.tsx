import DocumentCard from '@/components/documents/DocumentCard'
import Comment from '@/components/Comment'
import React from 'react'
import CommentForm from '@/components/CommentForm'
import CommentsEmpty from '@/components/empty-states/CommentsEmpty'
import { AnimatedContainer } from '@/components/animations/AnimatedContainer'

const DocumentPage = () => {
    const mockComments = Array(3).fill(0);

    return (
        <AnimatedContainer className="container mx-auto py-8 space-y-8">
            <DocumentCard />

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Discussion</h2>
                <CommentForm />

                {mockComments.length === 0 ? <CommentsEmpty /> : (
                    <div className="space-y-6">
                        {mockComments.map((_, index) => (
                            <Comment key={index} />
                        ))}
                    </div>
                )}
            </div>
        </AnimatedContainer>
    );
}

export default DocumentPage