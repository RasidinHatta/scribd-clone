"use client"

import React from 'react';

interface DocumentTitleProps {
    pdfTitle: string; // The path to the PDF file
}

const DocumentTitle: React.FC<DocumentTitleProps> = ({ pdfTitle }) => {

    return (
        <p className="text-sm text-gray-500 dark:text-gray-400">{pdfTitle}</p>
    );
};

export default DocumentTitle;