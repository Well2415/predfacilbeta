import React from 'react';
import { RelatorioInspecaoItem } from '../../../../hooks/relatorioInspecoesData';

interface ViewRelatorioInspecaoModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: RelatorioInspecaoItem | null;
}

const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
    <div className="flex justify-between items-center px-[40px] py-[20px] bg-white border-b border-[#E1E1E1] rounded-t-[16px] self-stretch">
        <h3 className="text-[#404040] text-[20px] font-medium font-['Funnel_Sans'] leading-normal">{title}</h3>
        <button onClick={onClose} className="w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors p-[4px] overflow-hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>
);

const ViewField: React.FC<{
    label: string;
    value?: string;
}> = ({ label, value }) => (
    <div className="flex flex-col gap-[8px] w-full self-stretch">
        <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans'] leading-normal">{label}</label>
        <div className="w-full py-[13px] bg-white rounded-[4px] flex items-start self-stretch border-b border-[#F0F0F0]">
            <div className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] leading-normal whitespace-pre-wrap">
                {value || '-'}
            </div>
        </div>
    </div>
);

export const ViewRelatorioInspecaoModal: React.FC<ViewRelatorioInspecaoModalProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-[20px] backdrop-blur-sm">
            <div className="w-[867px] max-h-[90vh] overflow-y-auto bg-white rounded-[8px] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200 scrollbar-hide border border-black/10">
                <ModalHeader title={data?.nome || 'Visualizar Relatório'} onClose={onClose} />
                <div className="p-[32px] flex flex-col gap-[24px] self-stretch">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                        <ViewField label="Enviado Por" value={data?.enviadoPor} />
                        <ViewField label="Previsto Para" value={data?.previsto} />
                        <ViewField label="Respondido Em" value={data?.respondido} />
                    </div>
                </div>
            </div>
        </div>
    );
};
