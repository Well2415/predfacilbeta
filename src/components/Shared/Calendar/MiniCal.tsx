
import { useState, useRef, useEffect } from 'react';

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

interface MiniCalProps {
    value?: Date | null;
    onSelect: (d: Date) => void;
    onClose: () => void;
    className?: string;
}

export function MiniCal({ value, onSelect, onClose, className = "top-[60px]" }: MiniCalProps) {
    const hoje = new Date();
    // Se tiver um valor selecionado, inicia o calendário naquele mês/ano.
    const [mes, setMes] = useState(value ? value.getMonth() : hoje.getMonth());
    const [ano, setAno] = useState(value ? value.getFullYear() : hoje.getFullYear());
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const grid = buildGrid(mes, ano);

    const isToday = (day: number) => {
        return day === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
    };

    const isSelected = (day: number) => {
        return value && day === value.getDate() && mes === value.getMonth() && ano === value.getFullYear();
    };

    return (
        <div ref={ref} className={`absolute z-50 bg-white border border-[#E1E1E1] rounded-[8px] shadow-xl p-[16px] flex flex-col gap-[12px] w-[240px] ${className}`}>
            <div className="flex justify-between items-center">
                <button
                    type="button"
                    onClick={() => { if (mes === 0) { setMes(11); setAno(a => a - 1); } else setMes(m => m - 1); }}
                    className="w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <span className="text-[#3B4141] text-[13px] font-semibold font-['DM_Sans']">{MESES_CAL[mes]} {ano}</span>
                <button
                    type="button"
                    onClick={() => { if (mes === 11) { setMes(0); setAno(a => a + 1); } else setMes(m => m + 1); }}
                    className="w-[24px] h-[24px] flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-[2px]">
                {DIAS_SEM.map((d, i) => (
                    <div key={i} className="h-[22px] flex items-center justify-center text-[10px] font-semibold text-[#AAAAAA] font-['DM_Sans'] uppercase">{d}</div>
                ))}
                {grid.map((day, i) => day === null ? (
                    <div key={i} className="h-[26px]" />
                ) : (
                    <div
                        key={i}
                        onClick={() => onSelect(new Date(ano, mes, day))}
                        className={`
                            h-[26px] flex items-center justify-center rounded-[4px] text-[12px] cursor-pointer font-['DM_Sans'] transition-all
                            ${isSelected(day)
                                ? 'bg-[#F78800] text-white font-bold'
                                : isToday(day)
                                    ? 'bg-[#F9F9F9] text-[#F78800] border border-[#F78800] font-medium'
                                    : 'text-[#3B4141] hover:bg-[#FFEAD0] hover:text-[#F68903]'
                            }
                        `}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}
