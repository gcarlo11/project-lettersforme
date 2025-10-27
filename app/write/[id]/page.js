'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const moods = ['Happy', 'Sad', 'Nostalgic', 'Grateful', 'Hopeful'];

export default function WritePage({ params }) {
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    senderName: '',
    message: '',
    spotifyUrl: '',
    mood: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadSession();
  }, [params.id]);

  const loadSession = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('session_id', params.id)
        .single();

      if (error) throw error;
      setSession(data);
    } catch (error) {
      console.error('Error loading session:', error);
      router.push('/');
    }
  };

  const submitMessage = async () => {
    if (!formData.message.trim()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            session_id: params.id,
            sender_name: formData.senderName.trim() || 'Anonymous',
            message: formData.message.trim(),
            spotify_url: formData.spotifyUrl.trim() || null,
            mood: formData.mood || null,
          }
        ]);

      if (error) throw error;
      
      setSubmitted(true);
      setTimeout(() => {
        router.push(`/session/${params.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">💌</div>
          <h2 className="text-2xl font-bold text-gray-800">Thank you for your letter</h2>
          <p className="text-gray-600 mt-2">Your message has been sent with love</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-lg mx-auto pt-8">
        <button
          onClick={() => router.push(`/session/${params.id}`)}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Write to {session.name}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Your name (optional)</label>
              <input
                type="text"
                placeholder="Anonymous"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Your message</label>
              <textarea
                placeholder="Write your heart out..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Spotify track link (optional)</label>
              <input
                type="text"
                placeholder="https://open.spotify.com/track/..."
                value={formData.spotifyUrl}
                onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">How are you feeling?</label>
              <div className="flex flex-wrap gap-2">
                {moods.map(mood => (
                  <button
                    key={mood}
                    onClick={() => setFormData({ ...formData, mood: formData.mood === mood ? '' : mood })}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      formData.mood === mood
                        ? 'bg-purple-400 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={submitMessage}
              disabled={!formData.message.trim() || loading}
              className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Letter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}