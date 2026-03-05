import React from 'react';

interface ReportsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReportsModal({ isOpen, onClose }: ReportsModalProps) {


    // If not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Modal Container - Matches "width: 717px; background: white; border-radius: 8px;" from HTML */}
            <div className="w-[717px] bg-white rounded-[8px] outline outline-1 outline-[rgba(0,0,0,0.10)] outline-offset-[-1px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">

                {/* Header - Matches "align-self: stretch; padding: 20px 40px; ..." */}
                <div className="w-full px-[40px] py-[20px] bg-white rounded-t-[16px] border-b border-[#E1E1E1] flex justify-between items-center">
                    <div className="text-[#414F5D] text-[20px] font-medium font-['Funnel_Sans'] break-words">
                        Módulo de Relatórios
                    </div>
                    {/* Close Button - Matches "width: 40px; height: 40px..." */}
                    <div
                        className="w-[40px] h-[40px] p-[4px] overflow-hidden rounded-[30px] flex justify-center items-center gap-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={onClose}
                    >
                        <div className="w-[24px] h-[24px] relative overflow-hidden">
                            {/* X Icon made of divs as per HTML description logic, but SVG is cleaner and functionally identical for "no details different" visually */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="w-full p-[32px] flex flex-col justify-center items-center gap-[24px]">
                    <div className="text-center text-[#414F5D] text-[18px] font-normal font-['Funnel_Sans'] leading-[28px]">
                        Esta funcionalidade está sendo preparada para o <span className="font-bold">Jardins Residence</span>.<br />
                        Em breve você poderá gerenciar este módulo através do seu painel administrativo.
                    </div>
                </div>
            </div>
        </div>
    );
}
