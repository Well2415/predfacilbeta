import { useState, useMemo, useEffect } from 'react';
import fornecedoresData from '../components/Dashboard/Cadastro/Fornecedores/fornecedores.json';

export interface FornecedorItem {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    cep: string;
    category: string;
    phone: string;
    cell: string;
    rating: number;
    cpf: string;
    cnpj: string;
    neighborhood: string;
    email: string;
    website: string;
    registeredAt: string;
}

const LOCAL_STORAGE_KEY = 'projetopablo_fornecedores';

export const useCadastroFornecedoresData = () => {
    // Inicialização com localStorage ou dados padrão
    const [todos, setTodos] = useState<FornecedorItem[]>(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return fornecedoresData;
            }
        }
        return fornecedoresData;
    });

    const [busca, setBusca] = useState('');
    const [categoria, setCategoria] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // Persistência automática
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    // Mock de carregamento
    const consultar = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    };

    useEffect(() => {
        consultar();
    }, [busca, categoria]);

    const filtrados = useMemo(() => {
        return todos.filter(f => {
            const termo = busca.toLowerCase();
            const bateBusca = !busca ||
                f.name.toLowerCase().includes(termo) ||
                (f.cnpj && f.cnpj.includes(termo)) ||
                (f.cpf && f.cpf.includes(termo));

            const bateCategoria = !categoria || f.category === categoria;

            return bateBusca && bateCategoria;
        });
    }, [todos, busca, categoria]);

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
        setTodos(prev => prev.filter(f => f.id !== id));
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const excluirSelecionados = () => {
        setTodos(prev => prev.filter(f => !selectedIds.has(f.id)));
        setSelectedIds(new Set());
    };

    const adicionarFornecedor = (fornecedor: Omit<FornecedorItem, 'id'>) => {
        const novoId = Math.max(0, ...todos.map(f => f.id)) + 1;
        setTodos(prev => [{ ...fornecedor, id: novoId }, ...prev]);
        return novoId;
    };

    const editarFornecedor = (id: number, dados: Partial<FornecedorItem>) => {
        setTodos(prev => prev.map(f => f.id === id ? { ...f, ...dados } : f));
    };

    const limparFiltros = () => {
        setBusca('');
        setCategoria('');
        setPaginaAtual(1);
    };

    return {
        todos: itensPagina,
        totalItens,
        totalPaginas,
        paginaAtual,
        setPaginaAtual,
        itensPorPagina,
        setItensPorPagina,
        busca,
        setBusca,
        categoria,
        setCategoria,
        loading,
        selectedIds,
        allSelected,
        toggleAll,
        toggleOne,
        excluir,
        excluirSelecionados,
        adicionarFornecedor,
        editarFornecedor,
        consultar,
        limparFiltros
    };
};
