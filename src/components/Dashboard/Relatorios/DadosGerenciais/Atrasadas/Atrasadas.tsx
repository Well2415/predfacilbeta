import React, { useState, useRef, useEffect } from 'react';
import { useRelatorioAtrasadasData, InspecaoAtrasada } from '../../../../../hooks/relatorioAtrasadasData';

interface RelatoriosDadosProps {
    view: string;
    RelatInspecoesIcon?: string;
    PesquisarIcon?: string;
    RelatCalendarioIcon?: string;
    CalendarioFiltroIcon?: string;
}

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
        <div ref={ref} className="absolute top-[60px] left-0 z-50 bg-white border border-[#E1E1E1] rounded-[8px] shadow-xl p-[16px] flex flex-col gap-[12px] w-[240px]">
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
                {DIAS_SEM.map((d, i) => (<div key={i} className="h-[22px] flex items-center justify-center text-[10px] font-semibold text-[#AAAAAA] font-['DM_Sans']">{d}</div>))}
                {grid.map((day, i) => day === null ? <div key={i} /> : (
                    <div key={i} onClick={() => onSelect(new Date(ano, mes, day))} className="h-[26px] flex items-center justify-center rounded-[4px] text-[12px] cursor-pointer font-['DM_Sans'] text-[#3B4141] hover:bg-[#FFEAD0] hover:text-[#F68903] transition-colors">{day}</div>
                ))}
            </div>
        </div>
    );
}

const ITENS_OPCOES = [5, 10, 20, 50];

