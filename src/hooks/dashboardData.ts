import { useState, useEffect } from 'react';
import dashboardData from '../components/Dashboard/dashboard.json';

export interface Condominio {
    id: number;
    nome: string;
    sigla: string;
    cor_tema: string;
}

export interface FiltrosEquipamentos {
    periodos: string[];
    condominios: string[];
    tipos_equipamento: string[];
}

export interface ProximaManutencao {
    id: number;
    codigo: string;
    titulo: string;
    descricao: string;
    dia_semana: string;
    dia: string;
    mes: string;
    ano: string;
}

export interface SaudeGeral {
    percentual: number;
    status_label: string;
    status_cor_texto: string;
    status_cor_fundo: string;
    cor_grafico: string;
}

export interface SaudePontualidade extends SaudeGeral {
    totalizacao: number;
    em_dias: number;
    atrasadas: number;
}

export interface SaudeConformidade extends SaudeGeral {
    concluidas: number;
    conformes: number;
    nao_conformes: number;
}

export interface SaudeResolucao extends SaudeGeral {
    totais: number;
    resolvidas: number;
    pendentes: number;
}

export interface Bomba {
    id: number;
    nome: string;
    percentual: number;
    status_label: string;
    status_cor_fundo: string;
    cor_grafico: string;
}

export interface Reservatorio {
    id: number;
    nome: string;
    percentual: number;
    icone: 'cheio' | 'baixo';
    status_label: string;
    status_cor_fundo: string;
    ultima_atualizacao: string;
}

export interface ChecagemItem {
    ativo: boolean;
}

export interface Gerador {
    id: number;
    nome: string;
    status_label: string;
    status_cor_fundo: string;
    nivel_combustivel: boolean;
    nivel_oleo: boolean;
    ultima_manutencao: boolean;
}

export interface Elevador {
    id: number;
    nome: string;
    status_label: string;
    status_cor_fundo: string;
    tempo_resposta: boolean;
    ruido_motor: boolean;
    ultima_manutencao: boolean;
}

export interface DashboardData {
    condominio: Condominio;
    filtros_equipamentos: FiltrosEquipamentos;
    proximas_manutencoes: ProximaManutencao[];
    saude_condominio: {
        saude_geral: SaudeGeral;
        pontualidade: SaudePontualidade;
        conformidade: SaudeConformidade;
        resolucao: SaudeResolucao;
    };
    equipamentos: {
        bombas: Bomba[];
        reservatorios: Reservatorio[];
        gerador: Gerador;
        elevador: Elevador;
    };
}

export function useDashboardData() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise((r) => setTimeout(r, 400));
            setData(dashboardData as DashboardData);
            setLoading(false);
        };

        loadData();
    }, []);

    return { data, loading };
}

export function getReservatorioStatus(percent: number): { label: string; bg: string } {
    if (percent >= 50) return { label: 'Conforme', bg: '#E6F9F1' };
    if (percent >= 25) return { label: 'Não Conforme', bg: '#FFE78E' };
    return { label: 'Em condição crítica', bg: '#FBDFDF' };
}
