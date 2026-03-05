import { useState, useMemo } from 'react';
import consumoData from '../components/Dashboard/Relatorios/Consumo/relatorioConsumo.json';

export interface RelatorioConsumoItem {
    id: number;
    tipo: 'Energia' | 'Agua' | 'Gas' | string;
    consumo: string;
    valor: string;
    mes: string; // "MM/YYYY"
}

const parseMes = (mes: string) => {
    const [m, y] = mes.split('/').map(Number);
    return { month: m - 1, year: y };
};

const parseNum = (str: string): number => {
    const match = str.match(/[\d.,]+/);
    if (!match) return 0;
    return parseFloat(match[0].replace(',', '.')) || 0;
};

export const useRelatorioConsumoData = () => {
    const todos = consumoData as RelatorioConsumoItem[];
    const [filtroDe, setFiltroDe] = useState('');
    const [filtroAte, setFiltroAte] = useState('');

    const filtrados = useMemo(() => {
        return todos.filter(item => {
            const { month, year } = parseMes(item.mes);
            const itemDate = new Date(year, month, 1);

            if (filtroDe) {
                const [, mm, yyyy] = filtroDe.split('/').map(Number);
                const deDate = new Date(yyyy, mm - 1, 1);
                if (itemDate < deDate) return false;
            }

            if (filtroAte) {
                const [, mm, yyyy] = filtroAte.split('/').map(Number);
                const ateDate = new Date(yyyy, mm - 1, 1);
                if (itemDate > ateDate) return false;
            }

            return true;
        });
    }, [todos, filtroDe, filtroAte]);

    const byTipoAndMonth = useMemo(() => {
        const map: Record<string, Record<number, number>> = {
            Agua: {},
            Energia: {},
            Gas: {},
        };
        filtrados.forEach(item => {
            const { month } = parseMes(item.mes);
            const val = parseFloat(item.valor) || 0;
            if (map[item.tipo] !== undefined) {
                map[item.tipo][month] = (map[item.tipo][month] || 0) + val;
            }
        });
        return map;
    }, [filtrados]);

    const summaryByTipo = useMemo(() => {
        const calc = (tipo: string) => {
            const items = filtrados.filter(i => i.tipo === tipo);
            if (items.length === 0) return { total: 0, media: 0, maior: 0, menor: 0 };
            const valores = items.map(i => parseFloat(i.valor) || 0);
            const consumos = items.map(i => parseNum(i.consumo));
            return {
                total: valores.reduce((a, b) => a + b, 0),
                media: consumos.reduce((a, b) => a + b, 0) / consumos.length,
                maior: Math.max(...consumos),
                menor: Math.min(...consumos),
            };
        };
        return {
            Agua: calc('Agua'),
            Energia: calc('Energia'),
            Gas: calc('Gas'),
        };
    }, [filtrados]);

    const limparFiltros = () => {
        setFiltroDe('');
        setFiltroAte('');
    };

    const hasFilters = !!(filtroDe || filtroAte);

    return {
        filtrados,
        byTipoAndMonth,
        summaryByTipo,
        filtroDe,
        setFiltroDe,
        filtroAte,
        setFiltroAte,
        limparFiltros,
        hasFilters,
    };
};
