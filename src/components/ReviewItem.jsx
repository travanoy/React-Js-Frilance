import { useTranslation } from 'react-i18next';

export default function ReviewItem({ review }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-[2rem] border border-green-200 bg-green-50 p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-green-900">{review.clientName}</p>
          <p className="text-xs text-green-600">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <span className="rounded-full bg-amber-400 px-3 py-2 text-xs font-semibold text-amber-900">{review.rating} ★</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-700">{review.comment || t('noReviewsText')}</p>
    </div>
  );
}
