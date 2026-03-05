import { useState, useMemo, useEffect } from 'react';
import dataUsuarios from '../components/Dashboard/Relatorios/DadosGerenciais/PorUsuario/usuarios.json';

export interface UsuarioRelatorio {
    id: number;
    nome: string;
    inspecoes: number;
    ocorrencias: number;
    naoConformidades: number;
    planosConcluidos: number;
    dataAtividade: string;
}

export function useRelatorioUsuariosData() {
    const [busca, setBusca] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const parseData = (dStr: string) => {
        if (!dStr) return 0;
        return new Date(dStr).getTime();
    };

    const filtrados = useMemo(() => {
        return dataUsuarios.filter(item => {
            const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase());
            const matchDataInicio = !dataInicio || parseData(item.dataAtividade) >= parseData(dataInicio);
            const matchDataFim = !dataFim || parseData(item.dataAtividade) <= parseData(dataFim);
            return matchBusca && matchDataInicio && matchDataFim;
        });
    }, [busca, dataInicio, dataFim]);

    const totalPaginas = Math.ceil(filtrados.length / itensPorPagina);
    const itensPagina = useMemo(() => {
        const start = (paginaAtual - 1) * itensPorPagina;
        return filtrados.slice(start, start + itensPorPagina);
    }, [filtrados, paginaAtual, itensPorPagina]);

    const chartData = useMemo(() => {
        // Pega os 5 usuários com mais inspeções para o gráfico
        const topUsers = [...filtrados]
            .sort((a, b) => b.inspecoes - a.inspecoes)
            .slice(0, 5);

        const maxVal = Math.max(...topUsers.map(u => u.inspecoes), 10);

        return {
            users: topUsers.map(u => ({
                name: u.nome,
                value: Math.round((u.inspecoes / maxVal) * 100),
                raw: u.inspecoes
            })),
            maxVal
        };
    }, [filtrados]);

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
        limparFiltros,
        totalPaginas,
        itensPagina,
        chartData,
        totalResultados: filtrados.length,
        loading
    };
}
