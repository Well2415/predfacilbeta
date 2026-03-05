import React, { useState, useRef, useEffect } from 'react';
import { useRelatorioAtividadesData, Atividade, PlanoResolvido } from '../../../../../hooks/relatorioAtividadesData';

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

interface RelatoriosDadosAtividadesProps {
    PesquisarIcon?: string;
    RelatCalendarioIcon?: string;
}

const ITENS_OPCOES = [5, 10, 20, 50];

export const RelatoriosDadosAtividades: React.FC<RelatoriosDadosAtividadesProps> = ({
    PesquisarIcon,
    RelatCalendarioIcon,
}) => {
    const hook = useRelatorioAtividadesData();
    const [showPerPageAtiv, setShowPerPageAtiv] = useState(false);
    const [showPerPagePlano, setShowPerPagePlano] = useState(false);
    const [showCalDe, setShowCalDe] = useState(false);
    const [showCalAte, setShowCalAte] = useState(false);

    const perPageAtivRef = useRef<HTMLDivElement>(null);
    const perPagePlanoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (perPageAtivRef.current && !perPageAtivRef.current.contains(e.target as Node)) setShowPerPageAtiv(false);
            if (perPagePlanoRef.current && !perPagePlanoRef.current.contains(e.target as Node)) setShowPerPagePlano(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const fmtLabel = (val: string, fallback: string) => {
        if (!val) return fallback;
        const [y, m, d] = val.split('-');
        return `${d}/${m}/${y}`;
    };

    const paginasVisiveis = (total: number, atual: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (atual <= 4) return [1, 2, 3, 4, 5, '...', total];
        if (atual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        return [1, '...', atual - 1, atual, atual + 1, '...', total];
    };

    return (
        <div className="flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            {/* Filter Bar */}
            <div className="flex items-center gap-[20px] px-[40px]">
                <div className="flex-[2] h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center gap-[10px]">
                    <img src={PesquisarIcon} alt="Pesquisar" className="w-[20px] h-[20px] object-contain opacity-50" />
                    <input
                        type="text"
                        value={hook.busca}
                        onChange={(e) => { hook.setBusca(e.target.value); hook.setPagAtividades(1); hook.setPagPlanos(1); }}
                        placeholder="Filtrar Inspeções"
                        className="w-full bg-transparent outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D]/50"
                    />
                </div>

                <div className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center justify-between group cursor-pointer relative" onClick={() => setShowCalDe(!showCalDe)}>
                    <div className="flex items-center gap-[8px]">
                        <img src={RelatCalendarioIcon} alt="De" className="w-[20px] h-[20px] object-contain" />
                        <span className={`text-[16px] font-normal font-['Funnel_Sans'] ${hook.dataInicio ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
                            {fmtLabel(hook.dataInicio, 'De')}
                        </span>
                    </div>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${showCalDe ? 'rotate-180' : 'group-hover:translate-y-[1px]'}`}>
                        <path d="M1 1L5 5L9 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {showCalDe && (
                        <MiniCal
                            onClose={() => setShowCalDe(false)}
                            onSelect={(d) => {
                                const y = d.getFullYear();
                                const m = String(d.getMonth() + 1).padStart(2, '0');
                                const day = String(d.getDate()).padStart(2, '0');
                                hook.setDataInicio(`${y}-${m}-${day}`);
                                hook.setPagAtividades(1);
                                hook.setPagPlanos(1);
                                setShowCalDe(false);
                            }}
                        />
                    )}
                </div>

                <div className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center justify-between group cursor-pointer relative" onClick={() => setShowCalAte(!showCalAte)}>
                    <div className="flex items-center gap-[8px]">
                        <img src={RelatCalendarioIcon} alt="Até" className="w-[20px] h-[20px] object-contain" />
                        <span className={`text-[16px] font-normal font-['Funnel_Sans'] ${hook.dataFim ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
                            {fmtLabel(hook.dataFim, 'Até')}
                        </span>
                    </div>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${showCalAte ? 'rotate-180' : 'group-hover:translate-y-[1px]'}`}>
                        <path d="M1 1L5 5L9 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {showCalAte && (
                        <MiniCal
                            onClose={() => setShowCalAte(false)}
                            onSelect={(d) => {
                                const y = d.getFullYear();
                                const m = String(d.getMonth() + 1).padStart(2, '0');
                                const day = String(d.getDate()).padStart(2, '0');
                                hook.setDataFim(`${y}-${m}-${day}`);
                                hook.setPagAtividades(1);
                                hook.setPagPlanos(1);
                                setShowCalAte(false);
                            }}
                        />
                    )}
                </div>

                <button className="w-[200px] h-[56px] bg-[#F78800] rounded-[4px] text-white text-[16px] font-medium font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors shadow-sm">
                    Consultar
                </button>
            </div>

            {/* Limpar Filtros */}
            {(hook.busca || hook.dataInicio || hook.dataFim) && (
                <div className="flex items-center gap-[8px] px-[40px] -mt-[20px]">
                    <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                        Resultados encontrados
                    </span>
                    <button
                        onClick={() => hook.limparFiltros()}
                        className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}

            {/* Section: Atividades + Gráfico */}
            <div className="px-[40px] flex flex-col xl:flex-row gap-[32px] items-start">
                {/* Tabela Atividades */}
                <div className="flex-[3] flex flex-col gap-[24px] w-full">
                    <h3 className="text-[#3B4141] text-[20px] font-bold font-['Funnel_Sans'] tracking-wide">Atividades</h3>

                    <div className="flex flex-col gap-[16px]">
                        {/* Header */}
                        <div className="w-full px-[20px] flex justify-between items-center pb-[8px]">
                            <div className="w-[180px] text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans']">Nome da Ficha</div>
                            <div className="flex-1 text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans'] px-[10px]">Descrição da Pergunta</div>
                            <div className="w-[100px] text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans'] text-center">Periodicidade</div>
                            <div className="w-[100px] text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans'] text-center">Valor Pago</div>
                            <div className="w-[120px] text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans'] text-center">Status</div>
                        </div>

                        {/* Rows */}
                        {hook.loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-full h-[72px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] animate-pulse" />
                            ))
                        ) : hook.atividades.length === 0 ? (
                            <div className="w-full py-10 text-center text-[#848484] font-['Funnel_Sans']">Nenhuma atividade encontrada.</div>
                        ) : (
                            hook.atividades.map((row: Atividade) => (
                                <div key={row.id} className="w-full px-[20px] py-[24px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-between items-center hover:bg-gray-50 transition-colors gap-[16px]">
                                    <div className="w-[180px] text-[#414F5D] text-[13px] font-normal font-['Funnel_Sans'] break-words pr-[10px] uppercase">{row.ficha}</div>
                                    <div className="flex-1 text-[#414F5D] text-[13px] font-normal font-['Funnel_Sans'] leading-[1.4] pr-[10px]">{row.descricao}</div>
                                    <div className="w-[100px] text-[#414F5D] text-[13px] font-normal font-['Funnel_Sans'] text-center">{row.periodicidade || '-'}</div>
                                    <div className="w-[100px] text-[#414F5D] text-[13px] font-normal font-['Funnel_Sans'] text-center">{row.valor ? `R$ ${row.valor.toLocaleString('pt-BR')}` : '-'}</div>
                                    <div className="w-[120px] flex justify-center">
                                        <span className={`px-[12px] py-[6px] rounded-[4px] text-[12px] font-medium font-['DM_Sans'] ${row.status === 'Não Conforme' ? 'bg-[#FEEAEA] text-[#E63946]' : 'bg-[#E6F9EE] text-[#00A859]'}`}>
                                            {row.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Atividades */}
                    <div className="w-full pt-[24px] pb-[16px] flex justify-between items-center bg-white z-20 border-t border-[#F0F0F0]">
                        <div className="flex items-center gap-[16px]">
                            <div className="relative" ref={perPageAtivRef}>
                                <div
                                    onClick={() => setShowPerPageAtiv(!showPerPageAtiv)}
                                    className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                                >
                                    <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">{hook.itensPorPagAtividades}</span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={showPerPageAtiv ? 'rotate-180' : ''}>
                                        <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {showPerPageAtiv && (
                                    <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50">
                                        {ITENS_OPCOES.map(n => (
                                            <div
                                                key={n}
                                                onClick={() => { hook.setItensPorPagAtividades(n); hook.setPagAtividades(1); setShowPerPageAtiv(false); }}
                                                className="px-[12px] py-[6px] text-center hover:bg-orange-50 cursor-pointer text-[14px] font-['Funnel_Sans'] text-[#3B4141]"
                                            >
                                                {n}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans'] min-w-[150px]">Fichas por página</span>
                        </div>
                        <div className="flex items-center gap-[6px]">
                            <div
                                onClick={() => hook.setPagAtividades(p => Math.max(1, p - 1))}
                                className={`w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-[4px] ${hook.pagAtividades === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                            >
                                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {paginasVisiveis(hook.totalPagAtividades, hook.pagAtividades).map((pg, i) => (
                                <div
                                    key={i}
                                    onClick={() => typeof pg === 'number' && hook.setPagAtividades(pg)}
                                    className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border ${pg === hook.pagAtividades ? 'border-[#F78800] bg-white' : 'border-[#E8E8E8] bg-white cursor-pointer hover:bg-gray-50'}`}
                                >
                                    <span className={`${pg === hook.pagAtividades ? 'text-[#F78800] font-semibold' : 'text-[#3B4141] font-normal'} text-[15px] font-['Funnel_Sans']`}>{pg}</span>
                                </div>
                            ))}
                            <div
                                onClick={() => hook.setPagAtividades(p => Math.min(hook.totalPagAtividades, p + 1))}
                                className={`w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] ${hook.pagAtividades === hook.totalPagAtividades ? 'opacity-30 pointer-events-none' : ''}`}
                            >
                                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráfico de Barras ao lado da Tabela */}
                <div className="flex-1 w-full bg-white outline outline-1 outline-[#F0F0F0] -outline-offset-1 rounded-[4px] p-[24px] h-full flex flex-col justify-end min-h-[500px] mt-[44px]">
                    <div className="h-[300px] flex items-start gap-[16px] pb-[16px]">
                        {/* Y Axis */}
                        <div className="h-full flex flex-col justify-between text-[#898D8D] text-[12px] font-normal font-['Funnel_Sans'] min-w-[30px] pr-[8px]">
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0</span>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 h-full flex flex-col border-b border-[#F0F0F0]">
                            <div className="flex-1 flex justify-around items-end">
                                {/* Bar: Não Conformes */}
                                <div className="relative group flex flex-col items-center justify-end h-full">
                                    <div
                                        className="w-[20px] bg-[#F8A743] rounded-t-[4px] transition-all duration-500 hover:bg-[#F78800] cursor-pointer"
                                        style={{ height: `${hook.barChartData.naoConformes}%` }}
                                    >
                                        <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {hook.barChartData.rawNaoConformes} itens
                                        </div>
                                    </div>
                                </div>

                                {/* Bar: Conformes */}
                                <div className="relative group flex flex-col items-center justify-end h-full">
                                    <div
                                        className="w-[20px] bg-[#F8A743] rounded-t-[4px] transition-all duration-500 hover:bg-[#F78800] cursor-pointer"
                                        style={{ height: `${hook.barChartData.conformes}%` }}
                                    >
                                        <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {hook.barChartData.rawConformes} itens
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* X Axis Labels */}
                    <div className="flex justify-around ml-[46px]">
                        <span className="text-[#898D8D] text-[12px] font-normal font-['Funnel_Sans'] text-center w-[80px]">Não Conformes</span>
                        <span className="text-[#898D8D] text-[12px] font-normal font-['Funnel_Sans'] text-center w-[80px]">Conformes</span>
                    </div>
                </div>
            </div>

            {/* Section: Chart Comparação de Gastos */}
            <div className="mx-[40px] p-[32px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex flex-col gap-[32px]">
                <div className="flex justify-start items-center gap-[24px]">
                    <span className="text-[#3B4141] text-[20px] font-bold font-['Funnel_Sans']">Comparação de Gastos por Período Selecionado</span>
                    <div className="h-[20px] w-[2px] bg-[#E1E1E1]"></div>
                    <div className="flex items-center gap-[24px]">
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#F9AC51]"></div>
                            <span className="text-[#414F5D] text-[14px] font-normal font-['Funnel_Sans']">Esse ano</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#3B4141]"></div>
                            <span className="text-[#414F5D] text-[14px] font-normal font-['Funnel_Sans']">Mesmo Periodo, Ano passado</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-[16px] h-[300px] items-end pb-[24px]">
                    <div className="h-full flex flex-col justify-between items-end text-[#898D8D] text-[12px] font-normal font-['Funnel_Sans'] pr-[8px]">
                        <span>R$ {hook.lineChartData.maxVal.toLocaleString('pt-BR')}</span>
                        <span>R$ {(hook.lineChartData.maxVal * 0.75).toLocaleString('pt-BR')}</span>
                        <span>R$ {(hook.lineChartData.maxVal * 0.5).toLocaleString('pt-BR')}</span>
                        <span>R$ {(hook.lineChartData.maxVal * 0.25).toLocaleString('pt-BR')}</span>
                        <span>R$ 0</span>
                    </div>

                    <div className="flex-1 h-full relative border-l border-[#F0F0F0]">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[0, 1, 2, 3, 4].map((_, i) => (
                                <div key={i} className={`w-full h-[1px] ${i === 4 ? 'bg-[#F0F0F0]' : 'bg-transparent'}`}>
                                    {i !== 4 && <div className="w-full border-t border-dashed border-[#E1E1E1]"></div>}
                                </div>
                            ))}
                        </div>

                        {/* Lines SVG */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1100 300" preserveAspectRatio="none">
                            {(() => {
                                const { currentYear, lastYear, maxVal } = hook.lineChartData;
                                const h = 300;
                                const getPath = (data: number[]) => {
                                    return data.map((v, i) => {
                                        const x = (i / 11) * 1100;
                                        const y = h - (v / maxVal) * h;
                                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                                    }).join(' ');
                                };
                                return (
                                    <>
                                        <path d={getPath(lastYear)} fill="none" stroke="#3B4141" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                                        <path d={getPath(currentYear)} fill="none" stroke="#F78800" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                    </>
                                );
                            })()}
                        </svg>

                        {/* X Axis Labels */}
                        <div className="absolute -bottom-[32px] left-0 right-0 flex justify-between px-[5%] text-[#898D8D] text-[12px] font-normal font-['Funnel_Sans']">
                            {MESES_CAL.map((m) => (
                                <span key={m}>{m}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Planos de Ação Resolvidos */}
            <div className="px-[40px] flex flex-col gap-[24px] mb-[80px]">
                <h3 className="text-[#3B4141] text-[20px] font-bold font-['Funnel_Sans']">Planos de Ação Resolvidos</h3>

                <div className="flex flex-col gap-[16px]">
                    {/* Header */}
                    <div className="w-full px-[20px] flex justify-between items-center pb-[8px] gap-[16px]">
                        <div className="w-[160px] text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans']">Realizado por</div>
                        <div className="w-[150px] text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans']">Data/Hora abertura</div>
                        <div className="w-[180px] text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans']">Fechamento Plano de Ação</div>
                        <div className="w-[160px] text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans']">Data/Hora Fechamento</div>
                        <div className="w-[160px] text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans']">Tempo para fechamento</div>
                        <div className="flex-1 text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans']">Descrição</div>
                        <div className="w-[120px] text-[#3B4141] text-[15px] font-bold font-['Funnel_Sans'] text-right">Valor Pago</div>
                    </div>

                    {/* Rows */}
                    {hook.loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="w-full h-[72px] bg-white rounded-[4px] animate-pulse outline outline-1 outline-[#F0F0F0]" />
                        ))
                    ) : hook.planos.length === 0 ? (
                        <div className="w-full py-10 text-center text-[#848484] font-['Funnel_Sans']">Nenhum plano de ação resolvido encontrado.</div>
                    ) : (
                        hook.planos.map((row: PlanoResolvido) => (
                            <div key={row.id} className="w-full min-h-[72px] px-[20px] py-[24px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-between items-center hover:bg-gray-50 transition-colors gap-[16px]">
                                <div className="w-[160px] text-[#414F5D] text-[13px] font-normal font-['Funnel_Sans'] break-words pr-[10px] uppercase">{row.realizadoPor}</div>
                                <div className="w-[150px] text-[#414F5D] text-[13px] font-normal font-['Funnel_Sans']">{row.dataAbertura}</div>
                                <div className="w-[180px] text-[#414F5D] text-[13px] font-normal font-['Funnel_Sans'] break-words pr-[10px] uppercase">{row.fechadoPor}</div>
                                <div className="w-[160px] text-[#414F5D] text-[13px] font-normal font-['Funnel_Sans']">{row.dataFechamento}</div>
                                <div className="w-[160px] text-[#414F5D] text-[13px] font-bold font-['Funnel_Sans']">{row.tempoFechamento}</div>
                                <div className="flex-1 text-[#414F5D] text-[13px] font-normal font-['Funnel_Sans'] leading-[1.4] pr-[10px]">{row.descricao}</div>
                                <div className="w-[120px] text-[#414F5D] text-[13px] font-normal font-['Funnel_Sans'] text-right">{row.valor ? `R$ ${row.valor.toLocaleString('pt-BR')}` : '-'}</div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination Planos */}
                <div className="w-full pt-[24px] pb-[16px] flex justify-between items-center bg-white z-20 border-t border-[#F0F0F0]">
                    <div className="flex items-center gap-[16px]">
                        <div className="relative" ref={perPagePlanoRef}>
                            <div
                                onClick={() => setShowPerPagePlano(!showPerPagePlano)}
                                className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                            >
                                <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">{hook.itensPorPagPlanos}</span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={showPerPagePlano ? 'rotate-180' : ''}>
                                    <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showPerPagePlano && (
                                <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50">
                                    {ITENS_OPCOES.map(n => (
                                        <div
                                            key={n}
                                            onClick={() => { hook.setItensPorPagPlanos(n); hook.setPagPlanos(1); setShowPerPagePlano(false); }}
                                            className="px-[12px] py-[6px] text-center hover:bg-orange-50 cursor-pointer text-[14px] font-['Funnel_Sans'] text-[#3B4141]"
                                        >
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans'] min-w-[150px]">Fichas por página</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                        <div
                            onClick={() => hook.setPagPlanos(p => Math.max(1, p - 1))}
                            className={`w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-[4px] ${hook.pagPlanos === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                        >
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {paginasVisiveis(hook.totalPagPlanos, hook.pagPlanos).map((pg, i) => (
                            <div
                                key={i}
                                onClick={() => typeof pg === 'number' && hook.setPagPlanos(pg)}
                                className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border ${pg === hook.pagPlanos ? 'border-[#F78800] bg-white' : 'border-[#E8E8E8] bg-white cursor-pointer hover:bg-gray-50'}`}
                            >
                                <span className={`${pg === hook.pagPlanos ? 'text-[#F78800] font-semibold' : 'text-[#3B4141] font-normal'} text-[15px] font-['Funnel_Sans']`}>{pg}</span>
                            </div>
                        ))}
                        <div
                            onClick={() => hook.setPagPlanos(p => Math.min(hook.totalPagPlanos, p + 1))}
                            className={`w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] ${hook.pagPlanos === hook.totalPagPlanos ? 'opacity-30 pointer-events-none' : ''}`}
                        >
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
