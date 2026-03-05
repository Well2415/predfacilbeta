import { useState, useMemo, useEffect } from 'react';
import atrasadasData from '../components/Dashboard/Relatorios/DadosGerenciais/Atrasadas/atrasadas.json';

export interface InspecaoAtrasada {
    id: number;
    nome: string;
    periodo: string;
    dataAtraso: string;
    diasAtraso: number;
}

export function useRelatorioAtrasadasData() {
    const [busca, setBusca] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [sortColumn, setSortColumn] = useState<'nome' | 'periodo' | 'dataAtraso' | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const parseData = (d: string) => {
        const [dia, mes, ano] = d.split('/').map(Number);
        return new Date(ano, mes - 1, dia).getTime();
    };

    const filtrados = useMemo(() => {
        return (atrasadasData.inspecoes as InspecaoAtrasada[]).filter(item => {
            const matchesBusca = item.nome.toLowerCase().includes(busca.toLowerCase());

            let matchesData = true;
            const timeAtraso = parseData(item.dataAtraso);

            if (dataInicio) {
                const timeInicio = new Date(dataInicio).getTime();
                if (timeAtraso < timeInicio) matchesData = false;
            }
            if (dataFim) {
                const timeFim = new Date(dataFim).getTime();
                if (timeAtraso > timeFim) matchesData = false;
            }

            return matchesBusca && matchesData;
        });
    }, [busca, dataInicio, dataFim]);

    const ordenados = useMemo(() => {
        if (!sortColumn) return filtrados;

        return [...filtrados].sort((a, b) => {
            if (sortColumn === 'dataAtraso') {
                const timeA = parseData(a.dataAtraso);
                const timeB = parseData(b.dataAtraso);
                return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
            }

            let valA = a[sortColumn].toLowerCase();
            let valB = b[sortColumn].toLowerCase();

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filtrados, sortColumn, sortDirection]);

    const totalPaginas = Math.ceil(ordenados.length / itensPorPagina);
    const itensPagina = useMemo(() => {
        const start = (paginaAtual - 1) * itensPorPagina;
        return ordenados.slice(start, start + itensPorPagina);
    }, [ordenados, paginaAtual, itensPorPagina]);

    const stats = useMemo(() => {
        const mais15 = filtrados.filter(i => i.diasAtraso > 15).length;
        const ate15 = filtrados.filter(i => i.diasAtraso <= 15 && i.diasAtraso > 7).length;
        const ate7 = filtrados.filter(i => i.diasAtraso <= 7).length;
        const total = filtrados.length;

        return {
            mais15,
            ate15,
            ate7,
            total,
            porcentagemMais15: total ? Math.round((mais15 / total) * 100) : 0,
            porcentagemAte15: total ? Math.round((ate15 / total) * 100) : 0,
            porcentagemAte7: total ? Math.round((ate7 / total) * 100) : 0
        };
    }, [filtrados]);

    const handleSort = (column: 'nome' | 'periodo' | 'dataAtraso') => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setPaginaAtual(1);
    };

    const limparFiltros = () => {
        setBusca('');
        setDataInicio('');
        setDataFim('');
        setPaginaAtual(1);
    };

    return {
        busca, setBusca,
        dataInicio, setDataInicio,
        dataFim, setDataFim,
        paginaAtual, setPaginaAtual,
        itensPorPagina, setItensPorPagina,
        sortColumn, sortDirection, handleSort,
        limparFiltros,
        totalPaginas,
        itensPagina,
        stats,
        loading
    };
}
