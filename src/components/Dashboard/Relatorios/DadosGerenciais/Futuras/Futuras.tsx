import React, { useState, useRef, useEffect } from 'react';
import { useRelatorioFuturasData, InspecaoFutura } from '../../../../../hooks/relatorioFuturasData';

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

interface RelatoriosDadosFuturasProps {
    PesquisarIcon?: string;
    CalendarioFiltroIcon?: string;
    IconeTotalPrevisto?: string;
    IconePerfilInspecoes?: string;
}

const ITENS_OPCOES = [5, 10, 20, 50];

export const RelatoriosDadosFuturas: React.FC<RelatoriosDadosFuturasProps> = ({
    PesquisarIcon,
    CalendarioFiltroIcon,
    IconeTotalPrevisto,
    IconePerfilInspecoes,
}) => {
    const hook = useRelatorioFuturasData();
    const [showPerPage, setShowPerPage] = useState(false);
    const [showCalDe, setShowCalDe] = useState(false);
    const [showCalAte, setShowCalAte] = useState(false);
    const [showCats, setShowCats] = useState(false);
    const perPageRef = useRef<HTMLDivElement>(null);
    const catsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (perPageRef.current && !perPageRef.current.contains(e.target as Node)) setShowPerPage(false);
            if (catsRef.current && !catsRef.current.contains(e.target as Node)) setShowCats(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const fmtLabel = (val: string, fallback: string) => {
        if (!val) return fallback;
        const [y, m, d] = val.split('-');
        return `${d}/${m}/${y}`;
    };

    const fmtMoeda = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
        <div className="flex flex-col gap-[40px] w-full font-['DM_Sans'] animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Filter Bar */}
            <div className="flex items-center gap-[20px] px-[40px]">
                <div className="flex-1 bg-white rounded-[4px]">
                    <div className="h-[56px] px-[20px] py-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-start items-center gap-[10px]">
                        <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                            <img src={PesquisarIcon} alt="Pesquisar" className="w-[24px] h-[24px] object-contain opacity-50" />
                        </div>
                        <input
                            type="text"
                            value={hook.busca}
                            onChange={(e) => { hook.setBusca(e.target.value); hook.setPaginaAtual(1); }}
                            placeholder="Filtrar Inspeções"
                            className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Inter']"
                        />
                    </div>
                </div>

                {/* Categorias Dropdown */}
                <div className="relative w-[240px]" ref={catsRef}>
                    <div
                        onClick={() => setShowCats(!showCats)}
                        className="h-[56px] px-[16px] py-[13px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-start items-center gap-[10px] cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <span className={`flex-1 text-[16px] font-normal font-['Funnel_Sans'] truncate ${hook.categoriasSelecionadas.length > 0 ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
                            {hook.categoriasSelecionadas.length === 0 ? 'Selecionar Categoria(s)' : hook.categoriasSelecionadas.join(', ')}
                        </span>
                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={`transition-transform ${showCats ? 'rotate-180' : ''}`}>
                            <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {showCats && (
                        <div className="absolute top-[60px] left-0 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50 max-h-[240px] overflow-y-auto p-1">
                            {hook.categoriasDisponiveis.map(cat => (
                                <div
                                    key={cat}
                                    onClick={() => {
                                        const newCats = hook.categoriasSelecionadas.includes(cat)
                                            ? hook.categoriasSelecionadas.filter(c => c !== cat)
                                            : [...hook.categoriasSelecionadas, cat];
                                        hook.setCategoriasSelecionadas(newCats);
                                        hook.setPaginaAtual(1);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer rounded"
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${hook.categoriasSelecionadas.includes(cat) ? 'bg-[#F78800] border-[#F78800]' : 'border-[#E1E1E1]'}`}>
                                        {hook.categoriasSelecionadas.includes(cat) && <svg width="8" height="6" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                    </div>
                                    <span className="text-[#3B4141] text-[14px] font-['Funnel_Sans']">{cat}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-[160px] h-[56px] px-[16px] py-[13px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-start items-center gap-[10px] relative cursor-pointer" onClick={() => setShowCalDe(!showCalDe)}>
                    <img src={CalendarioFiltroIcon} alt="Calendário" className="w-[20px] h-[20px] object-contain shrink-0" />
                    <span className={`flex-1 text-[16px] font-normal font-['Funnel_Sans'] ${hook.dataInicio ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
                        {fmtLabel(hook.dataInicio, 'De')}
                    </span>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={`transition-transform ${showCalDe ? 'rotate-180' : ''}`}>
                        <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                <div className="w-[160px] h-[56px] px-[16px] py-[13px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-start items-center gap-[10px] relative cursor-pointer" onClick={() => setShowCalAte(!showCalAte)}>
                    <img src={CalendarioFiltroIcon} alt="Calendário" className="w-[20px] h-[20px] object-contain shrink-0" />
                    <span className={`flex-1 text-[16px] font-normal font-['Funnel_Sans'] ${hook.dataFim ? 'text-[#3B4141]' : 'text-[#848484]'}`}>
                        {fmtLabel(hook.dataFim, 'Até')}
                    </span>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={`transition-transform ${showCalAte ? 'rotate-180' : ''}`}>
                        <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                <div className="w-[200px] h-[56px] p-[16px] bg-[#F78800] rounded-[4px] flex justify-center items-center gap-[10px] cursor-pointer hover:bg-[#E57600] transition-colors">
                    <span className="text-white text-[16px] font-medium font-['Funnel_Sans']">Consultar</span>
                </div>
            </div>

            {/* Contagem de resultados e Limpar Filtros */}
            {(hook.busca || hook.dataInicio || hook.dataFim || hook.categoriasSelecionadas.length > 0) && (
                <div className="flex items-center gap-[8px] px-[40px] -mt-[20px]">
                    <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                        {hook.stats.count} {hook.stats.count === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </span>
                    <button
                        onClick={() => hook.limparFiltros()}
                        className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70 transition-opacity"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="flex flex-col lg:flex-row items-stretch gap-[32px] px-[40px]">
                {/* Total Previsto Card */}
                <div className="flex-1 bg-white p-[24px] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex flex-col gap-[32px]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[32px] h-[32px] flex items-center justify-center">
                                <img src={IconeTotalPrevisto} alt="Total Previsto" className="w-[32px] h-[32px] object-contain" />
                            </div>
                            <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">Total Previsto – Período Selecionado</span>
                        </div>
                        <div className="px-[11px] py-[4px] bg-[#EEF0FA] rounded-[4px]">
                            <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">Normal</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-[8px]">
                            <span className="text-[#F68903] text-[32px] font-bold font-['DM_Sans'] leading-[40px]">{fmtMoeda(hook.stats.totalValor)}</span>
                            <div>
                                <span className="text-[#E63939] text-[16px] font-medium font-['DM_Sans']">+12%</span>
                                <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']"> vs mesmo período no ano passado</span>
                            </div>
                        </div>
                        <div className="w-[208px] flex flex-col gap-[8px]">
                            {[
                                { label: 'Próxima inspeção:', value: hook.stats.count > 0 ? fmtLabel(hook.stats.proxInspecao, '-') : '-' },
                                { label: 'Valor Médio:', value: fmtMoeda(hook.stats.valorMedio).split(',')[0] },
                                { label: 'Maior Gasto:', value: fmtMoeda(hook.stats.maiorGasto).split(',')[0] },
                                { label: 'Menor Gasto:', value: fmtMoeda(hook.stats.menorGasto).split(',')[0] }
                            ].map((item, i) => (
                                <React.Fragment key={i}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">{item.label}</span>
                                        <span className="text-[#3B4141] text-[12px] font-extrabold font-['DM_Sans']">{item.value}</span>
                                    </div>
                                    {i < 3 && <div className="h-[1px] bg-[#F0F0F0] w-full"></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Perfil das Inspeções Card */}
                <div className="flex-1 bg-white p-[24px] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex flex-col gap-[32px]">
                    <div className="flex items-center gap-[8px]">
                        <div className="w-[32px] h-[32px] flex items-center justify-center">
                            <img src={IconePerfilInspecoes} alt="Perfil das Inspeções" className="w-[32px] h-[32px] object-contain" />
                        </div>
                        <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">Perfil das Inspeções – Período Selecionado</span>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        {[
                            { label: 'Média por equipamento:', value: `${hook.stats.mediaEquipamento} inspeções` },
                            { label: 'Periodicidade média:', value: '21 dias' },
                            { label: 'Categoria mais recorrente:', value: hook.stats.maisRecorrente },
                            { label: 'Categoria menos recorrente:', value: hook.stats.menosRecorrente }
                        ].map((item, i) => (
                            <React.Fragment key={i}>
                                <div className="flex justify-between items-center h-[20px]">
                                    <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">{item.label}</span>
                                    <span className="text-[#3B4141] text-[12px] font-extrabold font-['DM_Sans']">{item.value}</span>
                                </div>
                                {i < 3 && <div className="h-[1px] bg-[#F0F0F0] w-full"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Line Chart Section */}
            <div className="mx-[40px] p-[24px] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex flex-col gap-[16px]">
                <div className="flex items-center gap-[16px]">
                    <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">Comparação de Gastos por Período Selecionado</span>
                    <div className="h-[20px] w-[1px] bg-black/20"></div>
                    <div className="flex items-center gap-[16px]">
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[8px] h-[8px] bg-[#F9AC51]"></div>
                            <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">Esse ano</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <div className="w-[8px] h-[8px] bg-[#3B4141]"></div>
                            <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">Mesmo Periodo, Ano passado</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-[16px] h-[263px] items-end mt-[20px]">
                    {/* Y Axis Labels */}
                    <div className="h-full flex flex-col justify-between items-end text-[#898D8D] text-[12px] font-normal font-['DM_Sans'] pr-[4px]">
                        <span>{fmtMoeda(hook.chartData.maxVal).split(',')[0]}</span>
                        <span>{fmtMoeda(hook.chartData.maxVal * 0.75).split(',')[0]}</span>
                        <span>{fmtMoeda(hook.chartData.maxVal * 0.5).split(',')[0]}</span>
                        <span>{fmtMoeda(hook.chartData.maxVal * 0.25).split(',')[0]}</span>
                        <span>R$0</span>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 h-full relative border-l border-b border-[#F0F0F0]">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[0, 1, 2, 3].map((_, i) => (
                                <div key={i} className="w-full h-[1px] bg-[#F0F0F0]"></div>
                            ))}
                        </div>

                        {/* Lines SVG */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1100 263" preserveAspectRatio="none">
                            {(() => {
                                const { currentYear, lastYear, maxVal } = hook.chartData;
                                const h = 263;
                                const getPath = (data: number[]) => {
                                    return data.map((v, i) => {
                                        const x = i * 100;
                                        const y = h - (v / maxVal) * h;
                                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                                    }).join(' ');
                                };
                                return (
                                    <>
                                        {/* Last Year Line (Grey Dotted) */}
                                        <path
                                            d={getPath(lastYear)}
                                            fill="none"
                                            stroke="#3B4141"
                                            strokeWidth="1.5"
                                            strokeDasharray="4 4"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                        {/* This Year Line (Orange) */}
                                        <path
                                            d={getPath(currentYear)}
                                            fill="none"
                                            stroke="#F78800"
                                            strokeWidth="2"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </>
                                );
                            })()}
                        </svg>

                        {/* X Axis Labels */}
                        <div className="absolute -bottom-[24px] left-0 right-0 flex justify-between px-[5%] text-[#898D8D] text-[12px] font-normal font-['DM_Sans']">
                            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((m) => (
                                <span key={m}>{m}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Data */}
            <div className="flex flex-col gap-[32px] px-[40px]">
                {/* Header */}
                <div className="w-full px-[20px] flex justify-between items-center">
                    <div className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Nome</div>
                    <div className="w-[200px] text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Valor Previsto</div>
                    <div className="w-[200px] text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Periodicidade</div>
                    <div className="w-[160px] text-center text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans']">Data Manutenção</div>
                </div>

                {/* Table Rows */}
                <div className="w-full flex flex-col gap-[16px]">
                    {hook.loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-full h-[72px] px-[20px] rounded-[4px] outline outline-1 outline-[#F0F0F0] animate-pulse bg-gray-50 flex items-center gap-4">
                                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                                <div className="w-[200px] h-4 bg-gray-200 rounded"></div>
                                <div className="w-[200px] h-4 bg-gray-200 rounded"></div>
                                <div className="w-[160px] h-4 bg-gray-200 rounded"></div>
                            </div>
                        ))
                    ) : hook.itensPagina.length === 0 ? (
                        <div className="w-full py-10 text-center text-[#848484] font-['Funnel_Sans']">Nenhuma inspeção futura encontrada.</div>
                    ) : (
                        hook.itensPagina.map((row: InspecaoFutura) => (
                            <div key={row.id} className="w-full h-[72px] px-[20px] py-[8px] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div className="flex-1 text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.nome}</div>
                                <div className="w-[200px] text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{fmtMoeda(row.valor).split(',')[0]}</div>
                                <div className="w-[200px] text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{row.periodo}</div>
                                <div className="w-[160px] text-center text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{fmtLabel(row.dataManutencao, '-')}</div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination and Summary */}
                <div className="w-full pt-[24px] pb-[16px] border-t border-[#E1E1E1] flex justify-between items-center mb-[80px] relative z-20">
                    <div className="flex justify-start items-center gap-[16px]">
                        <div className="relative" ref={perPageRef}>
                            <div
                                onClick={() => setShowPerPage(!showPerPage)}
                                className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
                            >
                                <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">{hook.itensPorPagina}</span>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
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
                        <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans']">Inspeções por página</span>
                    </div>
                    <span className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">{hook.stats.count} Inspeções</span>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-[6px]">
                        <div
                            onClick={() => hook.setPaginaAtual((p: number) => Math.max(1, p - 1))}
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
                            onClick={() => hook.setPaginaAtual((p: number) => Math.min(hook.totalPaginas, p + 1))}
                            className={`w-[32px] h-[32px] flex items-center justify-center bg-[#F78800] rounded-[4px] cursor-pointer hover:bg-[#E57600] ${hook.paginaAtual === hook.totalPaginas ? 'opacity-30 pointer-events-none' : ''}`}
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

