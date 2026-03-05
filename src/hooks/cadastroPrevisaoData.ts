import { useState, useEffect, useMemo } from 'react';
import previsaoJson from '../components/Dashboard/Cadastro/Previsao/previsao.json';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface SistemaPrevisao {
    id: number;
    nome: string;
    valores: string[];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function previsaoData() {
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState<Record<string, SistemaPrevisao[]>>({});
    const [anoSelecionado, setAnoSelecionado] = useState(previsaoJson.anos_disponiveis[1] ?? '2025');
    const [busca, setBusca] = useState('');
    const [dropdownAberto, setDropdownAberto] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await new Promise((r) => setTimeout(r, 300));
            setTodos(previsaoJson.sistemas as Record<string, SistemaPrevisao[]>);
            setLoading(false);
        };
        load();
    }, []);

    const sistemasFiltrados = useMemo(() => {
        const lista = todos[anoSelecionado] ?? [];
        if (!busca.trim()) return lista;
        const termo = busca.toLowerCase();
        return lista.filter((s) => s.nome.toLowerCase().includes(termo));
    }, [todos, anoSelecionado, busca]);

    const selecionarAno = (ano: string) => {
        setAnoSelecionado(ano);
        setBusca('');
        setDropdownAberto(false);
    };

    const adicionarSistema = (nome: string, mes: number, valor: string, ano: string) => {
        const novoId = Math.max(0, ...(todos[ano] ?? []).map((s) => s.id)) + 1;
        const valores = Array(12).fill('-');
        if (mes >= 0 && mes < 12) valores[mes] = valor;
        const novoSistema: SistemaPrevisao = { id: novoId, nome, valores };
        setTodos((prev) => ({
            ...prev,
            [ano]: [...(prev[ano] ?? []), novoSistema],
        }));
    };

    return {
        loading,
        sistemasFiltrados,
        anoSelecionado,
        anosDisponiveis: previsaoJson.anos_disponiveis,
        busca,
        setBusca,
        dropdownAberto,
        setDropdownAberto,
        selecionarAno,
        adicionarSistema,
    };
}
