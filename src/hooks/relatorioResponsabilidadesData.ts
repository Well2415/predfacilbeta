import { useState, useMemo, useEffect } from 'react';
import dataResponsabilidades from '../components/Dashboard/Relatorios/PlanoManutencao/Responsabilidades/responsabilidades.json';

export interface Responsabilidade {
    id: number;
    cargo: string;
    descricao: string;
}

export function useRelatorioResponsabilidadesData() {
    const [busca, setBusca] = useState('');
    const [pag, setPag] = useState(1);
    const [itensPorPag, setItensPorPag] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const filtrados = useMemo(() => {
        return (dataResponsabilidades as Responsabilidade[]).filter(item => {
            const matchBusca = item.cargo.toLowerCase().includes(busca.toLowerCase()) ||
                item.descricao.toLowerCase().includes(busca.toLowerCase());
            return matchBusca;
        });
    }, [busca]);

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / itensPorPag));

    const itensPaginados = useMemo(() => {
        const start = (pag - 1) * itensPorPag;
        return filtrados.slice(start, start + itensPorPag);
    }, [filtrados, pag, itensPorPag]);

    const stats = {
        totalItems: filtrados.length
    };

    const limparFiltros = () => {
        setBusca('');
        setPag(1);
    };

    return {
        busca, setBusca,
        pag, setPag,
        itensPorPag, setItensPorPag,
        loading,
        itens: itensPaginados,
        totalPaginas,
        stats,
        limparFiltros
    };
}
