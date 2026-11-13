import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../features/auth/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.login || !form.password) {
      setError(t('loginInvalid'));
      return;
    }
    try {
      await dispatch(loginUser({ login: form.login, password: form.password })).unwrap();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-soft border border-green-200">
        <h1 className="text-3xl font-semibold text-green-900">{t('loginTitle')}</h1>
        <p className="mt-3 text-sm text-green-600">{t('loginHint')}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm text-green-900">
            {t('loginLabel')}
            <input
              name="login"
              value={form.login}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 outline-none"
            />
          </label>
          <label className="block text-sm text-green-900">
            {t('loginPassword')}
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
            {t('loginButton')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-green-600">
          {t('noAccount')} <Link to="/register" className="text-green-600 hover:underline">{t('registerButton')}</Link>
        </p>
      </div>
    </div>
  );
}
