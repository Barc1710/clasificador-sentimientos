// src/store/resultsStore.js
import { atom } from 'nanostores';

// 1. Define el "átomo" que guardará la lista de resultados.
// Empezamos con 3 ejemplos.
export const $allResults = atom([
    { sentiment: 'positivo', score: 0.9 },
    { sentiment: 'negativo', score: 0.8 },
    { sentiment: 'positivo', score: 0.95 },
]);

// 2. Define una "acción" para añadir nuevos resultados a la lista.
export function addResult(newResult) {
    const currentResults = $allResults.get(); // Lee el valor actual
    $allResults.set([...currentResults, newResult]); // Pone el valor nuevo
}