"use client"

import React, { useEffect, useState } from 'react';

interface DocumentViewerProps {
    pdfPath: string; // The path to the PDF file
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ pdfPath }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        // Use the PDF path passed as a prop
        const url = pdfPath;
        setPdfUrl(url);
    }, [pdfPath]);

    return (
        <div>
            {pdfUrl ? (
                <iframe
                    src={pdfUrl}
                    title="PDF Preview"
                    width="100%"
                    height="600px" // Default height
                    style={{ marginTop: '20px', border: '1px solid #ccc' }}
                />
            ) : (
                <p>Loading PDF preview...</p>
            )}
        </div>
    );
};

export default DocumentViewer;