'use client'

import { useState, useEffect } from 'react';
// Import useParams
import { useRouter, useParams } from 'next/navigation';
import { Heart, Music } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SpotifyEmbed from '@/components/SpotifyEmbed';
import { Caveat } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'], weight: '400' });

// Hapus 'params' dari props function
export default function MessagePage() {
  // Gunakan useParams untuk mendapatkan parameter rute
  const params = useParams();
  const id = params.id; // Ekstrak id dari params

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Pastikan 'id' ada sebelum memuat data
    if (id) {
      loadMessage(id); // Kirim 'id' sebagai argumen
    }
  // Tambahkan 'id' sebagai dependency
  }, [id]);

  // Modifikasi fungsi untuk menerima 'messageId'
  const loadMessage = async (messageId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        // Gunakan 'messageId' di sini
        .eq('id', messageId)
        .single();

      if (error) throw error;
      setMessage(data);
    } catch (error) {
      console.error('Error loading message:', error);
      // Mungkin arahkan ke halaman error atau not found
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    // Pastikan 'id' ada dan message sudah dimuat
    if (!id || !message) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ liked: !message.liked })
        // Gunakan 'id' di sini
        .eq('id', id);

      if (error) throw error;
      // Perbarui state lokal secara langsung
      setMessage({ ...message, liked: !message.liked });
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Message not found</h2>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-purple-400 text-white rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-lg mx-auto pt-8">
        <button
          // Navigasi kembali ke session page menggunakan session_id dari message
          onClick={() => router.push(`/session/${message.session_id}`)}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-purple-600">
                {message.sender_name || 'Anonymous'}
              </h3>
              <p className="text-xs text-gray-400">
                {new Date(message.created_at).toLocaleDateString()}
              </p>
            </div>
            {message.mood && (
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                {message.mood}
              </span>
            )}
          </div>

          <div className="prose prose-sm max-w-none mb-6">
            <p className={`text-gray-700 text-2xl whitespace-pre-wrap ${caveat.className}`}>{message.message}</p>
          </div>

          <SpotifyEmbed url={message.spotify_url} />

          <button
            onClick={toggleLike}
            className="w-full mt-6 py-3 border-2 border-pink-200 text-pink-500 rounded-xl flex items-center justify-center gap-2 hover:bg-pink-50 transition-all"
          >
            <Heart className={`w-5 h-5 ${message.liked ? 'fill-current' : ''}`} />
            {message.liked ? 'Loved' : 'Love this'}
          </button>
        </div>
      </div>
    </div>
  );
}