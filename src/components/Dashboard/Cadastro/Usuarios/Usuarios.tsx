import React, { useState, useRef, useEffect } from 'react';
import { usuariosData, Usuario } from '../../../../hooks/cadastroUsuariosData';

interface UsuariosProps {
    setShowAddUserModal: (show: boolean) => void;
    PesquisarIcon: string;
    SetaCimaBaixoIcon: string;
    ExcluirCadastroIcon: string;
    EditarCadastroIcon: string;
}

const PAGINAS_VISIVEIS = 5;

export const Usuarios: React.FC<UsuariosProps> = ({
    setShowAddUserModal,
    PesquisarIcon,
    SetaCimaBaixoIcon,
    ExcluirCadastroIcon,
    EditarCadastroIcon,
}) => {
    const hook = usuariosData();
    const [confirmarExclusao, setConfirmarExclusao] = useState<number | null>(null);
    const [editando, setEditando] = useState<Usuario | null>(null);
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

    const handleExcluir = (id: number) => {
        if (confirmarExclusao === id) {
            hook.excluir(id);
            setConfirmarExclusao(null);
        } else {
            setConfirmarExclusao(id);
        }
    };

    const handleSalvarEdicao = () => {
        if (editando) {
            hook.atualizar(editando);
            setEditando(null);
        }
    };

    const paginasVisiveis = () => {
        const total = hook.totalPaginas;
        const atual = hook.paginaAtual;
        const inicio = Math.max(1, atual - Math.floor(PAGINAS_VISIVEIS / 2));
        const fim = Math.min(total, inicio + PAGINAS_VISIVEIS - 1);
        return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
    };

    const OrdenacaoIcon = ({ coluna }: { coluna: 'nome' | 'tipo' }) => {
        const ativo = hook.ordemColuna === coluna;
        return (
            <img
                src={SetaCimaBaixoIcon}
                alt="Ordenar"
                className={`w-[8px] h-[13px] object-contain transition-opacity cursor-pointer ${ativo ? 'opacity-100' : 'opacity-40 hover:opacity-70'} ${ativo && hook.ordemDirecao === 'desc' ? 'rotate-180' : ''}`}
                onClick={() => hook.alternarOrdem(coluna)}
            />
        );
    };

    return (
        <div className="flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Modal de Edição Inline */}
            {editando && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setEditando(null)}>
                    <div className="bg-white rounded-[8px] p-[32px] w-[480px] flex flex-col gap-[24px] shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-[#3B4141] text-[20px] font-bold font-['DM_Sans']">Editar Usuário</h3>
                        <div className="flex flex-col gap-[16px]">
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[#3B4141] text-[14px] font-medium font-['DM_Sans']">Nome</label>
                                <input
                                    value={editando.nome}
                                    onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                                    className="h-[48px] px-[16px] border border-[#E1E1E1] rounded-[4px] text-[#3B4141] text-[16px] font-['DM_Sans'] outline-none focus:border-[#F78800]"
                                />
                            </div>
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[#3B4141] text-[14px] font-medium font-['DM_Sans']">E-mail</label>
                                <input
                                    value={editando.email}
                                    onChange={(e) => setEditando({ ...editando, email: e.target.value })}
                                    className="h-[48px] px-[16px] border border-[#E1E1E1] rounded-[4px] text-[#3B4141] text-[16px] font-['DM_Sans'] outline-none focus:border-[#F78800]"
                                />
                            </div>
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[#3B4141] text-[14px] font-medium font-['DM_Sans']">Tipo de Usuário</label>
                                <select
                                    value={editando.tipo}
                                    onChange={(e) => setEditando({ ...editando, tipo: e.target.value })}
                                    className="h-[48px] px-[16px] border border-[#E1E1E1] rounded-[4px] text-[#3B4141] text-[16px] font-['DM_Sans'] outline-none focus:border-[#F78800] bg-white"
                                >
                                    {hook.tiposDisponiveis.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-[12px] justify-end">
                            <button
                                onClick={() => setEditando(null)}
                                className="h-[48px] px-[24px] border border-[#E1E1E1] rounded-[4px] text-[#3B4141] text-[16px] font-medium font-['DM_Sans'] hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSalvarEdicao}
                                className="h-[48px] px-[24px] bg-[#F78800] rounded-[4px] text-white text-[16px] font-medium font-['DM_Sans'] hover:bg-[#E57600] transition-colors"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtro + Tipo + Botão */}
            <div className="flex items-center gap-[20px]">
                {/* Campo de busca */}
                <div className="flex-1 h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] flex items-center gap-[10px]">
                    <img src={PesquisarIcon} alt="Pesquisar" className="w-[24px] h-[24px] object-contain shrink-0" />
                    <input
                        type="text"
                        value={hook.busca}
                        onChange={(e) => hook.setBusca(e.target.value)}
                        placeholder="Filtrar usuários por nome, e-mail ou tipo..."
                        className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Inter'] placeholder:text-[#414F5D]"
                    />
                    {hook.busca && (
                        <button onClick={() => hook.setBusca('')} className="text-[#AAAAAA] hover:text-[#3B4141] text-[18px] leading-none">×</button>
                    )}
                </div>

                {/* Filtro por tipo */}
                <select
                    value={hook.filtroTipo}
                    onChange={(e) => hook.setFiltroTipo(e.target.value)}
                    className={`h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] text-[16px] font-['Inter'] outline-none cursor-pointer ${hook.filtroTipo ? 'text-[#F78800]' : 'text-[#414F5D]'}`}
                >
                    <option value="">Todos os tipos</option>
                    {hook.tiposDisponiveis.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                {/* Botão Adicionar */}
                <button
                    onClick={() => setShowAddUserModal(true)}
                    className="w-[200px] h-[56px] px-[16px] bg-[#F78800] rounded-[4px] flex justify-center items-center gap-[10px] hover:bg-[#E57600] transition-colors shrink-0"
                >
                    <div className="text-white text-[16px] font-medium font-['Funnel_Sans']">Adicionar Usuário</div>
                </button>
            </div>

            {/* Contagem de resultados */}
            {(hook.busca || hook.filtroTipo) && (
                <div className="flex items-center gap-[8px]">
                    <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                        {hook.totalItens} {hook.totalItens === 1 ? 'usuário encontrado' : 'usuários encontrados'}
                    </span>
                    <button
                        onClick={() => { hook.setBusca(''); hook.setFiltroTipo(''); }}
                        className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}

            {/* Tabela */}
            <div className="flex flex-col gap-[32px]">
                {/* Cabeçalho */}
                <div className="px-[20px] flex justify-between items-start">
                    <div
                        className="flex-1 flex items-center gap-[12px] cursor-pointer select-none"
                        onClick={() => hook.alternarOrdem('nome')}
                    >
                        <div className={`text-[18px] font-semibold font-['Funnel_Sans'] ${hook.ordemColuna === 'nome' ? 'text-[#F78800]' : 'text-[#3B4141]'}`}>Nome</div>
                        <OrdenacaoIcon coluna="nome" />
                    </div>
                    <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">E-mail</div>
                    <div
                        className="flex-1 flex items-center gap-[12px] cursor-pointer select-none"
                        onClick={() => hook.alternarOrdem('tipo')}
                    >
                        <div className={`text-[18px] font-semibold font-['Funnel_Sans'] ${hook.ordemColuna === 'tipo' ? 'text-[#F78800]' : 'text-[#3B4141]'}`}>Tipo de Usuário</div>
                        <OrdenacaoIcon coluna="tipo" />
                    </div>
                    <div className="w-[104px] text-center text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Ações</div>
                </div>

                {/* Linhas */}
                <div className="flex flex-col gap-[16px]">
                    {hook.loading ? (
                        [0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="px-[20px] py-[16px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] flex justify-between items-center animate-pulse">
                                <div className="flex-1 h-[16px] bg-gray-100 rounded mr-[20px]" />
                                <div className="flex-1 h-[16px] bg-gray-100 rounded mr-[20px]" />
                                <div className="flex-1 h-[16px] bg-gray-100 rounded mr-[20px]" />
                                <div className="w-[104px] h-[16px] bg-gray-100 rounded" />
                            </div>
                        ))
                    ) : hook.itensPagina.length === 0 ? (
                        <div className="py-[48px] flex flex-col items-center gap-[12px]">
                            <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans']">Nenhum usuário encontrado</span>
                            <span className="text-[#AAAAAA] text-[16px] font-['DM_Sans']">Tente ajustar os filtros de busca.</span>
                        </div>
                    ) : (
                        hook.itensPagina.map((user) => (
                            <div
                                key={user.id}
                                className={`px-[20px] py-[8px] bg-white rounded-[4px] outline outline-1 outline-offset-[-1px] flex justify-between items-center transition-shadow hover:shadow-sm ${confirmarExclusao === user.id ? 'outline-red-300 bg-red-50' : 'outline-[#F0F0F0]'
                                    }`}
                            >
                                <div className="flex-1 flex items-center gap-[8px]">
                                    <span className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{user.nome}</span>
                                    {!user.ativo && (
                                        <span className="px-[6px] py-[2px] bg-gray-100 text-[#898D8D] text-[11px] font-medium rounded-[4px]">Inativo</span>
                                    )}
                                </div>
                                <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{user.email}</div>
                                <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{user.tipo}</div>
                                <div className="w-[104px] flex justify-center items-center gap-[16px]">
                                    {confirmarExclusao === user.id ? (
                                        <div className="flex items-center gap-[8px]">
                                            <button
                                                onClick={() => handleExcluir(user.id)}
                                                className="text-red-500 text-[13px] font-semibold font-['DM_Sans'] hover:opacity-70"
                                            >
                                                Confirmar
                                            </button>
                                            <button
                                                onClick={() => setConfirmarExclusao(null)}
                                                className="text-[#898D8D] text-[13px] font-['DM_Sans'] hover:opacity-70"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div
                                                className="w-[20px] h-[20px] relative cursor-pointer hover:opacity-60 transition-opacity"
                                                onClick={() => setEditando({ ...user })}
                                                title="Editar usuário"
                                            >
                                                <img src={EditarCadastroIcon} alt="Editar" className="w-full h-full object-contain" />
                                            </div>
                                            <div
                                                className="w-[20px] h-[20px] relative cursor-pointer hover:opacity-60 transition-opacity"
                                                onClick={() => handleExcluir(user.id)}
                                                title="Excluir usuário"
                                            >
                                                <img src={ExcluirCadastroIcon} alt="Excluir" className="w-full h-full object-contain" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Paginação */}
                {hook.totalPaginas > 1 && (
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
                                                onClick={() => { hook.setItensPorPagina(n); hook.setPagina(1); setShowPerPage(false); }}
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

                        <div className="flex items-center gap-[6px]">
                            <button
                                onClick={() => hook.setPagina(Math.max(1, hook.paginaAtual - 1))}
                                disabled={hook.paginaAtual === 1}
                                className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-[4px] disabled:opacity-40"
                            >
                                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {paginasVisiveis().map((pg) => (
                                <button
                                    key={pg}
                                    onClick={() => hook.setPagina(pg)}
                                    className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border text-[14px] font-['Inter'] transition-colors ${pg === hook.paginaAtual
                                        ? 'border-[#F78800] text-[#F78800] font-semibold'
                                        : 'border-[#E5E7EB] text-[#3B4141] hover:bg-gray-50 cursor-pointer'
                                        }`}
                                >
                                    {pg}
                                </button>
                            ))}

                            <button
                                onClick={() => hook.setPagina(Math.min(hook.totalPaginas, hook.paginaAtual + 1))}
                                disabled={hook.paginaAtual === hook.totalPaginas}
                                className="w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] disabled:opacity-40"
                            >
                                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                    <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
