import { getCommunityDocuments } from '@/data/document';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

const DocumentsPage = async () => {
  const documents = await getCommunityDocuments();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Community Documents</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Edited</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc: any) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.title}</TableCell>
              <TableCell>{doc.description}</TableCell>
              <TableCell>{doc.format}</TableCell>
              <TableCell>{doc.user.name}({doc.user.email})</TableCell>
              <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(doc.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary  hover:underline"
                >
                  View
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsPage;