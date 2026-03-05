import React from 'react';

interface RelatoriosOpcoesModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportType: 'simplificado' | 'completo' | null;
    setReportType: (type: 'simplificado' | 'completo' | null) => void;
}

export const RelatoriosOpcoesModal: React.FC<RelatoriosOpcoesModalProps> = ({
    isOpen,
    onClose,
    reportType,
    setReportType
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-[20px] backdrop-blur-sm">
            <div className="w-[717px] bg-white rounded-[8px] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200" style={{ outline: '1px solid rgba(0, 0, 0, 0.10)', outlineOffset: '-1px' }}>
                {/* Header */}
                <div className="flex justify-between items-center px-[40px] py-[20px] bg-white border-b border-[#E1E1E1] rounded-t-[16px]">
                    <h3 className="text-[#414F5D] text-[20px] font-medium font-['Funnel_Sans']">Relatórios</h3>
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
                    <h4 className="text-[#414F5D] text-[20px] font-medium font-['Funnel_Sans']">Selecione uma opção</h4>

                    <div className="flex flex-col gap-[16px]">
                        {/* Option: Simplificado */}
                        <div
                            onClick={() => setReportType('simplificado')}
                            className={`flex items-center gap-[16px] p-[12px] bg-white rounded-[4px] border cursor-pointer transition-all ${reportType === 'simplificado' ? 'border-[#F78800] bg-orange-50/10' : 'border-[#E6EAEE] hover:border-gray-300'}`}
                        >
                            <div className="flex-1 flex flex-col items-start">
                                <span className="text-[#414F5D] text-[20px] font-semibold font-['DM_Sans'] leading-[32px]">Simplificado</span>
                                <span className="text-[#AAAAAA] text-[16px] font-normal font-['Funnel_Sans'] leading-[19.2px]">Resumo das inspeções principais.</span>
                            </div>
                            <div className={`w-[21px] h-[21px] rounded-[6px] border flex items-center justify-center transition-colors ${reportType === 'simplificado' ? 'border-[#F78800] bg-[#F78800]' : 'border-[#D3D3D3]'}`}>
                                {reportType === 'simplificado' && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Option: Completo */}
                        <div
                            onClick={() => setReportType('completo')}
                            className={`flex items-center gap-[16px] p-[12px] bg-white rounded-[4px] border cursor-pointer transition-all ${reportType === 'completo' ? 'border-[#F78800] bg-orange-50/10' : 'border-[#E6EAEE] hover:border-gray-300'}`}
                        >
                            <div className="flex-1 flex flex-col items-start">
                                <span className="text-[#414F5D] text-[20px] font-semibold font-['DM_Sans'] leading-[32px]">Completo</span>
                                <span className="text-[#AAAAAA] text-[16px] font-normal font-['Funnel_Sans'] leading-[19.2px]">Detalhes técnicos e registros completos.</span>
                            </div>
                            <div className={`w-[21px] h-[21px] rounded-[6px] border flex items-center justify-center transition-colors ${reportType === 'completo' ? 'border-[#F78800] bg-[#F78800]' : 'border-[#D3D3D3]'}`}>
                                {reportType === 'completo' && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-black/5 my-[8px]"></div>

                    {/* Footer Buttons */}
                    <div className="flex gap-[24px] items-center">
                        <button className="flex-1 h-[56px] px-[16px] rounded-[4px] bg-[#F78800] flex items-center justify-center text-white text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors">
                            Enviar por E-mail
                        </button>
                        <button className="flex-1 h-[56px] px-[16px] rounded-[4px] bg-[#F78800] flex items-center justify-center text-white text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors">
                            Visualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
