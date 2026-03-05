import { useState, useRef, useEffect } from 'react';
import { MiniCal } from '../../../Shared/Calendar/MiniCal';
import type { cadastroInspecoesData } from '../../../../hooks/cadastroInspecoesData';

type InspecoesHook = ReturnType<typeof cadastroInspecoesData>;

interface InspecoesProps {
    view: string;
    setView: (view: any) => void;
    selectedInspecao: { id: number; name: string } | null;
    setSelectedInspecao: (inspecao: { id: number; name: string } | null) => void;
    inspecoesHook: InspecoesHook;
    setShowAddInspecaoModal: (show: boolean) => void;
    setShowImportModal: (show: boolean) => void;
    setShowAddProcedimentoModal: (show: boolean) => void;
    setShowEditProcedureModal: (show: boolean) => void;
    setProcedimentoParaEditar: (proc: any) => void;
    setInspecaoParaEditar: (inspecao: any) => void;
    PesquisarIcon: string;
    AgendaIcon: string;
    ExcluirCadastroIcon: string;
    EditarCadastroIcon: string;
}

const PAGINAS_VISIVEIS = 5;

export const Inspecoes: React.FC<InspecoesProps> = ({
    view,
    setView,
    selectedInspecao,
    setSelectedInspecao,
    inspecoesHook: hook,
    setShowAddInspecaoModal,
    setShowImportModal,
    setShowAddProcedimentoModal,
    setShowEditProcedureModal,
    setProcedimentoParaEditar,
    setInspecaoParaEditar,
    PesquisarIcon,
    AgendaIcon,
    ExcluirCadastroIcon,
    EditarCadastroIcon,
}) => {
    const [showCalDe, setShowCalDe] = useState(false);
    const [showCalAte, setShowCalAte] = useState(false);
    const [dataDe, setDataDe] = useState<Date | null>(null);
    const [dataAte, setDataAte] = useState<Date | null>(null);
    const [showPerPage, setShowPerPage] = useState(false);
    const [confirmarExclusao, setConfirmarExclusao] = useState<number | null>(null);
    const [confirmarExclusaoProc, setConfirmarExclusaoProc] = useState<number | null>(null);
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

    const fmtLabel = (d: Date | null, fallback: string) =>
        d ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` : fallback;

    const paginasVisiveis = () => {
        const total = hook.totalPaginas;
        const atual = hook.paginaAtual;
        const inicio = Math.max(1, atual - Math.floor(PAGINAS_VISIVEIS / 2));
        const fim = Math.min(total, inicio + PAGINAS_VISIVEIS - 1);
        return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
    };

    const handleConfirmarExclusao = (id: number) => {
        if (confirmarExclusao === id) {
            hook.excluir(id);
            setConfirmarExclusao(null);
        } else {
            setConfirmarExclusao(id);
        }
    };

    const handleConfirmarExclusaoProc = (id: number) => {
        if (confirmarExclusaoProc === id) {
            if (selectedInspecao) {
                hook.excluirProcedimento(selectedInspecao.id, id);
            }
            setConfirmarExclusaoProc(null);
        } else {
            setConfirmarExclusaoProc(id);
        }
    };

    const handleLimparFiltros = () => {
        setDataDe(null);
        setDataAte(null);
        hook.limparFiltros();
    };

    const handleLimparFiltrosProc = () => {
        setDataDe(null);
        setDataAte(null);
        hook.limparFiltrosProc();
    };

    const procedimentosFiltrados = selectedInspecao ? hook.getProcedimentosFiltrados(selectedInspecao.id) : [];
    const totalPaginasProc = Math.max(1, Math.ceil(procedimentosFiltrados.length / hook.itensPorPaginaProc));
    const paginaProc = Math.min(hook.paginaAtualProc, totalPaginasProc);
    const procedimentosPagina = procedimentosFiltrados.slice(
        (paginaProc - 1) * hook.itensPorPaginaProc,
        paginaProc * hook.itensPorPaginaProc
    );

    if (view === 'inspecoes') {
        return (
            <div className="flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
                {/* Filtros */}
                <div className="flex items-center justify-between gap-[20px] w-full">
                    <button
                        onClick={() => setShowAddInspecaoModal(true)}
                        className="h-[56px] px-[24px] border border-[#F78800] rounded-[4px] flex items-center justify-center text-[#F78800] text-[16px] font-medium font-['DM_Sans'] shadow-sm hover:bg-orange-50 transition-colors shrink-0"
                    >
                        Adicionar Inspeção
                    </button>

                    {/* Barra de Pesquisa */}
                    <div className="flex-1 h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[12px]">
                        <div className="w-[24px] h-[24px] flex items-center justify-center">
                            <img src={PesquisarIcon} alt="Pesquisar" className="w-[24px] h-[24px] object-contain opacity-50" />
                        </div>
                        <input
                            type="text"
                            value={hook.busca}
                            onChange={(e) => hook.setBusca(e.target.value as string)}
                            placeholder="Filtrar Inspeções"
                            className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Inter'] placeholder:text-[#414F5D]"
                        />
                        {hook.busca && (
                            <button onClick={() => hook.setBusca('')} className="text-[#AAAAAA] hover:text-[#3B4141] text-[18px] leading-none transition-colors">×</button>
                        )}
                    </div>

                    {/* Filtros de Data */}
                    <div className="flex items-center gap-[20px]">
                        <div className="relative">
                            <div onClick={() => { setShowCalDe((v: boolean) => !v); setShowCalAte(false); }} className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center gap-[12px]">
                                    <img src={AgendaIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                                    <span className="text-[#414F5D] text-[16px] font-normal font-['Inter']">{fmtLabel(dataDe, 'De')}</span>
                                </div>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#414F5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            {showCalDe && <MiniCal value={dataDe ? new Date(dataDe) : null} onSelect={(d: Date) => { setDataDe(d); hook.setFiltroDataDe(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`); setShowCalDe(false); }} onClose={() => setShowCalDe(false)} />}
                        </div>

                        <div className="relative">
                            <div onClick={() => { setShowCalAte((v: boolean) => !v); setShowCalDe(false); }} className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all">
                                <div className="flex items-center gap-[12px]">
                                    <img src={AgendaIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                                    <span className="text-[#414F5D] text-[16px] font-normal font-['Inter']">{fmtLabel(dataAte, 'Até')}</span>
                                </div>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#414F5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            {showCalAte && <MiniCal value={dataAte ? new Date(dataAte) : null} onSelect={(d: Date) => { setDataAte(d); hook.setFiltroDataAte(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`); setShowCalAte(false); }} onClose={() => setShowCalAte(false)} />}
                        </div>
                    </div>

                    <button
                        onClick={hook.consultar}
                        className="h-[56px] px-[24px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-medium font-['Inter'] shadow-sm hover:bg-[#E57600] transition-colors shrink-0"
                    >
                        Consultar
                    </button>
                </div>

                {/* Contagem de resultados e Limpar Filtros */}
                {(hook.busca || hook.filtroDataDe || hook.filtroDataAte) && (
                    <div className="flex items-center gap-[8px] -mt-[12px]">
                        <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                            {hook.totalItens} {hook.totalItens === 1 ? 'inspeção encontrada' : 'inspeções encontradas'}
                        </span>
                        <button
                            onClick={handleLimparFiltros}
                            className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}

                {/* Tabela de Inspeções */}
                <div className="flex flex-col gap-[32px] w-full flex-1">
                    <div className="flex flex-col w-full">
                        {/* Cabeçalho */}
                        <div className="px-[20px] py-[12px] flex items-center w-full">
                            <div className="w-[40px] flex items-center justify-center relative">
                                <div
                                    onClick={hook.toggleAll}
                                    className={`w-[18px] h-[18px] border-[1.5px] ${hook.allSelected ? 'border-[#F78800] bg-[#F78800]' : 'border-[#D1D5DB] bg-white'} rounded-[4px] cursor-pointer flex items-center justify-center transition-colors`}
                                >
                                    {hook.allSelected && (
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                {hook.allSelected && hook.selectedIds.size > 0 && (
                                    <div
                                        onClick={hook.excluirSelecionados}
                                        className="absolute top-[30px] left-[0px] bg-white shadow-lg rounded-[4px] p-[10px] flex items-center gap-[8px] z-20 border border-[#F0F0F0] min-w-[140px] cursor-pointer hover:bg-red-50 transition-colors animate-in fade-in zoom-in-95 duration-200"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 6H5H21" stroke="#E63939" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6H19Z" stroke="#E63939" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="text-[#E63939] text-[14px] font-bold font-['DM_Sans'] whitespace-nowrap">Excluir grupo</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-[360px] text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Nome</div>
                            <div className="flex-1 text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Atualizado em</div>
                            <div className="flex-1 text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Próxima Vistoria</div>
                            <div className="flex-1 text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Avisar a partir de</div>
                            <div className="flex-1 text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Periodicidade</div>
                            <div className="w-[120px] text-center text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Ações</div>
                        </div>

                        {/* Linhas */}
                        <div className="flex flex-col gap-[12px] w-full">
                            {hook.loading ? (
                                [0, 1, 2, 3, 4].map((i) => (
                                    <div key={i} className="px-[20px] py-[16px] rounded-[4px] border border-[#E5E7EB] flex items-center bg-white animate-pulse gap-[12px]">
                                        <div className="w-[40px] h-[18px] bg-gray-100 rounded" />
                                        <div className="w-[360px] h-[16px] bg-gray-100 rounded" />
                                        <div className="flex-1 h-[16px] bg-gray-100 rounded" />
                                        <div className="flex-1 h-[16px] bg-gray-100 rounded" />
                                        <div className="flex-1 h-[16px] bg-gray-100 rounded" />
                                        <div className="flex-1 h-[16px] bg-gray-100 rounded" />
                                        <div className="w-[120px] h-[16px] bg-gray-100 rounded" />
                                    </div>
                                ))
                            ) : hook.itensPagina.length === 0 ? (
                                <div className="py-[48px] flex flex-col items-center gap-[12px]">
                                    <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans']">Nenhuma inspeção encontrada</span>
                                    <span className="text-[#AAAAAA] text-[16px] font-['DM_Sans']">Tente ajustar os filtros.</span>
                                </div>
                            ) : (
                                hook.itensPagina.map((row) => {
                                    const selecionado = hook.selectedIds.has(row.id);
                                    return (
                                        <div
                                            key={row.id}
                                            className={`px-[20px] py-[16px] rounded-[4px] border border-offset-[-1px] flex items-center bg-white transition-all ${confirmarExclusao === row.id ? 'border-red-300 bg-red-50 shadow-sm' : 'border-[#E5E7EB] hover:bg-gray-50'}`}
                                        >
                                            <div className="w-[40px] flex items-center justify-center">
                                                <div
                                                    onClick={() => hook.toggleOne(row.id)}
                                                    className={`w-[18px] h-[18px] border-[1.5px] ${selecionado ? 'border-[#F78800] bg-[#F78800]' : 'border-[#D1D5DB] bg-white'} rounded-[4px] cursor-pointer flex items-center justify-center transition-colors hover:border-[#F78800]`}
                                                >
                                                    {selecionado && (
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="w-[360px] text-[#3B4141] text-[14px] font-normal font-['Inter']">{row.name}</div>
                                            <div className="flex-1 text-[#3B4141] text-[14px] font-normal font-['Inter']">{row.updated}</div>
                                            <div className="flex-1 text-[#3B4141] text-[14px] font-normal font-['Inter']">{row.next}</div>
                                            <div className="flex-1 text-[#3B4141] text-[14px] font-normal font-['Inter']">{row.warn}</div>
                                            <div className="flex-1 text-[#3B4141] text-[14px] font-normal font-['Inter']">{row.periodicity}</div>
                                            <div className="w-[120px] flex justify-center items-center gap-[12px]">
                                                {/* Ver detalhe */}
                                                <div
                                                    onClick={() => { setSelectedInspecao({ id: row.id, name: row.name }); setView('inspecoes_detalhe'); }}
                                                    className="w-[20px] h-[20px] flex items-center justify-center cursor-pointer hover:opacity-80"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <circle cx="12" cy="12" r="3" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                {/* Duplicar */}
                                                <div
                                                    onClick={() => { const { id: _id, ...rest } = row; hook.adicionarInspecao(rest); }}
                                                    className="w-[20px] h-[20px] flex items-center justify-center cursor-pointer hover:opacity-80"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                {/* Editar */}
                                                <div
                                                    onClick={() => {
                                                        setInspecaoParaEditar(row);
                                                        setShowAddInspecaoModal(true);
                                                    }}
                                                    className="w-[20px] h-[20px] cursor-pointer hover:opacity-80 flex items-center justify-center"
                                                >
                                                    <img src={EditarCadastroIcon} alt="Editar" className="w-full h-full object-contain" />
                                                </div>
                                                <div className={`${confirmarExclusao === row.id ? 'w-[110px]' : 'w-[20px]'} flex justify-center`}>
                                                    {confirmarExclusao === row.id ? (
                                                        <div className="flex items-center gap-[4px] pr-[8px]">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleConfirmarExclusao(row.id); }}
                                                                className="text-red-500 text-[13px] font-bold font-['DM_Sans'] hover:opacity-70 whitespace-nowrap"
                                                            >
                                                                Confirmar
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setConfirmarExclusao(null); }}
                                                                className="text-[#848484] text-[18px] leading-none font-medium hover:opacity-70 w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
                                                                title="Cancelar"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={(e) => { e.stopPropagation(); setConfirmarExclusao(row.id); }}
                                                            className="w-[20px] h-[20px] cursor-pointer hover:opacity-80 flex items-center justify-center"
                                                        >
                                                            <img src={ExcluirCadastroIcon} alt="Excluir" className="w-full h-full object-contain" />
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
                    <div className="pt-[24px] pb-[32px] border-t border-[#E1E1E1] flex justify-between items-center w-full">
                        <div className="flex items-center gap-[16px]">
                            <div className="relative" ref={perPageRef}>
                                <div
                                    onClick={() => setShowPerPage(!showPerPage)}
                                    className="h-[32px] px-[12px] bg-[#EEF0FA] rounded-[6px] flex justify-center items-center gap-[8px] cursor-pointer"
                                >
                                    <span className="text-[#3B4141] text-[14px] font-normal font-['Inter']">{hook.itensPorPagina}</span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                        <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {showPerPage && (
                                    <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-20">
                                        {[5, 10, 20, 50].map(n => (
                                            <div
                                                key={n}
                                                onClick={() => { hook.setItensPorPagina(n); hook.setPaginaAtual(1); setShowPerPage(false); }}
                                                className="px-[12px] py-[6px] text-center hover:bg-orange-50 cursor-pointer text-[14px] font-['Inter'] text-[#3B4141]"
                                            >
                                                {n}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="text-[#F78800] text-[14px] font-normal font-['Inter']">Relatórios por página</span>
                        </div>

                        {hook.totalPaginas > 1 && (
                            <div className="flex items-center gap-[6px]">
                                <button
                                    onClick={() => hook.setPaginaAtual(Math.max(1, hook.paginaAtual - 1))}
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
                                        onClick={() => hook.setPaginaAtual(pg)}
                                        className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border text-[14px] font-['Inter'] transition-colors ${pg === hook.paginaAtual ? 'border-[#F78800] text-[#F78800] font-semibold' : 'border-[#E5E7EB] text-[#3B4141] hover:bg-gray-50 cursor-pointer'}`}
                                    >
                                        {pg}
                                    </button>
                                ))}
                                <button
                                    onClick={() => hook.setPaginaAtual(Math.min(hook.totalPaginas, hook.paginaAtual + 1))}
                                    disabled={hook.paginaAtual === hook.totalPaginas}
                                    className="w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] disabled:opacity-40"
                                >
                                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                        <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {hook.totalPaginas <= 1 && (
                            <div className="flex items-center gap-[6px]">
                                <div className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-[4px]">
                                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div className="w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border border-[#F78800] bg-white text-[#F78800] font-semibold text-[14px]">1</div>
                                <div className="w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600]">
                                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setShowImportModal(true)}
                    className="w-full h-[60px] bg-[#F78800] flex justify-center items-center gap-[10px] hover:bg-[#E57600] transition-colors mt-auto"
                >
                    <span className="text-white text-[18px] font-bold font-['DM_Sans']">Importar Formulários</span>
                </button>
            </div>
        );
    }

    if (view === 'inspecoes_detalhe') {
        return (
            <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 w-full min-h-screen bg-white">
                <div className="pt-[32px] pb-[32px] flex items-center justify-between gap-[20px] w-full mt-[20px]">
                    <div className="flex-1 h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[12px]">
                        <img src={PesquisarIcon} alt="Pesquisar" className="w-[24px] h-[24px] object-contain opacity-50" />
                        <input
                            type="text"
                            value={hook.buscaProc}
                            onChange={(e) => hook.setBuscaProc(e.target.value as string)}
                            placeholder="Filtrar Procedimentos"
                            className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Inter']"
                        />
                    </div>

                    <div className="flex items-center gap-[20px]">
                        <div className="relative">
                            <div onClick={() => { setShowCalDe((v: boolean) => !v); setShowCalAte(false); }} className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center gap-[12px]">
                                    <img src={AgendaIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                                    <span className="text-[#414F5D] text-[16px] font-normal font-['Inter']">{fmtLabel(dataDe, 'De')}</span>
                                </div>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#414F5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            {showCalDe && <MiniCal value={dataDe} onSelect={(d: Date) => {
                                setDataDe(d);
                                hook.setDataDeProc(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                                setShowCalDe(false);
                            }} onClose={() => setShowCalDe(false)} />}
                        </div>

                        <div className="relative">
                            <div onClick={() => { setShowCalAte((v: boolean) => !v); setShowCalDe(false); }} className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center gap-[12px]">
                                    <img src={AgendaIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                                    <span className="text-[#414F5D] text-[16px] font-normal font-['Inter']">{fmtLabel(dataAte, 'Até')}</span>
                                </div>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#414F5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                            {showCalAte && <MiniCal value={dataAte} onSelect={(d: Date) => {
                                setDataAte(d);
                                hook.setDataAteProc(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                                setShowCalAte(false);
                            }} onClose={() => setShowCalAte(false)} />}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowAddProcedimentoModal(true)}
                        className="h-[56px] px-[24px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-medium font-['Inter'] shadow-sm hover:bg-[#E57600] transition-colors shrink-0"
                    >
                        Adicionar Procedimento
                    </button>
                </div>

                {/* Contagem de resultados e Limpar Filtros Detalhe */}
                {(hook.buscaProc || hook.dataDeProc || hook.dataAteProc) && (
                    <div className="flex items-center gap-[8px] -mt-[12px] mb-[20px]">
                        <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                            {procedimentosFiltrados.length} {procedimentosFiltrados.length === 1 ? 'procedimento encontrado' : 'procedimentos encontrados'}
                        </span>
                        <button
                            onClick={handleLimparFiltrosProc}
                            className="text-[#F78800] text-[14px] font-medium font-['DM_Sans'] hover:underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-[32px] w-full flex-1">
                    <div className="flex flex-col w-full">
                        <div className="px-[20px] py-[12px] flex items-center w-full bg-white border-b border-[#F0F0F0]">
                            <div className="w-[40px] flex items-center justify-center">
                                <div className="w-[18px] h-[18px] border-[1.5px] border-[#D1D5DB] bg-white rounded-[4px] cursor-pointer" />
                            </div>
                            <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Nome</div>
                            <div className="w-[200px] text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Atualizado em</div>
                            <div className="w-[120px] text-center text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Ações</div>
                        </div>

                        <div className="flex flex-col w-full">
                            {procedimentosPagina.length === 0 ? (
                                <div className="py-[32px] flex justify-center">
                                    <span className="text-[#AAAAAA] text-[16px] font-['DM_Sans']">
                                        {hook.buscaProc ? 'Nenhum procedimento encontrado.' : 'Nenhum procedimento cadastrado para esta inspeção.'}
                                    </span>
                                </div>
                            ) : (
                                procedimentosPagina.map((proc) => {
                                    const isExcluindo = confirmarExclusaoProc === proc.id;
                                    return (
                                        <div
                                            key={proc.id}
                                            className={`px-[20px] py-[16px] border-b border-[#F0F0F0] flex items-center w-full transition-all ${isExcluindo ? 'border-red-300 bg-red-50 shadow-sm' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className="w-[40px] flex items-center justify-center">
                                                <div className="w-[18px] h-[18px] border-[1.5px] border-[#D1D5DB] bg-white rounded-[4px] cursor-pointer" />
                                            </div>
                                            <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['DM_Sans']">{proc.name}</div>
                                            <div className="w-[200px] text-[#3B4141] text-[16px] font-normal font-['DM_Sans']">{proc.updated}</div>
                                            <div className="w-[120px] flex justify-center items-center gap-[16px]">
                                                {/* Editar */}
                                                {!isExcluindo && (
                                                    <div
                                                        className="w-[20px] h-[20px] cursor-pointer hover:opacity-80 flex items-center justify-center"
                                                        onClick={() => {
                                                            setProcedimentoParaEditar(proc);
                                                            setShowEditProcedureModal(true);
                                                        }}
                                                    >
                                                        <img src={EditarCadastroIcon} alt="Editar" className="w-full h-full object-contain" />
                                                    </div>
                                                )}
                                                {/* Excluir */}
                                                <div className={`${isExcluindo ? 'w-[80px]' : 'w-[20px]'} flex justify-center`}>
                                                    {isExcluindo ? (
                                                        <div className="flex items-center gap-[8px]">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleConfirmarExclusaoProc(proc.id); }}
                                                                className="text-red-500 text-[13px] font-bold font-['DM_Sans'] hover:opacity-70"
                                                            >
                                                                Confirmar
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setConfirmarExclusaoProc(null); }}
                                                                className="text-[#898D8D] text-[15px] font-bold font-['DM_Sans'] hover:opacity-70 px-1"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="w-[20px] h-[20px] cursor-pointer hover:opacity-80 flex items-center justify-center"
                                                            onClick={(e) => { e.stopPropagation(); setConfirmarExclusaoProc(proc.id); }}
                                                        >
                                                            <img src={ExcluirCadastroIcon} alt="Excluir" className="w-full h-full object-contain" />
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

                    <div className="pt-[24px] pb-[32px] border-t border-[#E1E1E1] flex justify-between items-center w-full mt-auto">
                        <div className="flex items-center gap-[16px]">
                            <div className="relative" ref={perPageRef}>
                                <div
                                    onClick={() => setShowPerPage(!showPerPage)}
                                    className="h-[32px] px-[12px] bg-[#EEF0FA] rounded-[6px] flex justify-center items-center gap-[8px] cursor-pointer"
                                >
                                    <span className="text-[#3B4141] text-[14px] font-normal font-['Inter']">{hook.itensPorPagina}</span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                        <path d="M1 1L5 5L9 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {showPerPage && (
                                    <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-20">
                                        {[5, 10, 20, 50].map(n => (
                                            <div
                                                key={n}
                                                onClick={() => { hook.setItensPorPaginaProc(n); hook.setPaginaAtualProc(1); setShowPerPage(false); }}
                                                className="px-[12px] py-[6px] text-center hover:bg-orange-50 cursor-pointer text-[14px] font-['Inter'] text-[#3B4141]"
                                            >
                                                {n}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="text-[#F78800] text-[14px] font-normal font-['Inter']">Procedimentos por página</span>
                        </div>
                        <div className="flex items-center gap-[6px]">
                            <div className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-[4px]">
                                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" onClick={() => hook.setPaginaAtualProc(p => Math.max(1, p - 1))}>
                                    <path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {Array.from({ length: totalPaginasProc }, (_, i) => i + 1).map(pg => (
                                <div
                                    key={pg}
                                    onClick={() => hook.setPaginaAtualProc(pg)}
                                    className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border text-[14px] cursor-pointer ${pg === paginaProc
                                        ? 'border-[#F78800] bg-white text-[#F78800] font-semibold'
                                        : 'border-[#E1E1E1] text-[#3B4141] hover:bg-gray-50'
                                        }`}
                                >
                                    {pg}
                                </div>
                            ))}
                            <div className="w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600]">
                                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" onClick={() => hook.setPaginaAtualProc(p => Math.min(totalPaginasProc, p + 1))}>
                                    <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
