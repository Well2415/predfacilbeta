import React, { useState, useRef, useEffect } from 'react';
import { useRelatorioUsuariosData, UsuarioRelatorio } from '../../../../../hooks/relatorioUsuariosData';

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

interface RelatoriosDadosUsuarioProps {
    PesquisarIcon?: string;
    RelatCalendarioIcon?: string;
}

const ITENS_OPCOES = [5, 10, 20, 50];

export const RelatoriosDadosUsuario: React.FC<RelatoriosDadosUsuarioProps> = ({
    PesquisarIcon,
    RelatCalendarioIcon,
}) => {
    const hook = useRelatorioUsuariosData();
    const [showPerPage, setShowPerPage] = useState(false);
    const [showCalDe, setShowCalDe] = useState(false);
    const [showCalAte, setShowCalAte] = useState(false);
    const perPageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (perPageRef.current && !perPageRef.current.contains(e.target as Node)) setShowPerPage(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
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
        <div className="flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            {/* Filter Bar */}
            <div className="flex items-center gap-[20px] px-[40px]">
                <div className="flex-1 bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 h-[56px] px-[20px] flex items-center gap-[10px]">
                    <img src={PesquisarIcon} alt="Pesquisar" className="w-[24px] h-[24px] object-contain opacity-50" />
                    <input
                        type="text"
                        value={hook.busca}
                        onChange={(e) => { hook.setBusca(e.target.value); hook.setPaginaAtual(1); }}
                        placeholder="Filtrar Usuário"
                        className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-['Inter'] placeholder:text-[#414F5D]/50"
                    />
                </div>

                <div className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center justify-between group cursor-pointer relative" onClick={() => setShowCalDe(!showCalDe)}>
                    <div className="flex items-center gap-[8px]">
                        <img src={RelatCalendarioIcon} alt="De" className="w-[20px] h-[20px] object-contain" />
                        <span className={`text-[16px] font-['Funnel_Sans'] ${hook.dataInicio ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
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
                                hook.setPaginaAtual(1);
                                setShowCalDe(false);
                            }}
                        />
                    )}
                </div>

                <div className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center justify-between group cursor-pointer relative" onClick={() => setShowCalAte(!showCalAte)}>
                    <div className="flex items-center gap-[8px]">
                        <img src={RelatCalendarioIcon} alt="Até" className="w-[20px] h-[20px] object-contain" />
                        <span className={`text-[16px] font-['Funnel_Sans'] ${hook.dataFim ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
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
                                hook.setPaginaAtual(1);
                                setShowCalAte(false);
                            }}
                        />
                    )}
                </div>

                <button className="w-[200px] h-[56px] bg-[#F78800] rounded-[4px] text-white text-[16px] font-medium font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors shadow-sm">
                    Consultar
                </button>
            </div>

            {/* Contagem de resultados e Limpar Filtros */}
            {(hook.busca || hook.dataInicio || hook.dataFim) && (
                <div className="flex items-center gap-[8px] px-[40px] -mt-[20px]">
                    <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                        {hook.totalResultados} {hook.totalResultados === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </span>
                    <button
                        onClick={() => hook.limparFiltros()}
                        className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}

            <div className="px-[40px] w-full overflow-x-auto pb-[20px]">
                <div className="min-w-[1100px] flex flex-col gap-[32px]">
                    <div className="w-full px-[20px] flex justify-between items-center whitespace-nowrap">
                        <div className="flex-[1.5] text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Nome</div>
                        <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Número de Inspeções</div>
                        <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Número de Ocorrências</div>
                        <div className="flex-[1.2] text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Número de Não Conformidades</div>
                        <div className="flex-[1.2] text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Planos de Ação Concluídos</div>
                    </div>

                    <div className="w-full flex flex-col gap-[16px]">
                        {hook.loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-full h-[72px] px-[20px] rounded-[4px] outline outline-1 outline-[#F0F0F0] animate-pulse bg-gray-50 flex items-center gap-4">
                                    <div className="flex-[1.5] h-4 bg-gray-200 rounded"></div>
                                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                                    <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                                    <div className="flex-[1.2] h-4 bg-gray-200 rounded"></div>
                                    <div className="flex-[1.2] h-4 bg-gray-200 rounded"></div>
                                </div>
                            ))
                        ) : hook.itensPagina.length === 0 ? (
                            <div className="w-full py-10 text-center text-[#848484] font-['Funnel_Sans']">Nenhum dado de usuário encontrado.</div>
                        ) : (
                            hook.itensPagina.map((row: UsuarioRelatorio) => (
                                <div key={row.id} className="w-full min-h-[72px] px-[20px] py-[12px] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-between items-center hover:bg-gray-50 transition-colors whitespace-nowrap">
                                    <div className="flex-[1.5] text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.nome}</div>
                                    <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.inspecoes}</div>
                                    <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.ocorrencias || '-'}</div>
                                    <div className="flex-[1.2] text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.naoConformidades || '-'}</div>
                                    <div className="flex-[1.2] text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.planosConcluidos || '-'}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Pagination and Summary */}
            <div className="w-full pt-[24px] pb-[16px] border-t border-[#E1E1E1] flex justify-between items-center px-[40px] relative z-20">
                <div className="flex items-center gap-[16px]">
                    <div className="relative" ref={perPageRef}>
                        <div
                            className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                            onClick={() => setShowPerPage(!showPerPage)}
                        >
                            <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">{hook.itensPorPagina}</span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${showPerPage ? 'rotate-180' : ''}`}>
                                <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {showPerPage && (
                            <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50">
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
                    <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans']">Usuários por página</span>
                </div>
                <span className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{hook.totalResultados} Usuários</span>
                <div className="flex items-center gap-[6px]">
                    <div
                        onClick={() => hook.setPaginaAtual(p => Math.max(1, p - 1))}
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
                        onClick={() => hook.setPaginaAtual(p => Math.min(hook.totalPaginas, p + 1))}
                        className={`w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] ${hook.paginaAtual === hook.totalPaginas ? 'opacity-30 pointer-events-none' : ''}`}
                    >
                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Bar Chart Section */}
            <div className="mx-[40px] p-[32px] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex flex-col gap-[16px] mb-[80px]">
                <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">Volume de Inspeções por Usuário</span>

                <div className="h-[250px] flex items-start gap-[16px]">
                    {/* Y Axis */}
                    <div className="h-[192px] flex flex-col justify-between text-[#898D8D] text-[14px] font-normal font-['DM_Sans'] text-right min-w-[50px] pr-2">
                        <span>{hook.chartData.maxVal}</span>
                        <span>{Math.round(hook.chartData.maxVal * 0.75)}</span>
                        <span>{Math.round(hook.chartData.maxVal * 0.5)}</span>
                        <span>{Math.round(hook.chartData.maxVal * 0.25)}</span>
                        <span>0</span>
                    </div>

                    {/* Chart Columns Area */}
                    <div className="flex-1 flex flex-col gap-[20px]">
                        <div className="h-[192px] border-b border-[#F0F0F0] flex justify-around items-end pb-[4px]">
                            {hook.chartData.users.map((user, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-[12px] flex-1 max-w-[120px] h-full justify-end">
                                    <div
                                        className="w-[28px] bg-[#F8A743] rounded-t-[8px] transition-all duration-500 hover:bg-[#F78800] cursor-pointer relative group"
                                        style={{ height: `${user.value}%` }}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-[35px] left-1/2 -translate-x-1/2 bg-black/80 text-white text-[12px] px-[8px] py-[4px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                                            {user.raw} Inspeções
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* X Axis Labels */}
                        <div className="flex justify-around">
                            {hook.chartData.users.map((user, i) => (
                                <span key={i} className="text-[#898D8D] text-[14px] font-normal font-['DM_Sans'] text-center flex-1 max-w-[120px] line-clamp-2 px-2" title={user.name}>{user.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

