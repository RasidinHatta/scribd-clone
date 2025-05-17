import DocumentCard from '@/components/documents/DocumentCard'
import Comment from '@/components/Comment'
import React from 'react'
import CommentForm from '@/components/CommentForm'
import CommentsEmpty from '@/components/empty-states/CommentsEmpty'
import { AnimatedContainer } from '@/components/animations/AnimatedContainer'
import { getDocumentById } from '@/data/document'
import DocumentNotFound from '@/components/not-found/DocumentNotFound'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Document | SAMS",
  description: "A document sharing platform with community discussions",
};

type DocumentPageProps = {
    params: Promise<{ id: string }>;
};

const DocumentPage = async ({ params }: DocumentPageProps) => {
    const { id } = await params;
    const document = await getDocumentById(id);
    const mockComments = Array(3).fill(0);

    return (
        <AnimatedContainer className="container mx-auto py-8 space-y-8">
            {document ? (
                <>
                    <div className="px-4 sm:px-6 md:px-8">
                        <DocumentCard
                            title={document.title}
                            description={document.description}
                            url={document.url}
                            author={document.user?.name || "Anonymous"}
                            authorImage={document.user?.image}
                        />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">Discussion</h2>
                        <CommentForm />
                        {mockComments.length === 0 ? (
                            <CommentsEmpty />
                        ) : (
                            <div className="space-y-6">
                                {mockComments.map((_, index) => (
                                    <Comment
                                        key={index}
                                        username={`User ${index + 1}`}
                                        avatarUrl={`https://avatars.githubusercontent.com/u/12459${index + 1}`}
                                        commentText={`This is a mock comment number ${index + 1}.`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <DocumentNotFound />
            )}
        </AnimatedContainer>
    );
}

export default DocumentPage;