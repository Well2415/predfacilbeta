
/**
 * Utilitários para manipulação de datas no formato brasileiro (DD/MM/YYYY)
 */

/**
 * Converte uma string no formato DD/MM/YYYY para um objeto Date
 */
export function parseBR(dateStr: string): Date | null {
    if (!dateStr) return null;
    const [d, m, y] = dateStr.split('/');
    if (!d || !m || !y) return null;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return isNaN(date.getTime()) ? null : date;
}

/**
 * Formata um objeto Date para uma string DD/MM/YYYY
 */
export function formatBR(date: Date | null | undefined, fallback: string = ''): string {
    if (!date) return fallback;
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

/**
 * Formata um objeto Date para uma string YYYY-MM-DD (usado em inputs de data)
 */
export function formatISO(date: Date | null | undefined): string {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
