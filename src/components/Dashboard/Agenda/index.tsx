import React, { useState, useEffect, useRef } from 'react';
import { useCalendario, usePrevisaoOrcamentaria, ItemGasto } from '../../../hooks/agendaData';

interface AgendaProps {
    agendaSubView: 'calendario' | 'previsao';
    selectedAgendaDay: string;
    setSelectedAgendaDay: (day: string) => void;
    selectedBudgetYear: string | null;
    setSelectedBudgetYear: (year: string | null) => void;
    selectedBudgetMonth: string | null;
    setSelectedBudgetMonth: (month: string | null) => void;
    setShowReportModal: (show: boolean) => void;
    setShowAddPrevisaoModal: (show: boolean) => void;
    AgendaIcon: string;
    IconeAgendaInspecoes: string;
    SemaAtividades: string;
}

const ITENS_OPCOES = [5, 10, 20, 50];

export const Agenda: React.FC<AgendaProps> = ({
    agendaSubView,
    selectedAgendaDay,
    setSelectedAgendaDay,
    selectedBudgetYear,
    setSelectedBudgetYear,
    selectedBudgetMonth,
    setSelectedBudgetMonth,
    setShowReportModal,
    AgendaIcon,
    IconeAgendaInspecoes,
    SemaAtividades,
}) => {
    const cal = useCalendario();
    const prev = usePrevisaoOrcamentaria();

    const [itensDoMes, setItensDoMes] = useState<ItemGasto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [showPerPage, setShowPerPage] = useState(false);
    const perPageRef = useRef<HTMLDivElement>(null);

    const [sortColumn, setSortColumn] = useState<'nome' | 'categoria' | 'valor' | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (perPageRef.current && !perPageRef.current.contains(event.target as Node)) {
                setShowPerPage(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!selectedBudgetYear || !selectedBudgetMonth) return;
        prev.getItens(selectedBudgetYear, selectedBudgetMonth).then(setItensDoMes);
        setPaginaAtual(1);
    }, [selectedBudgetYear, selectedBudgetMonth]);

    const handleSort = (column: 'nome' | 'categoria' | 'valor') => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setPaginaAtual(1);
    };

    const parseValor = (v: string) => {
        return Number(v.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
    };

    const sortedItens = [...itensDoMes].sort((a, b) => {
        if (!sortColumn) return 0;

        let valA = a[sortColumn];
        let valB = b[sortColumn];

        if (sortColumn === 'valor') {
            const numA = parseValor(valA);
            const numB = parseValor(valB);
            return sortDirection === 'asc' ? numA - numB : numB - numA;
        }

        valA = valA.toLowerCase();
        valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPaginas = Math.ceil(sortedItens.length / itensPorPagina);
    const itensPagina = sortedItens.slice(
        (paginaAtual - 1) * itensPorPagina,
        paginaAtual * itensPorPagina
    );

    const eventoSelecionado = cal.getEventoDoDia(selectedAgendaDay);
    const resumoAno = selectedBudgetYear ? prev.getResumo(selectedBudgetYear) : null;

    return (
        <div className="flex flex-col gap-[40px] animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* ─── CALENDÁRIO ────────────────────────────────────────────── */}
            {agendaSubView === 'calendario' ? (
                <section className="flex flex-col gap-[32px]">
                    <div className="flex flex-col gap-[12px]">
                        <h2 className="text-[#3B4141] text-[24px] font-bold font-['Inter'] leading-[24px] tracking-[0px]">Calendário</h2>
                        <p className="text-[#414F5D] text-[20px] font-normal font-['DM_Sans'] leading-[22px]">Acompanhe o calendário de inspeções e eventos do condomínio em um só lugar.</p>
                    </div>

                    <div className="p-[24px] bg-white border border-[#F0F0F0] rounded-[8px] flex flex-col gap-[22px]">
                        {/* Navegação de mês */}
                        <div className="flex justify-between items-center w-full">
                            <button
                                onClick={cal.voltarMes}
                                className="w-[40px] h-[40px] border border-[#F0F0F0] rounded-[4px] flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <h3 className="text-[#3B4141] text-[24px] font-semibold font-['DM_Sans'] leading-[32px]">
                                {cal.loading ? '...' : `${cal.nomeMes} ${cal.ano}`}
                            </h3>
                            <button
                                onClick={cal.avancarMes}
                                className="w-[40px] h-[40px] border border-[#F0F0F0] rounded-[4px] flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>

                        {/* Grade de dias */}
                        {cal.loading ? (
                            <div className="flex justify-between items-start gap-[20px] pt-[20px] animate-pulse">
                                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-[20px]">
                                        <div className="w-[40px] h-[16px] bg-gray-100 rounded mb-[8px]" />
                                        {[0, 1, 2, 3, 4].map((j) => (
                                            <div key={j} className="w-full max-w-[100px] h-[36px] bg-gray-100 rounded-[4px]" />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-between items-start gap-[20px] pt-[20px]">
                                {cal.colunas.map((col, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-[20px]">
                                        <span className="text-[#AAAAAA] text-[16px] font-semibold font-['Funnel_Sans'] mb-[8px] uppercase">{col.label}</span>
                                        {col.dias.map((day, j) => {
                                            const temEvento = cal.diasComEvento.has(day);
                                            const selecionado = selectedAgendaDay === day;
                                            return (
                                                <div
                                                    key={j}
                                                    onClick={() => setSelectedAgendaDay(day)}
                                                    className={`w-full max-w-[100px] h-[36px] flex items-center justify-center rounded-[4px] text-[20px] font-medium font-['Funnel_Sans'] leading-[36px] cursor-pointer transition-colors relative
                                                        ${selecionado
                                                            ? 'bg-[#F68903] text-white shadow-sm'
                                                            : temEvento
                                                                ? 'text-[#F68903] font-bold hover:bg-[#FFEAD0]'
                                                                : 'text-[#3B4141] hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {day}
                                                    {temEvento && !selecionado && (
                                                        <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] bg-[#F68903] rounded-full" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detalhe do evento ou estado vazio */}
                    {eventoSelecionado ? (
                        <div className="p-[20px] bg-[#FAFBFE] rounded-[4px] border border-[#F0F0F0]/50 flex items-start gap-[12px] animate-in fade-in zoom-in duration-300">
                            <div className="w-[32px] h-[32px] flex items-center justify-center shrink-0">
                                <img src={AgendaIcon} alt="Ícone" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col gap-[8px]">
                                <h4 className="text-black text-[24px] font-normal font-['DM_Sans'] leading-[32px]">{eventoSelecionado.titulo}</h4>
                                <p className="text-[#414F5D] text-[20px] font-normal font-['DM_Sans'] leading-[24px]">{eventoSelecionado.descricao}</p>
                                <span className={`w-fit px-[10px] py-[2px] rounded-[4px] text-[13px] font-medium font-['DM_Sans'] ${eventoSelecionado.tipo === 'inspecao' ? 'bg-[#EEF0FA] text-[#3B4141]' : 'bg-[#FFEAD0] text-[#F68903]'}`}>
                                    {eventoSelecionado.tipo === 'inspecao' ? 'Inspeção' : 'Manutenção'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-[40px] pb-[20px] gap-[32px] animate-in fade-in zoom-in duration-300">
                            <div className="relative w-[300px] h-[250px] flex items-center justify-center">
                                <img src={SemaAtividades} alt="Sem Atividades" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col items-center gap-[8px] text-center">
                                <h3 className="text-[#3B4141] text-[28px] font-medium font-['Inter'] leading-[40px]">Sem Atividades</h3>
                                <p className="text-[#AAAAAA] text-[24px] font-normal font-['Funnel_Sans'] leading-[32px]">
                                    Nenhuma atividade foi encontrada <br />para o período selecionado.
                                </p>
                            </div>
                        </div>
                    )}
                </section>

            ) : (

                /* ─── PREVISÃO ORÇAMENTÁRIA ──────────────────────────────────── */
                <section className="flex flex-col gap-[32px]">
                    <div className="flex justify-between items-start w-full gap-[24px]">
                        <div className="flex flex-col gap-[12px] flex-1 min-w-0">
                            <h2 className="text-[#3B4141] text-[24px] font-bold font-['Inter'] leading-[24px] tracking-[0px]">Previsão Orçamentária</h2>
                            <p className="text-[#414F5D] text-[20px] font-normal font-['DM_Sans'] leading-[22px]">Monitore os custos programados das inspeções e mantenha o planejamento orçamentário em dia.</p>
                        </div>
                        {selectedBudgetYear && (
                            <div className="shrink-0">
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="h-[56px] px-[24px] bg-[#F78800] rounded-[4px] flex items-center gap-[8px] hover:bg-[#e67e00] transition-colors shadow-sm"
                                >
                                    <span className="text-white text-[16px] font-semibold font-['Inter']">Baixar Relatório</span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Breadcrumb de navegação */}
                    {(selectedBudgetYear || selectedBudgetMonth) && (
                        <div className="flex items-center gap-[8px] text-[#3B4141] text-[16px] font-['DM_Sans']">
                            <button onClick={() => { setSelectedBudgetYear(null); setSelectedBudgetMonth(null); }} className="text-[#F78800] hover:underline">
                                Anos
                            </button>
                            {selectedBudgetYear && (
                                <>
                                    <span className="text-[#AAAAAA]">/</span>
                                    <button onClick={() => setSelectedBudgetMonth(null)} className={selectedBudgetMonth ? 'text-[#F78800] hover:underline' : 'text-[#3B4141] font-semibold'}>
                                        {selectedBudgetYear}
                                    </button>
                                </>
                            )}
                            {selectedBudgetMonth && (
                                <>
                                    <span className="text-[#AAAAAA]">/</span>
                                    <span className="text-[#3B4141] font-semibold">{selectedBudgetMonth}</span>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── Nível 1: Grade de Anos ── */}
                    {!selectedBudgetYear && (
                        prev.loading ? (
                            <div className="grid grid-cols-2 gap-[32px]">
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="p-[24px] bg-white border border-[#F0F0F0] rounded-[4px] animate-pulse flex flex-col gap-[16px]">
                                        <div className="w-[80px] h-[24px] bg-gray-100 rounded" />
                                        <div className="w-[160px] h-[32px] bg-gray-100 rounded" />
                                        <div className="w-[100px] h-[20px] bg-gray-100 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-[32px]">
                                {prev.anos.map((card) => (
                                    <div
                                        key={card.id}
                                        onClick={() => setSelectedBudgetYear(card.ano)}
                                        className="p-[24px] bg-white border border-[#F0F0F0] rounded-[4px] flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
                                    >
                                        <div className="flex flex-col gap-[16px]">
                                            <div className="flex items-center gap-[8px]">
                                                <div className="w-[32px] h-[32px] flex items-center justify-center shrink-0">
                                                    <img src={IconeAgendaInspecoes} alt="Ícone" className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-[#3B4141] text-[24px] font-extrabold font-['DM_Sans']">{card.ano}</span>
                                            </div>
                                            <div className="flex flex-col gap-[8px]">
                                                <span className="text-[#F68903] text-[32px] font-bold font-['DM_Sans']">{card.valor_total}</span>
                                                <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans']">Inspeções: {card.total_inspecoes}</span>
                                            </div>
                                        </div>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* ── Nível 2: Resumo Anual + Grade de Meses ── */}
                    {selectedBudgetYear && !selectedBudgetMonth && resumoAno && (
                        <div className="flex flex-col gap-[40px] animate-in fade-in zoom-in duration-500">
                            {/* Card de resumo anual */}
                            <div className="p-[32px] bg-white border border-[#F0F0F0] rounded-[4px] flex flex-col gap-[32px]">
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex items-center gap-[12px]">
                                        <div className="w-[40px] h-[40px] flex items-center justify-center shrink-0">
                                            <img src={IconeAgendaInspecoes} alt="Ícone" className="w-full h-full object-contain" />
                                        </div>
                                        <h3 className="text-[#3B4141] text-[40px] font-black font-['DM_Sans'] leading-[44px]">{selectedBudgetYear}</h3>
                                    </div>
                                    <div className="text-[#F68903] text-[40px] font-bold font-['DM_Sans'] leading-[44px]">
                                        {prev.anos.find((a) => a.ano === selectedBudgetYear)?.valor_total ?? '—'}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    {[
                                        { label: 'Inspeções:', value: String(resumoAno.total_inspecoes) },
                                        { label: 'Fixos:', value: resumoAno.fixos },
                                        { label: 'Variáveis:', value: resumoAno.variaveis },
                                        { label: 'Maior Gasto:', value: resumoAno.maior_gasto },
                                        { label: 'Menor Gasto:', value: resumoAno.menor_gasto },
                                        { label: 'Média Mensal:', value: resumoAno.media_mensal },
                                    ].map((row, i) => (
                                        <div key={i} className={`flex flex-col ${i > 0 ? 'mt-[8px]' : ''}`}>
                                            {i > 0 && <div className="h-[1px] bg-[#F0F0F0] w-full mb-[8px]" />}
                                            <div className="flex justify-between items-center">
                                                <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans'] leading-[32px]">{row.label}</span>
                                                <span className="text-[#3B4141] text-[20px] font-extrabold font-['DM_Sans'] leading-[32px]">{row.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Grade de meses */}
                            <div className="grid grid-cols-4 gap-[24px]">
                                {resumoAno.meses.map((mes) => (
                                    <div
                                        key={mes.id}
                                        onClick={() => setSelectedBudgetMonth(mes.nome)}
                                        className="p-[20px] bg-white border border-[#F0F0F0] rounded-[4px] flex flex-col gap-[20px] hover:shadow-md transition-all group cursor-pointer"
                                    >
                                        <div className="flex flex-col gap-[8px]">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-[#3B4141] text-[24px] font-black font-['DM_Sans'] leading-[28px]">{mes.nome}</h4>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-0.5 transition-transform">
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </div>
                                            <div className="text-[#F68903] text-[28px] font-bold font-['DM_Sans'] leading-[32px]">{mes.valor_total}</div>
                                        </div>
                                        <div className="flex flex-col gap-[8px]">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans'] leading-[24px]">Fixos:</span>
                                                <span className="text-[#3B4141] text-[20px] font-extrabold font-['DM_Sans'] leading-[24px]">{mes.fixos}</span>
                                            </div>
                                            <div className="h-[1px] bg-[#F0F0F0] w-full" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans'] leading-[24px]">Variáveis:</span>
                                                <span className="text-[#3B4141] text-[20px] font-extrabold font-['DM_Sans'] leading-[24px]">{mes.variaveis}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Nível 3: Itens do Mês ── */}
                    {selectedBudgetYear && selectedBudgetMonth && (
                        <div className="flex flex-col gap-[40px] animate-in fade-in zoom-in duration-500">
                            {/* Cabeçalho do mês */}
                            <div className="p-[32px] bg-white border border-[#F0F0F0] rounded-[4px] flex flex-col gap-[32px]">
                                <div className="flex justify-between items-center w-full">
                                    <h3 className="text-[#3B4141] text-[40px] font-black font-['DM_Sans'] leading-[44px]">{selectedBudgetMonth}</h3>
                                    <div className="text-[#F68903] text-[40px] font-bold font-['DM_Sans'] leading-[44px]">
                                        {resumoAno?.meses.find((m) => m.nome === selectedBudgetMonth)?.valor_total ?? '—'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-[8px]">
                                    {[
                                        { label: 'Inspeções:', value: String(resumoAno?.total_inspecoes ?? '—') },
                                        { label: 'Fixos:', value: resumoAno?.meses.find((m) => m.nome === selectedBudgetMonth)?.fixos ?? '—' },
                                        { label: 'Variáveis:', value: resumoAno?.meses.find((m) => m.nome === selectedBudgetMonth)?.variaveis ?? '—' },
                                    ].map((row, i) => (
                                        <React.Fragment key={i}>
                                            {i > 0 && <div className="h-[1px] bg-[#F0F0F0] w-full" />}
                                            <div className="flex justify-between items-center">
                                                <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans'] leading-[32px]">{row.label}</span>
                                                <span className="text-[#3B4141] text-[20px] font-extrabold font-['DM_Sans']">{row.value}</span>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Tabela de itens */}
                            <div className="flex flex-col gap-[32px]">
                                <div className="flex justify-between px-[20px] text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">
                                    <div
                                        className="flex-1 flex items-center gap-[8px] cursor-pointer hover:opacity-70 transition-opacity"
                                        onClick={() => handleSort('nome')}
                                    >
                                        <span>Nome</span>
                                        <svg
                                            width="10" height="10" viewBox="0 0 24 24" fill="none"
                                            stroke={sortColumn === 'nome' ? '#F78800' : 'currentColor'}
                                            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                            className={`transition-transform ${sortColumn === 'nome' && sortDirection === 'desc' ? 'rotate-180' : ''}`}
                                        >
                                            <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                                        </svg>
                                    </div>
                                    <div
                                        className="w-[160px] flex items-center justify-center gap-[8px] cursor-pointer hover:opacity-70 transition-opacity"
                                        onClick={() => handleSort('categoria')}
                                    >
                                        <span>Categoria</span>
                                        <svg
                                            width="10" height="10" viewBox="0 0 24 24" fill="none"
                                            stroke={sortColumn === 'categoria' ? '#F78800' : 'currentColor'}
                                            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                            className={`transition-transform ${sortColumn === 'categoria' && sortDirection === 'desc' ? 'rotate-180' : ''}`}
                                        >
                                            <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                                        </svg>
                                    </div>
                                    <div
                                        className="w-[160px] flex items-center justify-center gap-[8px] cursor-pointer hover:opacity-70 transition-opacity"
                                        onClick={() => handleSort('valor')}
                                    >
                                        <span>Valor</span>
                                        <svg
                                            width="10" height="10" viewBox="0 0 24 24" fill="none"
                                            stroke={sortColumn === 'valor' ? '#F78800' : 'currentColor'}
                                            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                            className={`transition-transform ${sortColumn === 'valor' && sortDirection === 'desc' ? 'rotate-180' : ''}`}
                                        >
                                            <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-[16px]">
                                    {prev.loadingItens ? (
                                        [0, 1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-[72px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] animate-pulse flex gap-[20px] items-center">
                                                <div className="flex-1 h-[16px] bg-gray-100 rounded" />
                                                <div className="w-[100px] h-[16px] bg-gray-100 rounded" />
                                                <div className="w-[100px] h-[16px] bg-gray-100 rounded" />
                                            </div>
                                        ))
                                    ) : (
                                        itensPagina.map((row) => (
                                            <div key={row.id} className="h-[72px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] flex justify-between items-center hover:shadow-sm transition-shadow">
                                                <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['DM_Sans']">{row.nome}</div>
                                                <div className="w-[160px] text-center text-[#3B4141] text-[16px] font-normal font-['DM_Sans']">{row.categoria}</div>
                                                <div className="w-[160px] text-center text-[#3B4141] text-[16px] font-normal font-['DM_Sans']">{row.valor}</div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Paginação */}
                                <div className="pt-[24px] pb-[16px] border-t border-[#E1E1E1] flex justify-between items-center">
                                    <div className="flex items-center gap-[16px]">
                                        <div className="relative" ref={perPageRef}>
                                            <div
                                                onClick={() => setShowPerPage(!showPerPage)}
                                                className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex justify-center items-center gap-[8px] cursor-pointer"
                                            >
                                                <span className="text-[#3B4141] text-[14px] font-normal font-['Inter']">{itensPorPagina}</span>
                                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                                    <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            {showPerPage && (
                                                <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-20">
                                                    {ITENS_OPCOES.map(n => (
                                                        <div
                                                            key={n}
                                                            onClick={() => { setItensPorPagina(n); setPaginaAtual(1); setShowPerPage(false); }}
                                                            className="px-[12px] py-[6px] text-center hover:bg-orange-50 cursor-pointer text-[14px] font-['Inter'] text-[#3B4141]"
                                                        >
                                                            {n}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[#F78800] text-[16px] font-normal font-['Inter']">Gastos por página</span>
                                    </div>
                                    <div className="flex items-center gap-[6px]">
                                        <button
                                            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                                            disabled={paginaAtual === 1}
                                            className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-[4px] disabled:opacity-40"
                                        >
                                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                                <path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pg) => (
                                            <button
                                                key={pg}
                                                onClick={() => setPaginaAtual(pg)}
                                                className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border text-[14px] font-['Inter'] transition-colors ${pg === paginaAtual
                                                    ? 'border-[#F78800] text-[#F78800] font-semibold'
                                                    : 'border-[#E5E7EB] text-[#3B4141] hover:bg-gray-50 cursor-pointer'
                                                    }`}
                                            >
                                                {pg}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                                            disabled={paginaAtual === totalPaginas}
                                            className="w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] disabled:opacity-40"
                                        >
                                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                                <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};
