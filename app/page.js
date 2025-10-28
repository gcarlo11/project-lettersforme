'use client'

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Caveat } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'], weight: '700' });

export default function Home() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createSession = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    const sessionId = generateId();
    
    try {
      const { error } = await supabase
        .from('sessions')
        .insert([
          {
            name: name.trim(),
            session_id: sessionId,
          }
        ]);

      if (error) throw error;
      
      router.push(`/session/${sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h1 className={`text-5xl text-bold text-gray-800 mb-2 ${caveat.className}`}>Letters For Me</h1>
          <p className="text-gray-600">Write. Listen. Feel.</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <p className="text-gray-700 mb-6 text-center">
            Create your personal space for anonymous messages with songs that touch the soul.
          </p>
          
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createSession()}
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none mb-4"
            disabled={loading}
          />
          
          <button
            onClick={createSession}
            disabled={loading || !name.trim()}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create My LettersForMe Page'}
          </button>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-500">
          💌 Each session lasts 21 days before disappearing
        </div>
      </div>
    </div>
  );
}