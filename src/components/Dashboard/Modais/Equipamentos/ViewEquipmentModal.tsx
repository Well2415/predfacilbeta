import { EquipamentoItem } from '../../../../hooks/cadastroEquipamentosData';

interface ViewEquipmentModalProps {
    onClose: () => void;
    data: EquipamentoItem;
}

export function ViewEquipmentModal({ onClose, data }: ViewEquipmentModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="w-[717px] bg-white rounded-[8px] outline outline-1 outline-[rgba(0,0,0,0.10)] -outline-offset-1 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="h-[80px] px-[40px] py-[20px] border-b border-[#E1E1E1] flex justify-between items-center shrink-0 rounded-t-[16px]">
                    <div className="text-[#404040] text-[20px] font-medium font-['Funnel_Sans']">{data?.nome}</div>
                    <button onClick={onClose} className="w-[40px] h-[40px] p-[4px] rounded-[30px] flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-[32px] flex flex-col gap-[24px] overflow-y-auto custom-scrollbar">
                    <div className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] leading-[22.40px]">Informações básicas</div>

                    <div className="flex gap-[24px]">
                        {/* Image Area */}
                        <div className="w-[155px] h-[151px] relative bg-white rounded-[4px] outline outline-1 outline-[rgba(0,0,0,0.10)] -outline-offset-1 overflow-hidden shrink-0">
                            <img
                                src="https://placehold.co/105x79"
                                alt="Equipment"
                                className="absolute left-[25px] top-[36px] w-[105px] h-[79px] object-cover"
                            />
                        </div>

                        {/* Basic Info Fields */}
                        <div className="flex-1 flex flex-col gap-[24px]">
                            {/* Categoria */}
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Categoria</label>
                                <div className="h-[32px] flex items-center">
                                    <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data?.categoria}</span>
                                </div>
                            </div>

                            {/* Nome */}
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Nome</label>
                                <div className="h-[32px] flex items-center">
                                    <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data?.nome}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row: Serial and Marca */}
                    <div className="flex gap-[24px]">
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">№ de Série:</label>
                            <div className="h-[32px] flex items-center">
                                <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data?.serial}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Marca</label>
                            <div className="h-[32px] flex items-center">
                                <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data?.marca || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Modelo */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Modelo</label>
                        <div className="h-[32px] flex items-center">
                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data?.modelo || '-'}</span>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="h-[1px] bg-[rgba(0,0,0,0.05)] w-full"></div>

                    <div className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] leading-[22.40px]">Dados Técnicos</div>

                    {/* Technical Grid 1 */}
                    <div className="grid grid-cols-4 gap-[24px]">
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Voltagem</label>
                            <div className="h-[32px] flex items-center">
                                <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data?.voltagem || '-'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Frequência HZ</label>
                            <div className="h-[32px] flex items-center">
                                <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data?.frequencia || '-'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Potência KW</label>
                            <div className="h-[32px] flex items-center">
                                <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data?.potenciaKW || '-'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Tensão V</label>
                            <div className="h-[32px] flex items-center">
                                <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data?.tensaoV || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
