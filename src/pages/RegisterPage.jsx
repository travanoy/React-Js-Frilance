import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice.js';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [form, setForm] = useState({ login: '', name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.login || !form.name || !form.email || !form.password) {
      setError(t('registrationInvalid'));
      return;
    }
    dispatch(login({ login: form.login, name: form.name, email: form.email, password: form.password }));
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-soft border border-green-200">
        <h1 className="text-3xl font-semibold text-green-900">{t('registerTitle')}</h1>
        <p className="mt-3 text-sm text-green-600">{t('registerHint')}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm text-green-900">
            {t('registerLogin')}
            <input
              name="login"
              value={form.login}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 outline-none"
            />
          </label>
          <label className="block text-sm text-green-900">
            {t('registerName')}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 outline-none"
            />
          </label>
          <label className="block text-sm text-green-900">
            {t('registerEmail')}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 outline-none"
            />
          </label>
          <label className="block text-sm text-green-900">
            {t('registerPassword')}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 outline-none"
            />
          </label>
          {error && <div className="rounded-3xl bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button type="submit" className="w-full rounded-3xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700">
            {t('registerButton')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-green-600">
          {t('haveAccount')} <Link to="/login" className="text-green-600 hover:underline">{t('loginButton')}</Link>
        </p>
      </div>
    </div>
  );
}
