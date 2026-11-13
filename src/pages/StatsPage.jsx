import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loadStats } from '../features/stats/statsSlice.js';
import Loader from '../components/Loader.jsx';

export default function StatsPage() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.stats);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(loadStats());
  }, [dispatch]);

  if (status === 'idle' || status === 'loading') return <Loader />;
  if (status === 'failed') return <div className="rounded-[2rem] bg-rose-500/10 p-10 text-center text-rose-200 shadow-soft">{error}</div>;

  const totalDesigners = data?.totalDesigners ?? 0;
  const totalProjects = data?.totalProjects ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const topCategories = Array.isArray(data?.topCategories) ? data.topCategories : [];

  return (
    <div className="py-10">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft border border-green-200">
          <p className="text-sm uppercase tracking-[0.35em] text-green-600">{t('statsDesigners')}</p>
          <p className="mt-4 text-4xl font-semibold text-green-900">{totalDesigners}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-8 shadow-soft border border-green-200">
          <p className="text-sm uppercase tracking-[0.35em] text-green-600">{t('statsProjects')}</p>
          <p className="mt-4 text-4xl font-semibold text-green-900">{totalProjects}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-8 shadow-soft border border-green-200">
          <p className="text-sm uppercase tracking-[0.35em] text-green-600">{t('statsOrders')}</p>
          <p className="mt-4 text-4xl font-semibold text-green-900">{totalOrders}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] bg-white p-8 shadow-soft border border-green-200">
        <h2 className="text-xl font-semibold text-green-900">{t('topCategories')}</h2>
        {topCategories.length > 0 ? (
          <ul className="mt-4 space-y-3 text-gray-700">
            {topCategories.map((item) => (
              <li key={item.category} className="flex items-center justify-between rounded-3xl border border-green-200 bg-green-50 p-4">
                <span>{item.category}</span>
                <span className="font-semibold text-green-900">{item.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-green-600">{t('statsUnavailable')}</p>
        )}
      </div>
    </div>
  );
}
