import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitOrder } from '../features/orders/ordersSlice.js';
import { selectAuth, logout } from '../features/auth/authSlice.js'; // Добавили logout сюда
import { useTranslation } from 'react-i18next';

export default function OrderPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const auth = useSelector(selectAuth);
  const [form, setForm] = useState({ 
    clientName: auth.user?.name || auth.user?.login || '', 
    clientEmail: auth.user?.email || '', 
    serviceId: '', 
    requirements: '' 
  });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setMessage(null);
    try {
      await dispatch(submitOrder(form)).unwrap();
      setStatus('success');
      setMessage(t('orderSuccess'));
      setForm((prev) => ({ ...prev, requirements: '' }));
    } catch (error) {
      setStatus('failed');
      setMessage(error);
    }
  };

  
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="py-10">
      <div className="absolute top-10 right-24">
          <button
            onClick={handleLogout}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            {t('logout') || 'Выйти'}
          </button>
        </div>
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-soft border border-green-200 relative">
        
        
        

        <h1 className="text-3xl font-semibold text-green-900 pr-20">{t('orderTitle')}</h1>
        <p className="mt-3 text-sm text-green-600">{t('orderHint')}</p>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-green-900">{t('orderLabelName')}</label>
            <input
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-900">{t('orderLabelEmail')}</label>
            <input
              name="clientEmail"
              type="email"
              value={form.clientEmail}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-900">{t('orderLabelServiceId')}</label>
            <input
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 outline-none"
              placeholder={t('orderLabelServiceId')}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-900">{t('orderLabelRequirements')}</label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows="5"
              className="mt-2 w-full rounded-3xl border border-green-300 bg-green-50 px-4 py-3 text-green-900 outline-none"
            />
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <button
              type="submit"
              className="rounded-3xl bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? t('orderSending') : t('orderSubmit')}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-6 rounded-3xl p-4 text-sm ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}