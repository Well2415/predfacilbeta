import React, { useState, useRef, useEffect } from 'react';
import previsaoJson from '../../../../components/Dashboard/Cadastro/Previsao/previsao.json';

interface AddPrevisaoModalProps {
    isOpen: boolean;
    onClose: () => void;
    AgendaIcon: string;
    anosDisponiveis?: string[];
    anoAtual?: string;
    onAdicionar?: (nome: string, mes: number, valor: string, ano: string) => void;
}

const MESES_NOMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function buildGrid(mes: number, ano: number) {
    const firstDay = new Date(ano, mes, 1).getDay();
    const totalDays = new Date(ano, mes + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
}

export const AddPrevisaoModal: React.FC<AddPrevisaoModalProps> = ({
    isOpen,
    onClose,
    AgendaIcon,
    anosDisponiveis: _anosDisponiveis = ['2025', '2026', '2027'],
    anoAtual = '2025',
    onAdicionar,
}) => {
    const hoje = new Date();
    const [sistema, setSistema] = useState('');
    const [showSistemaDropdown, setShowSistemaDropdown] = useState(false);
    const [showCalendario, setShowCalendario] = useState(false);
    const [calMes, setCalMes] = useState(hoje.getMonth());
    const [calAno, setCalAno] = useState(hoje.getFullYear());
    const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
    const [valor, setValor] = useState('');
    const sistemaRef = useRef<HTMLDivElement>(null);
    const calRef = useRef<HTMLDivElement>(null);

    // Nomes únicos dos sistemas disponíveis no JSON
    const sistemasDisponiveis: string[] = Array.from(
        new Set(
            Object.values(previsaoJson.sistemas)
                .flat()
                .map((s: { nome: string }) => s.nome)
        )
    );
    const sistemasFiltrados = sistema.trim()
        ? sistemasDisponiveis.filter((n) => n.toLowerCase().includes(sistema.toLowerCase()))
        : sistemasDisponiveis;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sistemaRef.current && !sistemaRef.current.contains(e.target as Node)) setShowSistemaDropdown(false);
            if (calRef.current && !calRef.current.contains(e.target as Node)) setShowCalendario(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (!isOpen) return null;

    const handleClose = () => {
        setSistema('');
        setDataSelecionada(null);
        setValor('');
        setShowSistemaDropdown(false);
        setShowCalendario(false);
        onClose();
    };

    const handleSubmit = () => {
        if (!sistema.trim() || !valor.trim()) return;
        const mes = dataSelecionada ? dataSelecionada.getMonth() : 0;
        const ano = dataSelecionada ? String(dataSelecionada.getFullYear()) : anoAtual;
        onAdicionar?.(sistema.trim(), mes, valor, ano);
        handleClose();
    };

    const dataFormatada = dataSelecionada
        ? `${String(dataSelecionada.getDate()).padStart(2, '0')}/${String(dataSelecionada.getMonth() + 1).padStart(2, '0')}/${dataSelecionada.getFullYear()}`
        : 'Selecione a data';

    const grid = buildGrid(calMes, calAno);

    return (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-[20px] backdrop-blur-sm">
            <div className="w-[717px] bg-white rounded-[8px] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200" style={{ outline: '1px solid rgba(0, 0, 0, 0.10)', outlineOffset: '-1px' }}>
                {/* Header */}
                <div className="flex justify-between items-center px-[40px] py-[20px] bg-white border-b border-[#E1E1E1] rounded-t-[16px]">
                    <h3 className="text-[#404040] text-[20px] font-medium font-['Funnel_Sans']">Adicionar Previsão Orçamentária</h3>
                    <button onClick={handleClose} className="p-[4px] rounded-full hover:bg-gray-100 transition-colors">
                        <div className="w-[24px] h-[24px] relative flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Body */}
                <div className="p-[32px] flex flex-col gap-[24px]">
                    {/* Row 1: Sistema & Data */}
                    <div className="flex gap-[24px]">

                        {/* Sistema - dropdown com nomes existentes + livre */}
                        <div ref={sistemaRef} className="flex-1 flex flex-col gap-[8px] relative">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Sistema</label>
                            <div
                                onClick={() => setShowSistemaDropdown(true)}
                                className="h-[56px] px-[20px] bg-white rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer"
                            >
                                <input
                                    type="text"
                                    value={sistema}
                                    onChange={(e) => { setSistema(e.target.value); setShowSistemaDropdown(true); }}
                                    placeholder="Insira o nome do sistema"
                                    className="flex-1 text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] bg-transparent border-none outline-none"
                                />
                                <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showSistemaDropdown && sistemasFiltrados.length > 0 && (
                                <div className="absolute top-[88px] left-0 w-full bg-white border border-[#E1E1E1] rounded-[8px] shadow-lg z-50 overflow-auto max-h-[200px]">
                                    {sistemasFiltrados.map((nome) => (
                                        <div
                                            key={nome}
                                            onClick={() => { setSistema(nome); setShowSistemaDropdown(false); }}
                                            className={`px-[16px] py-[12px] cursor-pointer text-[16px] font-['Funnel_Sans'] transition-colors ${nome === sistema ? 'bg-[#FFEAD0] text-[#F78800] font-medium' : 'text-[#3B4141] hover:bg-[#FFEAD0]'}`}
                                        >
                                            {nome}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Data - mini calendário */}
                        <div ref={calRef} className="flex-1 flex flex-col gap-[8px] relative">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Data</label>
                            <div
                                onClick={() => setShowCalendario((v) => !v)}
                                className="h-[56px] px-[20px] bg-white rounded-[4px] border border-[#F0F0F0] flex items-center gap-[10px] cursor-pointer"
                            >
                                <div className="w-[20px] h-[20px] relative overflow-hidden flex items-center justify-center shrink-0">
                                    <img src={AgendaIcon} alt="Data" className="w-[20px] h-[20px] object-contain" />
                                </div>
                                <span className={`text-[16px] font-normal font-['Funnel_Sans'] ${dataSelecionada ? 'text-[#3B4141]' : 'text-[#414F5D]'}`}>
                                    {dataFormatada}
                                </span>
                            </div>

                            {/* Mini calendário */}
                            {showCalendario && (
                                <div className="absolute top-[88px] right-0 w-[280px] bg-white border border-[#E1E1E1] rounded-[8px] shadow-xl z-50 p-[16px] flex flex-col gap-[12px]">
                                    {/* Nav mês */}
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => { if (calMes === 0) { setCalMes(11); setCalAno((a) => a - 1); } else { setCalMes((m) => m - 1); } }}
                                            className="w-[28px] h-[28px] flex items-center justify-center rounded hover:bg-gray-100"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                        </button>
                                        <span className="text-[#3B4141] text-[14px] font-semibold font-['DM_Sans']">
                                            {MESES_NOMES[calMes].slice(0, 3)} {calAno}
                                        </span>
                                        <button
                                            onClick={() => { if (calMes === 11) { setCalMes(0); setCalAno((a) => a + 1); } else { setCalMes((m) => m + 1); } }}
                                            className="w-[28px] h-[28px] flex items-center justify-center rounded hover:bg-gray-100"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                        </button>
                                    </div>
                                    {/* Dias da semana */}
                                    <div className="grid grid-cols-7 gap-[2px]">
                                        {DIAS_SEMANA.map((d, i) => (
                                            <div key={i} className="h-[24px] flex items-center justify-center text-[11px] font-semibold text-[#AAAAAA] font-['DM_Sans']">{d}</div>
                                        ))}
                                        {grid.map((day, i) => {
                                            if (day === null) return <div key={i} />;
                                            const data = new Date(calAno, calMes, day);
                                            const selecionado = dataSelecionada?.toDateString() === data.toDateString();
                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => { setDataSelecionada(data); setShowCalendario(false); }}
                                                    className={`h-[28px] flex items-center justify-center rounded-[4px] text-[13px] cursor-pointer font-['DM_Sans'] transition-colors ${selecionado ? 'bg-[#F68903] text-white font-semibold' : 'text-[#3B4141] hover:bg-[#FFEAD0]'}`}
                                                >
                                                    {day}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Valor */}
                    <div className="flex gap-[24px]">
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Valor</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] border border-[#F0F0F0] flex items-center">
                                <input
                                    type="text"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                    placeholder="Insira o valor total"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] bg-transparent border-none outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-[#E1E1E1]"></div>

                    {/* Footer Actions */}
                    <div className="flex gap-[16px]">
                        <button
                            onClick={handleClose}
                            className="flex-1 h-[56px] border border-[#F78800] rounded-[4px] flex items-center justify-center text-[#F78800] text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#FFF5E5] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 h-[56px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors"
                        >
                            Adicionar Previsão
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
