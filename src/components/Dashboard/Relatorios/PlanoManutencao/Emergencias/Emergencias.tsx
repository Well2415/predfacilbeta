import { useState, useRef, useEffect } from 'react';
import { useRelatorioEmergenciasData, Emergencia } from '../../../../../hooks/relatorioEmergenciasData';
import { ViewEmergenciaModal } from '../../../Modais/Relatorios/PlanoManutencao/ViewEmergenciaModal';

export function Emergencias() {
    const hook = useRelatorioEmergenciasData();
    const [showPerPage, setShowPerPage] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Emergencia | null>(null);
    const perPageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (perPageRef.current && !perPageRef.current.contains(e.target as Node)) setShowPerPage(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const ITENS_OPCOES = [5, 10, 20, 50];

    const paginasVisiveis = (total: number, atual: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (atual <= 4) return [1, 2, 3, 4, 5, '...', total];
        if (atual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        return [1, '...', atual - 1, atual, atual + 1, '...', total];
    };

    return (
        <div className="w-full flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Search Bar Container */}
            <div className="w-full px-[40px] flex flex-col gap-[20px]">
                <div className="w-full bg-white rounded-[4px] flex flex-col gap-[10px]">
                    <div className="w-full h-[56px] px-[20px] py-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[10px]">
                        <div className="w-[24px] h-[24px] relative flex justify-center items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={hook.busca}
                            onChange={(e) => { hook.setBusca(e.target.value); hook.setPag(1); }}
                            placeholder="Filtrar por Tipo de Ocorrência ou Descrição"
                            className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['DM_Sans'] leading-[24px] placeholder:text-[#848484]"
                        />
                    </div>
                </div>

                {hook.busca && (
                    <div className="flex items-center gap-[8px]">
                        <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                            {hook.stats.totalItems} resultados encontrados
                        </span>
                        <button
                            onClick={() => hook.limparFiltros()}
                            className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Table & Pagination Container */}
            <div className="w-full px-[40px] flex flex-col justify-center items-center gap-[32px]">

                {/* Table Content */}
                <div className="w-full flex flex-col gap-[32px]">
                    {/* Table Header */}
                    <div className="w-full px-[20px] flex justify-between items-center">
                        <div className="w-[480px] text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Tipo de Ocorrência</div>
                        <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Descrição</div>
                        <div className="w-[72px] text-center text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Ações</div>
                    </div>

                    {/* Table Body - Cards */}
                    <div className="w-full flex flex-col gap-[16px]">
                        {hook.loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="w-full h-[72px] bg-white rounded-[4px] border border-[#F0F0F0] animate-pulse" />
                            ))
                        ) : hook.itens.length === 0 ? (
                            <div className="w-full py-10 text-center text-[#848484] font-['DM_Sans'] border border-[#F0F0F0] rounded-[4px]">Nenhuma emergência encontrada.</div>
                        ) : (
                            hook.itens.map((item: Emergencia) => (
                                <div key={item.id} className="w-full px-[20px] py-[20px] bg-white rounded-[4px] border border-[#F0F0F0] flex justify-between items-center hover:bg-gray-50 transition-colors group">
                                    <div className="w-[480px] text-[#3B4141] text-[16px] font-normal font-['DM_Sans'] pr-[20px]">{item.tipo}</div>
                                    <div className="flex-1 text-[#3B4141] text-[15px] font-normal font-['DM_Sans'] leading-[24px] pr-[20px]">
                                        <ul className="list-disc pl-[20px] m-0 space-y-[4px]">
                                            {item.procedimentos.map((proc, idx) => (
                                                <li key={idx}>{proc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="px-[24px] flex justify-center items-center">
                                        <div
                                            onClick={() => setSelectedItem(item)}
                                            className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-orange-50 rounded-[4px] transition-colors"
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
                </div>

                {/* Pagination */}
                <div className="w-full pt-[24px] pb-[16px] border-t border-[#E1E1E1] flex justify-between items-center">
                    <div className="flex items-center gap-[16px]">
                        <div className="relative" ref={perPageRef}>
                            <div
                                onClick={() => setShowPerPage(!showPerPage)}
                                className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                            >
                                <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{hook.itensPorPag}</span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={showPerPage ? 'rotate-180' : ''}>
                                    <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showPerPage && (
                                <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50 overflow-hidden">
                                    {ITENS_OPCOES.map(n => (
                                        <div
                                            key={n}
                                            onClick={() => { hook.setItensPorPag(n); hook.setPag(1); setShowPerPage(false); }}
                                            className="px-[12px] py-[8px] text-center hover:bg-[#F788001a] hover:text-[#F78800] cursor-pointer text-[14px] font-['DM_Sans'] text-[#3B4141] transition-colors"
                                        >
                                            {n}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <span className="text-[#F78800] text-[14px] font-normal font-['DM_Sans']">Itens por página</span>
                    </div>

                    <div className="flex items-center gap-[6px]">
                        <button
                            onClick={() => hook.setPag((p: number) => Math.max(1, p - 1))}
                            className={`w-[32px] h-[32px] flex items-center justify-center bg-white rounded-[4px] border border-[#E1E1E1] hover:bg-gray-50 transition-colors ${hook.pag === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                        >
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {paginasVisiveis(hook.totalPaginas, hook.pag).map((num, i) => (
                            <div
                                key={i}
                                onClick={() => typeof num === 'number' && hook.setPag(num)}
                                className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border transition-all ${num === hook.pag ? 'border-[#F78800] bg-[#F788001a] text-[#F78800] font-bold' : 'border-[#E8E8E8] bg-white cursor-pointer hover:bg-gray-50 text-[#3B4141] font-normal'} text-[14px] font-['DM_Sans']`}
                            >
                                {num}
                            </div>
                        ))}

                        <button
                            onClick={() => hook.setPag((p: number) => Math.min(hook.totalPaginas, p + 1))}
                            className={`w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] hover:bg-[#E57600] transition-colors ${hook.pag === hook.totalPaginas ? 'opacity-30 pointer-events-none' : ''}`}
                        >
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>

            {selectedItem && (
                <ViewEmergenciaModal
                    data={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
