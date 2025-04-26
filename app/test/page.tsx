"use client"

import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

// Define the PDF content
const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
        </Page>
    </Document>
);

const TestPage = () => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const generatePdf = async () => {
            const blob = await pdf(<MyDocument />).toBlob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        };

        generatePdf();

        // Cleanup old object URL when component unmounts
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, []); // Empty [] = run once on page load

    return (
        <div>
            {pdfUrl ? (
                <iframe
                    src={pdfUrl}
                    title="PDF Preview"
                    width="100%"
                    height="600px"
                    style={{ marginTop: '20px', border: '1px solid #ccc' }}
                />
            ) : (
                <p>Loading PDF preview...</p>
            )}
        </div>
    )
}

export default TestPage;