import { useTranslation } from 'react-i18next';

export default function Loader() {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl bg-green-100 p-10 text-center text-green-900 shadow-soft border border-green-200">
      {t('loading')}
    </div>
  );
}
