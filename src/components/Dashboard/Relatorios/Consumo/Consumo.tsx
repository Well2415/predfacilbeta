import React, { useState, useRef, useEffect } from 'react';
import { useRelatorioConsumoData } from '../../../../hooks/relatorioConsumoData';
import { RelatoriosOpcoesModal } from '../../Modais/Relatorios/RelatoriosOpcoesModal';

// ─── MiniCal ─────────────────────────────────────────────────────────────────

const DIAS_SEM = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MESES_LABEL = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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
                <span className="text-[#3B4141] text-[13px] font-semibold font-['DM_Sans']">{MESES_LABEL[mes]} {ano}</span>
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

// ─── Utils ────────────────────────────────────────────────────────────────────

function toInputDate(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

function fmtBRL(n: number) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ─── Chart ───────────────────────────────────────────────────────────────────

const VIEWBOX_W = 1000;
const VIEWBOX_H = 200;
const PAD_TOP = 10;
const PAD_BOTTOM = 24;
const CHART_H = VIEWBOX_H - PAD_TOP - PAD_BOTTOM;

// Calcula escala arredondada para ticks limpos
function niceScale(maxVal: number): { max: number; step: number } {
    if (maxVal <= 0) return { max: 100, step: 33 };
    const rawStep = maxVal / 3;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const step = Math.ceil(rawStep / magnitude) * magnitude;
    return { max: step * 3, step };
}

function fmtTick(n: number): string {
    if (n >= 1000) return `R$${(n / 1000).toFixed(1).replace('.', ',')}K`;
    return `R$${Math.round(n)}`;
}

function buildLinePath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return '';
    return points.reduce((path, pt, i) => {
        if (i === 0) return `M${pt.x} ${pt.y}`;
        const prev = points[i - 1];
        const cpX = (prev.x + pt.x) / 2;
        return `${path} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
    }, '');
}

interface LineChartProps {
    byMonth: Record<number, number>;
    stroke: string;
    totalValue: number;
}

function LineChart({ byMonth, stroke, totalValue }: LineChartProps) {
    const { max: scaleMax, step } = niceScale(totalValue || 1);
    const toY = (val: number) => PAD_TOP + CHART_H - (Math.min(val, scaleMax) / scaleMax) * CHART_H;

    // Build cumulative points: each month adds to the running total
    let cumulative = 0;
    const allPoints = MESES_LABEL.map((_, i) => {
        if (byMonth[i] !== undefined) cumulative += byMonth[i];
        return {
            x: (i / (MESES_LABEL.length - 1)) * VIEWBOX_W,
            y: toY(cumulative),
            hasData: byMonth[i] !== undefined,
        };
    });

    // Simulate previous year: 90% of cumulative values
    let prevCumulative = 0;
    const prevPoints = MESES_LABEL.map((_, i) => {
        if (byMonth[i] !== undefined) prevCumulative += byMonth[i] * 0.9;
        return {
            x: (i / (MESES_LABEL.length - 1)) * VIEWBOX_W,
            y: toY(prevCumulative),
        };
    });

    const currentPath = buildLinePath(allPoints);
    const prevPath = buildLinePath(prevPoints);

    return (
        <div className="h-[230px] flex gap-[16px] items-end">
            <div className="h-full flex flex-col justify-between text-[#898D8D] text-[12px] font-['DM_Sans'] pb-[20px]">
                <span>{fmtTick(step * 3)}</span>
                <span>{fmtTick(step * 2)}</span>
                <span>{fmtTick(step)}</span>
                <span>0</span>
            </div>
            <div className="flex-1 h-full relative">
                <div className="absolute inset-0 flex flex-col justify-between pb-[20px]">
                    <div className="border-b border-dashed border-[#E1E1E1] h-[1px] w-full"></div>
                    <div className="border-b border-dashed border-[#E1E1E1] h-[1px] w-full"></div>
                    <div className="border-b border-dashed border-[#E1E1E1] h-[1px] w-full"></div>
                    <div className="border-b border-[#E1E1E1] h-[1px] w-full"></div>
                </div>
                <svg
                    viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                    overflow="visible"
                >
                    {prevPath && (
                        <path d={prevPath} fill="none" stroke="#3B4141" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" opacity="0.6" />
                    )}
                    {currentPath && (
                        <path d={currentPath} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    )}
                    {allPoints.map((pt, i) => pt.hasData ? (
                        <circle key={i} cx={pt.x} cy={pt.y} r="5" fill={stroke} vectorEffect="non-scaling-stroke" />
                    ) : null)}
                </svg>
                <div className="absolute bottom-0 w-full flex justify-between text-[#898D8D] text-[12px] font-['DM_Sans']">
                    {MESES_LABEL.map(m => <span key={m}>{m}</span>)}
                </div>
            </div>
        </div>
    );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface RelatoriosConsumoProps {
    RelatCalendarioIcon: string;
    RelatAguaIcon: string;
    RelatEnergiaIcon: string;
    RelatGasIcon: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const RelatoriosConsumo: React.FC<RelatoriosConsumoProps> = ({
    RelatCalendarioIcon,
    RelatAguaIcon,
    RelatEnergiaIcon,
    RelatGasIcon,
}) => {
    const hook = useRelatorioConsumoData();
    const [showCalDe, setShowCalDe] = useState(false);
    const [showCalAte, setShowCalAte] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportType, setReportType] = useState<'simplificado' | 'completo' | null>(null);

    const { summaryByTipo, byTipoAndMonth, hasFilters, filtroDe, filtroAte } = hook;

    const handleSelectDe = (d: Date) => { hook.setFiltroDe(toInputDate(d)); setShowCalDe(false); };
    const handleSelectAte = (d: Date) => { hook.setFiltroAte(toInputDate(d)); setShowCalAte(false); };

    return (
        <div className="flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-2 duration-300 w-full mb-[80px]">
            <RelatoriosOpcoesModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                reportType={reportType}
                setReportType={setReportType}
            />
            {/* Filter Bar */}
            <div className="flex items-center gap-[20px] px-[40px]">
                {/* De */}
                <div className="flex-1 relative">
                    <div
                        onClick={() => { setShowCalDe(!showCalDe); setShowCalAte(false); }}
                        className="h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[10px] cursor-pointer hover:bg-gray-50"
                    >
                        <div className="w-[20px] h-[20px] flex items-center justify-center">
                            <img src={RelatCalendarioIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                            <span className="text-[#848484] text-[16px] font-normal font-['Funnel_Sans']">{filtroDe || 'De'}</span>
                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    {showCalDe && <MiniCal onSelect={handleSelectDe} onClose={() => setShowCalDe(false)} />}
                </div>

                {/* Até */}
                <div className="flex-1 relative">
                    <div
                        onClick={() => { setShowCalAte(!showCalAte); setShowCalDe(false); }}
                        className="h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[10px] cursor-pointer hover:bg-gray-50"
                    >
                        <div className="w-[20px] h-[20px] flex items-center justify-center">
                            <img src={RelatCalendarioIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                            <span className="text-[#848484] text-[16px] font-normal font-['Funnel_Sans']">{filtroAte || 'Até'}</span>
                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    {showCalAte && <MiniCal onSelect={handleSelectAte} onClose={() => setShowCalAte(false)} />}
                </div>

                {/* Consultar */}
                <button
                    className="w-[200px] h-[56px] bg-[#F78800] rounded-[4px] flex justify-center items-center gap-[10px] hover:bg-[#E57600] transition-colors"
                >
                    <span className="text-white text-[16px] font-medium font-['Funnel_Sans']">Consultar</span>
                </button>
            </div>

            {/* Limpar Filtros */}
            {hasFilters && (
                <div className="flex items-center gap-[8px] px-[40px] -mt-[16px]">
                    <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                        {hook.filtrados.length} {hook.filtrados.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                    </span>
                    <button
                        onClick={hook.limparFiltros}
                        className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}

            {/* Summary Cards Row */}
            <div className="flex gap-[32px] px-[40px]">
                {/* Água Card */}
                <div className="flex-1 p-[20px] rounded-[4px] border border-[#F0F0F0] flex flex-col gap-[16px] bg-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[32px] h-[32px]"><img src={RelatAguaIcon} alt="Água" className="w-full h-full object-contain" /></div>
                            <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">Água</span>
                        </div>
                        <div className="px-[11px] py-[4px] bg-[#EEF0FA] rounded-[4px]">
                            <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">Normal</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-[24px]">
                        <div className="flex flex-col gap-[8px]">
                            <span className="text-[#F68903] text-[26px] font-bold font-['DM_Sans'] leading-[32px]">{fmtBRL(summaryByTipo.Agua.total)}</span>
                            <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Total do período</span>
                        </div>
                        <div className="min-w-[170px] flex flex-col gap-[8px]">
                            <div className="flex justify-between items-center border-b border-[#F0F0F0] pb-[8px]">
                                <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Média:</span>
                                <span className="text-[#3B4141] text-[12px] font-extrabold font-['DM_Sans']">{summaryByTipo.Agua.media.toFixed(0)} m³</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#F0F0F0] pb-[8px]">
                                <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Maior Consumo:</span>
                                <span className="text-[#3B4141] text-[12px] font-extrabold font-['DM_Sans']">{summaryByTipo.Agua.maior.toFixed(0)} m³</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Menor Consumo:</span>
                                <span className="text-[#3B4141] text-[12px] font-extrabold font-['DM_Sans']">{summaryByTipo.Agua.menor.toFixed(0)} m³</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Energia Card */}
                <div className="flex-1 p-[20px] rounded-[4px] border border-[#F0F0F0] flex flex-col gap-[16px] bg-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[32px] h-[32px]"><img src={RelatEnergiaIcon} alt="Energia" className="w-full h-full object-contain" /></div>
                            <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">Energia Elétrica</span>
                        </div>
                        <div className="px-[11px] py-[4px] bg-[#FFCE1C]/50 rounded-[4px]">
                            <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">Acima da Média</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-[24px]">
                        <div className="flex flex-col gap-[8px]">
                            <span className="text-[#F68903] text-[26px] font-bold font-['DM_Sans'] leading-[32px]">{fmtBRL(summaryByTipo.Energia.total)}</span>
                            <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Total do período</span>
                        </div>
                        <div className="min-w-[170px] flex flex-col gap-[8px]">
                            <div className="flex justify-between items-center border-b border-[#F0F0F0] pb-[8px]">
                                <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Média:</span>
                                <span className="text-[#3B4141] text-[12px] font-extrabold font-['DM_Sans']">{summaryByTipo.Energia.media.toFixed(0)} kWh</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#F0F0F0] pb-[8px]">
                                <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Maior Consumo:</span>
                                <span className="text-[#3B4141] text-[12px] font-extrabold font-['DM_Sans']">{summaryByTipo.Energia.maior.toFixed(0)} kWh</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Menor Consumo:</span>
                                <span className="text-[#3B4141] text-[12px] font-extrabold font-['DM_Sans']">{summaryByTipo.Energia.menor.toFixed(0)} kWh</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gás Card */}
                <div className="flex-1 p-[20px] rounded-[4px] border border-[#F0F0F0] flex flex-col gap-[16px] bg-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[32px] h-[32px]"><img src={RelatGasIcon} alt="Gás" className="w-full h-full object-contain" /></div>
                            <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">Gás</span>
                        </div>
                        <div className="px-[11px] py-[4px] bg-[#2AE49F]/[0.16] rounded-[4px]">
                            <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">Abaixo da Média</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-[24px]">
                        <div className="flex flex-col gap-[8px]">
                            <span className="text-[#F68903] text-[26px] font-bold font-['DM_Sans'] leading-[32px]">{fmtBRL(summaryByTipo.Gas.total)}</span>
                            <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Total do período</span>
                        </div>
                        <div className="min-w-[170px] flex flex-col gap-[8px]">
                            <div className="flex justify-between items-center border-b border-[#F0F0F0] pb-[8px]">
                                <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Média:</span>
                                <span className="text-[#3B4141] text-[14px] font-extrabold font-['DM_Sans']">{summaryByTipo.Gas.media.toFixed(0)} kg</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[#F0F0F0] pb-[8px]">
                                <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Maior Consumo:</span>
                                <span className="text-[#3B4141] text-[14px] font-extrabold font-['DM_Sans']">{summaryByTipo.Gas.maior.toFixed(0)} kg</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Menor Consumo:</span>
                                <span className="text-[#3B4141] text-[14px] font-extrabold font-['DM_Sans']">{summaryByTipo.Gas.menor.toFixed(0)} kg</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="flex flex-col gap-[32px] px-[40px]">
                {/* Água Chart */}
                <div className="w-full p-[24px] border border-[#F0F0F0] rounded-[4px] flex flex-col gap-[16px] bg-white">
                    <div className="flex items-center gap-[16px]">
                        <span className="text-[#3B4141]/20 font-['Inter']">|</span>
                        <div className="flex items-center gap-[8px]">
                            <img src={RelatAguaIcon} alt="" className="w-[32px] h-[32px]" />
                            <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">Água</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[8px] h-[8px] bg-[#F9AC51] rounded-full"></div>
                            <span className="text-[#3B4141] text-[14px] font-['DM_Sans']">Esse ano</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[8px] h-[8px] bg-[#3B4141] rounded-full"></div>
                            <span className="text-[#3B4141] text-[14px] font-['DM_Sans']">Mesmo Periodo, Ano passado</span>
                        </div>
                    </div>
                    <LineChart byMonth={byTipoAndMonth.Agua} stroke="#F9AC51" totalValue={summaryByTipo.Agua.total} />
                </div>

                {/* Energia Chart */}
                <div className="w-full p-[24px] border border-[#F0F0F0] rounded-[4px] flex flex-col gap-[16px] bg-white">
                    <div className="flex items-center gap-[16px]">
                        <span className="text-[#3B4141]/20 font-['Inter']">|</span>
                        <div className="flex items-center gap-[8px]">
                            <img src={RelatEnergiaIcon} alt="" className="w-[32px] h-[32px]" />
                            <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">Energia Elétrica</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[8px] h-[8px] bg-[#F9AC51] rounded-full"></div>
                            <span className="text-[#3B4141] text-[14px] font-['DM_Sans']">Esse ano</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[8px] h-[8px] bg-[#3B4141] rounded-full"></div>
                            <span className="text-[#3B4141] text-[14px] font-['DM_Sans']">Mesmo Periodo, Ano passado</span>
                        </div>
                    </div>
                    <LineChart byMonth={byTipoAndMonth.Energia} stroke="#F9AC51" totalValue={summaryByTipo.Energia.total} />
                </div>

                {/* Gás Chart */}
                <div className="w-full p-[24px] border border-[#F0F0F0] rounded-[4px] flex flex-col gap-[16px] bg-white">
                    <div className="flex items-center gap-[16px]">
                        <span className="text-[#3B4141]/20 font-['Inter']">|</span>
                        <div className="flex items-center gap-[8px]">
                            <img src={RelatGasIcon} alt="" className="w-[32px] h-[32px]" />
                            <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">Gás</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[8px] h-[8px] bg-[#F9AC51] rounded-full"></div>
                            <span className="text-[#3B4141] text-[14px] font-['DM_Sans']">Esse ano</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[8px] h-[8px] bg-[#3B4141] rounded-full"></div>
                            <span className="text-[#3B4141] text-[14px] font-['DM_Sans']">Mesmo Periodo, Ano passado</span>
                        </div>
                    </div>
                    <LineChart byMonth={byTipoAndMonth.Gas} stroke="#F9AC51" totalValue={summaryByTipo.Gas.total} />
                </div>
            </div>
            {/* Botão Relatórios */}
            <div className="px-[40px]">
                <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full h-[56px] bg-[#F78800] rounded-[4px] flex justify-center items-center hover:bg-[#E57600] transition-colors"
                >
                    <span className="text-white text-[16px] font-medium font-['Funnel_Sans']">Relatórios</span>
                </button>
            </div>
        </div>
    );
};
