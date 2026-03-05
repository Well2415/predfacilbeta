import { useState, useEffect, useMemo } from 'react';
import usuariosJson from '../components/Dashboard/Cadastro/Usuarios/usuarios.json';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    tipo: string;
    ativo: boolean;
}

export type OrdemColuna = 'nome' | 'tipo' | null;
export type OrdemDirecao = 'asc' | 'desc';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usuariosData() {
    const [todos, setTodos] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [ordemColuna, setOrdemColuna] = useState<OrdemColuna>(null);
    const [ordemDirecao, setOrdemDirecao] = useState<OrdemDirecao>('asc');
    const [pagina, setPagina] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await new Promise((r) => setTimeout(r, 300));
            setTodos(usuariosJson.usuarios as Usuario[]);
            setLoading(false);
        };
        load();
    }, []);

    const alternarOrdem = (coluna: OrdemColuna) => {
        if (ordemColuna === coluna) {
            setOrdemDirecao((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setOrdemColuna(coluna);
            setOrdemDirecao('asc');
        }
        setPagina(1);
    };

    const filtrados = useMemo(() => {
        let lista = [...todos];

        if (busca.trim()) {
            const termo = busca.toLowerCase();
            lista = lista.filter(
                (u) =>
                    u.nome.toLowerCase().includes(termo) ||
                    u.email.toLowerCase().includes(termo) ||
                    u.tipo.toLowerCase().includes(termo)
            );
        }

        if (filtroTipo) {
            lista = lista.filter((u) => u.tipo === filtroTipo);
        }

        if (ordemColuna) {
            lista.sort((a, b) => {
                const va = a[ordemColuna].toLowerCase();
                const vb = b[ordemColuna].toLowerCase();
                return ordemDirecao === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
            });
        }

        return lista;
    }, [todos, busca, filtroTipo, ordemColuna, ordemDirecao]);

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / itensPorPagina));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const itensPagina = filtrados.slice(
        (paginaAtual - 1) * itensPorPagina,
        paginaAtual * itensPorPagina
    );

    const excluir = (id: number) => {
        setTodos((prev) => prev.filter((u) => u.id !== id));
    };

    const atualizar = (usuario: Usuario) => {
        setTodos((prev) => prev.map((u) => (u.id === usuario.id ? usuario : u)));
    };

    const adicionarUsuario = (usuario: Omit<Usuario, 'id'>) => {
        const novoId = Math.max(0, ...todos.map((u) => u.id)) + 1;
        setTodos((prev) => [...prev, { ...usuario, id: novoId }]);
    };

    return {
        loading,
        itensPagina,
        totalItens: filtrados.length,
        totalPaginas,
        paginaAtual,
        busca,
        setBusca: (v: string) => { setBusca(v); setPagina(1); },
        filtroTipo,
        setFiltroTipo: (v: string) => { setFiltroTipo(v); setPagina(1); },
        ordemColuna,
        ordemDirecao,
        alternarOrdem,
        setPagina,
        itensPorPagina,
        setItensPorPagina,
        excluir,
        atualizar,
        adicionarUsuario,
        tiposDisponiveis: usuariosJson.tipos_usuario,
    };
}
