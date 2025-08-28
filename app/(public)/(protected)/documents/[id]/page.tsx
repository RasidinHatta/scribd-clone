import DocumentCard from '@/components/documents/DocumentCard'
import React from 'react'
import { getDocumentById } from '@/data/document'
import DocumentNotFound from '@/components/not-found/DocumentNotFound'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { getCommentsByDocumentId } from '@/data/comment'
import CommentSection from '@/components/comment/CommentSection'
import { AnimatedContainer } from '@/components/landing/AnimatedContainer'

export const metadata: Metadata = {
  title: "Document | SAMS",
  description: "A document sharing platform with community discussions",
}

type DocumentPageProps = {
  params: Promise<{ id: string }>
}

const DocumentPage = async ({ params }: DocumentPageProps) => {
  const { id } = await params
  const document = await getDocumentById(id)
  const session = await auth()
  const user = session?.user || null
  const comments = await getCommentsByDocumentId(id)

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

            <CommentSection
              documentId={id}
              user={user}
              comments={comments}
            />
          </div>
        </>
      ) : (
        <DocumentNotFound />
      )}
    </AnimatedContainer>
  )
}

export default DocumentPage