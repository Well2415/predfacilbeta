import { useState, useMemo, useEffect } from 'react';
import dataHistorico from '../components/Dashboard/Relatorios/Historico/historico.json';

export interface ManutencaoLancamento {
    mes: number;
    valor: number;
    status: string;
    data: string;
}

export interface ManutencaoSistema {
    id: number;
    sistema: string;
    categoria: string;
    prioridade: string;
    status: string;
    lancamentos: ManutencaoLancamento[];
}

export interface RelatorioGerado {
    id: number;
    modelo: string;
    periodo: string;
    dataSolicitacao: string;
}

export function useRelatorioHistoricoData() {
    const [busca, setBusca] = useState('');
    const [prioridade, setPrioridade] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [categoria, setCategoria] = useState<string>('');
    const [anoRelatorio, setAnoRelatorio] = useState('2025');

    const [buscaRelatorio, setBuscaRelatorio] = useState('');

    // Paginação
    const [pagSistemas, setPagSistemas] = useState(1);
    const [itensPorPagSistemas, setItensPorPagSistemas] = useState(10);

    const [pagRelatorios, setPagRelatorios] = useState(1);
    const [itensPorPagRelatorios, setItensPorPagRelatorios] = useState(10);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Filtros Manutenções
    const sistemasFiltrados = useMemo(() => {
        return (dataHistorico.manutencoes as ManutencaoSistema[]).filter(item => {
            const matchBusca = item.sistema.toLowerCase().includes(busca.toLowerCase());
            const matchPrioridade = !prioridade || item.prioridade === prioridade;
            const matchStatus = !status || item.status === status;
            const matchCategoria = !categoria || item.categoria === categoria;
            return matchBusca && matchPrioridade && matchStatus && matchCategoria;
        });
    }, [busca, prioridade, status, categoria]);

    // Paginação Manutenções
    const totalPagSistemas = Math.ceil(sistemasFiltrados.length / itensPorPagSistemas);
    const itensPagSistemas = useMemo(() => {
        const start = (pagSistemas - 1) * itensPorPagSistemas;
        return sistemasFiltrados.slice(start, start + itensPorPagSistemas);
    }, [sistemasFiltrados, pagSistemas, itensPorPagSistemas]);

    // Filtros Relatórios
    const relatoriosFiltrados = useMemo(() => {
        return (dataHistorico.relatorios as RelatorioGerado[]).filter(item => {
            return item.modelo.toLowerCase().includes(buscaRelatorio.toLowerCase()) ||
                item.periodo.toLowerCase().includes(buscaRelatorio.toLowerCase());
        });
    }, [buscaRelatorio]);

    // Paginação Relatórios
    const totalPagRelatorios = Math.ceil(relatoriosFiltrados.length / itensPorPagRelatorios);
    const itensPagRelatorios = useMemo(() => {
        const start = (pagRelatorios - 1) * itensPorPagRelatorios;
        return relatoriosFiltrados.slice(start, start + itensPorPagRelatorios);
    }, [relatoriosFiltrados, pagRelatorios, itensPorPagRelatorios]);

    // Stats
    const stats = useMemo(() => {
        const totalAnoAtual = sistemasFiltrados.reduce((acc, s) => {
            return acc + s.lancamentos.reduce((accL, l) => accL + l.valor, 0);
        }, 0);

        // Simulação do ano passado (para fins de exibição dinâmica)
        // Se o total for zero, variação é zero. Caso contrário, simulamos que ano passado foi ~11% menor.
        const totalAnoPassado = totalAnoAtual * 0.892;
        const variacao = totalAnoPassado > 0 ? ((totalAnoAtual - totalAnoPassado) / totalAnoPassado) * 100 : 12;

        return {
            totalPrevisto: totalAnoAtual,
            variacao: Math.round(variacao),
            countSistemas: sistemasFiltrados.length,
            countRelatorios: relatoriosFiltrados.length
        };
    }, [sistemasFiltrados, relatoriosFiltrados]);

    const limparFiltrosManutencao = () => {
        setBusca('');
        setPrioridade('');
        setStatus('');
        setCategoria('');
        setAnoRelatorio('2025');
        setPagSistemas(1);
    };

    const limparFiltrosRelatorio = () => {
        setBuscaRelatorio('');
        setPagRelatorios(1);
    };

    const categoriasDisponiveis = useMemo(() => {
        const cats = new Set(dataHistorico.manutencoes.map(i => i.categoria));
        return Array.from(cats).sort();
    }, []);

    const prioridadesDisponiveis = ['Baixa', 'Normal', 'Média', 'Alta'];
    const statusDisponiveis = ['Pendente', 'Executado', 'Cancelado'];

    return {
        busca, setBusca,
        prioridade, setPrioridade,
        status, setStatus,
        categoria, setCategoria,
        anoRelatorio, setAnoRelatorio,
        buscaRelatorio, setBuscaRelatorio,
        pagSistemas, setPagSistemas,
        itensPorPagSistemas, setItensPorPagSistemas,
        pagRelatorios, setPagRelatorios,
        itensPorPagRelatorios, setItensPorPagRelatorios,
        loading,
        sistemas: itensPagSistemas,
        relatorios: itensPagRelatorios,
        totalPagSistemas,
        totalPagRelatorios,
        stats,
        limparFiltrosManutencao,
        limparFiltrosRelatorio,
        categoriasDisponiveis,
        prioridadesDisponiveis,
        statusDisponiveis
    };
}
