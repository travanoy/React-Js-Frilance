import { useEffect, useState } from 'react';
import { client } from '../api/client.js';
import { useTranslation } from 'react-i18next';

export default function AdminPanel() {
  const { t } = useTranslation();
  const [designers, setDesigners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [d, o] = await Promise.all([client.get('/designers'), client.get('/orders')]);
        setDesigners(Array.isArray(d) ? d : []);
        setOrders(Array.isArray(o) ? o : []);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleVerify = async (id, current) => {
    try {
      await client.patch(`/designers/${id}/verify`, { isVerified: !current });
      setDesigners((s) => s.map((x) => (x.id === id ? { ...x, isVerified: !current } : x)));
    } catch (err) {
      alert(err.message || 'Failed');
    }
  };

  const removeDesigner = async (id) => {
    if (!confirm('Delete designer?')) return;
    try {
      await client.del(`/designers/${id}`);
      setDesigners((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      alert(err.message || 'Failed');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await client.patch(`/orders/${id}/status`, { status });
      setOrders((s) => s.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      alert(err.message || 'Failed');
    }
  };

  if (loading) return <div className="p-8">{t('loading')}</div>;
  if (error) return <div className="p-8 text-rose-400">{error}</div>;

  return (
    <div className="space-y-6 py-10">
      <section className="rounded-[2rem] bg-white p-6 shadow-soft border border-green-200">
        <h2 className="text-xl font-semibold text-green-900">Designers</h2>
        <div className="mt-4 space-y-3">
          {designers.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-3xl border border-green-200 p-3">
              <div>
                <div className="font-semibold text-green-900">{d.name || d.login}</div>
                <div className="text-sm text-green-600">{d.title || ''}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleVerify(d.id, d.isVerified)} className="rounded px-3 py-1 bg-green-500 text-white">{d.isVerified ? 'Unverify' : 'Verify'}</button>
                <button onClick={() => removeDesigner(d.id)} className="rounded px-3 py-1 bg-red-500 text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-soft border border-green-200">
        <h2 className="text-xl font-semibold text-green-900">Orders</h2>
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded-3xl border border-green-200 p-3">
              <div>
                <div className="font-semibold text-green-900">{o.clientName} → {o.serviceId}</div>
                <div className="text-sm text-green-600">{o.status}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateOrderStatus(o.id, 'processing')} className="rounded px-3 py-1 bg-green-600 text-white">Processing</button>
                <button onClick={() => updateOrderStatus(o.id, 'completed')} className="rounded px-3 py-1 bg-green-500 text-white">Complete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
