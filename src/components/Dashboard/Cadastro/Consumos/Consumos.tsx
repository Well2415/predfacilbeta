import { useState, useRef, useEffect } from 'react';
import { MiniCal } from '../../../Shared/Calendar/MiniCal';
import type { useConsumosData } from '../../../../hooks/cadastroConsumosData';

interface ConsumosProps {
    hook: ReturnType<typeof useConsumosData>;
    setShowAddConsumptionModal: (show: boolean) => void;
    setConsumoParaEditar: (consumo: any) => void;
    EnergiaIcon: string;
    AguaIcon: string;
    GasIcon: string;
    CalendarioFiltroIcon: string;
    ExcluirIcon: string;
    SetaCimaBaixoIcon: string;
    IconeLapis: string;
}

const PAGINAS_VISIVEIS = 5;

export function Consumos({
    hook,
    setShowAddConsumptionModal,
    setConsumoParaEditar,
    EnergiaIcon,
    AguaIcon,
    GasIcon,
    CalendarioFiltroIcon,
    ExcluirIcon,
    SetaCimaBaixoIcon,
    IconeLapis
}: ConsumosProps) {
    const [showTipos, setShowTipos] = useState(false);
    const [showCalDe, setShowCalDe] = useState(false);
    const [showCalAte, setShowCalAte] = useState(false);
    const [dataDe, setDataDe] = useState<Date | null>(null);
    const [dataAte, setDataAte] = useState<Date | null>(null);
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

    const fmtLabel = (d: Date | null, fallback: string) =>
        d ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` : fallback;

    const selecionarDe = (d: Date) => {
        setDataDe(d);
        hook.setFiltroDe(`${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`);
        setShowCalDe(false);
    };
    const selecionarAte = (d: Date) => {
        setDataAte(d);
        hook.setFiltroAte(`${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`);
        setShowCalAte(false);
    };

    const paginasVisiveis = () => {
        const total = hook.totalPaginas;
        const atual = hook.paginaAtual;
        const inicio = Math.max(1, atual - Math.floor(PAGINAS_VISIVEIS / 2));
        const fim = Math.min(total, inicio + PAGINAS_VISIVEIS - 1);
        return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
    };

    const handleLimparFiltros = () => {
        setDataDe(null);
        setDataAte(null);
        hook.limparFiltros();
    };

    const OrdenacaoIcon = ({ coluna }: { coluna: 'tipo' | 'valor' | 'consumo' | 'vencimento' | 'pagamento' }) => {
        const ativo = hook.ordemColuna === coluna;
        return (
            <img
                src={SetaCimaBaixoIcon}
                alt="Ordenar"
                className={`w-[8px] h-[13px] object-contain transition-opacity cursor-pointer ${ativo ? 'opacity-100' : 'opacity-40 hover:opacity-70'} ${ativo && hook.ordemDirecao === 'desc' ? 'rotate-180' : ''}`}
                onClick={(e) => { e.stopPropagation(); hook.alternarOrdem(coluna); }}
            />
        );
    };

    return (
        <div className="flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Filter Bar */}
            <div className="flex items-center gap-[20px] w-full">
                {/* Tipo de Conta Dropdown */}
                <div className="relative">
                    <div
                        onClick={() => setShowTipos(!showTipos)}
                        className="w-[240px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
                    >
                        <span className="text-[#848484] text-[16px] font-normal font-['Inter'] truncate">
                            {hook.filtroTipo || 'Tipo de Conta'}
                        </span>
                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={`transition-transform duration-200 ${showTipos ? 'rotate-180' : ''}`}>
                            <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {showTipos && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowTipos(false)} />
                            <div className="absolute top-[60px] left-0 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                <div
                                    onClick={() => { hook.setFiltroTipo(''); setShowTipos(false); }}
                                    className="px-[16px] py-[12px] text-[#404040] hover:bg-orange-50 cursor-pointer transition-colors border-b border-[#F0F0F0]"
                                >
                                    Todos os tipos
                                </div>
                                {['Energia', 'Agua', 'Gas'].map(tipo => (
                                    <div
                                        key={tipo}
                                        onClick={() => { hook.setFiltroTipo(tipo); setShowTipos(false); }}
                                        className="px-[16px] py-[12px] text-[#404040] hover:bg-orange-50 cursor-pointer transition-colors border-b border-[#F0F0F0] last:border-0"
                                    >
                                        {tipo}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Filtros de Data com Calendário */}
                <div className="flex items-center gap-[20px]">
                    <div className="relative">
                        <div onClick={() => { setShowCalDe((v: boolean) => !v); setShowCalAte(false); }} className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                            <div className="flex items-center gap-[12px]">
                                <img src={CalendarioFiltroIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                                <span className="text-[#414F5D] text-[16px] font-normal font-['Inter']">{fmtLabel(dataDe, 'De')}</span>
                            </div>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#414F5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        {showCalDe && <MiniCal onSelect={selecionarDe} onClose={() => setShowCalDe(false)} />}
                    </div>

                    <div className="relative">
                        <div onClick={() => { setShowCalAte((v: boolean) => !v); setShowCalDe(false); }} className="w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                            <div className="flex items-center gap-[12px]">
                                <img src={CalendarioFiltroIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                                <span className="text-[#414F5D] text-[16px] font-normal font-['Inter']">{fmtLabel(dataAte, 'Até')}</span>
                            </div>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#414F5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        {showCalAte && <MiniCal onSelect={selecionarAte} onClose={() => setShowCalAte(false)} />}
                    </div>
                </div>

                <button
                    onClick={() => {
                        setConsumoParaEditar(null);
                        setShowAddConsumptionModal(true);
                    }}
                    className="h-[56px] px-[24px] bg-[#F78800] rounded-[4px] text-white text-[16px] font-medium font-['Inter'] hover:bg-[#E57600] transition-colors shadow-sm"
                >
                    Adicionar Consumo
                </button>
            </div>

            {/* Contagem de resultados e Limpar Filtros */}
            {(hook.filtroTipo || hook.filtroDe || hook.filtroAte) && (
                <div className="flex items-center gap-[8px] -mt-[12px]">
                    <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                        {hook.totalItens} {hook.totalItens === 1 ? 'consumo encontrado' : 'consumos encontrados'}
                    </span>
                    <button
                        onClick={handleLimparFiltros}
                        className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}

            {/* Consumos Table */}
            <div className="flex flex-col gap-[32px] w-full">
                <div className="flex flex-col w-full">
                    {/* Header */}
                    <div className="px-[20px] py-[12px] flex items-center justify-between w-full border-b border-[#F0F0F0]">
                        <div
                            className="flex-1 flex items-center gap-[12px] cursor-pointer select-none"
                            onClick={() => hook.alternarOrdem('tipo')}
                        >
                            <span className={`text-[16px] font-bold font-['DM_Sans'] ${hook.ordemColuna === 'tipo' ? 'text-[#F78800]' : 'text-[#3B4141]'}`}>Tipo de Conta</span>
                            <OrdenacaoIcon coluna="tipo" />
                        </div>
                        <div className="flex-1 text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Valor (R$)</div>
                        <div className="flex-1 text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Consumo</div>
                        <div className="flex-1 text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Data Vencimento</div>
                        <div className="flex-1 text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Data Pagamento</div>
                        <div className="w-[60px] text-center text-[#3B4141] text-[16px] font-bold font-['DM_Sans']">Ações</div>
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col gap-[12px] w-full mt-[12px]">
                        {hook.loading ? (
                            <div className="w-full py-[100px] flex items-center justify-center">
                                <div className="w-[40px] h-[40px] border-4 border-[#F78800] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : hook.todos.length === 0 ? (
                            <div className="w-full py-[60px] flex items-center justify-center bg-white rounded-[4px] border border-[#F0F0F0]">
                                <span className="text-[#848484] text-[18px]">Nenhum consumo encontrado</span>
                            </div>
                        ) : (
                            hook.todos.map((item: any) => {
                                const isExcluindo = confirmarExclusao === item.id;
                                return (
                                    <div key={item.id} className={`h-[56px] px-[20px] bg-white rounded-[4px] border flex items-center justify-between w-full transition-all ${isExcluindo ? 'border-red-300 bg-red-50 shadow-sm' : 'border-[#E5E7EB] hover:bg-gray-50'}`}>
                                        <div className="flex-1 flex items-center gap-[12px]">
                                            <div className="w-[24px] h-[24px] flex items-center justify-center">
                                                {item.tipo === 'Energia' ? (
                                                    <img src={EnergiaIcon} alt="Energia" className="w-[20px] h-[20px] object-contain" />
                                                ) : item.tipo === 'Agua' ? (
                                                    <img src={AguaIcon} alt="Agua" className="w-[20px] h-[20px] object-contain" />
                                                ) : (
                                                    <img src={GasIcon} alt="Gas" className="w-[20px] h-[20px] object-contain" />
                                                )}
                                            </div>
                                            <span className="text-[#3B4141] text-[14px] font-normal font-['Inter']">{item.tipo}</span>
                                        </div>
                                        <div className="flex-1 text-[#3B4141] text-[14px] font-normal font-['Inter']">{item.valor}</div>
                                        <div className="flex-1 text-[#3B4141] text-[14px] font-normal font-['Inter']">{item.consumo}</div>
                                        <div className="flex-1 text-[#3B4141] text-[14px] font-normal font-['Inter']">{item.vencimento}</div>
                                        <div className="flex-1 text-[#3B4141] text-[14px] font-normal font-['Inter']">{item.pagamento || '-'}</div>
                                        <div className="w-[124px] flex items-center justify-center gap-[12px]">
                                            {!isExcluindo && (
                                                <button
                                                    onClick={() => { setConsumoParaEditar(item); setShowAddConsumptionModal(true); }}
                                                    className="w-[20px] h-[20px] flex items-center justify-center hover:scale-110 transition-transform"
                                                >
                                                    <img src={IconeLapis} alt="Editar" className="w-[20px] h-[20px] object-contain" />
                                                </button>
                                            )}
                                            <div className="flex justify-center min-w-[20px]">
                                                {isExcluindo ? (
                                                    <div className="flex items-center gap-[8px]">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); hook.excluir(item.id); setConfirmarExclusao(null); }}
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
                                                    <button
                                                        onClick={() => setConfirmarExclusao(item.id)}
                                                        className="w-[20px] h-[20px] flex items-center justify-center hover:scale-110 transition-transform"
                                                    >
                                                        <img src={ExcluirIcon} alt="Excluir" className="w-[20px] h-[20px] object-contain" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {/* Pagination */}
                        <div className="mt-[24px] py-[24px] border-t border-[#E1E1E1] flex items-center justify-between w-full">
                            <div className="flex items-center gap-[16px]">
                                <div className="relative" ref={perPageRef}>
                                    <div
                                        onClick={() => setShowPerPage(!showPerPage)}
                                        className="h-[32px] px-[12px] bg-[#EEF0FA] rounded-[6px] flex items-center gap-[8px] cursor-pointer hover:bg-[#E5E7F5]"
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
                                <span className="text-[#F78800] text-[14px] font-normal font-['Inter']">Consumos por página</span>
                            </div>

                            <div className="flex items-center gap-[6px]">
                                <button
                                    disabled={hook.paginaAtual === 1}
                                    onClick={() => hook.setPaginaAtual(h => Math.max(1, h - 1))}
                                    className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-[4px] disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                        <path d="M5 1L1 5L5 9" stroke="#F78800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                {paginasVisiveis().map(page => (
                                    <button
                                        key={page}
                                        onClick={() => hook.setPaginaAtual(page)}
                                        className={`w-[32px] h-[32px] flex justify-center items-center rounded-[4px] border ${hook.paginaAtual === page ? 'border-[#F78800] bg-white text-[#F78800] font-semibold' : 'border-[#E5E7EB] bg-white text-[#3B4141]'} text-[14px] font-medium font-['Inter'] hover:border-[#F78800] transition-colors cursor-pointer`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    disabled={hook.paginaAtual === hook.totalPaginas}
                                    onClick={() => hook.setPaginaAtual(h => Math.min(hook.totalPaginas, h + 1))}
                                    className="w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                                        <path d="M1 1L5 5L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
