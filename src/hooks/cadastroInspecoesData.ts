import { useState, useEffect, useMemo, useCallback } from 'react';
import { parseBR } from '../utils/dateUtils';
import inspecoesJson from '../components/Dashboard/Cadastro/Inspecoes/inspecoes.json';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface InspecaoItem {
    id: number;
    name: string;
    updated: string;
    next: string;
    warn: string;
    periodicity: string;
}

export interface ProcedimentoItem {
    id: number;
    name: string;
    updated: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function cadastroInspecoesData() {
    const [inspecoes, setInspecoes] = useState<InspecaoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtroDataDe, setFiltroDataDe] = useState('');
    const [filtroDataAte, setFiltroDataAte] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const [procedimentosMapa, setProcedimentosMapa] = useState<Record<string, ProcedimentoItem[]>>({});

    // Estados específicos para procedimentos
    const [buscaProc, setBuscaProc] = useState('');
    const [dataDeProc, setDataDeProc] = useState('');
    const [dataAteProc, setDataAteProc] = useState('');
    const [paginaAtualProc, setPaginaAtualProc] = useState(1);
    const [itensPorPaginaProc, setItensPorPaginaProc] = useState(10);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await new Promise((r) => setTimeout(r, 200));
            setInspecoes(inspecoesJson.inspecoes as InspecaoItem[]);
            setProcedimentosMapa(inspecoesJson.procedimentos as Record<string, ProcedimentoItem[]>);
            setLoading(false);
        };
        load();
    }, []);

    const filtrados = useMemo(() => {
        let lista = [...inspecoes];

        if (busca.trim()) {
            const termo = busca.toLowerCase();
            lista = lista.filter((i) => i.name.toLowerCase().includes(termo));
        }

        if (filtroDataDe) {
            const de = new Date(filtroDataDe);
            lista = lista.filter((i) => {
                const d = parseBR(i.updated);
                return d ? d >= de : true;
            });
        }

        if (filtroDataAte) {
            const ate = new Date(filtroDataAte);
            lista = lista.filter((i) => {
                const d = parseBR(i.updated);
                return d ? d <= ate : true;
            });
        }

        return lista;
    }, [inspecoes, busca, filtroDataDe, filtroDataAte]);

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / itensPorPagina));
    const pagina = Math.min(paginaAtual, totalPaginas);
    const itensPagina = filtrados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);

    const allSelected = itensPagina.length > 0 && itensPagina.every((i) => selectedIds.has(i.id));

    const toggleAll = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allSelected) {
                itensPagina.forEach((i) => next.delete(i.id));
            } else {
                itensPagina.forEach((i) => next.add(i.id));
            }
            return next;
        });
    };

    const toggleOne = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const excluir = (id: number) => {
        setInspecoes((prev) => prev.filter((i) => i.id !== id));
        setSelectedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    };

    const excluirSelecionados = () => {
        setInspecoes((prev) => prev.filter((i) => !selectedIds.has(i.id)));
        setSelectedIds(new Set());
    };

    const adicionarInspecao = (inspecao: Omit<InspecaoItem, 'id'>) => {
        const novoId = Math.max(0, ...inspecoes.map((i) => i.id)) + 1;
        setInspecoes((prev) => [{ ...inspecao, id: novoId }, ...prev]);
        return novoId;
    };

    const editarInspecao = (id: number, dados: Partial<InspecaoItem>) => {
        setInspecoes((prev) => prev.map((i) => (i.id === id ? { ...i, ...dados } : i)));
    };

    const adicionarProcedimento = (inspecaoId: number, procedimento: Omit<ProcedimentoItem, 'id'>) => {
        const idStr = String(inspecaoId);
        const lista = procedimentosMapa[idStr] ?? [];
        const novoId = Math.max(0, ...lista.map(p => p.id)) + 1;
        const novoP = { ...procedimento, id: novoId };

        setProcedimentosMapa(prev => ({
            ...prev,
            [idStr]: [novoP, ...lista]
        }));
    };

    const excluirProcedimento = (inspecaoId: number, procedimentoId: number) => {
        const idStr = String(inspecaoId);
        setProcedimentosMapa(prev => ({
            ...prev,
            [idStr]: (prev[idStr] ?? []).filter(p => p.id !== procedimentoId)
        }));
    };

    const editarProcedimento = (inspecaoId: number, procedimentoId: number, dados: Partial<ProcedimentoItem>) => {
        const idStr = String(inspecaoId);
        setProcedimentosMapa(prev => ({
            ...prev,
            [idStr]: (prev[idStr] ?? []).map(p => (p.id === procedimentoId ? { ...p, ...dados } : p))
        }));
    };

    const importarFormularios = (formularios: string[]) => {
        const hoje = new Date().toLocaleDateString('pt-BR');
        formularios.forEach(f => {
            adicionarInspecao({
                name: `Importado: ${f}`,
                updated: hoje,
                next: 'A definir',
                warn: 'A definir',
                periodicity: 'A definir'
            });
        });
    };

    const getProcedimentos = (inspecaoId: number): ProcedimentoItem[] => {
        return procedimentosMapa[String(inspecaoId)] ?? [];
    };

    const consultar = () => setPaginaAtual(1);
    const limparFiltros = () => {
        setBusca('');
        setFiltroDataDe('');
        setFiltroDataAte('');
        setPaginaAtual(1);
    };

    const limparFiltrosProc = () => {
        setBuscaProc('');
        setDataDeProc('');
        setDataAteProc('');
        setPaginaAtualProc(1);
    };

    const getProcedimentosFiltrados = useCallback((inspecaoId: number) => {
        let lista = procedimentosMapa[String(inspecaoId)] ?? [];

        if (buscaProc.trim()) {
            const termo = buscaProc.toLowerCase();
            lista = lista.filter(p => p.name.toLowerCase().includes(termo));
        }

        if (dataDeProc) {
            const de = new Date(dataDeProc);
            lista = lista.filter(p => {
                const d = parseBR(p.updated);
                return d ? d >= de : true;
            });
        }

        if (dataAteProc) {
            const ate = new Date(dataAteProc);
            lista = lista.filter(p => {
                const d = parseBR(p.updated);
                return d ? d <= ate : true;
            });
        }

        return lista;
    }, [procedimentosMapa, buscaProc, dataDeProc, dataAteProc]);

    return {
        loading,
        itensPagina,
        totalPaginas,
        paginaAtual: pagina,
        totalItens: filtrados.length,
        busca,
        setBusca: (v: string) => { setBusca(v); setPaginaAtual(1); },
        filtroDataDe,
        setFiltroDataDe,
        filtroDataAte,
        setFiltroDataAte,
        itensPorPagina,
        setItensPorPagina,
        setPaginaAtual,
        selectedIds,
        allSelected,
        toggleAll,
        toggleOne,
        excluir,
        excluirSelecionados,
        adicionarInspecao,
        editarInspecao,
        adicionarProcedimento,
        importarFormularios,
        getProcedimentos,
        consultar,
        limparFiltros,
        // Procedimentos
        buscaProc,
        setBuscaProc: (v: string) => { setBuscaProc(v); setPaginaAtualProc(1); },
        dataDeProc,
        setDataDeProc: (v: string) => { setDataDeProc(v); setPaginaAtualProc(1); },
        dataAteProc,
        setDataAteProc: (v: string) => { setDataAteProc(v); setPaginaAtualProc(1); },
        paginaAtualProc,
        setPaginaAtualProc,
        itensPorPaginaProc,
        setItensPorPaginaProc,
        getProcedimentosFiltrados,
        limparFiltrosProc,
        excluirProcedimento,
        editarProcedimento
    };
}

