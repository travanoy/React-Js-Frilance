import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DEFAULT_DESIGNER_IMAGE = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80';

export default function DesignerCard({ designer }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const imageUrl = designer.avatar || designer.photo || DEFAULT_DESIGNER_IMAGE;

  return (
    <article className="overflow-hidden rounded-[2rem] border border-green-200 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative h-52 w-full bg-green-100">
        <img src={imageUrl} alt={designer.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-green-600">{designer.location || '—'}</p>
            <h3 className="mt-2 text-xl font-semibold text-green-900">{designer.name}</h3>
            <p className="mt-1 text-sm text-gray-600">{designer.title}</p>
          </div>
          <span className={`rounded-full px-3 py-2 text-xs font-semibold ${designer.isAvailable ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
            {designer.isAvailable ? t('availableTag') : t('busyTag')}
          </span>
        </div>

        <p className="mt-5 text-sm leading-6 text-gray-600">{designer.bio || t('descriptionMissing')}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(designer.skills || []).slice(0, 5).map((skill) => (
            <span key={skill} className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-900">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
          <div>{t('rating')} {designer.rating?.toFixed(1) ?? '—'}</div>
          <div>{designer.hourlyRate ?? '—'} {designer.currency ?? ''} {t('perHour')}</div>
        </div>

        <button
          onClick={() => navigate(`/designers/${designer.id}`)}
          className="mt-6 inline-flex rounded-3xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          {t('viewDesigner')}
        </button>
      </div>
    </article>
  );
}
