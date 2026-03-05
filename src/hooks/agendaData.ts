import { useState, useEffect, useCallback } from 'react';
import calendarioData from '../components/Dashboard/Agenda/calendario.json';
import previsaoData from '../components/Dashboard/Agenda/previsao.json';

// ─── Tipos: Calendário ────────────────────────────────────────────────────────

export interface EventoCalendario {
    id: number;
    dia: string;
    titulo: string;
    descricao: string;
    tipo: 'inspecao' | 'manutencao';
}

export interface CalendarioMes {
    mes: number;
    ano: number;
    eventos: EventoCalendario[];
}

// ─── Tipos: Previsão Orçamentária ─────────────────────────────────────────────

export interface AnoBudget {
    id: number;
    ano: string;
    valor_total: string;
    total_inspecoes: number;
}

export interface MesBudget {
    id: number;
    nome: string;
    valor_total: string;
    fixos: string;
    variaveis: string;
}

export interface ResumoBudget {
    total_inspecoes: number;
    fixos: string;
    variaveis: string;
    maior_gasto: string;
    menor_gasto: string;
    media_mensal: string;
    meses: MesBudget[];
}

export interface ItemGasto {
    id: number;
    nome: string;
    categoria: string;
    valor: string;
}

// ─── Hook: Calendário ─────────────────────────────────────────────────────────

const NOMES_MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

export interface ColunaDia {
    label: string;
    dias: string[];
}

export function buildCalendarioGrid(mes: number, ano: number): ColunaDia[] {
    const primeiroDia = new Date(ano, mes - 1, 1).getDay();
    const totalDias = new Date(ano, mes, 0).getDate();

    const colunas: ColunaDia[] = DIAS_SEMANA.map((label) => ({ label, dias: [] }));

    for (let dia = 1; dia <= totalDias; dia++) {
        const diaSemana = (primeiroDia + dia - 1) % 7;
        colunas[diaSemana].dias.push(String(dia).padStart(2, '0'));
    }

    return colunas;
}

export function useCalendario() {
    const hoje = new Date();
    const [mes, setMes] = useState(calendarioData.calendario.mes_atual ?? hoje.getMonth() + 1);
    const [ano, setAno] = useState(calendarioData.calendario.ano_atual ?? hoje.getFullYear());
    const [eventos, setEventos] = useState<EventoCalendario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await new Promise((r) => setTimeout(r, 300));
            setEventos(calendarioData.calendario.eventos as EventoCalendario[]);
            setLoading(false);
        };
        load();
    }, [mes, ano]);

    const avancarMes = useCallback(() => {
        setMes((m) => {
            if (m === 12) { setAno((a) => a + 1); return 1; }
            return m + 1;
        });
    }, []);

    const voltarMes = useCallback(() => {
        setMes((m) => {
            if (m === 1) { setAno((a) => a - 1); return 12; }
            return m - 1;
        });
    }, []);

    const getEventoDoDia = useCallback(
        (dia: string) => eventos.find((e) => e.dia === dia) ?? null,
        [eventos]
    );

    const diasComEvento = new Set(eventos.map((e) => e.dia));

    return {
        mes,
        ano,
        nomeMes: NOMES_MESES[mes - 1],
        colunas: buildCalendarioGrid(mes, ano),
        eventos,
        diasComEvento,
        loading,
        avancarMes,
        voltarMes,
        getEventoDoDia,
    };
}

// ─── Hook: Previsão Orçamentária ──────────────────────────────────────────────

export function usePrevisaoOrcamentaria() {
    const [anos, setAnos] = useState<AnoBudget[]>([]);
    const [resumoAnual, setResumoAnual] = useState<Record<string, ResumoBudget>>({});
    const [itensPorMes, setItensPorMes] = useState<Record<string, ItemGasto[]>>({});
    const [loading, setLoading] = useState(true);
    const [loadingItens, setLoadingItens] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await new Promise((r) => setTimeout(r, 300));
            setAnos(previsaoData.anos as AnoBudget[]);
            setResumoAnual(previsaoData.resumo_por_ano as Record<string, ResumoBudget>);
            setItensPorMes(previsaoData.itens_por_mes as unknown as Record<string, ItemGasto[]>);
            setLoading(false);
        };
        load();
    }, []);

    const getResumo = (ano: string): ResumoBudget | null =>
        resumoAnual[ano] ?? null;

    const getItens = useCallback(async (_ano: string, _mes: string): Promise<ItemGasto[]> => {
        setLoadingItens(true);
        await new Promise((r) => setTimeout(r, 200));
        const chave = Object.keys(itensPorMes).find((k) => !k.startsWith('_')) ?? '';
        const itens = itensPorMes[chave];
        const result: ItemGasto[] = Array.isArray(itens) ? itens : [];
        setLoadingItens(false);
        return result;
    }, [itensPorMes]);

    return { anos, loading, loadingItens, getResumo, getItens };
}
