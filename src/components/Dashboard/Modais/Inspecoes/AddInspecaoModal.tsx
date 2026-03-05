import React from 'react';

interface AddInspecaoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (inspecao: any) => void;
    onEdit?: (id: number, inspecao: any) => void;
    inspecaoParaEditar?: any;
    inspecaoConferida: boolean;
    setInspecaoConferida: (conferida: boolean) => void;
}

export const AddInspecaoModal: React.FC<AddInspecaoModalProps> = ({
    isOpen,
    onClose,
    onAdd,
    onEdit,
    inspecaoParaEditar,
    inspecaoConferida,
    setInspecaoConferida
}) => {
    const [name, setName] = React.useState('');
    const [intervalo, setIntervalo] = React.useState('');
    const [aviso, setAviso] = React.useState('');
    const [dataProxima, setDataProxima] = React.useState('');
    const [grupo, setGrupo] = React.useState('');

    React.useEffect(() => {
        if (inspecaoParaEditar) {
            setName(inspecaoParaEditar.name || '');
            setIntervalo((inspecaoParaEditar.periodicity || '').replace(' dias', ''));
            setAviso(inspecaoParaEditar.warn || '');
            setDataProxima(inspecaoParaEditar.next || '');
        } else {
            setName('');
            setIntervalo('');
            setAviso('');
            setDataProxima('');
            setGrupo('');
        }
    }, [inspecaoParaEditar, isOpen]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);

        let maskedValue = '';
        if (value.length > 0) {
            maskedValue = value.slice(0, 2);
            if (value.length > 2) {
                maskedValue += '/' + value.slice(2, 4);
                if (value.length > 4) {
                    maskedValue += '/' + value.slice(4, 8);
                }
            }
        }
        setDataProxima(maskedValue);
    };

    const handleSave = () => {
        if (!name.trim()) return;

        const dados = {
            name,
            updated: inspecaoParaEditar ? inspecaoParaEditar.updated : new Date().toLocaleDateString('pt-BR'),
            next: dataProxima || 'A definir',
            warn: aviso || 'A definir',
            periodicity: intervalo ? `${intervalo} dias` : 'A definir'
        };

        if (inspecaoParaEditar && onEdit) {
            onEdit(inspecaoParaEditar.id, dados);
        } else {
            onAdd(dados);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-in fade-in duration-200">
            <div className="w-[717px] bg-white rounded-[8px] outline outline-1 outline-[rgba(0,0,0,0.10)] -outline-offset-1 flex flex-col justify-start items-center relative shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="self-stretch px-[40px] py-[20px] bg-white rounded-t-[8px] border-b border-[#E1E1E1] flex justify-between items-center shrink-0">
                    <h2 className="text-[#404040] text-[20px] font-medium font-['Funnel_Sans']">
                        {inspecaoParaEditar ? 'Editar Inspeção' : 'Adicionar Inspeção'}
                    </h2>
                    <div
                        onClick={onClose}
                        className="w-[40px] h-[40px] p-[4px] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-[24px] h-[24px] relative flex items-center justify-center text-[#404040]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="self-stretch p-[32px] flex flex-col gap-[24px]">
                    {/* Descrição */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Descrição / Nome da Inspeção</label>
                        <textarea
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Insira a descrição da inspeção"
                            className="w-full h-[100px] px-[20px] py-[13px] bg-white border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] resize-none placeholder:text-[#414F5D]"
                        />
                    </div>

                    {/* Row: Intervalo & Quando Avisar */}
                    <div className="flex gap-[24px]">
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Intervalo de inspeções (em dias)</label>
                            <input
                                type="number"
                                value={intervalo}
                                onChange={(e) => setIntervalo(e.target.value)}
                                placeholder="Ex: 30"
                                className="w-full h-[56px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D]"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Quando Avisar? (dias antes da inspeção)</label>
                            <input
                                type="text"
                                value={aviso}
                                onChange={(e) => setAviso(e.target.value)}
                                placeholder="Insira os dias"
                                className="w-full h-[56px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D]"
                            />
                        </div>
                    </div>

                    {/* Row: Data & Grupo */}
                    <div className="flex gap-[24px]">
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Data da próxima inspeção</label>
                            <input
                                type="text"
                                value={dataProxima}
                                onChange={handleDateChange}
                                placeholder="DD/MM/YYYY"
                                className="w-full h-[56px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D]"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Grupo/Classificação</label>
                            <input
                                type="text"
                                value={grupo}
                                onChange={(e) => setGrupo(e.target.value)}
                                placeholder="Ex: Elétrica"
                                className="w-full h-[56px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D]"
                            />
                        </div>
                    </div>

                    {/* Divider Line */}
                    <div className="w-full h-[1px] bg-black opacity-5" />

                    {/* Conferido Checkbox */}
                    <div className="flex items-center gap-[12px]">
                        <div
                            onClick={() => setInspecaoConferida(!inspecaoConferida)}
                            className={`w-[20px] h-[20px] rounded-[4px] border-[2px] cursor-pointer flex items-center justify-center transition-all ${inspecaoConferida ? 'border-[#F78800] bg-[#F78800]' : 'border-[#CCCCCC] bg-white'}`}
                        >
                            {inspecaoConferida && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <span className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">Conferido</span>
                    </div>

                    {/* Buttons Area */}
                    <div className="flex items-center gap-[16px]">
                        <button
                            onClick={onClose}
                            className="flex-1 h-[56px] border border-[#F78800] rounded-[4px] flex items-center justify-center text-[#F78800] text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-orange-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 h-[56px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors shadow-sm"
                        >
                            {inspecaoParaEditar ? 'Salvar Alterações' : 'Adicionar Inspeção'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
