import { useTranslation } from 'react-i18next';

export default function ServiceCard({ service }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-[2rem] border border-green-200 bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-green-900">{service.title}</h3>
          <p className="mt-2 text-sm text-green-600">{service.tier}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{service.deliveryDays} {t('daysShort')}</p>
          <p className="mt-1 text-lg font-semibold text-green-900">{service.price} {service.currency}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-gray-700">{service.description || t('serviceDescriptionMissing')}</p>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {(service.includes || []).map((item) => (
          <li key={item} className="list-disc pl-5">{item}</li>
        ))}
      </ul>
    </div>
  );
}
