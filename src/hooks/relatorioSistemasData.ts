import { useState, useMemo, useEffect } from 'react';
import dataSistemas from '../components/Dashboard/Relatorios/PlanoManutencao/Sistemas/sistemas.json';

export interface Sistema {
    id: number;
    nome: string;
    descricao: string;
    cuidadosUso: string;
    normasTecnicas: string;
    glossario: string;
}

export function useRelatorioSistemasData() {
    const [sistemas, setSistemas] = useState<Sistema[]>([]);
    const [busca, setBusca] = useState('');
    const [pag, setPag] = useState(1);
    const [itensPorPag, setItensPorPag] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSistemas(dataSistemas as Sistema[]);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const filtrados = useMemo(() => {
        return sistemas.filter(item => {
            const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase()) ||
                item.descricao.toLowerCase().includes(busca.toLowerCase());
            return matchBusca;
        });
    }, [sistemas, busca]);

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

    const adicionar = (novo: Omit<Sistema, 'id'>) => {
        const id = sistemas.length > 0 ? Math.max(...sistemas.map(s => s.id)) + 1 : 1;
        setSistemas([...sistemas, { ...novo, id }]);
    };

    const editar = (id: number, atualizado: Partial<Sistema>) => {
        setSistemas(sistemas.map(s => s.id === id ? { ...s, ...atualizado } : s));
    };

    const excluir = (id: number) => {
        setSistemas(sistemas.filter(s => s.id !== id));
        if (itensPaginados.length === 1 && pag > 1) setPag(pag - 1);
    };

    return {
        busca, setBusca,
        pag, setPag,
        itensPorPag, setItensPorPag,
        loading,
        itens: itensPaginados,
        totalPaginas,
        stats,
        limparFiltros,
        adicionar,
        editar,
        excluir
    };
}