export const RelatoriosDados: React.FC<RelatoriosDadosProps> = ({
    PesquisarIcon,
    RelatCalendarioIcon,
}) => {
    const hook = useRelatorioAtrasadasData();
    const [showPerPage, setShowPerPage] = useState(false);
    const [showCalDe, setShowCalDe] = useState(false);
    const [showCalAte, setShowCalAte] = useState(false);
    const perPageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (perPageRef.current && !perPageRef.current.contains(event.target as Node)) {
                setShowPerPage(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fmtLabel = (val: string, fallback: string) => {
        if (!val) return fallback;
        const [y, m, d] = val.split('-');
        return `${d}/${m}/${y}`;
    };

    const paginasVisiveis = () => {
        const total = hook.totalPaginas;
        const atual = hook.paginaAtual;
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (atual <= 4) return [1, 2, 3, 4, 5, '...', total];
        if (atual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        return [1, '...', atual - 1, atual, atual + 1, '...', total];
    };
    return (
        <div className="flex flex-col gap-[40px] w-full font-['DM_Sans'] animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Filter Section */}
            <div className="flex items-center gap-[20px] px-[40px]">
                <div className="flex-1 bg-white rounded-[4px] flex flex-col gap-[10px]">
                    <div className="h-[56px] px-[20px] py-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-start items-center gap-[10px]">
                        <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                            <img src={PesquisarIcon} alt="Pesquisar" className="w-[24px] h-[24px] object-contain opacity-50" />
                        </div>
                        <input
                            type="text"
                            value={hook.busca}
                            onChange={(e) => { hook.setBusca(e.target.value); hook.setPaginaAtual(1); }}
                            placeholder="Filtrar Inspeções"
                            className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Inter']"
                        />
                    </div>
                </div>
                <div className="w-[160px] h-[56px] px-[16px] py-[13px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-start items-center gap-[10px] relative cursor-pointer" onClick={() => setShowCalDe(!showCalDe)}>
                    <img src={RelatCalendarioIcon} alt="Calendário" className="w-[20px] h-[20px] object-contain shrink-0" />
                    <span className={`flex-1 text-[16px] font-normal font-['Funnel_Sans'] ${hook.dataInicio ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
                        {fmtLabel(hook.dataInicio, 'De')}
                    </span>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={`transition-transform ${showCalDe ? 'rotate-180' : ''}`}>
                        <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {showCalDe && (
                        <MiniCal
                            onClose={() => setShowCalDe(false)}
                            onSelect={(d) => {
                                const y = d.getFullYear();
                                const m = String(d.getMonth() + 1).padStart(2, '0');
                                const day = String(d.getDate()).padStart(2, '0');
                                hook.setDataInicio(`${y}-${m}-${day}`);
                                hook.setPaginaAtual(1);
                                setShowCalDe(false);
                            }}
                        />
                    )}
                </div>
                <div className="w-[160px] h-[56px] px-[16px] py-[13px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-start items-center gap-[10px] relative cursor-pointer" onClick={() => setShowCalAte(!showCalAte)}>
                    <img src={RelatCalendarioIcon} alt="Calendário" className="w-[20px] h-[20px] object-contain shrink-0" />
                    <span className={`flex-1 text-[16px] font-normal font-['Funnel_Sans'] ${hook.dataFim ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
                        {fmtLabel(hook.dataFim, 'Até')}
                    </span>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={`transition-transform ${showCalAte ? 'rotate-180' : ''}`}>
                        <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {showCalAte && (
                        <MiniCal
                            onClose={() => setShowCalAte(false)}
                            onSelect={(d) => {
                                const y = d.getFullYear();
                                const m = String(d.getMonth() + 1).padStart(2, '0');
                                const day = String(d.getDate()).padStart(2, '0');
                                hook.setDataFim(`${y}-${m}-${day}`);
                                hook.setPaginaAtual(1);
                                setShowCalAte(false);
                            }}
                        />
                    )}
                </div>
                <div className="w-[200px] h-[56px] p-[16px] bg-[#F78800] rounded-[4px] flex justify-center items-center gap-[10px] cursor-pointer hover:bg-[#E57600] transition-colors">
                    <span className="text-white text-[16px] font-medium font-['Funnel_Sans']">Consultar</span>
                </div>
            </div>

            {/* Contagem de resultados e Limpar Filtros */}
            {(hook.busca || hook.dataInicio || hook.dataFim) && (
                <div className="flex items-center gap-[8px] px-[40px] -mt-[20px]">
                    <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                        {hook.stats.total} {hook.stats.total === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </span>
                    <button
                        onClick={() => hook.limparFiltros()}
                        className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}

            <div className="px-[40px] flex flex-col justify-center items-center gap-[32px]">
                <div className="w-full flex flex-col justify-start items-start gap-[32px]">
                    {/* Table Header */}
                    <div className="w-full px-[20px] flex justify-between items-center">
                        <div
                            className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans'] cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-2"
                            onClick={() => hook.handleSort('nome')}
                        >
                            Nome
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={hook.sortColumn === 'nome' ? '#F78800' : 'currentColor'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${hook.sortColumn === 'nome' && hook.sortDirection === 'desc' ? 'rotate-180' : ''}`}>
                                <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                            </svg>
                        </div>
                        <div
                            className="w-[200px] text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans'] cursor-pointer hover:opacity-70 transition-opacity flex items-center gap-2"
                            onClick={() => hook.handleSort('periodo')}
                        >
                            Periodicidade
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={hook.sortColumn === 'periodo' ? '#F78800' : 'currentColor'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${hook.sortColumn === 'periodo' && hook.sortDirection === 'desc' ? 'rotate-180' : ''}`}>
                                <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                            </svg>
                        </div>
                        <div
                            className="w-[160px] text-center text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans'] cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center gap-2"
                            onClick={() => hook.handleSort('dataAtraso')}
                        >
                            Atrasado Desde
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={hook.sortColumn === 'dataAtraso' ? '#F78800' : 'currentColor'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${hook.sortColumn === 'dataAtraso' && hook.sortDirection === 'desc' ? 'rotate-180' : ''}`}>
                                <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                            </svg>
                        </div>
                    </div>

                    {/* Table Rows */}
                    <div className="w-full flex flex-col gap-[16px]">
                        {hook.loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-full h-[72px] px-[20px] rounded-[4px] outline outline-1 outline-[#F0F0F0] animate-pulse bg-gray-50 flex items-center gap-4">
                                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                                    <div className="w-[200px] h-4 bg-gray-200 rounded"></div>
                                    <div className="w-[160px] h-4 bg-gray-200 rounded"></div>
                                </div>
                            ))
                        ) : hook.itensPagina.length === 0 ? (
                            <div className="w-full py-10 text-center text-[#848484] font-['Funnel_Sans']">Nenhuma inspeção atrasada encontrada.</div>
                        ) : (
                            hook.itensPagina.map((row: InspecaoAtrasada) => (
                                <div key={row.id} className="w-full h-[72px] px-[20px] py-[8px] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.nome}</div>
                                    <div className="w-[200px] text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.periodo}</div>
                                    <div className="w-[160px] text-center text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.dataAtraso}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pagination and Summary */}
                <div className="w-full pt-[24px] pb-[16px] border-t border-[#E1E1E1] flex justify-between items-center relative z-10">
                    <div className="flex justify-start items-center gap-[16px]">
                        <div className="relative" ref={perPageRef}>
                            <div
                                onClick={() => setShowPerPage(!showPerPage)}
                                className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                            >
                                <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">{hook.itensPorPagina}</span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                    <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showPerPage && (
                                <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-20">
                                    {ITENS_OPCOES.map(n => (
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
                        <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans']">Inspeções por página</span>
                    </div>
                    <span className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{hook.stats.total} Inspeções Atrasadas</span>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-[6px]">
                        <div
                            onClick={() => hook.setPaginaAtual((p: number) => Math.max(1, p - 1))}
                            className={`w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-[4px] ${hook.paginaAtual === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                        >
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {paginasVisiveis().map((pg, i) => (
                            pg === '...' ? (
                                <div key={i} className="w-[32px] h-[32px] flex justify-center items-center">
                                    <span className="text-[#3B4141] text-[15px] font-normal font-['Inter']">...</span>
                                </div>
                            ) : (
                                <div
                                    key={i}
                                    onClick={() => hook.setPaginaAtual(Number(pg))}
                                    className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border ${pg === hook.paginaAtual ? 'border-[#F78800] bg-white' : 'border-[#E5E7EB] bg-white cursor-pointer hover:bg-gray-50'}`}
                                >
                                    <span className={`${pg === hook.paginaAtual ? 'text-[#F78800] font-semibold' : 'text-[#3B4141] font-normal'} text-[14px] font-['Inter']`}>{pg}</span>
                                </div>
                            )
                        ))}

                        <div
                            onClick={() => hook.setPaginaAtual((p: number) => Math.min(hook.totalPaginas, p + 1))}
                            className={`w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] ${hook.paginaAtual === hook.totalPaginas ? 'opacity-30 pointer-events-none' : ''}`}
                        >
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="h-[312px] min-w-[400px] mx-[40px] p-[32px] overflow-hidden rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex flex-col justify-start items-start gap-[16px] mb-[80px]">
                <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans'] leading-[24px]">Atrasadas:</span>
                <div className="flex-1 flex justify-start items-center gap-[40px] w-full">
                    {/* Donut Chart Visual */}
                    <div className="w-[180px] h-[180px] relative flex items-center justify-center">
                        <svg width="180" height="180" viewBox="0 0 100 100" className="transform -rotate-90">
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#F9FAFB" strokeWidth="24" />
                            <defs>
                                <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#E63946" />
                                    <stop offset="100%" stopColor="#F28B8B" />
                                </linearGradient>
                            </defs>
                            {(() => {
                                const data = [
                                    { value: hook.stats.mais15, color: 'url(#redGradient)' },
                                    { value: hook.stats.ate15, color: '#FFCE1C' },
                                    { value: hook.stats.ate7, color: '#333333' }
                                ];
                                const total = hook.stats.total || 1; // Avoid division by zero
                                const radius = 38;
                                const circumference = 2 * Math.PI * radius;
                                let currentAngle = 0;

                                return data.map((item, index) => {
                                    if (item.value === 0) return null;
                                    const percentage = item.value / total;
                                    const strokeLength = circumference * percentage;
                                    const gap = total > item.value ? 2 : 0;
                                    const dashArray = `${Math.max(0, strokeLength - gap)} ${circumference}`;
                                    const rotation = currentAngle;
                                    currentAngle += percentage * 360;

                                    return (
                                        <circle
                                            key={index}
                                            cx="50"
                                            cy="50"
                                            r={radius}
                                            fill="none"
                                            stroke={item.color}
                                            strokeWidth="24"
                                            strokeDasharray={dashArray}
                                            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%', transition: 'all 0.5s ease-out' }}
                                        />
                                    );
                                });
                            })()}
                        </svg>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 flex flex-col items-start gap-[16px] w-full">
                        {[
                            { label: 'Há mais de 15 dias: ', count: hook.stats.mais15, percent: hook.stats.porcentagemMais15 + '%', color: '#E63946' },
                            { label: 'Até 15 dias: ', count: hook.stats.ate15, percent: hook.stats.porcentagemAte15 + '%', color: '#FFCE1C' },
                            { label: 'Até 7 dias: ', count: hook.stats.ate7, percent: hook.stats.porcentagemAte7 + '%', color: '#333333' }
                        ].map((item, i) => (
                            <div key={i} className="w-full flex justify-between items-center">
                                <div className="flex items-center gap-[8px]">
                                    <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <div className="flex items-center gap-[4px]">
                                        <span className="text-[#3B4141] text-[16px] font-normal font-['DM_Sans'] leading-[24px]">{item.label}</span>
                                        <span className="text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] leading-[24px]">{item.count}</span>
                                    </div>
                                </div>
                                <span className="text-[#3B4141] text-[12px] font-normal font-['DM_Sans'] leading-[24px]">{item.percent}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
