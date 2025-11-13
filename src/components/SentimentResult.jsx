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
  neutro: {
    emoji: '😐',
    label: 'Neutro',
    textClass: 'text-gray-600',
    bgClass: 'bg-gray-100',
    borderClass: 'border-gray-300',
    accentHex: '#6B7280',
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
  const { sentiment, score } = data;
  const styles = SENTIMENT_STYLES[sentiment] || SENTIMENT_STYLES.error;
  const confidencePercent = Math.round((score ?? 0) * 100);

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

        {sentiment !== 'error' && (
          <span className={`inline-flex items-center justify-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium ${styles.textClass}`}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: styles.accentHex }} />
            {confidencePercent}% de confianza
          </span>
        )}
      </div>

      {sentiment !== 'error' && (
        <div className="border-t border-white/70 bg-white/70 px-6 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm font-medium text-slate-600">
              <span>Confianza del resultado</span>
              <span className={`${styles.textClass}`}>{confidencePercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${confidencePercent}%`, backgroundColor: styles.accentHex }}
              />
            </div>
            <p className="text-xs text-slate-500">
              Este indicador combina la probabilidad devuelta por el modelo con el ajuste histórico de resultados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}