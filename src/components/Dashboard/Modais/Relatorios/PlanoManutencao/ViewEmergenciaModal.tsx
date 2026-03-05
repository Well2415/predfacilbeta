
import { Emergencia } from '../../../../../hooks/relatorioEmergenciasData';

interface ViewEmergenciaModalProps {
    onClose: () => void;
    data: Emergencia;
}

export function ViewEmergenciaModal({ onClose, data }: ViewEmergenciaModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-[650px] bg-white rounded-[8px] shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="h-[70px] px-[32px] border-b border-[#E1E1E1] flex justify-between items-center shrink-0">
                    <div className="text-[#3B4141] text-[20px] font-bold font-['DM_Sans']">Detalhes da Emergência</div>
                    <button onClick={onClose} className="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="#3B4141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-[32px] flex flex-col gap-[24px] overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[#898D8D] text-[14px] font-medium font-['DM_Sans'] uppercase tracking-wider">Tipo de Ocorrência</label>
                        <div className="text-[#3B4141] text-[18px] font-bold font-['DM_Sans'] leading-tight">
                            {data.tipo}
                        </div>
                    </div>

                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[#898D8D] text-[14px] font-medium font-['DM_Sans'] uppercase tracking-wider">Procedimentos de Emergência</label>
                        <div className="bg-[#F9FAFB] p-6 rounded-[4px] border border-[#F0F0F0]">
                            <ul className="list-disc pl-[24px] space-y-[12px]">
                                {data.procedimentos.map((proc, idx) => (
                                    <li key={idx} className="text-[#3B4141] text-[15px] font-normal font-['DM_Sans'] leading-relaxed">
                                        {proc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-[24px] border-t border-[#E1E1E1] flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-[32px] h-[48px] bg-[#F78800] text-white rounded-[4px] text-[16px] font-bold font-['DM_Sans'] hover:bg-[#E57600] transition-colors shadow-sm"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
