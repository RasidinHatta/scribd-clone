'use client';

import { Button } from '../ui/button'
import Link from 'next/link'
import DocumentsEmpty from '../empty-states/DocumentsEmpty'
import PDFCard from './PDFCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';
import { AnimatedContainer } from '../landing/AnimatedContainer';
import { programs } from '@/lib/schemas';

interface Document {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  publicId: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface CommunityPageProps {
  documents: Document[];
  showActions?: boolean;
}

const CommunityPage = ({
  documents = [],
  showActions = false,
}: CommunityPageProps) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  // Define the specific subjects you want to include
  const specificSubjects = programs
  
  // Get unique subjects from documents (filtering out null values)
  const documentSubjects = [...new Set(
    documents.map(doc => doc.subject).filter((subject): subject is string => subject !== null)
  )];
  
  // Combine all subjects
  const subjects = ['all', ...specificSubjects, ...documentSubjects];
  const uniqueSubjects = [...new Set(subjects)];
  
  // Filter documents based on selected subject
  const filteredDocuments = selectedSubject === 'all' 
    ? documents 
    : documents.filter(doc => doc.subject === selectedSubject);

  return (
    <AnimatedContainer className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Documents</h1>
          <p className="text-muted-foreground">
            Browse and discuss documents shared by the community
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              {uniqueSubjects.map(subject => (
                <SelectItem key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredDocuments.length === 0 ? (
        <DocumentsEmpty />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <PDFCard
              id={doc.id}
              key={doc.id}
              title={doc.title}
              description={doc.description || "No description available"}
              subject={doc.subject || "Other"}
              publicId={doc.publicId}
              author={doc.user.name || "Anonymous"}
              authorImage={doc.user.image}
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </AnimatedContainer>
  );
};

export default CommunityPage;