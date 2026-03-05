import React, { useState, useRef, useEffect } from 'react';
import { useRelatorioInspecoesData } from '../../../../hooks/relatorioInspecoesData';

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
                {DIAS_SEM.map((d, i) => (<div key={i} className="h-[22px] flex items-center justify-center text-[10px] font-semibold text-[#AAAAAA] font-['DM_Sans']">{d}</div>))}
                {grid.map((day, i) => day === null ? <div key={i} /> : (
                    <div key={i} onClick={() => onSelect(new Date(ano, mes, day))} className="h-[26px] flex items-center justify-center rounded-[4px] text-[12px] cursor-pointer font-['DM_Sans'] text-[#3B4141] hover:bg-[#FFEAD0] hover:text-[#F68903] transition-colors">{day}</div>
                ))}
            </div>
        </div>
    );
}

interface RelatoriosInspecoesProps {
    hook: ReturnType<typeof useRelatorioInspecoesData>;
    setShowReportModal: (show: boolean) => void;
    setShowViewRelatorioModal: (show: boolean) => void;
    // Ícones
    AgendaIcon: string;
    SetaCimaBaixoIcon: string;
}

export const RelatoriosInspecoes: React.FC<RelatoriosInspecoesProps> = ({
    hook,
    setShowReportModal,
    setShowViewRelatorioModal,
    AgendaIcon,
    SetaCimaBaixoIcon,
}) => {
    const [showCalDe, setShowCalDe] = useState(false);
    const [showCalAte, setShowCalAte] = useState(false);
    const [showPerPage, setShowPerPage] = useState(false);
    const perPageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (perPageRef.current && !perPageRef.current.contains(e.target as Node)) setShowPerPage(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const fmtLabel = (val: string, fallback: string) => {
        if (!val) return fallback;
        const [y, m, d] = val.split('-');
        return `${d}/${m}/${y}`;
    };

    const handleNextPage = () => {
        if (hook.paginaAtual < hook.totalPaginas) {
            hook.setPaginaAtual(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (hook.paginaAtual > 1) {
            hook.setPaginaAtual(prev => prev - 1);
        }
    };

    const paginasVisiveis = () => {
        const total = hook.totalPaginas;
        const atual = hook.paginaAtual;
        const result: (number | string)[] = [];
        if (total <= 7) {
            for (let i = 1; i <= total; i++) result.push(i);
        } else {
            if (atual <= 4) {
                result.push(1, 2, 3, 4, 5, '...', total);
            } else if (atual >= total - 3) {
                result.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
            } else {
                result.push(1, '...', atual - 1, atual, atual + 1, '...', total);
            }
        }
        return result;
    };

    return (
        <div className="flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Linha de Filtro e Ações */}
            <div className="flex items-center gap-[20px]">
                {/* Barra de Pesquisa */}
                <div className="flex-1 h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[10px]">
                    <div className="w-[24px] h-[24px] flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="7" stroke="#CCCCCC" strokeWidth="1.33" />
                            <path d="M15 15L21 21" stroke="#CCCCCC" strokeWidth="1.33" strokeLinecap="round" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={hook.busca}
                        onChange={(e) => hook.setBusca(e.target.value)}
                        placeholder="Filtrar por Nome de Inspeção ou Remetente"
                        className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Inter'] placeholder:text-[#414F5D] leading-[24px]"
                    />
                </div>

                {/* De */}
                <div className="relative">
                    <div
                        onClick={() => { setShowCalDe(!showCalDe); setShowCalAte(false); }}
                        className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[10px] cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex-1 flex justify-start items-center gap-[8px]">
                            <div className="w-[20px] h-[20px] relative overflow-hidden flex items-center justify-center">
                                <img src={AgendaIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                            </div>
                            <span className="text-[#848484] text-[16px] font-normal font-['Funnel_Sans']">{fmtLabel(hook.filtroDataDe, 'De')}</span>
                        </div>
                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                            <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {showCalDe && (
                        <MiniCal
                            onSelect={(d) => {
                                const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                hook.setFiltroDataDe(val);
                                setShowCalDe(false);
                            }}
                            onClose={() => setShowCalDe(false)}
                        />
                    )}
                </div>

                {/* Até */}
                <div className="relative">
                    <div
                        onClick={() => { setShowCalAte(!showCalAte); setShowCalDe(false); }}
                        className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[10px] cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex-1 flex justify-start items-center gap-[8px]">
                            <div className="w-[20px] h-[20px] relative overflow-hidden flex items-center justify-center">
                                <img src={AgendaIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                            </div>
                            <span className="text-[#848484] text-[16px] font-normal font-['Funnel_Sans']">{fmtLabel(hook.filtroDataAte, 'Até')}</span>
                        </div>
                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                            <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {showCalAte && (
                        <MiniCal
                            onSelect={(d) => {
                                const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                hook.setFiltroDataAte(val);
                                setShowCalAte(false);
                            }}
                            onClose={() => setShowCalAte(false)}
                        />
                    )}
                </div>

                {/* Botão de Relatórios */}
                <button
                    className="w-[200px] h-[56px] bg-[#F78800] rounded-[4px] flex justify-center items-center gap-[10px] hover:bg-[#E57600] transition-colors shadow-sm"
                    onClick={() => setShowReportModal(true)}
                >
                    <span className="text-white text-[16px] font-medium font-['Funnel_Sans']">Relatórios</span>
                </button>
            </div>

            {/* Contagem de resultados e Limpar Filtros */}
            {(hook.busca || hook.filtroDataDe || hook.filtroDataAte) && (
                <div className="flex items-center gap-[8px] -mt-[12px]">
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

            {/* Container da Tabela */}
            <div className="flex flex-col gap-[32px]">
                {/* Cabeçalho da Tabela */}
                <div className="px-[20px] flex justify-between items-center">
                    <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Nome</div>
                    <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Enviado Por</div>
                    <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Previsto Para</div>
                    <div
                        className="flex-1 flex items-center gap-[12px] cursor-pointer group"
                        onClick={() => {
                            hook.setOrdenacao(prev => prev === 'asc' ? 'desc' : 'asc');
                        }}
                    >
                        <span className={`text-[18px] font-semibold font-['Funnel_Sans'] ${hook.ordenacao ? 'text-[#F78800]' : 'text-[#3B4141]'}`}>Respondido Em</span>
                        <div className="w-[10px] h-[16px] flex items-center justify-center">
                            <img
                                src={SetaCimaBaixoIcon}
                                alt="Ordenar"
                                className={`w-full h-full object-contain ${hook.ordenacao ? 'brightness-0 saturate-100 invert-[58%] sepia-[61%] saturate-[2386%] hue-rotate-[359deg] brightness-[101%] contrast-[106%]' : ''}`}
                                style={{ filter: hook.ordenacao ? 'invert(65%) sepia(35%) saturate(5000%) hue-rotate(360deg) brightness(100%) contrast(105%)' : 'none' }}
                            />
                        </div>
                    </div>
                    <div className="w-[72px] text-center text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Ações</div>
                </div>

                {/* Linhas da Tabela */}
                <div className="flex flex-col gap-[16px]">
                    {hook.loading ? (
                        <div className="py-[48px] flex justify-center">
                            <div className="w-[24px] h-[24px] border-[3px] border-[#F78800] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : hook.itensPagina.length === 0 ? (
                        <div className="py-[48px] flex flex-col items-center gap-[12px]">
                            <span className="text-[#3B4141] text-[18px] font-medium font-['DM_Sans']">Nenhum resultado encontrado</span>
                        </div>
                    ) : (
                        hook.itensPagina.map((row) => (
                            <div key={row.id} className="px-[20px] py-[8px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] outline-offset-[-1px] flex justify-between items-center hover:shadow-sm transition-shadow min-h-[56px]">
                                <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.nome}</div>
                                <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.enviadoPor}</div>
                                <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.previsto}</div>
                                <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.respondido}</div>
                                <div className="w-[72px] flex justify-center items-center">
                                    <div
                                        className="w-[20px] h-[20px] flex items-center justify-center cursor-pointer hover:opacity-80 hover:scale-110 transition-transform"
                                        onClick={() => {
                                            hook.setSelectedRelatorio(row);
                                            setShowViewRelatorioModal(true);
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="3" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Paginação */}
                <div className="mt-[24px] py-[24px] border-t border-[#E1E1E1] flex justify-between items-center w-full">
                    <div className="flex items-center gap-[16px]">
                        <div className="relative" ref={perPageRef}>
                            <div
                                onClick={() => setShowPerPage(v => !v)}
                                className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex justify-center items-center gap-[8px] cursor-pointer"
                            >
                                <span className="text-[#3B4141] text-[14px] font-normal font-['Inter']">{hook.itensPorPagina}</span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showPerPage && (
                                <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-20">
                                    {[5, 10, 20, 50].map(n => (
                                        <div
                                            key={n}
                                            onClick={() => { hook.setItensPorPagina(n); hook.setPaginaAtual(1); setShowPerPage(false); }}
                                            className="px-[12px] py-[6px] text-center hover:bg-orange-50 cursor-pointer text-[14px]"
                                        >
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="text-[#F78800] text-[16px] font-normal font-['Inter']">Relatórios por página</span>
                    </div>

                    <div className="flex items-center gap-[6px]">
                        <button
                            onClick={handlePrevPage}
                            disabled={hook.paginaAtual === 1}
                            className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-[4px] disabled:opacity-40"
                        >
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                <path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {paginasVisiveis().map((pg, idx) => (
                            pg === '...' ? (
                                <span key={idx} className="w-[32px] h-[32px] flex justify-center items-center text-[#3B4141]">...</span>
                            ) : (
                                <button
                                    key={idx}
                                    onClick={() => hook.setPaginaAtual(Number(pg))}
                                    className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border ${pg === hook.paginaAtual ? 'border-[#F78800] bg-white text-[#F78800] font-semibold' : 'border-[#E5E7EB] bg-white text-[#3B4141] hover:bg-gray-50'} text-[14px] font-medium font-['Inter'] transition-colors`}
                                >
                                    {pg}
                                </button>
                            )
                        ))}

                        <button
                            onClick={handleNextPage}
                            disabled={hook.paginaAtual === hook.totalPaginas}
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
    );
};
