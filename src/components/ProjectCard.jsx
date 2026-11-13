import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/auth/authSlice.js';
import { client } from '../api/client.js';

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80';

export default function ProjectCard({ project, compact = false }) {
  const { t } = useTranslation();
  const imageUrl = (project.images && project.images[0]) || project.image || DEFAULT_PROJECT_IMAGE;
  const [likes, setLikes] = useState(project.likes ?? 0);
  const [loading, setLoading] = useState(false);
  const auth = useSelector(selectAuth);
  const navigate = useNavigate();

  const handleLike = async () => {
    if (!auth.isAuthenticated) return navigate('/login');
    if (loading) return;
    setLoading(true);
    try {
      await client.patch(`/designers/${project.designerId}/projects/${project.id}/like`);
      setLikes((l) => l + 1);
    } catch (err) {
      // ignore for now
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <article className="overflow-hidden rounded-lg border border-green-200 bg-white shadow-sm transition hover:scale-[1.02]">
        <div className="relative aspect-square bg-green-100">
          <img src={imageUrl} alt={project.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute left-2 bottom-2 right-2">
            <div className="backdrop-blur-sm rounded-md bg-black/30 px-2 py-1 text-sm font-medium text-white line-clamp-1">{project.title}</div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-[2rem] border border-green-200 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative h-48 w-full bg-green-100">
        <img src={imageUrl} alt={project.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <div className="rounded-3xl bg-green-100 p-4 text-green-900">{project.category || '—'}</div>
        <h3 className="mt-4 text-xl font-semibold text-green-900">{project.title}</h3>
        <p className="mt-3 text-sm text-gray-600 line-clamp-3">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(project.tags || []).slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-900">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between text-sm text-gray-600">
          <button onClick={handleLike} disabled={loading} className="inline-flex items-center gap-2">
            <span className="text-rose-400">❤️</span> <span>{likes}</span>
          </button>
          <span>{project.views ?? 0} 👁️</span>
        </div>
        <Link
          to={`/designers/${project.designerId}`}
          className="mt-5 inline-flex rounded-3xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          {t('viewDesigner')}
        </Link>
      </div>
    </article>
  );
}
