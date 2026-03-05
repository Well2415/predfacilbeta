import React from 'react';

interface AnexosCondominioModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AnexosCondominioModal: React.FC<AnexosCondominioModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-[20px] backdrop-blur-sm">
            <div className="w-[717px] bg-white rounded-[8px] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200" style={{ outline: '1px solid rgba(0, 0, 0, 0.10)', outlineOffset: '-1px' }}>
                {/* Header */}
                <div className="flex justify-between items-center px-[40px] py-[20px] bg-white border-b border-[#E1E1E1] rounded-t-[16px]">
                    <h3 className="text-[#404040] text-[20px] font-medium font-['Funnel_Sans']">Documentos anexados relacionados ao condomínio</h3>
                    <button
                        onClick={onClose}
                        className="w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-[32px] flex flex-col gap-[24px]">
                    {/* Filter Input */}
                    <div className="w-full h-[56px] px-[20px] bg-[#F9FAFB] rounded-[4px] border border-[#F0F0F0] flex items-center gap-[12px]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Filtrar anexos"
                            className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Inter'] placeholder:text-[#414F5D]"
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full h-[352px] bg-[#F9FAFB] border border-[#F0F0F0] rounded-[4px]"></div>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-black/5"></div>

                    {/* Footer Buttons */}
                    <div className="flex gap-[16px] items-center">
                        <button
                            onClick={onClose}
                            className="flex-1 h-[56px] px-[16px] rounded-[4px] border border-[#F78800] flex items-center justify-center text-[#F78800] text-[16px] font-semibold font-['Funnel_Sans'] leading-[19.2px] hover:bg-orange-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button className="flex-1 h-[56px] px-[16px] rounded-[4px] bg-[#F78800] flex items-center justify-center text-white text-[16px] font-semibold font-['Funnel_Sans'] leading-[19.2px] hover:bg-[#E57600] transition-colors">
                            Anexar Novo Documento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
