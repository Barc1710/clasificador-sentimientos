// src/store/resultsStore.js
import { atom } from 'nanostores';

// 1. Define el "átomo" que guardará la lista de resultados.
// Empezamos vacío para que las estadísticas arranquen en 0.
export const $allResults = atom([]);

// 2. Define una "acción" para añadir nuevos resultados a la lista.
export function addResult(newResult) {
    const currentResults = $allResults.get(); // Lee el valor actual
    $allResults.set([...currentResults, newResult]); // Pone el valor nuevo
}