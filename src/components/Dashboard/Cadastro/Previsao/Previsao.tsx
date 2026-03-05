import React, { useRef, useEffect } from 'react';
import { previsaoData } from '../../../../hooks/cadastroPrevisaoData';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

interface PrevisaoProps {
    PesquisarIcon: string;
    AgendaIcon: string;
    setShowAddPrevisaoModal: (show: boolean) => void;
}

export const Previsao: React.FC<PrevisaoProps> = ({
    PesquisarIcon,
    AgendaIcon,
    setShowAddPrevisaoModal,
}) => {
    const hook = previsaoData();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                hook.setDropdownAberto(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [hook]);

    return (
        <div className="flex flex-col gap-[32px] animate-in fade-in zoom-in duration-300">

            {/* Filtros + Botão */}
            <div className="flex items-center gap-[20px]">

                {/* Busca por sistema */}
                <div className="flex-1 h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[12px]">
                    <img src={PesquisarIcon} alt="Pesquisar" className="w-[24px] h-[24px] object-contain shrink-0" />
                    <input
                        type="text"
                        value={hook.busca}
                        onChange={(e) => hook.setBusca(e.target.value)}
                        placeholder="Filtrar por sistema"
                        className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Inter'] placeholder:text-[#414F5D]"
                    />
                    {hook.busca && (
                        <button onClick={() => hook.setBusca('')} className="text-[#AAAAAA] hover:text-[#3B4141] text-[18px] leading-none">×</button>
                    )}
                </div>

                {/* Seletor de Ano */}
                <div ref={dropdownRef} className="relative">
                    <div
                        onClick={() => hook.setDropdownAberto(!hook.dropdownAberto)}
                        className={`w-[160px] h-[56px] px-[16px] bg-[#F9FAFB] rounded-[4px] border flex items-center gap-[10px] cursor-pointer hover:bg-gray-50 transition-colors ${hook.dropdownAberto ? 'border-[#F78800]' : 'border-[#F0F0F0]'}`}
                    >
                        <img src={AgendaIcon} alt="Ano" className="w-[20px] h-[20px] object-contain shrink-0" />
                        <span className={`flex-1 text-[16px] font-normal font-['Funnel_Sans'] ${hook.dropdownAberto ? 'text-[#F78800]' : 'text-[#848484]'}`}>
                            {hook.anoSelecionado}
                        </span>
                        <svg
                            width="12" height="7" viewBox="0 0 12 7" fill="none"
                            className={`transition-transform duration-200 ${hook.dropdownAberto ? 'rotate-180' : ''}`}
                        >
                            <path d="M1 1L6 6L11 1" stroke={hook.dropdownAberto ? '#F78800' : '#848484'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {hook.dropdownAberto && (
                        <div className="absolute top-[60px] left-0 w-full bg-white border border-[#E1E1E1] rounded-[8px] shadow-lg z-50 overflow-hidden">
                            {hook.anosDisponiveis.map((ano) => (
                                <div
                                    key={ano}
                                    onClick={() => hook.selecionarAno(ano)}
                                    className={`px-[16px] py-[12px] cursor-pointer text-[16px] font-['Funnel_Sans'] transition-colors ${ano === hook.anoSelecionado
                                        ? 'bg-[#FFEAD0] text-[#F78800] font-medium'
                                        : 'text-[#3B4141] hover:bg-[#FFEAD0]'
                                        }`}
                                >
                                    {ano}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Botão Adicionar */}
                <button
                    onClick={() => setShowAddPrevisaoModal(true)}
                    className="w-[200px] h-[56px] bg-[#F78800] rounded-[4px] flex justify-center items-center gap-[10px] hover:bg-[#E57600] transition-colors shadow-sm shrink-0"
                >
                    <span className="text-white text-[16px] font-medium font-['Funnel_Sans']">Adicionar Previsão</span>
                </button>
            </div>

            {/* Contagem de resultados */}
            {hook.busca && (
                <div className="flex items-center gap-[8px]">
                    <span className="text-[#898D8D] text-[14px] font-['DM_Sans']">
                        {hook.sistemasFiltrados.length} {hook.sistemasFiltrados.length === 1 ? 'sistema encontrado' : 'sistemas encontrados'}
                    </span>
                    <button onClick={() => hook.setBusca('')} className="text-[#F78800] text-[14px] font-['DM_Sans'] underline hover:opacity-70">
                        Limpar
                    </button>
                </div>
            )}

            {/* Tabela */}
            <div className="flex flex-col gap-[8px] pb-[40px] w-full overflow-x-auto">
                <div className="min-w-[1200px] flex flex-col gap-[32px]">

                    {/* Cabeçalho */}
                    <div className="px-[20px] flex justify-between items-center whitespace-nowrap">
                        <div className="w-[180px] text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans'] shrink-0">Sistema</div>
                        {MESES.map((m) => (
                            <div key={m} className="flex-1 text-[#3B4141] text-[18px] font-semibold font-['Funnel_Sans'] text-center">{m}</div>
                        ))}
                    </div>

                    {/* Linhas */}
                    <div className="flex flex-col gap-[16px]">
                        {hook.loading ? (
                            [0, 1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-full px-[20px] py-[12px] rounded-[4px] outline outline-1 outline-[#F0F0F0] bg-white flex gap-[16px] animate-pulse">
                                    <div className="w-[180px] h-[16px] bg-gray-100 rounded shrink-0" />
                                    {MESES.map((_, j) => (
                                        <div key={j} className="flex-1 h-[16px] bg-gray-100 rounded" />
                                    ))}
                                </div>
                            ))
                        ) : hook.sistemasFiltrados.length === 0 ? (
                            <div className="py-[48px] flex flex-col items-center gap-[12px]">
                                <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans']">Nenhum sistema encontrado</span>
                                <span className="text-[#AAAAAA] text-[16px] font-['DM_Sans']">
                                    {hook.busca ? 'Tente ajustar o filtro.' : `Nenhuma previsão cadastrada para ${hook.anoSelecionado}.`}
                                </span>
                            </div>
                        ) : (
                            hook.sistemasFiltrados.map((row) => (
                                <div
                                    key={row.id}
                                    className="w-full px-[20px] py-[12px] rounded-[4px] outline outline-1 outline-[#F0F0F0] outline-offset-[-1px] flex justify-between items-center bg-white hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
                                >
                                    <div className="w-[180px] text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans'] shrink-0 truncate pr-[8px]">{row.nome}</div>
                                    {row.valores.map((val, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 text-[14px] font-normal font-['Funnel_Sans'] text-center ${val === '-' ? 'text-[#CCCCCC]' : 'text-[#3B4141] font-medium'}`}
                                        >
                                            {val}
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
