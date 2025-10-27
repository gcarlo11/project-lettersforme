import { Heart, Music } from 'lucide-react';

export default function MessageCard({ message, onClick, onLike }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-semibold text-purple-600">
          {message.sender_name || 'Anonymous'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="text-pink-400 hover:scale-110 transition-transform"
        >
          <Heart className={`w-5 h-5 ${message.liked ? 'fill-current' : ''}`} />
        </button>
      </div>
      <p className="text-gray-700 text-sm line-clamp-2">{message.message}</p>
      {message.spotify_url && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <Music className="w-3 h-3" />
          <span>Song attached</span>
        </div>
      )}
      {message.mood && (
        <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
          {message.mood}
        </span>
      )}
    </div>
  );
}