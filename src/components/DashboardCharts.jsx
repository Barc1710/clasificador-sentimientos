// src/components/DashboardCharts.jsx
import React from 'react';
import { useStore } from '@nanostores/react'; // <-- 1. Importa el hook de Nano Stores
import { $allResults } from '../store/resultsStore'; // <-- 2. Importa el store
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

export function DashboardCharts() {
  // 3. Se suscribe al store global.
  const allResults = useStore($allResults);

  // --- MODIFICACIÓN 1: Cálculo de totales (sin 'neutro') ---
  // Tu API solo devuelve 'positivo' y 'negativo'.
  const totals = { positivo: 0, negativo: 0 };
  allResults.forEach((result) => {
    if (result.sentiment === 'positivo') {
      totals.positivo += 1;
    } else if (result.sentiment === 'negativo') {
      totals.negativo += 1;
    }
  });

  // --- MODIFICACIÓN 2: Datos del Gráfico de Torta (sin 'neutro') ---
  const pieData = [
    { name: 'Positivos', value: totals.positivo },
    { name: 'Negativos', value: totals.negativo },
  ];
  const PIE_COLORS = { 'Positivos': '#10B981', 'Negativos': '#EF4444' };

  const hasResults = allResults.length > 0;

  // --- MODIFICACIÓN 3: Datos del Gráfico de Líneas (basado en volumen, no score) ---
  // Como la API no da 'score', mostramos un 1 por cada post para ver el volumen.
  const lineData = allResults.slice(-10).map((r, index) => ({
    name: `Analisis ${index + 1}`,
    positivos: r.sentiment === 'positivo' ? 1 : 0,
    negativos: r.sentiment === 'negativo' ? 1 : 0,
  }));

  // --- MODIFICACIÓN 4: Tarjetas de KPI (eliminada la de 'neutro') ---
  const summaryCards = [
    {
      key: 'positivo',
      label: 'Positivos',
      value: totals.positivo,
      description: 'Mensajes con tono alentador u optimista.',
      textClass: 'text-green-600',
      ringClass: 'ring-green-500/20',
      accentHex: '#10B981',
    },
    {
      key: 'negativo',
      label: 'Negativos',
      value: totals.negativo,
      description: 'Comentarios con percepción desfavorable.',
      textClass: 'text-red-600',
      ringClass: 'ring-red-500/20',
      accentHex: '#EF4444',
    },
  ];

  const chartTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    border: '1px solid rgba(148, 163, 184, 0.35)',
    boxShadow: '0 25px 45px -25px rgba(15, 23, 42, 0.45)',
    color: '#0f172a',
    padding: 12,
  };

  const legendStyle = {
    paddingTop: 12,
  };

  return (
    <div className="space-y-6">
      {/* --- MODIFICACIÓN 5: Grilla de KPIs (ahora 2 columnas) --- */}
      <section className="grid gap-4 sm:grid-cols-2"> 
        {summaryCards.map((card) => {
          const percentage = hasResults ? Math.round((card.value / allResults.length) * 100) : 0;
          return (
            <article
              key={card.key}
              className={`rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl backdrop-blur ring-1 ${card.ringClass}`}
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${card.textClass}`}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: card.accentHex }} />
                  {card.label}
                </span>
                <span className="text-3xl font-semibold text-slate-900">{card.value}</span>
              </div>
              <p className="mt-3 text-sm text-slate-500">{card.description}</p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percentage}%`, backgroundColor: card.accentHex }}
                />
              </div>
              <span className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                {hasResults ? `${percentage}% del total` : 'Sin datos aún'}
              </span>
            </article>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_35px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Distribución general</h3>
            <span className="text-sm text-slate-500">{hasResults ? `${allResults.length} análisis` : 'Sin datos'}</span>
          </div>
          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="rgba(15, 23, 42, 0.15)" />
                  </filter>
                </defs>
                <Pie
                  data={pieData} // Ya no contiene 'Neutros'
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={110}
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  stroke="#ffffff"
                  strokeWidth={2}
                  isAnimationActive
                  animationDuration={900}
                  animationEasing="ease-out"
                  filter="url(#shadow)"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(148, 163, 184, 0.15)' }} />
                <Legend iconType="circle" wrapperStyle={legendStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_35px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            {/* --- MODIFICACIÓN 6: Título del gráfico --- */}
            <h3 className="text-xl font-semibold text-slate-900">Volumen de posts (últimos 10)</h3>
            <span className="text-sm text-slate-500">Últimos 10 registros</span>
          </div>
          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{ fill: '#64748B' }} />
                {/* --- MODIFICACIÓN 7: Eje Y (para 0 y 1) --- */}
                <YAxis domain={[0, 1]} allowDecimals={false} stroke="#94A3B8" tick={{ fill: '#64748B' }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend iconType="circle" wrapperStyle={legendStyle} />
                {/* --- MODIFICACIÓN 8: Nombres de las líneas --- */}
                <Line type="monotone" dataKey="positivos" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Post Positivo" />
                <Line type="monotone" dataKey="negativos" stroke="#EF4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Post Negativo" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {!hasResults && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-slate-500">
          Ingresa tu primer texto para comenzar a poblar las visualizaciones del dashboard.
        </div>
      )}
    </div>
  );
}