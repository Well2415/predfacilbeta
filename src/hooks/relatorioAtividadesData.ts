import { useState, useMemo, useEffect } from 'react';
import dataAtividades from '../components/Dashboard/Relatorios/DadosGerenciais/UltimasAtividades/atividades.json';

export interface Atividade {
    id: number;
    ficha: string;
    descricao: string;
    periodicidade: number;
    valor: number;
    status: 'Conforme' | 'Não Conforme';
    data: string;
}

export interface PlanoResolvido {
    id: number;
    realizadoPor: string;
    dataAbertura: string;
    fechadoPor: string;
    dataFechamento: string;
    tempoFechamento: string;
    descricao: string;
    valor: number;
}

export function useRelatorioAtividadesData() {
    const [busca, setBusca] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    // Paginação Atividades
    const [pagAtividades, setPagAtividades] = useState(1);
    const [itensPorPagAtividades, setItensPorPagAtividades] = useState(10);

    // Paginação Planos
    const [pagPlanos, setPagPlanos] = useState(1);
    const [itensPorPagPlanos, setItensPorPagPlanos] = useState(10);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const parseData = (dStr: string) => {
        if (!dStr) return 0;
        return new Date(dStr.split(' ')[0]).getTime();
    };

    // Filtro Atividades
    const atividadesFiltradas = useMemo(() => {
        return dataAtividades.atividades.filter(item => {
            const matchBusca = item.ficha.toLowerCase().includes(busca.toLowerCase()) ||
                item.descricao.toLowerCase().includes(busca.toLowerCase());
            const itemTime = parseData(item.data);
            const matchDe = !dataInicio || itemTime >= new Date(dataInicio).getTime();
            const matchAte = !dataFim || itemTime <= new Date(dataFim).getTime();
            return matchBusca && matchDe && matchAte;
        });
    }, [busca, dataInicio, dataFim]);

    // Filtro Planos
    const planosFiltrados = useMemo(() => {
        return dataAtividades.planosResolvidos.filter(item => {
            const matchBusca = item.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                item.realizadoPor.toLowerCase().includes(busca.toLowerCase());
            const itemTime = parseData(item.dataAbertura);
            const matchDe = !dataInicio || itemTime >= new Date(dataInicio).getTime();
            const matchAte = !dataFim || itemTime <= new Date(dataFim).getTime();
            return matchBusca && matchDe && matchAte;
        });
    }, [busca, dataInicio, dataFim]);

    // Paginação Atividades
    const totalPagAtividades = Math.ceil(atividadesFiltradas.length / itensPorPagAtividades);
    const itensPagAtividades = useMemo(() => {
        const start = (pagAtividades - 1) * itensPorPagAtividades;
        return atividadesFiltradas.slice(start, start + itensPorPagAtividades);
    }, [atividadesFiltradas, pagAtividades, itensPorPagAtividades]);

    // Paginação Planos
    const totalPagPlanos = Math.ceil(planosFiltrados.length / itensPorPagPlanos);
    const itensPagPlanos = useMemo(() => {
        const start = (pagPlanos - 1) * itensPorPagPlanos;
        return planosFiltrados.slice(start, start + itensPorPagPlanos);
    }, [planosFiltrados, pagPlanos, itensPorPagPlanos]);

    // Gráfico de Barras (Conformes vs Não Conformes)
    const barChartData = useMemo(() => {
        const conformes = atividadesFiltradas.filter(a => a.status === 'Conforme').length;
        const naoConformes = atividadesFiltradas.filter(a => a.status === 'Não Conforme').length;
        const total = conformes + naoConformes || 1;

        return {
            conformes: Math.round((conformes / total) * 100),
            naoConformes: Math.round((naoConformes / total) * 100),
            rawConformes: conformes,
            rawNaoConformes: naoConformes
        };
    }, [atividadesFiltradas]);

    // Gráfico de Linha (Gastos)
    const lineChartData = useMemo(() => {
        const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        const currentYear = months.map(m => {
            const totalAtiv = atividadesFiltradas.reduce((acc, item) => {
                const date = new Date(item.data);
                return date.getMonth() === m ? acc + item.valor : acc;
            }, 0);
            const totalPlan = planosFiltrados.reduce((acc, item) => {
                const date = new Date(item.dataAbertura.split(' ')[0]);
                return date.getMonth() === m ? acc + item.valor : acc;
            }, 0);
            return totalAtiv + totalPlan;
        });

        // Simulado para comparação
        const lastYear = currentYear.map(v => v === 0 ? Math.floor(Math.random() * 2000) + 1000 : v * 0.85);

        const maxVal = Math.max(...currentYear, ...lastYear, 10000);
        return { currentYear, lastYear, maxVal };
    }, [atividadesFiltradas, planosFiltrados]);

    const limparFiltros = () => {
        setBusca('');
        setDataInicio('');
        setDataFim('');
        setPagAtividades(1);
        setPagPlanos(1);
    };

    return {
        busca, setBusca,
        dataInicio, setDataInicio,
        dataFim, setDataFim,
        pagAtividades, setPagAtividades,
        itensPorPagAtividades, setItensPorPagAtividades,
        pagPlanos, setPagPlanos,
        itensPorPagPlanos, setItensPorPagPlanos,
        loading,
        atividades: itensPagAtividades,
        planos: itensPagPlanos,
        totalAtividades: atividadesFiltradas.length,
        totalPlanos: planosFiltrados.length,
        totalPagAtividades,
        totalPagPlanos,
        barChartData,
        lineChartData,
        limparFiltros
    };
}
