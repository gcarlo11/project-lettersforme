import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function SessionCard({ session }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const link = `${window.location.origin}/session/${session.session_id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
      <p className="text-gray-600 text-sm mb-3">Share this link:</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={`${window.location.origin}/session/${session.session_id}`}
          readOnly
          className="flex-1 px-4 py-2 bg-gray-50 rounded-xl text-sm"
        />
        <button
          onClick={copyLink}
          className="px-4 py-2 bg-purple-400 text-white rounded-xl flex items-center gap-2 hover:bg-purple-500 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}