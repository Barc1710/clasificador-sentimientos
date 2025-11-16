// src/services/apiService.js
import axios from 'axios';

const DEFAULT_API_URL = 'http://127.0.0.1:8000/predict';
const REAL_API_URL = import.meta.env.PUBLIC_SENTIMENT_API_URL || DEFAULT_API_URL;

const normalizeSentiment = (value) => {
    const normalized = String(value ?? '').toLowerCase();
    if (normalized.includes('pos')) return 'positivo';
    if (normalized.includes('neg')) return 'negativo';
    throw new Error(`Sentimiento no reconocido en la respuesta: ${value}`);
};

export const analyzeTextSentiment = async (text) => {
    const payload = text?.trim();
    if (!payload) {
        throw new Error('Se requiere un texto válido para analizar.');
    }

    try {
        const response = await axios.post(
            REAL_API_URL,
            { text: payload },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const { sentiment, label, prediction } = response.data || {};
        const sentimentLabel = sentiment ?? label ?? prediction;

        return {
            sentiment: normalizeSentiment(sentimentLabel),
        };
    } catch (error) {
        console.error('[API] Error conectando con el servicio de sentimientos:', error);
        throw error;
    }
};