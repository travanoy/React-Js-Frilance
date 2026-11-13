import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next';
import { selectAuth,logout } from '../features/auth/authSlice.js';

const LOCALE_KEY = 'designer-marketplace-locale';
const localeOptions = [
  ['ru', 'Русский'],
  ['en', 'English'],
];


export default function Navbar() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  const auth = useSelector(selectAuth);
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || 'ru';



  return (
    <nav className="sticky top-0 z-30 border-b border-green-200 bg-white text-gray-900 shadow-lg backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <NavLink to="/" className="text-lg font-bold text-green-900">
            {t('siteName')}
          </NavLink>
          <p className="text-xs text-green-600">{t('siteTagline')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'}>
            {t('homeExplore')}
          </NavLink>
          <NavLink to="/designers" className={({ isActive }) => isActive ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'}>
            {t('designers')}
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => isActive ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'}>
            {t('stats')}
          </NavLink>
          <select
            value={locale}
            onChange={(e) => {
              const selected = e.target.value;
              i18n.changeLanguage(selected);
              window.localStorage.setItem(LOCALE_KEY, selected);
            }}
            className="rounded-full border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-900 outline-none transition hover:border-green-400"
          >
            {localeOptions.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          {auth.isAuthenticated ? (
  
  <div className="flex items-center gap-2">
    
    <NavLink to="/order" className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 whitespace-nowrap">
      {auth.user?.name || auth.user?.login}
    </NavLink>
    
    
    <button
      type="button"
      onClick={handleLogout}
      className="shrink-0 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap"
    >
      {t('logout') || 'Выйти'}
    </button>
  </div>
) : (
  
  <NavLink to="/login" className="rounded-full border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-900 transition hover:bg-green-100 whitespace-nowrap">
    {t('loginButton')}
  </NavLink>
)}
          
          
        </div>
      </div>
    </nav>
  );
}
