'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Function to extract markdown from OCR result
const extractMarkdownFromOCR = (ocrResult: string) => {
  try {
    // Parse the OCR result JSON
    const parsedResult = JSON.parse(ocrResult);
    
    // If the OCR result has a markdown property, return it
    if (parsedResult.markdown) {
      return parsedResult.markdown;
    }
    
    // If the OCR result has a text property, return it
    if (parsedResult.text) {
      return parsedResult.text;
    }
    
    // Otherwise, return the stringified JSON
    return `\`\`\`json\n${JSON.stringify(parsedResult, null, 2)}\n\`\`\``;
  } catch (error) {
    // If parsing fails, return the raw string
    return ocrResult;
  }
};

export default function SuccessPage() {
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const documentId = searchParams.get('id');
  
  useEffect(() => {
    if (!documentId) {
      router.push('/');
      return;
    }
    
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }
        
        const data = await response.json();
        setDocument(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [documentId, router]);
  
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </main>
    );
  }
  
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Document Uploaded Successfully!</h1>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-lg mb-2">{document?.title}</h2>
          {document?.imagePath && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={document.imagePath}
                alt={document.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {document?.ocrResult && (
            <div className="mt-4 text-left">
              <h3 className="font-semibold text-md mb-2">OCR Result:</h3>
              <div className="bg-white p-4 rounded-lg overflow-auto max-h-96 text-black">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({node, ...props}) => <p className="text-black my-2" {...props} />,
                    li: ({node, ...props}) => <li className="text-black" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-black font-bold text-2xl my-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-black font-bold text-xl my-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-black font-bold text-lg my-2" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-600 underline" {...props} />,
                    table: ({node, ...props}) => <table className="border-collapse border border-gray-400 my-4" {...props} />,
                    th: ({node, ...props}) => <th className="border border-gray-400 px-4 py-2 text-black bg-gray-200" {...props} />,
                    td: ({node, ...props}) => <td className="border border-gray-400 px-4 py-2 text-black" {...props} />,
                    code: ({node, ...props}) => <code className="bg-gray-100 text-black px-1 rounded" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-gray-100 text-black p-4 rounded my-4 overflow-x-auto" {...props} />
                  }}
                >
                  {extractMarkdownFromOCR(document.ocrResult)}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
        
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload Another Document
        </Link>
      </div>
    </main>
  );
}
