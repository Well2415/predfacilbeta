import { useState, useMemo, useEffect } from 'react';
import dataEmergencias from '../components/Dashboard/Relatorios/PlanoManutencao/Emergencias/emergencias.json';

export interface Emergencia {
    id: number;
    tipo: string;
    procedimentos: string[];
}

export function useRelatorioEmergenciasData() {
    const [busca, setBusca] = useState('');
    const [pag, setPag] = useState(1);
    const [itensPorPag, setItensPorPag] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const filtrados = useMemo(() => {
        return (dataEmergencias as Emergencia[]).filter(item => {
            const matchBusca = item.tipo.toLowerCase().includes(busca.toLowerCase()) ||
                item.procedimentos.some(p => p.toLowerCase().includes(busca.toLowerCase()));
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
