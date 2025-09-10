"use client"

import React from 'react'
import { Button } from '../ui/button'
import { CldUploadButton } from 'next-cloudinary'
import { FiUpload } from 'react-icons/fi'

interface ChangeUserImageProps {
    onUpload: (info: any) => Promise<void>;
    disabled?: boolean;
}

const ChangeUserImage = ({ onUpload, disabled }: ChangeUserImageProps) => {
    return (
        <Button asChild disabled={disabled}>
            <CldUploadButton
                onSuccess={(result: any) => {
                    if (result?.info) {
                        onUpload(result.info);
                    }
                }}
                onError={(error: any) => {
                    console.error("Upload error:", error);
                }}
                options={{
                    clientAllowedFormats: ['png', 'jpg', 'jpeg'],
                    maxFileSize: 5242880,
                    multiple: false,
                    cropping: true,
                    croppingAspectRatio: 1.0,
                    croppingShowBackButton: true,
                    showSkipCropButton: false,
                    resourceType: 'image',
                }}
                uploadPreset="sams-image"
            >
                <div className="flex gap-2 items-center text-[#171717]">
                    <FiUpload className="w-4 h-4" />
                    {disabled ? "Uploading..." : "Change Profile Picture"}
                </div>
            </CldUploadButton>
        </Button>
    )
}

export default ChangeUserImage