import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loader from '../components/Loader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import ReviewItem from '../components/ReviewItem.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import { client } from '../api/client.js';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/auth/authSlice.js';

const API_BASE = 'http://localhost:5000/api';

async function fetchDesigner(id) {
  const res = await fetch(`${API_BASE}/designers/${id}`);
  if (!res.ok) throw new Error('Не удалось загрузить дизайнера');
  return res.json();
}

async function fetchDesignerProjects(id) {
  const res = await fetch(`${API_BASE}/designers/${id}/projects`);
  if (!res.ok) throw new Error('Не удалось загрузить проекты дизайнера');
  return res.json();
}

async function fetchDesignerServices(id) {
  const res = await fetch(`${API_BASE}/designers/${id}/services`);
  if (!res.ok) throw new Error('Не удалось загрузить услуги дизайнера');
  return res.json();
}

async function fetchDesignerReviews(id) {
  const res = await fetch(`${API_BASE}/designers/${id}/reviews`);
  if (!res.ok) throw new Error('Не удалось загрузить отзывы дизайнера');
  return res.json();
}

export default function DesignerPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const auth = useSelector(selectAuth);
  const [designer, setDesigner] = useState(null);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setStatus('loading');
      try {
        const [designerData, projectsData, servicesData, reviewsData] = await Promise.all([
          fetchDesigner(id),
          fetchDesignerProjects(id),
          fetchDesignerServices(id),
          fetchDesignerReviews(id),
        ]);
        setDesigner(designerData);
        setProjects(projectsData);
        setServices(servicesData);
        setReviews(reviewsData);
        setStatus('succeeded');
      } catch (err) {
        setError(err.message);
        setStatus('failed');
      }
    }
    load();
  }, [id]);

  if (status === 'loading') return <Loader />;
  if (status === 'failed') return <div className="rounded-[2rem] bg-rose-500/10 p-10 text-center text-rose-200 shadow-soft">{error}</div>;

  return (
    <div className="space-y-10 py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-soft border border-green-200">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <div className="space-y-6 rounded-[2rem] bg-green-50 p-6 border border-green-200">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-200 text-3xl text-green-900">{designer.name?.[0] || 'D'}</div>
              <div>
                <h1 className="text-2xl font-semibold text-green-900">{designer.name}</h1>
                <p className="mt-2 text-sm text-green-700">{designer.title}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-green-600">{t('location')}</p>
              <p className="text-base text-green-900">{designer.location || t('descriptionMissing')}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-green-600">{t('rating')}</p>
              <p className="text-base text-green-900">{designer.rating?.toFixed(1) ?? '—'} ({designer.reviewsCount ?? 0} {t('ratingCount')})</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-green-600">{t('price')}</p>
              <p className="text-base text-green-900">{designer.hourlyRate ?? '—'} {designer.currency || ''}/ч</p>
            </div>
            <Link
              to="/order"
              className="mt-4 inline-flex w-full justify-center rounded-3xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              {t('orderService')}
            </Link>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-green-50 p-6 border border-green-200">
              <h2 className="text-xl font-semibold text-green-900">{t('designerBio')}</h2>
              <p className="mt-4 text-sm leading-7 text-gray-700">{designer.bio || t('descriptionMissing')}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(designer.skills || []).map((skill) => (
                  <span key={skill} className="rounded-full bg-green-200 px-3 py-1 text-xs text-green-900 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="rounded-[2rem] bg-green-50 p-6 border border-green-200">
                <h2 className="text-xl font-semibold text-green-900">{t('portfolio')}</h2>
                <div className="mt-4">
                  {projects.length === 0 ? (
                    <p className="text-sm text-gray-600">{t('noProjects')}</p>
                  ) : (
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                      {projects.map((project) => (
                        <div key={project.id} className="w-full">
                          <ProjectCard project={project} compact />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-[2rem] bg-green-50 p-6 border border-green-200">
                <h2 className="text-xl font-semibold text-green-900">{t('services')}</h2>
                <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {services.length === 0 ? <p className="text-sm text-gray-600">{t('noServices')}</p> : services.map((service) => <ServiceCard key={service.id} service={service} />)}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-green-50 p-6 border border-green-200">
              <h2 className="text-xl font-semibold text-green-900">{t('reviews')}</h2>
              <div className="mt-4 space-y-4">
                {reviews.length === 0 ? <p className="text-sm text-gray-600">{t('noReviews')}</p> : reviews.map((review) => <ReviewItem key={review.id} review={review} />)}
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-green-900">{t('addReview') || 'Add a review'}</h3>
                <ReviewForm designerId={id} auth={auth} onAdd={(r) => setReviews((s) => [r, ...s])} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
