import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { prisma } from '@/lib/prisma';

// Define the props type for the page component
interface DocumentPageProps {
  params: {
    id: string;
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  await params;
  const { id } = params;
  
  // Fetch the document from the database
  const document = await prisma.document.findUnique({
    where: {
      id: id
    }
  });
  
  // If document not found, return 404
  if (!document) {
    notFound();
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{document.title}</h1>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Documents
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b">
            <h2 className="text-lg font-medium text-gray-900">Document Details</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              ID: {document.id}
            </p>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Created: {new Date(document.createdAt).toLocaleString()}
            </p>
          </div>
          
          {document.imagePath && (
            <div className="border-b border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Document Image</h3>
                <div className="mt-2 max-w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={document.imagePath.startsWith('http') 
                      ? document.imagePath 
                      : `/${document.imagePath}`
                    } 
                    alt={document.title}
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              </div>
            </div>
          )}
          
          {document.ocrResult && (
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">OCR Result</h3>
              <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none prose-gray prose-headings:text-gray-900 prose-p:text-gray-800 prose-li:text-gray-800 prose-strong:text-gray-900">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {document.ocrResult}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          {!document.ocrResult && (
            <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No OCR result available for this document.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
