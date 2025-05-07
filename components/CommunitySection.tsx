"use client";

import { useEffect, useState } from "react";
import CommunityPage from "@/components/CommunityPage";

export default function CommunitySection() {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        async function fetchDocuments() {
            const res = await fetch("/api/community-documents");
            const data = await res.json();
            setDocuments(data);
        }

        fetchDocuments();
    }, []);

    return <CommunityPage documents={documents} />;
}
