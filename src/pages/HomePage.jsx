import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loadProjects } from '../features/projects/projectsSlice.js';
import { selectProjects } from '../features/projects/projectsSlice.js';
import ProjectCard from '../components/ProjectCard.jsx';
import Loader from '../components/Loader.jsx';

const categories = ['ui-ux', 'branding', 'illustration', 'motion', 'print', 'other'];

export default function HomePage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { list, status, error } = useSelector(selectProjects);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (sort) params.sort = sort;
    dispatch(loadProjects(params));
  }, [dispatch, category, sort]);

  return (
    <div className="space-y-8 py-10">
      <div className="rounded-[2rem] bg-white border border-green-200 p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-green-600">{t('homeExplore')}</p>
            <h1 className="mt-3 text-3xl font-semibold text-green-900">{t('homeTitle')}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 outline-none"
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 outline-none"
            >
              <option value="newest">{t('newest')}</option>
              <option value="popular">{t('popular')}</option>
            </select>
          </div>
        </div>
      </div>

      {status === 'loading' ? (
        <Loader />
      ) : error ? (
        <div className="rounded-[2rem] bg-rose-50 p-10 text-center text-rose-700 shadow-soft">{error}</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          {list.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      )}
    </div>
  );
}
