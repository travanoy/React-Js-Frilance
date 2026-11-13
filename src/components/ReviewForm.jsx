import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../api/client.js';

export default function ReviewForm({ designerId, auth, onAdd }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.isAuthenticated) return navigate('/login');
    setLoading(true);
    setError(null);
    try {
      const res = await client.post(`/designers/${designerId}/reviews`, { rating, text });
      onAdd && onAdd(res);
      setRating(5);
      setText('');
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-700">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-900 border border-green-300">
          {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full rounded-md bg-green-50 p-3 text-sm text-green-900 border border-green-300" placeholder="Write your review..." />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <button type="submit" disabled={loading} className="inline-flex items-center rounded-3xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
