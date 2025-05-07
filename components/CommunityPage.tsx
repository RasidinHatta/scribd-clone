'use client'; // Ensuring this is a Client Component

import { Button } from './ui/button';
import Link from 'next/link';
import DocumentsEmpty from './empty-states/DocumentsEmpty';
import PDFCard from './documents/PDFCard';
import { AnimatedContainer } from './animations/AnimatedContainer';

interface Document {
  id: string;
  title: string;
  description: string | null;
  user: {
    name: string | null; // Allow name to be string | null
    image: string | null;
  };
}

interface CommunityPageProps {
  documents: Document[];
}

const CommunityPage = ({ documents = [] }: CommunityPageProps) => {
  return (
    <AnimatedContainer className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Documents</h1>
          <p className="text-muted-foreground">
            Browse and discuss documents shared by the community
          </p>
        </div>
        <Button asChild>
          <Link href="/upload">Upload Document</Link>
        </Button>
      </div>
      {documents.length === 0 ? (
        <DocumentsEmpty />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <PDFCard
              id={doc.id}
              key={doc.id}
              title={doc.title}
              description={doc.description || "No description available"}
              author={doc.user.name || "Anonymous"}
              authorImage={doc.user.image}
            />
          ))}
        </div>
      )}
    </AnimatedContainer>
  );
};

export default CommunityPage;
