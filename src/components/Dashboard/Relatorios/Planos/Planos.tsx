import React, { useState, useRef, useEffect } from 'react';
import { useRelatorioPlanoData, RelatorioPlanoItem } from '../../../../hooks/relatorioPlanoData';
import { RelatoriosOpcoesModal } from '../../Modais/Relatorios/RelatoriosOpcoesModal';

// ─── MiniCal ──────────────────────────────────────────────────────────────────

const DIAS_SEM = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MESES_CAL = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function buildGrid(mes: number, ano: number) {
    const first = new Date(ano, mes, 1).getDay();
    const total = new Date(ano, mes + 1, 0).getDate();
    const cells: (number | null)[] = Array(first).fill(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
}

function MiniCal({ onSelect, onClose }: { onSelect: (d: Date) => void; onClose: () => void }) {
    const hoje = new Date();
    const [mes, setMes] = useState(hoje.getMonth());
    const [ano, setAno] = useState(hoje.getFullYear());
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [onClose]);

    const grid = buildGrid(mes, ano);

    return (
        <div ref={ref} className="absolute top-[60px] z-50 bg-white border border-[#E1E1E1] rounded-[8px] shadow-xl p-[16px] flex flex-col gap-[12px] w-[240px]">
            <div className="flex justify-between items-center">
                <button onClick={() => { if (mes === 0) { setMes(11); setAno(a => a - 1); } else setMes(m => m - 1); }} className="w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-gray-100">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <span className="text-[#3B4141] text-[13px] font-semibold font-['DM_Sans']">{MESES_CAL[mes]} {ano}</span>
                <button onClick={() => { if (mes === 11) { setMes(0); setAno(a => a + 1); } else setMes(m => m + 1); }} className="w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-gray-100">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-[2px]">
                {DIAS_SEM.map((d, i) => <div key={i} className="h-[22px] flex items-center justify-center text-[10px] font-semibold text-[#AAAAAA] font-['DM_Sans']">{d}</div>)}
                {grid.map((day, i) => day === null ? <div key={i} /> : (
                    <div key={i} onClick={() => onSelect(new Date(ano, mes, day))} className="h-[26px] flex items-center justify-center rounded-[4px] text-[12px] cursor-pointer font-['DM_Sans'] text-[#3B4141] hover:bg-[#FFEAD0] hover:text-[#F68903] transition-colors">{day}</div>
                ))}
            </div>
        </div>
    );
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function toInputDate(d: Date): string {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

function Checkbox({ label, color = '#3B4141', checked, onChange }: { label: string; color?: string; checked: boolean; onChange: () => void }) {
    return (
        <div className="flex items-start gap-[12px]">
            <div
                onClick={onChange}
                className={`w-[20px] h-[20px] rounded-[4px] border-2 flex items-center justify-center cursor-pointer flex-shrink-0 ${checked ? 'border-[#F78800] bg-[#F78800]' : 'border-[#CCCCCC]'}`}
            >
                {checked && <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span className="text-[16px] font-normal font-['Funnel_Sans']" style={{ color }}>{label}</span>
        </div>
    );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const isResolvido = status === 'Resolvido';
    return (
        <div className={`px-[11px] py-[4px] rounded-[4px] inline-flex ${isResolvido ? 'bg-[#2AE49F]/[0.16]' : 'bg-[#FFCE1C]/50'}`}>
            <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{status}</span>
        </div>
    );
}

// ─── DetailModal ─────────────────────────────────────────────────────────────

function DetailModal({ item, onClose }: { item: RelatorioPlanoItem; onClose: () => void }) {
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40" />
            <div
                className="relative bg-white rounded-[8px] shadow-2xl w-[640px] max-w-[90vw] p-[40px] flex flex-col gap-[24px] animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h2 className="text-[#3B4141] text-[20px] font-semibold font-['Funnel_Sans'] leading-tight pr-[16px]">{item.nome}</h2>
                    <button onClick={onClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2L14 14M14 2L2 14" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>
                </div>

                {/* Status */}
                <div className="flex items-center gap-[16px]">
                    <StatusBadge status={item.status} />
                    <span className="text-[#848484] text-[14px] font-normal font-['Funnel_Sans']">{item.agendamento}</span>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-[#F0F0F0]" />

                {/* Fields */}
                <div className="flex flex-col gap-[16px]">
                    <div className="flex flex-col gap-[4px]">
                        <span className="text-[#848484] text-[12px] font-medium font-['Funnel_Sans'] uppercase tracking-wider">Descrição</span>
                        <span className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans'] leading-[1.5]">{item.descricao}</span>
                    </div>
                    <div className="flex gap-[40px]">
                        <div className="flex flex-col gap-[4px]">
                            <span className="text-[#848484] text-[12px] font-medium font-['Funnel_Sans'] uppercase tracking-wider">Responsável</span>
                            <span className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans'] uppercase">{item.responsavel}</span>
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <span className="text-[#848484] text-[12px] font-medium font-['Funnel_Sans'] uppercase tracking-wider">Data</span>
                            <span className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{item.data}</span>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full h-[48px] bg-[#F78800] rounded-[4px] flex items-center justify-center hover:bg-[#E57600] transition-colors"
                >
                    <span className="text-white text-[16px] font-medium font-['Funnel_Sans']">Fechar</span>
                </button>
            </div>
        </div>
    );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface RelatoriosPlanosProps {
    RelatCalendarioIcon?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const RelatoriosPlanos: React.FC<RelatoriosPlanosProps> = ({ RelatCalendarioIcon }) => {
    const hook = useRelatorioPlanoData();
    const pages = buildPageNumbers(hook.paginaAtual, hook.totalPaginas);
    const [showCalDe, setShowCalDe] = useState(false);
    const [showCalAte, setShowCalAte] = useState(false);
    const [selectedItem, setSelectedItem] = useState<RelatorioPlanoItem | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportType, setReportType] = useState<'simplificado' | 'completo' | null>(null);
    const [showPerPage, setShowPerPage] = useState(false);
    const perPageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (perPageRef.current && !perPageRef.current.contains(e.target as Node)) setShowPerPage(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    const [considDataInclusao, setConsidDataInclusao] = useState(false);
    const [considDataResolucao, setConsidDataResolucao] = useState(false);

    const handleSelectDe = (d: Date) => { hook.setFiltroDe(toInputDate(d)); setShowCalDe(false); };
    const handleSelectAte = (d: Date) => { hook.setFiltroAte(toInputDate(d)); setShowCalAte(false); };

    const TABS = ['Todos', 'Resolvidos', 'Pendentes'] as const;
    const tabKey = (t: typeof TABS[number]) => t === 'Resolvidos' ? 'Resolvido' : t === 'Pendentes' ? 'Pendente' : 'Todos';

    const sortedPaginados = [...hook.paginados].sort((a, b) => {
        const cmp = a.status.localeCompare(b.status);
        return sortDir === 'asc' ? cmp : -cmp;
    });

    return (
        <div className="flex flex-col gap-[20px] animate-in fade-in slide-in-from-bottom-2 duration-300 w-full pb-[60px]">

            {/* Modals */}
            {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
            <RelatoriosOpcoesModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                reportType={reportType}
                setReportType={setReportType}
            />

            {/* Tabs */}
            <div className="px-[40px]">
                <div className="h-[56px] p-[8px] bg-[#EEF0FA] rounded-[4px] flex gap-[16px]">
                    {TABS.map(tab => {
                        const isActive = hook.tabAtiva === tabKey(tab);
                        return (
                            <div
                                key={tab}
                                onClick={() => { hook.setTabAtiva(tabKey(tab)); hook.setPaginaAtual(1); }}
                                className={`flex-1 flex items-center justify-center rounded-[4px] cursor-pointer ${isActive ? 'bg-white' : ''}`}
                            >
                                <span className={`text-[14px] font-['DM_Sans'] ${isActive ? 'text-[#F78800] font-semibold' : 'text-[#0E0700] font-normal'}`}>{tab}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Filters Row 1: categoria + descrição + De/Até */}
            <div className="px-[40px] flex gap-[20px]">
                <div className="flex-1">
                    <input
                        type="text"
                        value={hook.filtroCategoria}
                        onChange={e => hook.setFiltroCategoria(e.target.value)}
                        placeholder="Informe uma categoría"
                        className="w-full h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] leading-[24px] placeholder-[#414F5D] focus:outline-[#F78800] focus:outline-2 transition-all"
                    />
                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        value={hook.filtroDescricao}
                        onChange={e => hook.setFiltroDescricao(e.target.value)}
                        placeholder="Informe uma descrição de respostas ou inspeções"
                        className="w-full h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] leading-[24px] placeholder-[#414F5D] focus:outline-[#F78800] focus:outline-2 transition-all"
                    />
                </div>
                <div className="flex-1 flex gap-[20px]">
                    <div className="flex-1 relative">
                        <div
                            onClick={() => { setShowCalDe(!showCalDe); setShowCalAte(false); }}
                            className="h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] flex items-center gap-[8px] cursor-pointer"
                        >
                            <div className="flex-1 flex items-center gap-[8px]">
                                {RelatCalendarioIcon
                                    ? <img src={RelatCalendarioIcon} alt="" className="w-[20px] h-[20px] object-contain" />
                                    : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3.33" y="4.17" width="13.33" height="13.33" rx="1" stroke="#F78800" strokeWidth="1.33" /><line x1="3.33" y1="7.5" x2="16.67" y2="7.5" stroke="#F78800" strokeWidth="1.33" /><line x1="7" y1="3" x2="7" y2="5.5" stroke="#F78800" strokeWidth="1.33" strokeLinecap="round" /><line x1="13" y1="3" x2="13" y2="5.5" stroke="#F78800" strokeWidth="1.33" strokeLinecap="round" /></svg>
                                }
                                <span className="text-[#848484] text-[16px] font-normal font-['Funnel_Sans']">{hook.filtroDe || 'De'}</span>
                            </div>
                            <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 1L4 4L7 1" stroke="#848484" strokeWidth="1.2" strokeLinecap="round" /></svg>
                        </div>
                        {showCalDe && <MiniCal onSelect={handleSelectDe} onClose={() => setShowCalDe(false)} />}
                    </div>
                    <div className="flex-1 relative">
                        <div
                            onClick={() => { setShowCalAte(!showCalAte); setShowCalDe(false); }}
                            className="h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] flex items-center gap-[8px] cursor-pointer"
                        >
                            <div className="flex-1 flex items-center gap-[8px]">
                                {RelatCalendarioIcon
                                    ? <img src={RelatCalendarioIcon} alt="" className="w-[20px] h-[20px] object-contain" />
                                    : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3.33" y="4.17" width="13.33" height="13.33" rx="1" stroke="#F78800" strokeWidth="1.33" /><line x1="3.33" y1="7.5" x2="16.67" y2="7.5" stroke="#F78800" strokeWidth="1.33" /><line x1="7" y1="3" x2="7" y2="5.5" stroke="#F78800" strokeWidth="1.33" strokeLinecap="round" /><line x1="13" y1="3" x2="13" y2="5.5" stroke="#F78800" strokeWidth="1.33" strokeLinecap="round" /></svg>
                                }
                                <span className="text-[#848484] text-[16px] font-normal font-['Funnel_Sans']">{hook.filtroAte || 'Até'}</span>
                            </div>
                            <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 1L4 4L7 1" stroke="#848484" strokeWidth="1.2" strokeLinecap="round" /></svg>
                        </div>
                        {showCalAte && <MiniCal onSelect={handleSelectAte} onClose={() => setShowCalAte(false)} />}
                    </div>
                </div>
            </div>

            {/* Filters Row 2: Considerar / Criticidade / Mão de Obra */}
            <div className="px-[40px] flex gap-[20px]">
                <div className="flex-1 px-[20px] py-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] flex flex-col gap-[20px]">
                    <span className="text-[#414F5D] text-[20px] font-semibold font-['Funnel_Sans'] leading-[30px]">Considerar:</span>
                    <div className="flex gap-[20px]">
                        <Checkbox label="Data de Inclusão" checked={considDataInclusao} onChange={() => setConsidDataInclusao(v => !v)} />
                        <Checkbox label="Data de Resolução" checked={considDataResolucao} onChange={() => setConsidDataResolucao(v => !v)} />
                    </div>
                </div>

                <div className="flex-1 px-[20px] py-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] flex flex-col gap-[20px]">
                    <span className="text-[#414F5D] text-[20px] font-semibold font-['Funnel_Sans'] leading-[30px]">Criticidade:</span>
                    <div className="flex gap-[20px] flex-wrap">
                        <Checkbox label="Todos" checked={hook.criticidadeFiltro.includes('Todos')} onChange={() => hook.toggleCriticidade('Todos')} />
                        <Checkbox label="Mínimo" color="#FFC900" checked={hook.criticidadeFiltro.includes('Mínimo')} onChange={() => hook.toggleCriticidade('Mínimo')} />
                        <Checkbox label="Regular" color="#F78800" checked={hook.criticidadeFiltro.includes('Regular')} onChange={() => hook.toggleCriticidade('Regular')} />
                        <Checkbox label="Crítico" color="#E63939" checked={hook.criticidadeFiltro.includes('Crítico')} onChange={() => hook.toggleCriticidade('Crítico')} />
                    </div>
                </div>

                <div className="flex-1 px-[20px] py-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] flex flex-col gap-[20px]">
                    <span className="text-[#414F5D] text-[20px] font-semibold font-['Funnel_Sans'] leading-[30px]">Mão de Obra:</span>
                    <div className="flex gap-[20px] flex-wrap">
                        <Checkbox label="Todos" checked={hook.maobraFiltro.includes('Todos')} onChange={() => hook.toggleMaobra('Todos')} />
                        <Checkbox label="Empresa Especializada" checked={hook.maobraFiltro.includes('Empresa Especializada')} onChange={() => hook.toggleMaobra('Empresa Especializada')} />
                        <Checkbox label="Local" checked={hook.maobraFiltro.includes('Local')} onChange={() => hook.toggleMaobra('Local')} />
                    </div>
                </div>
            </div>

            {/* Consultar Button */}
            <div className="px-[40px]">
                <button
                    onClick={hook.consultar}
                    className="w-full h-[56px] bg-[#F78800] rounded-[4px] flex items-center justify-center hover:bg-[#E57600] transition-colors"
                >
                    <span className="text-white text-[16px] font-medium font-['Funnel_Sans']">Consultar</span>
                </button>
            </div>

            {/* Table Section */}
            {hook.hasFilters && (
                <div className="px-[40px] flex items-center gap-[8px] -mt-[8px]">
                    <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                        {hook.totalItens} {hook.totalItens === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </span>
                    <button
                        onClick={() => hook.limparFiltros()}
                        className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}

            <div className="px-[40px] flex flex-col gap-[32px]">
                <div className="flex flex-col gap-[16px]">
                    {/* Table Header */}
                    <div className="px-[20px] flex justify-between items-center">
                        <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Nome</div>
                        <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Descrição</div>
                        <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Responsável</div>
                        <div
                            className="flex-1 flex items-center gap-[12px] cursor-pointer"
                            onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                        >
                            <span className="text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Status</span>
                            <div className="flex flex-col gap-[2px]">
                                <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M7 4L4 1L1 4" stroke="#3B4141" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 1L4 4L7 1" stroke="#3B4141" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            </div>
                        </div>
                        <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Agendamento</div>
                        <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Data</div>
                        <div className="w-[72px] text-center text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Ações</div>
                    </div>

                    {/* Rows */}
                    {hook.paginados.length === 0 ? (
                        <div className="py-[48px] flex flex-col items-center gap-[12px]">
                            <span className="text-[#3B4141] text-[18px] font-medium font-['DM_Sans']">Nenhum resultado encontrado</span>
                        </div>
                    ) : sortedPaginados.map(row => (
                        <div key={row.id} className="px-[20px] py-[12px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] outline-offset-[-1px] flex justify-between items-center hover:shadow-sm transition-shadow">
                            <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans'] pr-[8px]">{row.nome}</div>
                            <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans'] pr-[20px] leading-snug">{row.descricao}</div>
                            <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.responsavel}</div>
                            <div className="flex-1">
                                <StatusBadge status={row.status} />
                            </div>
                            <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.agendamento}</div>
                            <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.data}</div>
                            <div className="w-[72px] flex justify-center items-center py-[16px] px-[24px]">
                                <div
                                    className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:opacity-80 hover:scale-110 transition-transform"
                                    onClick={() => setSelectedItem(row)}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="pt-[24px] pb-[16px] border-t border-[#E1E1E1] flex justify-between items-center">
                    <div className="flex items-center gap-[16px]">
                        <div className="relative" ref={perPageRef}>
                            <div
                                onClick={() => setShowPerPage(v => !v)}
                                className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex justify-center items-center gap-[8px] cursor-pointer"
                            >
                                <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">{hook.itensPorPagina}</span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                    <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showPerPage && (
                                <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-20">
                                    {[5, 10, 20, 50].map(n => (
                                        <div
                                            key={n}
                                            onClick={() => { hook.setItensPorPagina(n); hook.setPaginaAtual(1); setShowPerPage(false); }}
                                            className="px-[12px] py-[6px] text-center hover:bg-orange-50 cursor-pointer text-[14px] font-['Funnel_Sans'] text-[#3B4141]"
                                        >
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans']">Relatórios por página</span>
                    </div>
                    <div className="flex items-center gap-[3px]">
                        <button
                            onClick={() => hook.setPaginaAtual(p => Math.max(1, p - 1))}
                            disabled={hook.paginaAtual === 1}
                            className="w-[34px] h-[39px] flex items-center justify-center bg-white rounded-[6px] cursor-pointer hover:bg-gray-50 disabled:opacity-40"
                        >
                            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6L6 11" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        {pages.map((num, i) => num === '...' ? (
                            <div key={`e-${i}`} className="w-[39px] h-[39px] flex items-center justify-center rounded-[4px] outline outline-1 outline-[#E8E8E8] bg-white">
                                <span className="text-[#3B4141] text-[15px] font-normal font-['Funnel_Sans']">...</span>
                            </div>
                        ) : (
                            <button
                                key={num}
                                onClick={() => hook.setPaginaAtual(num as number)}
                                className={`w-[39px] h-[39px] flex items-center justify-center rounded-[4px] cursor-pointer ${hook.paginaAtual === num
                                    ? 'bg-[rgba(247,136,0,0.10)] outline outline-1 outline-[#F78800]'
                                    : 'bg-white outline outline-1 outline-[#E8E8E8] hover:bg-gray-50'
                                    }`}
                            >
                                <span className={`text-[15px] font-['Funnel_Sans'] ${hook.paginaAtual === num ? 'text-[#F78800] font-semibold' : 'text-[#3B4141] font-normal'}`}>{num}</span>
                            </button>
                        ))}
                        <button
                            onClick={() => hook.setPaginaAtual(p => Math.min(hook.totalPaginas, p + 1))}
                            disabled={hook.paginaAtual === hook.totalPaginas}
                            className="w-[34px] h-[39px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] disabled:opacity-40"
                        >
                            <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1L6 6L1 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Relatórios Button */}
            <div className="px-[40px]">
                <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full h-[56px] bg-[#F78800] rounded-[4px] flex items-center justify-center hover:bg-[#E57600] transition-colors"
                >
                    <span className="text-white text-[16px] font-medium font-['Funnel_Sans']">Relatórios</span>
                </button>
            </div>
        </div>
    );
};
