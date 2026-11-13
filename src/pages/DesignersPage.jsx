import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loadDesigners } from '../features/designers/designersSlice.js';
import { selectDesigners } from '../features/designers/designersSlice.js';
import DesignerCard from '../components/DesignerCard.jsx';
import Loader from '../components/Loader.jsx';

export default function DesignersPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { list, status, error } = useSelector(selectDesigners);
  const [skill, setSkill] = useState('');
  const [available, setAvailable] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('rating');

  useEffect(() => {
    const params = {};
    if (skill) params.skill = skill;
    if (available) params.isAvailable = available;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    dispatch(loadDesigners(params));
  }, [dispatch, skill, available, search, sort]);

  return (
    <div className="space-y-8 py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-soft border border-green-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-green-600">{t('designers')}</p>
            <h1 className="mt-3 text-3xl font-semibold text-green-900">{t('findDesigner')}</h1>
          </div>
          <p className="max-w-xl text-sm text-gray-600">{t('filtersSubtitle')}</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 outline-none"
          />
          <input
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder={t('skillPlaceholder')}
            className="rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 outline-none"
          />
          <select
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
            className="rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 outline-none"
          >
            <option value="">{t('anyStatus')}</option>
            <option value="true">{t('availableBadge')}</option>
            <option value="false">{t('unavailableBadge')}</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 outline-none"
          >
            <option value="rating">{t('sortByRating')}</option>
            <option value="price">{t('sortByPrice')}</option>
            <option value="newest">{t('sortByNewest')}</option>
          </select>
        </div>
      </section>

      {status === 'loading' ? (
        <Loader />
      ) : error ? (
        <div className="rounded-[2rem] bg-rose-50 p-10 text-center text-rose-700 shadow-soft">{error}</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          {list.map((designer) => <DesignerCard key={designer.id} designer={designer} />)}
        </div>
      )}
    </div>
  );
}
