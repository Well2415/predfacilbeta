import { useState, useMemo, useEffect } from 'react';
import { formatBR } from '../utils/dateUtils';
import initialData from '../components/Dashboard/Cadastro/Equipamentos/equipamentos.json';

export interface EquipamentoItem {
    id: number;
    nome: string;
    marca: string;
    modelo: string;
    serial: string;
    categoria: string;
    dataCadastro: string;
    voltagem: string;
    btuh: string;
    frequencia: string;
    capacidade: string;
    potenciaKW: string;
    potenciaCV: string;
    potenciaBTU: string;
    tensaoV: string;
    corrente: string;
    maxMCA: string;
    vazaoMax: string;
    vazaoMin: string;
    vazaoLS: string;
    imagem: string;
}

const LOCAL_STORAGE_KEY = 'predfacil_equipamentos_v1';

export const useEquipamentosData = () => {
    const [equipamentos, setEquipamentos] = useState<EquipamentoItem[]>(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return initialData as EquipamentoItem[];
            }
        }
        return initialData as EquipamentoItem[];
    });

    const [busca, setBusca] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [loading, setLoading] = useState(false);

    // Persistência
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(equipamentos));
    }, [equipamentos]);

    // Lógica de Grupos (Categorias)
    const gruposPaginados = useMemo(() => {
        const map = new Map<string, number>();
        equipamentos.forEach(item => {
            map.set(item.categoria, (map.get(item.categoria) || 0) + 1);
        });

        let result = Array.from(map.entries()).map(([nome, count]) => ({
            nome,
            count
        }));

        if (busca) {
            result = result.filter(g => g.nome.toLowerCase().includes(busca.toLowerCase()));
        }

        const inicio = (paginaAtual - 1) * itensPorPagina;
        return {
            itens: result.slice(inicio, inicio + itensPorPagina),
            total: result.length
        };
    }, [equipamentos, busca, paginaAtual, itensPorPagina]);

    // Equipamentos filtrados
    const filtrados = useMemo(() => {
        return equipamentos.filter(item => {
            const bateBusca = !busca ||
                item.nome.toLowerCase().includes(busca.toLowerCase()) ||
                item.marca.toLowerCase().includes(busca.toLowerCase()) ||
                item.modelo.toLowerCase().includes(busca.toLowerCase()) ||
                item.serial.toLowerCase().includes(busca.toLowerCase());

            const bateCategoria = !categoriaFiltro || item.categoria === categoriaFiltro;

            return bateBusca && bateCategoria;
        });
    }, [equipamentos, busca, categoriaFiltro]);

    // Paginação para Itens
    const itensPaginados = useMemo(() => {
        const inicio = (paginaAtual - 1) * itensPorPagina;
        return filtrados.slice(inicio, inicio + itensPorPagina);
    }, [filtrados, paginaAtual, itensPorPagina]);

    // CRUD
    const adicionar = (item: Omit<EquipamentoItem, 'id' | 'dataCadastro'>) => {
        const novoId = Math.max(0, ...equipamentos.map(i => i.id)) + 1;
        const dataCadastro = formatBR(new Date());

        const novoItem = { ...item, id: novoId, dataCadastro };
        setEquipamentos(prev => [novoItem, ...prev]);
        return novoItem;
    };

    const editar = (id: number, dados: Partial<EquipamentoItem>) => {
        setEquipamentos(prev => prev.map(item => item.id === id ? { ...item, ...dados } : item));
    };

    const excluir = (id: number) => {
        setEquipamentos(prev => prev.filter(item => item.id !== id));
    };

    const consultar = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 300);
    };

    const limparFiltros = () => {
        setBusca('');
        setCategoriaFiltro('');
        setPaginaAtual(1);
    };

    return {
        todos: equipamentos,
        grupos: gruposPaginados.itens,
        totalItensGrupos: gruposPaginados.total,
        totalPaginasGrupos: Math.ceil(gruposPaginados.total / itensPorPagina),
        equipamentos: itensPaginados,
        totalItensEquipamentos: filtrados.length,
        totalPaginasEquipamentos: Math.ceil(filtrados.length / itensPorPagina),
        paginaAtual,
        setPaginaAtual,
        itensPorPagina,
        setItensPorPagina,
        busca,
        setBusca,
        categoriaFiltro,
        setCategoriaFiltro,
        loading,
        consultar,
        adicionar,
        editar,
        excluir,
        limparFiltros
    };
};

