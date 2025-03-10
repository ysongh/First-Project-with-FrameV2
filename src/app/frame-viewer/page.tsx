"use client";

import { useState, useEffect } from 'react';

export default function FrameViewer() {
  const [frameContent, setFrameContent] = useState('Loading...');
  
  useEffect(() => {
    // Fetch the actual frame content from your API
    fetch('/api/hello')
      .then(response => response.text())
      .then(html => {
        setFrameContent(html);
      })
      .catch(error => {
        console.error('Error fetching frame:', error);
        setFrameContent('Error loading frame');
      });
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Frame Viewer</h1>
      
      <div className="border border-gray-300 rounded p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Frame HTML Response:</h2>
        <pre className="bg-gray-100 p-3 overflow-auto text-sm">
          {frameContent}
        </pre>
      </div>
      
      <div className="border border-gray-300 rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Test in Farcaster Frame Validator:</h2>
        <p className="mb-2">Your Frame URL is:</p>
        <code className="bg-gray-100 p-2 block mb-3">
          {typeof window !== 'undefined' ? 
            `${window.location.origin}/api/hello` : 
            'https://first-project-with-framev2.onrender.com/api/hello'}
        </code>
        <a 
          href="https://warpcast.com/~/developers/frames" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Open Frame Validator
        </a>
      </div>
    </div>
  );
}
