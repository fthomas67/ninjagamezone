export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[ç]/g, 'c') // Remplace ç par c
    .replace(/[œ]/g, 'oe') // Remplace œ par oe
    .replace(/[æ]/g, 'ae') // Remplace æ par ae
    .replace(/[àâä]/g, 'a') // Remplace à, â, ä par a
    .replace(/[éèêë]/g, 'e') // Remplace é, è, ê, ë par e
    .replace(/[îï]/g, 'i') // Remplace î, ï par i
    .replace(/[ôö]/g, 'o') // Remplace ô, ö par o
    .replace(/[ùûü]/g, 'u') // Remplace ù, û, ü par u
    .replace(/[ÿ]/g, 'y') // Remplace ÿ par y
    .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, ''); // Supprime les tirets au début et à la fin
}; 