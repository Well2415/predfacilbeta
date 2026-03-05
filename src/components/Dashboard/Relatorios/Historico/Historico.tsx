import React, { useState, useRef, useEffect } from 'react';
import { useRelatorioHistoricoData, ManutencaoSistema, RelatorioGerado } from '../../../../hooks/relatorioHistoricoData';

interface RelatoriosHistoricoProps {
    historicoTab: 'manutencoes' | 'relatorios';
    setHistoricoTab: (tab: 'manutencoes' | 'relatorios') => void;
    PesquisarIcon?: string;
    CalendarioFiltroIcon?: string;
    IconeTotalPrevisto?: string;
}

const ITENS_OPCOES = [5, 10, 20, 50];
const MESES_LABEL = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const RelatoriosHistorico: React.FC<RelatoriosHistoricoProps> = ({
    historicoTab,
    setHistoricoTab,
    PesquisarIcon,
    CalendarioFiltroIcon,
    IconeTotalPrevisto,
}) => {
    const hook = useRelatorioHistoricoData();
    const [showPerPageSist, setShowPerPageSist] = useState(false);
    const [showPerPageRel, setShowPerPageRel] = useState(false);
    const [showPrioridade, setShowPrioridade] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [showCategoria, setShowCategoria] = useState(false);
    const [showAno, setShowAno] = useState(false);

    const perPageSistRef = useRef<HTMLDivElement>(null);
    const perPageRelRef = useRef<HTMLDivElement>(null);
    const prioridadeRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);
    const categoriaRef = useRef<HTMLDivElement>(null);
    const anoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (perPageSistRef.current && !perPageSistRef.current.contains(e.target as Node)) setShowPerPageSist(false);
            if (perPageRelRef.current && !perPageRelRef.current.contains(e.target as Node)) setShowPerPageRel(false);
            if (prioridadeRef.current && !prioridadeRef.current.contains(e.target as Node)) setShowPrioridade(false);
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) setShowStatus(false);
            if (categoriaRef.current && !categoriaRef.current.contains(e.target as Node)) setShowCategoria(false);
            if (anoRef.current && !anoRef.current.contains(e.target as Node)) setShowAno(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const fmtMoeda = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const paginasVisiveis = (total: number, atual: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (atual <= 4) return [1, 2, 3, 4, 5, '...', total];
        if (atual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        return [1, '...', atual - 1, atual, atual + 1, '...', total];
    };

    return (
        <div className="flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            {/* Tabs Selector */}
            <div className="flex flex-col gap-[20px] px-[40px]">
                <div className="w-full h-[56px] p-[4px] bg-[#EEF0FA] rounded-[8px] flex items-center">
                    <button
                        onClick={() => setHistoricoTab('manutencoes')}
                        className={`flex-1 h-full rounded-[4px] flex justify-center items-center text-[14px] font-['DM_Sans'] transition-all ${historicoTab === 'manutencoes' ? 'bg-white text-[#F78800] font-bold shadow-sm' : 'text-[#3B4141] font-medium hover:text-[#F78800]'}`}>
                        Manutenções
                    </button>
                    <button
                        onClick={() => setHistoricoTab('relatorios')}
                        className={`flex-1 h-full rounded-[4px] flex justify-center items-center text-[14px] font-['DM_Sans'] transition-all ${historicoTab === 'relatorios' ? 'bg-white text-[#F78800] font-bold shadow-sm' : 'text-[#3B4141] font-medium hover:text-[#F78800]'}`}>
                        Relatórios
                    </button>
                </div>
            </div>

            {historicoTab === 'manutencoes' ? (
                <>
                    {/* Filter Bar */}
                    <div className="flex items-center gap-[16px] px-[40px]">
                        <div className="flex-[2] h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center gap-[10px]">
                            <img src={PesquisarIcon} alt="Pesquisar" className="w-[20px] h-[20px] object-contain opacity-50" />
                            <input
                                type="text"
                                value={hook.busca}
                                onChange={(e) => { hook.setBusca(e.target.value); hook.setPagSistemas(1); }}
                                placeholder="Filtrar por Sistema, Data, Observação ou Valor..."
                                className="w-full bg-transparent outline-none text-[#414F5D] text-[14px] font-normal font-['DM_Sans'] placeholder:text-[#848484]"
                            />
                        </div>

                        {/* Dropdown Prioridade */}
                        <div className="w-[140px] relative" ref={prioridadeRef}>
                            <div
                                onClick={() => setShowPrioridade(!showPrioridade)}
                                className="h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center justify-between group cursor-pointer"
                            >
                                <span className={`text-[14px] font-normal font-['DM_Sans'] ${hook.prioridade ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
                                    {hook.prioridade || 'Prioridade'}
                                </span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${showPrioridade ? 'rotate-180' : ''}`}>
                                    <path d="M1 1L5 5L9 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showPrioridade && (
                                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50">
                                    <div onClick={() => { hook.setPrioridade(''); setShowPrioridade(false); }} className="px-3 py-2 hover:bg-[#F788001a] hover:text-[#F78800] cursor-pointer text-[14px] text-[#848484]">Todas</div>
                                    {hook.prioridadesDisponiveis.map(p => (
                                        <div key={p} onClick={() => { hook.setPrioridade(p); setShowPrioridade(false); }} className="px-3 py-2 hover:bg-[#F788001a] hover:text-[#F78800] cursor-pointer text-[14px] text-[#3B4141]">{p}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dropdown Status */}
                        <div className="w-[140px] relative" ref={statusRef}>
                            <div
                                onClick={() => setShowStatus(!showStatus)}
                                className="h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center justify-between group cursor-pointer"
                            >
                                <span className={`text-[14px] font-normal font-['DM_Sans'] ${hook.status ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
                                    {hook.status || 'Status'}
                                </span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${showStatus ? 'rotate-180' : ''}`}>
                                    <path d="M1 1L5 5L9 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showStatus && (
                                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50">
                                    <div onClick={() => { hook.setStatus(''); setShowStatus(false); }} className="px-3 py-2 hover:bg-[#F788001a] hover:text-[#F78800] cursor-pointer text-[14px] text-[#848484]">Todos</div>
                                    {hook.statusDisponiveis.map(s => (
                                        <div key={s} onClick={() => { hook.setStatus(s); setShowStatus(false); }} className="px-3 py-2 hover:bg-[#F788001a] hover:text-[#F78800] cursor-pointer text-[14px] text-[#3B4141]">{s}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dropdown Categoria */}
                        <div className="w-[160px] relative" ref={categoriaRef}>
                            <div
                                onClick={() => setShowCategoria(!showCategoria)}
                                className="h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center justify-between group cursor-pointer"
                            >
                                <span className={`text-[14px] font-normal font-['DM_Sans'] ${hook.categoria ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
                                    {hook.categoria || 'Categoria'}
                                </span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${showCategoria ? 'rotate-180' : ''}`}>
                                    <path d="M1 1L5 5L9 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showCategoria && (
                                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50 max-h-48 overflow-y-auto custom-scrollbar">
                                    <div onClick={() => { hook.setCategoria(''); setShowCategoria(false); }} className="px-3 py-2 hover:bg-[#F788001a] hover:text-[#F78800] cursor-pointer text-[14px] text-[#848484]">Todas</div>
                                    {hook.categoriasDisponiveis.map(c => (
                                        <div key={c} onClick={() => { hook.setCategoria(c); setShowCategoria(false); }} className="px-3 py-2 hover:bg-[#F788001a] hover:text-[#F78800] cursor-pointer text-[14px] text-[#3B4141]">{c}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dropdown Ano */}
                        <div className="w-[140px] relative" ref={anoRef}>
                            <div
                                onClick={() => setShowAno(!showAno)}
                                className="h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-[8px]">
                                    <img src={CalendarioFiltroIcon} alt="Calendário" className="w-[16px] h-[16px] object-contain" />
                                    <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{hook.anoRelatorio}</span>
                                </div>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${showAno ? 'rotate-180' : ''}`}>
                                    <path d="M1 1L5 5L9 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showAno && (
                                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50">
                                    {['2023', '2024', '2025'].map(a => (
                                        <div key={a} onClick={() => { hook.setAnoRelatorio(a); setShowAno(false); }} className="px-3 py-2 hover:bg-[#F788001a] hover:text-[#F78800] cursor-pointer text-[14px] text-[#3B4141]">{a}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="h-[56px] px-[24px] bg-[#F78800] rounded-[4px] text-white text-[16px] font-semibold font-['DM_Sans'] leading-[19.2px] hover:bg-[#E57600] transition-colors flex items-center justify-center whitespace-nowrap shadow-sm">
                            Baixar Relatório
                        </button>
                    </div>

                    {/* Limpar Filtros */}
                    {(hook.busca || hook.prioridade || hook.status || hook.categoria || hook.anoRelatorio !== '2025') && (
                        <div className="flex items-center gap-[8px] px-[40px] -mt-[20px]">
                            <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                                {hook.stats.countSistemas} sistemas encontrados
                            </span>
                            <button
                                onClick={() => hook.limparFiltrosManutencao()}
                                className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}

                    {/* Total Previsto Card */}
                    <div className="px-[40px]">
                        <div className="w-full p-[24px] bg-white rounded-[8px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex flex-col gap-[16px]">
                            <div className="flex justify-start items-center gap-[12px]">
                                <div className="w-[24px] h-[24px] flex items-center justify-center">
                                    <img src={IconeTotalPrevisto} alt="Total Previsto" className="w-[24px] h-[24px] object-contain" />
                                </div>
                                <span className="text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Total Previsto – Período Selecionado</span>
                            </div>
                            <div className="flex flex-col gap-[4px]">
                                <span className="text-[#F78800] text-[32px] font-bold font-['DM_Sans'] leading-[40px]">{fmtMoeda(hook.stats.totalPrevisto)}</span>
                                <div className="flex items-center gap-[4px]">
                                    <span className={`text-[14px] font-bold font-['DM_Sans'] ${hook.stats.variacao >= 0 ? 'text-[#E63939]' : 'text-[#00A859]'}`}>
                                        {hook.stats.variacao >= 0 ? '+' : ''}{hook.stats.variacao}%
                                    </span>
                                    <span className="text-[#3B4141] text-[14px] font-medium font-['DM_Sans']">vs mesmo período no ano passado</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabela Manutenções */}
                    <div className="px-[40px] flex flex-col gap-[24px]">
                        <div className="w-full overflow-x-auto custom-scrollbar">
                            <div className="w-full flex flex-col min-w-[1000px]">
                                {/* Header */}
                                <div className="w-full flex">
                                    <div className="w-[200px] py-[16px] px-[12px] bg-white border border-[#F0F0F0] text-[#3B4141] text-[14px] font-bold font-['DM_Sans'] flex items-center justify-start border-r-0">
                                        Sistema
                                    </div>
                                    {MESES_LABEL.map((mes, idx) => (
                                        <div key={mes} className={`flex-1 py-[16px] px-[8px] bg-white border border-[#F0F0F0] ${idx !== 11 ? 'border-r-0' : ''} text-[#3B4141] text-[14px] font-bold font-['DM_Sans'] text-center flex items-center justify-center`}>
                                            {mes}
                                        </div>
                                    ))}
                                </div>

                                {/* Data Rows */}
                                {hook.loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="w-full h-[52px] animate-pulse border-b border-l border-r border-[#F0F0F0] bg-white" />
                                    ))
                                ) : hook.sistemas.length === 0 ? (
                                    <div className="w-full py-10 text-center text-[#848484] font-['DM_Sans'] border border-[#F0F0F0] border-t-0">Nenhuma manutenção encontrada.</div>
                                ) : (
                                    hook.sistemas.map((row: ManutencaoSistema) => (
                                        <div key={row.id} className="w-full flex group hover:bg-gray-50 transition-colors bg-white">
                                            <div className="w-[200px] py-[16px] px-[12px] border-b border-l border-[#F0F0F0] flex items-center justify-start">
                                                <span className="text-[#3B4141] text-[12px] font-normal font-['DM_Sans'] leading-[18px] w-full">{row.sistema}</span>
                                            </div>
                                            {MESES_LABEL.map((_, idx) => {
                                                const lanc = row.lancamentos.find(l => l.mes === idx);
                                                return (
                                                    <div key={idx} className={`flex-1 py-[16px] px-[8px] border-b border-l ${idx === 11 ? 'border-r' : ''} border-[#F0F0F0] flex items-center justify-center`}>
                                                        <span className="text-[#848484] text-[12px] font-normal font-['DM_Sans'] max-w-full truncate">
                                                            {lanc ? lanc.status : '-'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Pagination Manutenções */}
                        <div className="mt-[24px] py-[24px] border-t border-[#E1E1E1] flex items-center justify-between w-full">
                            <div className="flex items-center gap-[16px]">
                                <div className="relative" ref={perPageSistRef}>
                                    <div
                                        onClick={() => setShowPerPageSist(!showPerPageSist)}
                                        className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                                    >
                                        <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{hook.itensPorPagSistemas}</span>
                                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={showPerPageSist ? 'rotate-180' : ''}>
                                            <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {showPerPageSist && (
                                        <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50">
                                            {ITENS_OPCOES.map(n => (
                                                <div
                                                    key={n}
                                                    onClick={() => { hook.setItensPorPagSistemas(n); hook.setPagSistemas(1); setShowPerPageSist(false); }}
                                                    className="px-[12px] py-[6px] text-center hover:bg-[#F788001a] hover:text-[#F78800] cursor-pointer text-[14px] font-['DM_Sans'] text-[#3B4141]"
                                                >
                                                    {n}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[#F78800] text-[14px] font-normal font-['DM_Sans']">Sistemas por página</span>
                            </div>

                            <div className="flex items-center gap-[8px]">
                                <button
                                    onClick={() => hook.setPagSistemas(p => Math.max(1, p - 1))}
                                    className={`w-[32px] h-[32px] bg-white rounded-[4px] border border-[#E1E1E1] flex items-center justify-center hover:bg-gray-100 transition-colors ${hook.pagSistemas === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                {paginasVisiveis(hook.totalPagSistemas, hook.pagSistemas).map((pg, i) => (
                                    <div
                                        key={i}
                                        onClick={() => typeof pg === 'number' && hook.setPagSistemas(pg)}
                                        className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border ${pg === hook.pagSistemas ? 'border-[#F78800] bg-[#F788001a]' : 'border-[#E8E8E8] bg-white cursor-pointer hover:bg-gray-50'}`}
                                    >
                                        <span className={`${pg === hook.pagSistemas ? 'text-[#F78800] font-bold' : 'text-[#3B4141] font-normal'} text-[14px] font-['DM_Sans']`}>{pg}</span>
                                    </div>
                                ))}
                                <button
                                    onClick={() => hook.setPagSistemas(p => Math.min(hook.totalPagSistemas, p + 1))}
                                    className={`w-[32px] h-[32px] bg-[#F78800] rounded-[4px] flex items-center justify-center hover:bg-[#E57600] transition-colors ${hook.pagSistemas === hook.totalPagSistemas ? 'opacity-30 pointer-events-none' : ''}`}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Aba Relatórios */}
                    <div className="flex items-center gap-[16px] px-[40px] mt-[8px]">
                        <div className="w-full h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center gap-[10px]">
                            <img src={PesquisarIcon} alt="Pesquisar" className="w-[20px] h-[20px] object-contain opacity-50" />
                            <input
                                type="text"
                                value={hook.buscaRelatorio}
                                onChange={(e) => { hook.setBuscaRelatorio(e.target.value); hook.setPagRelatorios(1); }}
                                placeholder="Filtrar por Modelo"
                                className="w-full bg-transparent outline-none text-[#414F5D] text-[14px] font-normal font-['DM_Sans'] placeholder:text-[#848484]"
                            />
                        </div>
                    </div>

                    {/* Limpar Filtros Relatório */}
                    {hook.buscaRelatorio && (
                        <div className="flex items-center gap-[8px] px-[40px] mt-4">
                            <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                                {hook.stats.countRelatorios} relatórios encontrados
                            </span>
                            <button
                                onClick={() => hook.limparFiltrosRelatorio()}
                                className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}

                    {/* Tabela Relatórios */}
                    <div className="px-[40px] flex flex-col gap-[24px] mt-[32px]">
                        <div className="w-full overflow-x-auto custom-scrollbar">
                            <div className="w-full flex flex-col">
                                {/* Header */}
                                <div className="w-full flex pb-[8px]">
                                    <div className="flex-[1] py-[8px] px-[12px] bg-white text-[#3B4141] text-[14px] font-bold font-['DM_Sans'] flex items-center justify-start">
                                        Modelo
                                    </div>
                                    <div className="flex-[2] py-[8px] px-[12px] bg-white text-[#3B4141] text-[14px] font-bold font-['DM_Sans'] flex items-center justify-start">
                                        Filtro (Período)
                                    </div>
                                    <div className="flex-[2] py-[8px] px-[12px] bg-white text-[#3B4141] text-[14px] font-bold font-['DM_Sans'] flex items-center justify-start">
                                        Solicitado Em
                                    </div>
                                    <div className="flex-none w-[100px] py-[8px] px-[12px] bg-white text-[#3B4141] text-[14px] font-bold font-['DM_Sans'] flex items-center justify-center">
                                        Ações
                                    </div>
                                </div>

                                {/* Data Rows */}
                                <div className="flex flex-col gap-[16px]">
                                    {hook.loading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="w-full h-[72px] bg-white rounded-[8px] border border-[#F0F0F0] animate-pulse" />
                                        ))
                                    ) : hook.relatorios.length === 0 ? (
                                        <div className="w-full py-10 text-center text-[#848484] font-['DM_Sans'] border border-[#F0F0F0] rounded-[8px]">Nenhum relatório encontrado.</div>
                                    ) : (
                                        hook.relatorios.map((row: RelatorioGerado) => (
                                            <div key={row.id} className="w-full flex group bg-white border border-[#F0F0F0] rounded-[8px] hover:shadow-sm transition-all hover:border-[#E1E1E1]">
                                                <div className="flex-[1] py-[20px] px-[12px] flex items-center justify-start">
                                                    <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{row.modelo}</span>
                                                </div>
                                                <div className="flex-[2] py-[20px] px-[12px] flex items-center justify-start">
                                                    <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{row.periodo}</span>
                                                </div>
                                                <div className="flex-[2] py-[20px] px-[12px] flex items-center justify-start">
                                                    <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{row.dataSolicitacao}</span>
                                                </div>
                                                <div className="flex-none w-[100px] py-[20px] px-[12px] flex items-center justify-center">
                                                    <div className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-orange-50 rounded-[4px] transition-colors">
                                                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 11.5L8 15.5M8 15.5L4 11.5M8 15.5V1.5" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pagination Relatórios */}
                        <div className="mt-[24px] py-[24px] border-t border-[#E1E1E1] flex items-center justify-between w-full">
                            <div className="flex items-center gap-[16px]">
                                <div className="relative" ref={perPageRelRef}>
                                    <div
                                        onClick={() => setShowPerPageRel(!showPerPageRel)}
                                        className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                                    >
                                        <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{hook.itensPorPagRelatorios}</span>
                                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={showPerPageRel ? 'rotate-180' : ''}>
                                            <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {showPerPageRel && (
                                        <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50">
                                            {ITENS_OPCOES.map(n => (
                                                <div
                                                    key={n}
                                                    onClick={() => { hook.setItensPorPagRelatorios(n); hook.setPagRelatorios(1); setShowPerPageRel(false); }}
                                                    className="px-[12px] py-[6px] text-center hover:bg-[#F788001a] hover:text-[#F78800] cursor-pointer text-[14px] font-['DM_Sans'] text-[#3B4141]"
                                                >
                                                    {n}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[#F78800] text-[14px] font-normal font-['DM_Sans']">Relatórios por página</span>
                            </div>

                            <div className="flex items-center gap-[8px]">
                                <button
                                    onClick={() => hook.setPagRelatorios(p => Math.max(1, p - 1))}
                                    className={`w-[32px] h-[32px] bg-white rounded-[4px] border border-[#E1E1E1] flex items-center justify-center hover:bg-gray-100 transition-colors ${hook.pagRelatorios === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                {paginasVisiveis(hook.totalPagRelatorios, hook.pagRelatorios).map((pg, i) => (
                                    <div
                                        key={i}
                                        onClick={() => typeof pg === 'number' && hook.setPagRelatorios(pg)}
                                        className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border ${pg === hook.pagRelatorios ? 'border-[#F78800] bg-[#F788001a]' : 'border-[#E8E8E8] bg-white cursor-pointer hover:bg-gray-50'}`}
                                    >
                                        <span className={`${pg === hook.pagRelatorios ? 'text-[#F78800] font-bold' : 'text-[#3B4141] font-normal'} text-[14px] font-['DM_Sans']`}>{pg}</span>
                                    </div>
                                ))}
                                <button
                                    onClick={() => hook.setPagRelatorios(p => Math.min(hook.totalPagRelatorios, p + 1))}
                                    className={`w-[32px] h-[32px] bg-[#F78800] rounded-[4px] flex items-center justify-center hover:bg-[#E57600] transition-colors ${hook.pagRelatorios === hook.totalPagRelatorios ? 'opacity-30 pointer-events-none' : ''}`}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
