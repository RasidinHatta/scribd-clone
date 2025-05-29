import React from 'react'
import { getMyDocuments } from '@/data/document'
import { Metadata } from 'next'
import CommunityPage from '@/components/documents/CommunityPage'
import { auth } from '@/auth'

export const metadata: Metadata = {
    title: "My Document | SAMS",
    description: "A document sharing platform with community discussions",
}

const Page = async () => {
    const session = await auth()
    const userId= session?.user?.id as string
    const documents = await getMyDocuments(userId);
    const action = session ? true : false
    const upload = session ? true : false

    return <CommunityPage documents={documents} showActions={action} showUpload={upload}/>;
};

export default Page