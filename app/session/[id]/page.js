'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SessionCard from '@/components/SessionCard';
import MessageCard from '@/components/MessageCard';

export default function SessionPage({ params }) {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadSession();
    loadMessages();
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
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', params.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const toggleLike = async (messageId, currentLiked) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ liked: !currentLiked })
        .eq('id', messageId);

      if (error) throw error;
      loadMessages();
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

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Session not found</h2>
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

  const isExpired = new Date(session.expired_at) < new Date();
  const daysLeft = Math.ceil((new Date(session.expired_at) - new Date()) / (1000 * 60 * 60 * 24));

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🕊️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your letters have flown away</h2>
          <p className="text-gray-600">This session expired after 21 days</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-2 bg-purple-400 text-white rounded-xl"
          >
            Create New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Letters for {session.name}
          </h1>
          <p className="text-gray-600 text-sm">
            {daysLeft} days left
          </p>
        </div>

        <SessionCard session={session} />

        <button
          onClick={() => router.push(`/write/${params.id}`)}
          className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-xl font-semibold mb-6 hover:shadow-lg transition-all"
        >
          Write a Letter
        </button>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No letters yet. Share your link!</p>
            </div>
          ) : (
            messages.map(msg => (
              <MessageCard
                key={msg.id}
                message={msg}
                onClick={() => router.push(`/message/${msg.id}`)}
                onLike={() => toggleLike(msg.id, msg.liked)}
              />
            ))
          )}
        </div>

        <div className="text-center mt-8 text-xs text-gray-400">
          <p>💖 Support this project</p>
        </div>
      </div>
    </div>
  );
}