import { useState, useMemo } from 'react';
import planosData from '../components/Dashboard/Relatorios/Planos/relatorioPlanos.json';

export interface RelatorioPlanoItem {
    id: number;
    nome: string;
    descricao: string;
    responsavel: string;
    status: 'Resolvido' | 'Pendente' | string;
    agendamento: string;
    data: string;
    criticidade: string;
    maobra: string;
}

function parseDateField(dateStr: string): number {
    const [datePart] = dateStr.split(/\s[–-]\s/);
    const [dd, mm, yyyy] = (datePart || '').split('/').map(Number);
    if (!dd || !mm || !yyyy) return 0;
    return new Date(yyyy, mm - 1, dd).getTime();
}

function parseFilterDate(dateStr: string): number | null {
    if (!dateStr) return null;
    const [dd, mm, yyyy] = dateStr.split('/').map(Number);
    if (!dd || !mm || !yyyy) return null;
    return new Date(yyyy, mm - 1, dd).getTime();
}

export const useRelatorioPlanoData = () => {
    const todos = planosData as RelatorioPlanoItem[];
    const [tabAtiva, setTabAtiva] = useState<'Todos' | 'Resolvido' | 'Pendente'>('Todos');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroDescricao, setFiltroDescricao] = useState('');
    const [filtroDe, setFiltroDe] = useState('');
    const [filtroAte, setFiltroAte] = useState('');
    const [criticidadeFiltro, setCriticidadeFiltro] = useState<string[]>([]);
    const [maobraFiltro, setMaobraFiltro] = useState<string[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);

    const toggleCriticidade = (value: string) => {
        setCriticidadeFiltro(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        setPaginaAtual(1);
    };

    const toggleMaobra = (value: string) => {
        setMaobraFiltro(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        setPaginaAtual(1);
    };

    const filtrados = useMemo(() => {
        return todos.filter(item => {
            if (tabAtiva !== 'Todos' && item.status !== tabAtiva) return false;

            if (filtroCategoria && !item.nome.toLowerCase().includes(filtroCategoria.toLowerCase())) return false;

            if (filtroDescricao &&
                !item.descricao.toLowerCase().includes(filtroDescricao.toLowerCase()) &&
                !item.responsavel.toLowerCase().includes(filtroDescricao.toLowerCase())) return false;

            if (filtroDe || filtroAte) {
                const itemTs = parseDateField(item.data);
                if (filtroDe) {
                    const deTs = parseFilterDate(filtroDe);
                    if (deTs !== null && itemTs < deTs) return false;
                }
                if (filtroAte) {
                    const ateTs = parseFilterDate(filtroAte);
                    if (ateTs !== null && itemTs > ateTs + 86399999) return false;
                }
            }

            const activeCrit = criticidadeFiltro.filter(c => c !== 'Todos');
            if (activeCrit.length > 0 && !activeCrit.includes(item.criticidade)) return false;

            const activeMaobra = maobraFiltro.filter(m => m !== 'Todos');
            if (activeMaobra.length > 0 && !activeMaobra.includes(item.maobra)) return false;

            return true;
        });
    }, [todos, tabAtiva, filtroCategoria, filtroDescricao, filtroDe, filtroAte, criticidadeFiltro, maobraFiltro]);

    const totalItens = filtrados.length;
    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));

    const paginados = useMemo(() => {
        const start = (paginaAtual - 1) * itensPorPagina;
        return filtrados.slice(start, start + itensPorPagina);
    }, [filtrados, paginaAtual, itensPorPagina]);

    const consultar = () => setPaginaAtual(1);

    const limparFiltros = () => {
        setTabAtiva('Todos');
        setFiltroCategoria('');
        setFiltroDescricao('');
        setFiltroDe('');
        setFiltroAte('');
        setCriticidadeFiltro([]);
        setMaobraFiltro([]);
        setPaginaAtual(1);
    };

    const hasFilters = tabAtiva !== 'Todos' || !!filtroCategoria || !!filtroDescricao || !!filtroDe || !!filtroAte || criticidadeFiltro.length > 0 || maobraFiltro.length > 0;

    const handleCyclePerPage = () => {
        const opts = [5, 10, 20, 50];
        const idx = opts.indexOf(itensPorPagina);
        setItensPorPagina(opts[(idx + 1) % opts.length]);
        setPaginaAtual(1);
    };

    return {
        paginados,
        totalItens,
        totalPaginas,
        paginaAtual,
        setPaginaAtual,
        itensPorPagina,
        handleCyclePerPage,
        tabAtiva,
        setTabAtiva,
        filtroCategoria,
        setFiltroCategoria,
        filtroDescricao,
        setFiltroDescricao,
        filtroDe,
        setFiltroDe,
        filtroAte,
        setFiltroAte,
        criticidadeFiltro,
        toggleCriticidade,
        maobraFiltro,
        toggleMaobra,
        consultar,
        limparFiltros,
        hasFilters,
        setItensPorPagina,
    };
};
