import React, { useState } from 'react';

interface ImportFormulariosModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (forms: string[]) => void;
    PesquisarIcon: string;
    selectedImportForms: string[];
    setSelectedImportForms: (forms: string[]) => void;
}

export const ImportFormulariosModal: React.FC<ImportFormulariosModalProps> = ({
    isOpen,
    onClose,
    onImport,
    PesquisarIcon,
    selectedImportForms,
    setSelectedImportForms
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="w-[1238px] bg-white rounded-[8px] outline outline-1 outline-[rgba(0,0,0,0.10)] -outline-offset-1 flex flex-col justify-start items-center relative shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="self-stretch px-[40px] py-[20px] bg-white rounded-t-[16px] border-b border-[#E1E1E1] flex justify-between items-center">
                    <h2 className="text-[#404040] text-[20px] font-medium font-['Funnel_Sans']">Importação de Formulários Pre-Cadastrados</h2>
                    <div
                        onClick={onClose}
                        className="w-[40px] h-[40px] p-[4px] rounded-[30px] flex justify-center items-center gap-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-[24px] h-[24px] relative overflow-hidden">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="self-stretch p-[32px] flex flex-col justify-start items-start gap-[24px]">
                    {/* Search and Consult */}
                    <div className="self-stretch bg-white rounded-[4px] flex justify-start items-start gap-[16px]">
                        <div className="flex-1 flex flex-col justify-start items-start gap-[20px]">
                            <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">
                                <div className="self-stretch h-[56px] px-[20px] py-[16px] bg-[#F9FAFB] rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex justify-start items-center gap-[10px]">
                                    <div className="w-[24px] h-[24px] flex items-center justify-center">
                                        <img src={PesquisarIcon} alt="Pesquisar" className="w-[24px] h-[24px] object-contain opacity-50" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Filtrar formulários"
                                        className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Inter'] placeholder:text-[#414F5D]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-[200px] h-[56px] px-[16px] bg-[#F78800] rounded-[4px] flex justify-center items-center gap-[10px] cursor-pointer hover:bg-[#E57600] transition-colors">
                            <span className="text-white text-[16px] font-medium font-['Funnel_Sans']">Consultar</span>
                        </div>
                    </div>

                    <div className="self-stretch text-[#3B4141] text-[20px] font-normal font-['Funnel_Sans']">Selecione um formulário da lista para importá-lo.</div>
                    <div className="self-stretch h-[1px] bg-[rgba(0,0,0,0.05)]"></div>

                    {/* Form List */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-[32px]">
                        <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">
                            {['Básico', 'Condomínio HOrizontal', 'Condomínio Vertical', 'Agenda do Zelador', 'Fichas Condomínios'].map((item, index) => {
                                const isSelected = selectedImportForms.includes(item);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedImportForms(selectedImportForms.filter(f => f !== item));
                                            } else {
                                                setSelectedImportForms([...selectedImportForms, item]);
                                            }
                                        }}
                                        className={`self-stretch h-[56px] px-[20px] py-[8px] rounded-[4px] outline outline-1 ${isSelected ? 'outline-[#F78800] bg-orange-50/30' : 'outline-[#F0F0F0]'} -outline-offset-1 flex justify-between items-center cursor-pointer transition-all hover:bg-gray-50`}
                                    >
                                        <div className="pr-[20px] flex justify-start items-center gap-[10px]">
                                            <div className={`w-[20px] h-[20px] rounded-[4px] border-[2px] ${isSelected ? 'border-[#F78800] bg-[#F78800]' : 'border-[#CCCCCC] bg-white'} flex items-center justify-center transition-colors`}>
                                                {isSelected && (
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`flex-1 ${isSelected ? 'text-[#F78800] font-medium' : 'text-[#3B4141] font-normal'} text-[16px] font-['Funnel_Sans'] transition-colors`}>{item}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary Footer */}
                        <div className="self-stretch pt-[24px] pb-[16px] border-t border-[#E1E1E1] flex justify-between items-center">
                            <div className="flex justify-start items-center gap-[16px]">
                                <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans']">N de Formulários:</span>
                                <div className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex flex-col justify-center items-center gap-[10px]">
                                    <div className="flex justify-start items-center gap-[8px]">
                                        <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">5</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-start items-center gap-[16px]">
                                <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans']">N de Inspeções</span>
                                <div className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex flex-col justify-center items-center gap-[10px]">
                                    <div className="flex justify-start items-center gap-[8px]">
                                        <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">204</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-start items-center gap-[16px]">
                                <span className="text-[#F78800] text-[16px] font-normal font-['Funnel_Sans']">N de Procedimentos:</span>
                                <div className="h-[32px] px-[16px] bg-[#EEF0FA] rounded-[8px] flex flex-col justify-center items-center gap-[10px]">
                                    <div className="flex justify-start items-center gap-[8px]">
                                        <span className="text-[#3B4141] text-[14px] font-normal font-['Funnel_Sans']">309</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="self-stretch flex justify-start items-center gap-[16px]">
                        <div
                            onClick={onClose}
                            className="flex-1 h-[56px] px-[16px] rounded-[4px] outline outline-1 outline-[#F78800] -outline-offset-1 flex justify-center items-center gap-[10px] cursor-pointer hover:bg-orange-50 transition-colors"
                        >
                            <span className="text-[#F78800] text-[16px] font-semibold font-['Funnel_Sans'] leading-[19.20px]">Cancelar</span>
                        </div>
                        <div
                            onClick={() => {
                                if (selectedImportForms.length > 0) {
                                    onImport(selectedImportForms);
                                    setSelectedImportForms([]);
                                    onClose();
                                }
                            }}
                            className="flex-1 h-[56px] px-[16px] bg-[#F78800] rounded-[4px] flex justify-center items-center gap-[10px] cursor-pointer hover:bg-[#E57600] transition-colors"
                        >
                            <span className="text-white text-[16px] font-semibold font-['Funnel_Sans'] leading-[19.20px]">
                                {selectedImportForms.length > 0
                                    ? `Importar (${selectedImportForms.length}) formulários selecionados`
                                    : 'Importar Formulário Selecionado'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
