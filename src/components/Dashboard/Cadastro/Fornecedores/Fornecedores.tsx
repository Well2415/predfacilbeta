import React, { useState, useRef, useEffect } from 'react';
import type { useCadastroFornecedoresData } from '../../../../hooks/cadastroFornecedoresData';

interface FornecedoresProps {
    hook: ReturnType<typeof useCadastroFornecedoresData>;
    setShowAddSupplierModal: (show: boolean) => void;
    setFornecedorParaEditar: (fornecedor: any) => void;
    PesquisarIcon: string;
}

const CATEGORIAS = [
    "Dedetizadora / Limpa Fossa",
    "Contabilidade",
    "Diversos",
    "Bombas",
    "Arquitetura"
];

export const Fornecedores: React.FC<FornecedoresProps> = ({
    hook,
    setShowAddSupplierModal,
    setFornecedorParaEditar,
    PesquisarIcon,
}) => {
    const [showCategorias, setShowCategorias] = useState(false);
    const [showPerPage, setShowPerPage] = useState(false);
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

    const paginasVisiveis = () => {
        const total = hook.totalPaginas;
        const atual = hook.paginaAtual;
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

        if (atual <= 4) return [1, 2, 3, 4, 5, '...', total];
        if (atual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        return [1, '...', atual - 1, atual, atual + 1, '...', total];
    };

    const handleLimparFiltros = () => {
        hook.limparFiltros();
    };

    return (
        <div className="flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
            {/* Filtros */}
            <div className="flex items-center justify-between gap-[20px] w-full">
                <button
                    onClick={() => {
                        setFornecedorParaEditar(null);
                        setShowAddSupplierModal(true);
                    }}
                    className="h-[56px] px-[24px] border border-[#F78800] rounded-[4px] flex items-center justify-center text-[#F78800] text-[16px] font-medium font-['DM_Sans'] shadow-sm hover:bg-orange-50 transition-colors shrink-0"
                >
                    Adicionar Fornecedor
                </button>

                {/* Barra de Pesquisa */}
                <div className="flex-1 h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[12px]">
                    <div className="w-[24px] h-[24px] flex items-center justify-center">
                        <img src={PesquisarIcon} alt="Pesquisar" className="w-[24px] h-[24px] object-contain opacity-50" />
                    </div>
                    <input
                        type="text"
                        value={hook.busca}
                        onChange={(e) => hook.setBusca(e.target.value)}
                        placeholder="Filtrar Fornecedores"
                        className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Inter'] placeholder:text-[#414F5D]"
                    />
                    {hook.busca && (
                        <button onClick={() => hook.setBusca('')} className="text-[#AAAAAA] hover:text-[#3B4141] text-[18px] leading-none transition-colors">×</button>
                    )}
                </div>

                {/* Filtro Categoria */}
                <div className="relative">
                    <div
                        onClick={() => setShowCategorias(!showCategorias)}
                        className="w-[240px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-[12px]">
                            <span className="text-[#414F5D] text-[16px] font-normal font-['Inter'] truncate">
                                {hook.categoria || 'Categoria'}
                            </span>
                        </div>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform duration-200 ${showCategorias ? 'rotate-180' : ''}`}>
                            <path d="M1 1L5 5L9 1" stroke="#414F5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {showCategorias && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowCategorias(false)} />
                            <div className="absolute top-[60px] left-0 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                <div
                                    onClick={() => { hook.setCategoria(''); setShowCategorias(false); }}
                                    className="px-[16px] py-[12px] text-[#404040] hover:bg-orange-50 cursor-pointer transition-colors border-b border-[#F0F0F0]"
                                >
                                    Todas as categorias
                                </div>
                                {CATEGORIAS.map(cat => (
                                    <div
                                        key={cat}
                                        onClick={() => { hook.setCategoria(cat); setShowCategorias(false); }}
                                        className="px-[16px] py-[12px] text-[#404040] hover:bg-orange-50 cursor-pointer transition-colors border-b border-[#F0F0F0] last:border-0"
                                    >
                                        {cat}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <button
                    onClick={hook.consultar}
                    className="h-[56px] px-[24px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-medium font-['Inter'] shadow-sm hover:bg-[#E57600] transition-colors shrink-0"
                >
                    Consultar
                </button>
            </div>

            {/* Contagem de resultados e Limpar Filtros */}
            {(hook.busca || hook.categoria) && (
                <div className="flex items-center gap-[8px] -mt-[12px]">
                    <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                        {hook.totalItens} {hook.totalItens === 1 ? 'fornecedor encontrado' : 'fornecedores encontrados'}
                    </span>
                    <button
                        onClick={handleLimparFiltros}
                        className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}

            {/* Tabela de Fornecedores */}
            <div className="flex flex-col gap-[32px] w-full flex-1">
                <div className="flex flex-col w-full">
                    {/* Cabeçalho */}
                    <div className="px-[20px] py-[12px] flex items-center w-full">
                        <div className="w-[300px] text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Nome/Empresa</div>
                        <div className="flex-1 text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Endereço</div>
                        <div className="w-[150px] text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Categoria</div>
                        <div className="w-[140px] text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] text-center">Pontuação</div>
                        <div className="w-[120px] text-center text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Ações</div>
                    </div>

                    {/* Linhas */}
                    <div className="flex flex-col gap-[12px] w-full">
                        {hook.loading ? (
                            [0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className="px-[20px] py-[16px] rounded-[4px] border border-[#E5E7EB] flex items-center bg-white animate-pulse">
                                    <div className="w-[300px] h-[16px] bg-gray-100 rounded" />
                                    <div className="flex-1 h-[16px] bg-gray-100 rounded" />
                                    <div className="w-[150px] h-[16px] bg-gray-100 rounded" />
                                    <div className="w-[140px] h-[16px] bg-gray-100 rounded" />
                                    <div className="w-[120px] h-[16px] bg-gray-100 rounded" />
                                </div>
                            ))
                        ) : hook.todos.length === 0 ? (
                            <div className="py-[48px] flex flex-col items-center gap-[12px]">
                                <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans']">Nenhum fornecedor encontrado</span>
                                <span className="text-[#AAAAAA] text-[16px] font-['DM_Sans']">Tente ajustar os filtros.</span>
                            </div>
                        ) : (
                            hook.todos.map((f) => (
                                <div key={f.id} className="px-[20px] py-[16px] rounded-[4px] border border-[#E5E7EB] flex items-center bg-white hover:bg-gray-50 transition-colors">
                                    <div className="w-[300px] flex flex-col">
                                        <span className="text-[#3B4141] text-[14px] font-normal font-['Inter']">{f.name}</span>
                                        <span className="text-[#89898D] text-[12px] font-['Inter']">{f.cnpj || f.cpf}</span>
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <span className="text-[#3B4141] text-[14px] font-normal font-['Inter']">{f.address}</span>
                                        <span className="text-[#89898D] text-[12px] font-['Inter']">{f.city} – {f.state}</span>
                                    </div>
                                    <div className="w-[150px] text-[#3B4141] text-[14px] font-normal font-['Inter']">{f.category}</div>
                                    <div className="w-[140px] flex justify-center">
                                        <div className="px-[8px] py-[4px] bg-orange-50 text-[#F78800] rounded-full text-[13px] font-medium border border-[#F78800]/20 font-['Inter']">
                                            {f.rating.toFixed(1)}/5.0
                                        </div>
                                    </div>
                                    <div className="w-[120px] flex justify-center items-center">
                                        {/* Ver detalhe */}
                                        <div
                                            onClick={() => {
                                                setFornecedorParaEditar(f);
                                                setShowAddSupplierModal(true);
                                            }}
                                            className="w-[20px] h-[20px] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                            title="Ver detalhes"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

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
                        <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans']">Fornecedores por página</span>
                    </div>

                    <div className="flex items-center gap-[6px]">
                        <button
                            disabled={hook.paginaAtual === 1}
                            onClick={() => hook.setPaginaAtual(h => Math.max(1, h - 1))}
                            className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-[4px] disabled:opacity-40"
                        >
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                <path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {paginasVisiveis().map((pg, idx) => (
                            pg === '...' ? (
                                <span key={`dots-${idx}`} className="w-[32px] h-[32px] flex justify-center items-center text-[#3B4141]">...</span>
                            ) : (
                                <button
                                    key={pg}
                                    onClick={() => hook.setPaginaAtual(Number(pg))}
                                    className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border ${pg === hook.paginaAtual ? 'border-[#F78800] bg-white text-[#F78800] font-semibold' : 'border-[#E5E7EB] bg-white text-[#3B4141] hover:bg-gray-50'} text-[14px] font-medium font-['Inter'] transition-colors`}
                                >
                                    {pg}
                                </button>
                            )
                        ))}

                        <button
                            disabled={hook.paginaAtual === hook.totalPaginas}
                            onClick={() => hook.setPaginaAtual(h => Math.min(hook.totalPaginas, h + 1))}
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
