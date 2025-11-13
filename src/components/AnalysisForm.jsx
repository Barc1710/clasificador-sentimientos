// src/components/AnalysisForm.jsx
import React, { useState } from 'react';
import { analyzeTextSentiment } from '../services/apiService';
import { SentimentResult } from './SentimentResult';
import { addResult } from '../store/resultsStore'; // <-- 1. Importa la acción del store

export function AnalysisForm() {
  const [text, setText] = useState('');
  const [lastResult, setLastResult] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const suggestions = [
    'Publicación en redes sociales',
    'Reseña de un cliente',
    'Mensaje de soporte',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setLastResult(null);

    try {
      const data = await analyzeTextSentiment(text);
      setLastResult(data); 

      // 2. ¡Aquí está la magia!
      // Añade el resultado al store global en lugar de llamar a una prop
      addResult(data); 

    } catch (error) {
      setLastResult({ sentiment: 'error', score: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-7 shadow-[0_45px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:sticky lg:top-8">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-lg shadow-slate-900/20">
            ⚡
          </span>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Analizador en Tiempo Real</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Introduce un mensaje, titular o comentario para detectar automáticamente el sentimiento predominante y alimentar el tablero.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700" htmlFor="analysis-text">
            Texto a analizar
          </label>
          <textarea
            id="analysis-text"
            className="w-full resize-none rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-base text-slate-900 shadow-inner transition placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-500/40 disabled:cursor-not-allowed disabled:bg-slate-100"
            rows={6}
            placeholder="Escribe un tweet, una reseña o un comentario..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isLoading}
          >
            {isLoading ? 'Analizando…' : 'Analizar texto'}
            {!isLoading && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Ejemplos rápidos
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {suggestions.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-slate-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {lastResult && <SentimentResult data={lastResult} />}
      </div>
    </div>
  );
}