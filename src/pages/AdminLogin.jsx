import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { adminLogin } from '../features/auth/authSlice.js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await dispatch(adminLogin({ password })).unwrap();
      
      if (res?.token) {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-soft border border-green-200">
        <h1 className="text-2xl font-semibold text-green-900">Admin login</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 outline-none"
          />
          {error && <div className="text-red-600">{error}</div>}
          <button className="w-full rounded-3xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700">Login</button>
        </form>
      </div>
    </div>
  );
}
