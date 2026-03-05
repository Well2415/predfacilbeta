import React, { useState, useRef, useEffect } from 'react';
import { useEquipamentosData } from '../../../../hooks/cadastroEquipamentosData';

interface EquipamentosProps {
    hook: ReturnType<typeof useEquipamentosData>;
    equipmentSubView: 'lista' | 'detalhes';
    setEquipmentSubView: (view: 'lista' | 'detalhes') => void;
    selectedEquipmentGroup: string | null;
    setSelectedEquipmentGroup: (group: string | null) => void;
    setShowAddEquipmentModal: (show: boolean) => void;
    setShowViewEquipmentModal: (show: boolean) => void;
    setShowEditEquipmentModal: (show: boolean) => void;
    setEquipamentoParaEditar: (equipamento: any) => void;
    IconeLapis: string;
    ExcluirIcon: string;
}

export const Equipamentos: React.FC<EquipamentosProps> = ({
    hook,
    equipmentSubView,
    setEquipmentSubView,
    selectedEquipmentGroup,
    setSelectedEquipmentGroup,
    setShowAddEquipmentModal,
    setShowViewEquipmentModal,
    setShowEditEquipmentModal,
    setEquipamentoParaEditar,
    IconeLapis,
    ExcluirIcon,
}) => {
    const [showPerPage, setShowPerPage] = useState(false);
    const [confirmarExclusao, setConfirmarExclusao] = useState<number | null>(null);
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

    const handleNextPage = () => {
        if (hook.paginaAtual < (equipmentSubView === 'lista' ? hook.totalPaginasGrupos : hook.totalPaginasEquipamentos)) {
            hook.setPaginaAtual(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (hook.paginaAtual > 1) {
            hook.setPaginaAtual(prev => prev - 1);
        }
    };

    const paginasVisiveis = () => {
        const total = equipmentSubView === 'lista' ? hook.totalPaginasGrupos : hook.totalPaginasEquipamentos;
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
            {equipmentSubView === 'lista' ? (
                <>
                    {/* Barra de Filtro */}
                    <div className="flex items-center gap-[20px] w-full">
                        <div className="flex-1 h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-[10px] flex-1">
                                <div className="w-[24px] h-[24px] flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="11" cy="11" r="7" stroke="#CCCCCC" strokeWidth="2" />
                                        <path d="M20 20L16 16" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={hook.busca}
                                    onChange={(e) => hook.setBusca(e.target.value)}
                                    placeholder="Filtrar por nome"
                                    className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                />
                            </div>
                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Contagem de resultados e Limpar Filtros */}
                    {hook.busca && (
                        <div className="flex items-center gap-[8px] -mt-[12px]">
                            <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                                {hook.totalItensGrupos} {hook.totalItensGrupos === 1 ? 'grupo encontrado' : 'grupos encontrados'}
                            </span>
                            <button
                                onClick={() => hook.limparFiltros()}
                                className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}

                    {/* Tabela de Grupos */}
                    <div className="flex flex-col gap-[16px] w-full">
                        {/* Cabeçalho */}
                        <div className="px-[20px] flex items-center justify-between w-full">
                            <div className="w-[320px] text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Nome</div>
                            <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Nº de equipamentos</div>
                            <div className="w-[72px] text-center text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Ações</div>
                        </div>

                        {/* Linhas */}
                        <div className="flex flex-col gap-[16px]">
                            {hook.grupos.length === 0 ? (
                                <div className="py-[48px] flex flex-col items-center gap-[12px]">
                                    <span className="text-[#3B4141] text-[18px] font-medium font-['DM_Sans']">Nenhum grupo encontrado</span>
                                </div>
                            ) : (
                                hook.grupos.map((g, i) => (
                                    <div key={i} className="px-[20px] py-[16px] bg-white rounded-[4px] border border-[#F0F0F0] flex items-center justify-between min-h-[56px] hover:shadow-sm transition-shadow">
                                        <div className="w-[320px] text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{g.nome}</div>
                                        <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{g.count}</div>
                                        <div className="w-[72px] flex items-center justify-center">
                                            <div
                                                onClick={() => {
                                                    setSelectedEquipmentGroup(g.nome);
                                                    hook.setCategoriaFiltro(g.nome);
                                                    hook.setPaginaAtual(1);
                                                    setEquipmentSubView('detalhes');
                                                }}
                                                className="w-[24px] h-[24px] cursor-pointer hover:scale-110 transition-transform">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Paginação */}
                        <div className="mt-[24px] py-[24px] border-t border-[#E1E1E1] flex items-center justify-between w-full">
                            <div className="flex items-center gap-[16px]">
                                <div className="relative" ref={perPageRef}>
                                    <div
                                        onClick={() => setShowPerPage(!showPerPage)}
                                        className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                                    >
                                        <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">{hook.itensPorPagina}</span>
                                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                            <path d="M1 1L6 6L11 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                                <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans']">Grupos de Equipamentos por página</span>
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
                                    disabled={hook.paginaAtual === hook.totalPaginasGrupos}
                                    className="w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] disabled:opacity-40"
                                >
                                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                        <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-[32px]">
                    {/* Cabeçalho de Detalhes / Breadcrumb */}
                    <div className="flex items-center gap-[12px]">
                        <button
                            onClick={() => setEquipmentSubView('lista')}
                            className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans']">{selectedEquipmentGroup}</span>
                    </div>

                    {/* Barra de Filtro */}
                    <div className="flex items-center gap-[20px] w-full">
                        <div className="flex-1 h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-[10px] flex-1">
                                <div className="w-[24px] h-[24px] flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="11" cy="11" r="7" stroke="#CCCCCC" strokeWidth="2" />
                                        <path d="M20 20L16 16" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={hook.busca}
                                    onChange={(e) => hook.setBusca(e.target.value)}
                                    placeholder="Filtrar por alguma informação do equipamento"
                                    className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#848484]"
                                />
                            </div>
                            <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <button
                            onClick={() => {
                                setEquipamentoParaEditar(null);
                                setShowAddEquipmentModal(true);
                            }}
                            className="h-[56px] px-[24px] bg-[#F78800] rounded-[4px] text-white text-[16px] font-medium font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors shadow-sm">
                            Adicionar Equipamento
                        </button>
                    </div>

                    {/* Contagem de resultados e Limpar Filtros */}
                    {hook.busca && (
                        <div className="flex items-center gap-[8px] -mt-[12px]">
                            <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                                {hook.totalItensEquipamentos} {hook.totalItensEquipamentos === 1 ? 'equipamento encontrado' : 'equipamentos encontrados'}
                            </span>
                            <button
                                onClick={() => hook.limparFiltros()}
                                className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}

                    {/* Tabela de Equipamentos */}
                    <div className="flex flex-col gap-[16px] w-full">
                        {/* Cabeçalho */}
                        <div className="px-[20px] flex items-center justify-between w-full">
                            <div className="w-[380px] text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Nome</div>
                            <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans'] text-left">Marca</div>
                            <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Cadastrado Em</div>
                            <div className="w-[120px] text-center text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Ações</div>
                        </div>

                        {/* Linhas */}
                        <div className="flex flex-col gap-[12px] w-full">
                            {hook.equipamentos.length === 0 ? (
                                <div className="py-[48px] flex flex-col items-center gap-[12px]">
                                    <span className="text-[#3B4141] text-[18px] font-medium font-['DM_Sans']">Nenhum equipamento encontrado</span>
                                </div>
                            ) : (
                                hook.equipamentos.map((row, index) => {
                                    const isExcluindo = confirmarExclusao === row.id;
                                    return (
                                        <div
                                            key={index}
                                            className={`px-[20px] py-[16px] bg-white rounded-[4px] border border-offset-[-1px] flex items-center justify-between min-h-[56px] transition-all ${isExcluindo ? 'border-red-300 bg-red-50 shadow-sm' : 'border-[#F0F0F0] hover:shadow-sm'}`}
                                        >
                                            <div className="w-[380px] text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.nome}</div>
                                            <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans'] text-left">{row.marca}</div>
                                            <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.dataCadastro}</div>
                                            <div className="w-[124px] flex justify-center items-center gap-[12px]">
                                                {!isExcluindo && (
                                                    <>
                                                        <div
                                                            onClick={(e) => { e.stopPropagation(); setEquipamentoParaEditar(row); setShowViewEquipmentModal(true); }}
                                                            className="w-[20px] h-[20px] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        </div>
                                                        <div
                                                            onClick={(e) => { e.stopPropagation(); const { id: _id, dataCadastro: _dc, ...resto } = row; hook.adicionar(resto); }}
                                                            className="w-[20px] h-[20px] flex items-center justify-center cursor-pointer hover:opacity-80">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                        <div
                                                            onClick={(e) => { e.stopPropagation(); setEquipamentoParaEditar(row); setShowEditEquipmentModal(true); }}
                                                            className="w-[20px] h-[20px] cursor-pointer hover:opacity-80 flex items-center justify-center">
                                                            <img src={IconeLapis} alt="Editar" className="w-[20px] h-[20px] object-contain" />
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex justify-center min-w-[20px]">
                                                    {isExcluindo ? (
                                                        <div className="flex items-center gap-[8px]">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); hook.excluir(row.id); setConfirmarExclusao(null); }}
                                                                className="text-red-500 text-[13px] font-bold font-['DM_Sans'] hover:opacity-70"
                                                            >
                                                                Confirmar
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setConfirmarExclusao(null); }}
                                                                className="text-[#898D8D] text-[15px] font-bold font-['DM_Sans'] hover:opacity-70 px-1"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={(e) => { e.stopPropagation(); setConfirmarExclusao(row.id); }}
                                                            className="w-[20px] h-[20px] cursor-pointer hover:opacity-80 flex items-center justify-center">
                                                            <img src={ExcluirIcon} alt="Excluir" className="w-[20px] h-[20px] object-contain" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Paginação */}
                    <div className="mt-[24px] py-[24px] border-t border-[#E1E1E1] flex items-center justify-between w-full">
                        <div className="flex items-center gap-[16px]">
                            <div className="relative" ref={perPageRef}>
                                <div
                                    onClick={() => setShowPerPage(!showPerPage)}
                                    className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                                >
                                    <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">{hook.itensPorPagina}</span>
                                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                        <path d="M1 1L6 6L11 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                            <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans']">Equipamentos por página</span>
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
                                disabled={hook.paginaAtual === hook.totalPaginasEquipamentos}
                                className="w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] disabled:opacity-40"
                            >
                                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
