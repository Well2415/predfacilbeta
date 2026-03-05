import { useState, useMemo, useEffect } from 'react';
import dataFuturas from '../components/Dashboard/Relatorios/DadosGerenciais/Futuras/futuras.json';

export interface InspecaoFutura {
    id: number;
    nome: string;
    valor: number;
    periodo: string;
    dataManutencao: string;
    categoria: string;
}

export function useRelatorioFuturasData() {
    const [busca, setBusca] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [loading, setLoading] = useState(true);

    const categoriasDisponiveis = useMemo(() => {
        const cats = new Set(dataFuturas.map(i => i.categoria));
        return Array.from(cats).sort();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const parseData = (dStr: string) => {
        if (!dStr) return 0;
        return new Date(dStr).getTime();
    };

    const filtrados = useMemo(() => {
        return dataFuturas.filter(item => {
            const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase());
            const matchDataInicio = !dataInicio || parseData(item.dataManutencao) >= parseData(dataInicio);
            const matchDataFim = !dataFim || parseData(item.dataManutencao) <= parseData(dataFim);
            const matchCategoria = categoriasSelecionadas.length === 0 || categoriasSelecionadas.includes(item.categoria);
            return matchBusca && matchDataInicio && matchDataFim && matchCategoria;
        });
    }, [busca, dataInicio, dataFim, categoriasSelecionadas]);

    const totalPaginas = Math.ceil(filtrados.length / itensPorPagina);
    const itensPagina = useMemo(() => {
        const start = (paginaAtual - 1) * itensPorPagina;
        return filtrados.slice(start, start + itensPorPagina);
    }, [filtrados, paginaAtual, itensPorPagina]);

    const stats = useMemo(() => {
        const totalValor = filtrados.reduce((acc, i) => acc + i.valor, 0);
        const count = filtrados.length;

        // Categoria mais e menos recorrente
        const counts: Record<string, number> = {};
        filtrados.forEach(i => {
            counts[i.categoria] = (counts[i.categoria] || 0) + 1;
        });
        const sortedCats = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        const proxInspecao = filtrados.length > 0
            ? [...filtrados].sort((a, b) => parseData(a.dataManutencao) - parseData(b.dataManutencao))[0].dataManutencao
            : '-';

        const valores = filtrados.map(i => i.valor);
        const maiorGasto = valores.length > 0 ? Math.max(...valores) : 0;
        const menorGasto = valores.length > 0 ? Math.min(...valores) : 0;
        const valorMedio = count > 0 ? totalValor / count : 0;

        return {
            totalValor,
            count,
            proxInspecao,
            maiorGasto,
            menorGasto,
            valorMedio,
            maisRecorrente: sortedCats[0]?.[0] || '-',
            menosRecorrente: sortedCats[sortedCats.length - 1]?.[0] || '-',
            mediaEquipamento: (count / (new Set(filtrados.map(i => i.nome)).size || 1)).toFixed(1)
        };
    }, [filtrados]);

    const chartData = useMemo(() => {
        const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        // Ano Atual
        const currentYear = months.map(m => {
            return filtrados.reduce((acc, item) => {
                const date = new Date(item.dataManutencao);
                if (date.getMonth() === m) return acc + item.valor;
                return acc;
            }, 0);
        });

        // Ano Anterior (Simulado para comparação)
        const lastYear = currentYear.map(v => {
            if (v === 0) return Math.floor(Math.random() * 3000) + 1000;
            return Math.floor(v * (0.6 + Math.random() * 0.5));
        });

        const maxVal = Math.max(...currentYear, ...lastYear, 10000);

        return { currentYear, lastYear, maxVal };
    }, [filtrados]);

    const limparFiltros = () => {
        setBusca('');
        setDataInicio('');
        setDataFim('');
        setCategoriasSelecionadas([]);
        setPaginaAtual(1);
    };

    return {
        busca, setBusca,
        dataInicio, setDataInicio,
        dataFim, setDataFim,
        categoriasSelecionadas, setCategoriasSelecionadas,
        categoriasDisponiveis,
        paginaAtual, setPaginaAtual,
        itensPorPagina, setItensPorPagina,
        limparFiltros,
        totalPaginas,
        itensPagina,
        stats,
        chartData,
        loading
    };
}
