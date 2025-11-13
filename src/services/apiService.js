// src/services/apiService.js

const API_ENDPOINT = import.meta.env.PUBLIC_SENTIMENT_API_URL;

const mockAnalyze = async (text) => {
    console.warn(
        '[API MOCK] Usando respuesta simulada. Configura PUBLIC_SENTIMENT_API_URL para conectar con tu servicio real.'
    );
    return new Promise((resolve) => {
        setTimeout(() => {
            const sentiments = ['positivo', 'negativo', 'neutro'];
            const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
            const score = Number((Math.random() * (0.95 - 0.6) + 0.6).toFixed(2));
            resolve({ sentiment, score });
        }, 800);
    });
};

export const analyzeTextSentiment = async (text) => {
    const payload = text?.trim();
    if (!payload) {
        throw new Error('Se requiere un texto válido para analizar.');
    }

    if (!API_ENDPOINT) {
        return mockAnalyze(payload);
    }

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: payload }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error ${response.status}: ${errorBody || 'Respuesta no válida de la API'}`);
        }

        const data = await response.json();
        if (!data || typeof data.sentiment !== 'string' || typeof data.score !== 'number') {
            throw new Error('La API devolvió un formato de datos inesperado.');
        }

        return {
            sentiment: data.sentiment,
            score: Number(data.score.toFixed(2)),
        };
    } catch (error) {
        console.error('[API] Error al analizar sentimiento:', error);
        throw error;
    }
};