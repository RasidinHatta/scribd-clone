import UploadForm from '@/components/UploadForm'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Upload | SAMS",
  description: "A document sharing platform with community discussions",
};


const UploadPage = () => {
    return (
        <div className="container mx-auto py-8">
            <div className="max-w-2xl mx-auto">
                <UploadForm />
            </div>
        </div>
    )
}

export default UploadPage