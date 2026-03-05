import { useState, useEffect, useMemo } from 'react';
import relatoriosJson from '../components/Dashboard/Relatorios/Inspecoes/relatorioInspecoes.json';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface RelatorioInspecaoItem {
    id: number;
    nome: string;
    enviadoPor: string;
    previsto: string;
    respondido: string;
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function parseBR(dateStr: string): Date | null {
    // Formato: "DD/MM/YYYY" ou "DD/MM/YYYY – HH:mm"
    const datePart = dateStr.split(' – ')[0];
    const [d, m, y] = datePart.split('/');
    if (!d || !m || !y) return null;
    return new Date(Number(y), Number(m) - 1, Number(d));
}

function parseDateTimeBR(dateTimeStr: string): number {
    // Formato: "DD/MM/YYYY – HH:mm"
    const [datePart, timePart] = dateTimeStr.split(' – ');
    const [d, m, y] = datePart.split('/');
    const [hour, min] = timePart.split(':');
    return new Date(Number(y), Number(m) - 1, Number(d), Number(hour), Number(min)).getTime();
}

const ITENS_POR_PAGINA_DEFAULT = 10;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRelatorioInspecoesData() {
    const [todos, setTodos] = useState<RelatorioInspecaoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtroDataDe, setFiltroDataDe] = useState('');
    const [filtroDataAte, setFiltroDataAte] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(ITENS_POR_PAGINA_DEFAULT);
    const [ordenacao, setOrdenacao] = useState<'asc' | 'desc' | null>(null);
    const [selectedRelatorio, setSelectedRelatorio] = useState<RelatorioInspecaoItem | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            // Simula delay de rede
            await new Promise((r) => setTimeout(r, 300));
            setTodos(relatoriosJson.relatorios as RelatorioInspecaoItem[]);
            setLoading(false);
        };
        load();
    }, []);

    const filtrados = useMemo(() => {
        let lista = [...todos];

        // Busca
        if (busca.trim()) {
            const termo = busca.toLowerCase();
            lista = lista.filter((i) =>
                i.nome.toLowerCase().includes(termo) ||
                i.enviadoPor.toLowerCase().includes(termo)
            );
        }

        // Filtro de Data (baseado em 'respondido')
        if (filtroDataDe) {
            const de = new Date(filtroDataDe);
            lista = lista.filter((i) => {
                const d = parseBR(i.respondido);
                return d ? d >= de : true;
            });
        }

        if (filtroDataAte) {
            const ate = new Date(filtroDataAte);
            lista = lista.filter((i) => {
                const d = parseBR(i.respondido);
                return d ? d <= ate : true;
            });
        }

        // Ordenação (baseada em 'respondido')
        if (ordenacao) {
            lista.sort((a, b) => {
                const timeA = parseDateTimeBR(a.respondido);
                const timeB = parseDateTimeBR(b.respondido);
                return ordenacao === 'asc' ? timeA - timeB : timeB - timeA;
            });
        }

        return lista;
    }, [todos, busca, filtroDataDe, filtroDataAte, ordenacao]);

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / itensPorPagina));
    const pagina = Math.min(paginaAtual, totalPaginas);
    const itensPagina = filtrados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);

    const consultar = () => setPaginaAtual(1);

    const limparFiltros = () => {
        setBusca('');
        setFiltroDataDe('');
        setFiltroDataAte('');
        setPaginaAtual(1);
        setOrdenacao(null);
    };

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
        paginaAtualEstado: paginaAtual,
        setPaginaAtual,
        itensPorPagina,
        setItensPorPagina,
        ordenacao,
        setOrdenacao,
        selectedRelatorio,
        setSelectedRelatorio,
        consultar,
        limparFiltros,
    };
}
