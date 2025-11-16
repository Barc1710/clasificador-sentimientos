// src/components/SentimentResult.jsx
import React from 'react';

const SENTIMENT_STYLES = {
  positivo: {
    emoji: '😊',
    label: 'Positivo',
    textClass: 'text-green-600',
    bgClass: 'bg-green-100',
    borderClass: 'border-green-300',
    accentHex: '#10B981',
  },
  negativo: {
    emoji: '😠',
    label: 'Negativo',
    textClass: 'text-red-600',
    bgClass: 'bg-red-100',
    borderClass: 'border-red-300',
    accentHex: '#EF4444',
  },
  error: {
    emoji: '⚠️',
    label: 'Error',
    textClass: 'text-yellow-600',
    bgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-300',
    accentHex: '#F59E0B',
  },
};

export function SentimentResult({ data }) {
  if (!data) return null;
  const { sentiment } = data;
  const styles = SENTIMENT_STYLES[sentiment] || SENTIMENT_STYLES.error;

  return (
    <div
      className={`mt-6 overflow-hidden rounded-3xl border ${styles.borderClass} ${styles.bgClass} shadow-xl shadow-slate-900/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl`}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-3xl ${styles.textClass}`}>
            {styles.emoji}
          </span>
          <div className="space-y-1">
            <h3 className={`text-2xl font-semibold ${styles.textClass}`}>{styles.label}</h3>
            {sentiment !== 'error' ? (
              <p className="text-sm leading-relaxed text-slate-600">
                El modelo detectó un tono {styles.label.toLowerCase()} en el texto analizado.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-yellow-700">
                Ocurrió un problema al procesar el texto. Inténtalo nuevamente en unos segundos.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}