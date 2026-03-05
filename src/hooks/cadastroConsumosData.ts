import { useState, useMemo, useEffect } from 'react';
import consumosData from '../components/Dashboard/Cadastro/Consumos/consumos.json';

export interface ConsumoItem {
    id: number;
    tipo: 'Energia' | 'Agua' | 'Gas' | string;
    valor: string;
    consumo: string;
    vencimento: string;
    pagamento: string;
    observacoes?: string;
}

const LOCAL_STORAGE_KEY = 'projetopablo_consumos';

// Helper para converter "DD/MM/YYYY" para objeto Date comparável
const parseDateString = (dateStr: string) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month - 1, day);
};

export const useConsumosData = () => {
    // Inicialização com localStorage ou dados padrão
    const [todos, setTodos] = useState<ConsumoItem[]>(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return consumosData as ConsumoItem[];
            }
        }
        return consumosData as ConsumoItem[];
    });

    const [filtroTipo, setFiltroTipo] = useState<string>('');
    const [filtroDe, setFiltroDe] = useState<string>('');
    const [filtroAte, setFiltroAte] = useState<string>('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [ordemColuna, setOrdemColuna] = useState<'tipo' | 'valor' | 'consumo' | 'vencimento' | 'pagamento' | null>(null);
    const [ordemDirecao, setOrdemDirecao] = useState<'asc' | 'desc' | null>(null);

    // Persistência automática
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    // Simulação de carregamento
    const consultar = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    };

    useEffect(() => {
        consultar();
    }, [filtroTipo, filtroDe, filtroAte]);

    const alternarOrdem = (coluna: 'tipo' | 'valor' | 'consumo' | 'vencimento' | 'pagamento') => {
        if (ordemColuna === coluna) {
            if (ordemDirecao === 'asc') setOrdemDirecao('desc');
            else if (ordemDirecao === 'desc') {
                setOrdemColuna(null);
                setOrdemDirecao(null);
            }
        } else {
            setOrdemColuna(coluna);
            setOrdemDirecao('asc');
        }
    };

    const filtrados = useMemo(() => {
        const dataDeParsed = parseDateString(filtroDe);
        const dataAteParsed = parseDateString(filtroAte);

        let result = todos.filter(item => {
            const bateTipo = !filtroTipo || item.tipo === filtroTipo;

            // Comparação de datas usando objetos Date
            const itemDate = parseDateString(item.vencimento);

            let bateDe = true;
            if (dataDeParsed && itemDate) {
                bateDe = itemDate >= dataDeParsed;
            }

            let bateAte = true;
            if (dataAteParsed && itemDate) {
                bateAte = itemDate <= dataAteParsed;
            }

            return bateTipo && bateDe && bateAte;
        });

        // Ordenação
        if (ordemColuna && ordemDirecao) {
            result.sort((a, b) => {
                const valA = a[ordemColuna] || '';
                const valB = b[ordemColuna] || '';

                if (ordemColuna === 'vencimento' || ordemColuna === 'pagamento') {
                    const d1 = parseDateString(valA)?.getTime() || 0;
                    const d2 = parseDateString(valB)?.getTime() || 0;
                    return ordemDirecao === 'asc' ? d1 - d2 : d2 - d1;
                }

                if (ordemDirecao === 'asc') return valA.toString().localeCompare(valB.toString());
                return valB.toString().localeCompare(valA.toString());
            });
        }

        return result;
    }, [todos, filtroTipo, filtroDe, filtroAte, ordemColuna, ordemDirecao]);

    const totalItens = filtrados.length;
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    const itensPagina = useMemo(() => {
        const inicio = (paginaAtual - 1) * itensPorPagina;
        return filtrados.slice(inicio, inicio + itensPorPagina);
    }, [filtrados, paginaAtual, itensPorPagina]);

    // Lógica de Seleção
    const allSelected = itensPagina.length > 0 && itensPagina.every(i => selectedIds.has(i.id));

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds(prev => {
                const next = new Set(prev);
                itensPagina.forEach(i => next.delete(i.id));
                return next;
            });
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev);
                itensPagina.forEach(i => next.add(i.id));
                return next;
            });
        }
    };

    const toggleOne = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const excluir = (id: number) => {
        setTodos(prev => prev.filter(item => item.id !== id));
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const excluirSelecionados = () => {
        setTodos(prev => prev.filter(item => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
    };

    const adicionar = (item: Omit<ConsumoItem, 'id'>) => {
        const novoId = Math.max(0, ...todos.map(i => i.id)) + 1;
        setTodos(prev => [{ ...item, id: novoId }, ...prev]);
        return novoId;
    };

    const editar = (id: number, dados: Partial<ConsumoItem>) => {
        setTodos(prev => prev.map(item => item.id === id ? { ...item, ...dados } : item));
    };

    const limparFiltros = () => {
        setFiltroTipo('');
        setFiltroDe('');
        setFiltroAte('');
        setPaginaAtual(1);
        setOrdemColuna(null);
        setOrdemDirecao(null);
        setSelectedIds(new Set());
    };

    return {
        todos: itensPagina,
        totalItens,
        totalPaginas,
        paginaAtual,
        setPaginaAtual,
        itensPorPagina,
        setItensPorPagina,
        filtroTipo,
        setFiltroTipo,
        filtroDe,
        setFiltroDe,
        filtroAte,
        setFiltroAte,
        loading,
        selectedIds,
        allSelected,
        toggleAll,
        toggleOne,
        excluir,
        excluirSelecionados,
        adicionar,
        editar,
        limparFiltros,
        ordemColuna,
        ordemDirecao,
        alternarOrdem
    };
};
