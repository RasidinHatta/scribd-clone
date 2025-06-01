import React from 'react'
import { getCommunityDocuments } from '@/data/document'
import { Metadata } from 'next'
import CommunityPage from '@/components/documents/CommunityPage'
import { auth } from '@/auth'
import { RoleName } from '@/lib/generated/prisma'
import { PageProps } from '@/.next/types/app/layout'

export const metadata: Metadata = {
  title: "Community | SAMS",
  description: "A document sharing platform with community discussions",
}

interface CustomSearchParams {
  q?: string
}

const Page = async ({ 
  searchParams 
}: PageProps & { 
  searchParams: CustomSearchParams 
}) => {
  const query = searchParams.q?.toLowerCase() || '';
  const session = await auth()
  const role = session?.user?.role.name

  const upload = role === RoleName.USER

  const documents = await getCommunityDocuments()

  const filteredDocuments = query
    ? documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query)
      )
    : documents;

  return <CommunityPage documents={filteredDocuments} showUpload={upload} />;
};

export default Page