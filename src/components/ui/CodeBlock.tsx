import React from 'react';
import { Copy } from 'lucide-react';

interface CodeBlockProps {
  id: string;
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ id, language, code }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          title="Copy to clipboard"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
      <pre className={`language-${language} bg-gray-100 p-4 rounded-lg overflow-x-auto`}>
        <code id={id} className="text-sm">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;