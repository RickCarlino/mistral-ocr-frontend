import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  // Fetch all documents from the database
  const documents = await prisma.document.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      createdAt: true
    }
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Document Processor</h1>
        
        <div className="mb-8">
          <Link 
            href="/upload" 
            className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload New Document
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <h2 className="text-xl font-semibold p-4 border-b">All Documents</h2>
          
          {documents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No documents found. Upload your first document to get started.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <Link 
                    href={`/document/${doc.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {doc.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            View Details
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            ID: {doc.id}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Created: {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
