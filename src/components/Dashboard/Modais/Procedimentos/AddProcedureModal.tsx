import React, { useState } from 'react';

interface AddProcedureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (procedimento: any) => void;
}

export const AddProcedureModal: React.FC<AddProcedureModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [description, setDescription] = useState('');
    const [ambiente, setAmbiente] = useState('');
    const [realizador, setRealizador] = useState('');
    const [categoria, setCategoria] = useState('');
    const [grauCritico, setGrauCritico] = useState('');
    const [custo, setCusto] = useState('');
    const [isVerificacao, setIsVerificacao] = useState(false);
    const [imagesRequired, setImagesRequired] = useState(false);

    // Estados para os dropdowns (dropdowns são simulados para manter o design)
    const [showCategoria, setShowCategoria] = useState(false);
    const [showGrau, setShowGrau] = useState(false);
    const [showTipo, setShowTipo] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!description.trim()) return;

        onAdd({
            name: description,
            ambiente,
            realizador,
            categoria,
            grauCritico,
            custo,
            isVerificacao,
            imagesRequired,
            updated: new Date().toLocaleDateString('pt-BR'),
        });

        // Limpar e fechar
        setDescription('');
        setAmbiente('');
        setRealizador('');
        setCategoria('');
        setGrauCritico('');
        setCusto('');
        setIsVerificacao(false);
        setImagesRequired(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] animate-in fade-in duration-200">
            <div
                className="w-[717px] bg-white rounded-[8px] flex flex-col items-center justify-start relative shadow-2xl animate-in zoom-in-95 duration-200"
                style={{ outline: '1px solid rgba(0, 0, 0, 0.10)', outlineOffset: '-1px' }}
            >
                {/* Header */}
                <div className="self-stretch px-[40px] py-[20px] bg-white rounded-t-[16px] border-b border-[#E1E1E1] flex justify-between items-center">
                    <div className="text-[#404040] text-[20px] font-medium font-['Funnel_Sans']">
                        Adicionar Procedimento
                    </div>
                    <div
                        onClick={onClose}
                        className="w-[40px] h-[40px] p-[4px] rounded-[30px] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-[24px] h-[24px] relative flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="self-stretch p-[32px] flex flex-col gap-[24px]">
                    {/* Descrição */}
                    <div className="flex flex-col gap-[8px] w-full">
                        <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">
                            Descrição
                        </label>
                        <div className="self-stretch h-[120px] px-[20px] py-[13px] bg-white rounded-[4px] border border-[#F0F0F0] flex items-start">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent resize-none placeholder:text-[#414F5D]"
                                placeholder="Insira a descrição do Procedimento"
                            />
                        </div>
                    </div>

                    {/* Row: Ambiente & Realizador */}
                    <div className="flex gap-[24px] w-full">
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Ambiente</label>
                            <input
                                type="text"
                                value={ambiente}
                                onChange={(e) => setAmbiente(e.target.value)}
                                placeholder="Ex: Área Comum"
                                className="w-full h-[56px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D]"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Indicado ser realizado por</label>
                            <input
                                type="text"
                                value={realizador}
                                onChange={(e) => setRealizador(e.target.value)}
                                placeholder="Ex: Zelador"
                                className="w-full h-[56px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D]"
                            />
                        </div>
                    </div>

                    {/* Row: Categoria & Grau Crítico */}
                    <div className="flex gap-[24px] w-full">
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Categoría</label>
                            <div className="relative">
                                <div
                                    onClick={() => { setShowCategoria(!showCategoria); setShowGrau(false); setShowTipo(false); }}
                                    className="h-[56px] px-[20px] bg-white rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer"
                                >
                                    <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">
                                        {categoria || "Selecione a Categoría"}
                                    </span>
                                    <div className="w-[19px] h-[19px] flex items-center justify-center">
                                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                            <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                {showCategoria && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50 mt-1">
                                        {['Elétrica', 'Hidráulica', 'Incêndio', 'Estrutural', 'Outros'].map(c => (
                                            <div key={c} onClick={() => { setCategoria(c); setShowCategoria(false); }} className="px-[20px] py-[10px] hover:bg-orange-50 cursor-pointer text-[#414F5D] text-[14px]">
                                                {c}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Grau Critico</label>
                            <div className="relative">
                                <div
                                    onClick={() => { setShowGrau(!showGrau); setShowCategoria(false); setShowTipo(false); }}
                                    className="h-[56px] px-[20px] bg-white rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer"
                                >
                                    <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">
                                        {grauCritico || "Selecione o Grau de Criticidade"}
                                    </span>
                                    <div className="w-[19px] h-[19px] flex items-center justify-center">
                                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                            <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                {showGrau && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50 mt-1">
                                        {['Baixo', 'Médio', 'Alto', 'Crítico'].map(g => (
                                            <div key={g} onClick={() => { setGrauCritico(g); setShowGrau(false); }} className="px-[20px] py-[10px] hover:bg-orange-50 cursor-pointer text-[#414F5D] text-[14px]">
                                                {g}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row: Custo & Tipo */}
                    <div className="flex gap-[24px] w-full">
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Custo R$</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] border border-[#F0F0F0] flex items-center">
                                <input
                                    type="text"
                                    value={custo}
                                    onChange={(e) => setCusto(e.target.value)}
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent placeholder:text-[#414F5D]"
                                    placeholder="Insira o Custo"
                                />
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Procedimento ou Verificação?</label>
                            <div className="relative">
                                <div
                                    onClick={() => { setShowTipo(!showTipo); setShowCategoria(false); setShowGrau(false); }}
                                    className="h-[56px] px-[20px] bg-white rounded-[4px] border border-[#F0F0F0] flex items-center justify-between cursor-pointer"
                                >
                                    <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">
                                        {isVerificacao ? 'Verificação' : 'Procedimento'}
                                    </span>
                                    <div className="w-[19px] h-[19px] flex items-center justify-center">
                                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                            <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                {showTipo && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-50 mt-1">
                                        <div onClick={() => { setIsVerificacao(false); setShowTipo(false); }} className="px-[20px] py-[10px] hover:bg-orange-50 cursor-pointer text-[#414F5D] text-[14px]">Procedimento</div>
                                        <div onClick={() => { setIsVerificacao(true); setShowTipo(false); }} className="px-[20px] py-[10px] hover:bg-orange-50 cursor-pointer text-[#414F5D] text-[14px]">Verificação</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="self-stretch h-[1px] bg-black/5" />

                    {/* Checkbox */}
                    <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => setImagesRequired(!imagesRequired)}>
                        <div
                            className={`w-[20px] h-[20px] border-2 rounded-[4px] flex items-center justify-center transition-colors ${imagesRequired ? 'border-[#F78800] bg-[#F78800]' : 'border-[#CCCCCC]'}`}
                        >
                            {imagesRequired && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <span className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">
                            Imagens Obrigatórias?
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-[16px] w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 h-[56px] border border-[#F78800] rounded-[4px] text-[#F78800] text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-orange-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 h-[56px] bg-[#F78800] rounded-[4px] text-white text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors shadow-sm"
                        >
                            Adicionar Procedimento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
