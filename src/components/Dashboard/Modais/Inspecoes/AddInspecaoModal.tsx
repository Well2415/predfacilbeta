import React, { useState, useEffect, useMemo } from 'react';
import { AddProcedureModal } from '../Procedimentos/AddProcedureModal';
import { EditProcedureModal } from '../Procedimentos/EditProcedureModal';
import PesquisarIcon from '../../../../../imgdasboard/icones/Pesquisar.png';
import EditarCadastroIcon from '../../../../../imgdasboard/icones/IconeExcluirCadastro.svg';
import ExcluirCadastroIcon from '../../../../../imgdasboard/icones/IconeEditarcadastro.svg';

interface AddInspecaoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (inspecao: any, procedures: any[]) => void;
    onEdit?: (id: number, inspecao: any, procedures: any[]) => void;
    inspecaoParaEditar?: any;
    inspecaoConferida: boolean;
    setInspecaoConferida: (conferida: boolean) => void;
    getProcedimentos?: (id: number) => any[];
}

export const AddInspecaoModal: React.FC<AddInspecaoModalProps> = ({
    isOpen,
    onClose,
    onAdd,
    onEdit,
    inspecaoParaEditar,
    inspecaoConferida,
    setInspecaoConferida,
    getProcedimentos
}) => {
    const [name, setName] = React.useState('');
    const [intervalo, setIntervalo] = React.useState('');
    const [aviso, setAviso] = React.useState('');
    const [dataProxima, setDataProxima] = React.useState('');
    const [grupo, setGrupo] = React.useState('');
    const [localProcedures, setLocalProcedures] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddProcedure, setShowAddProcedure] = useState(false);
    const [procedureToEdit, setProcedureToEdit] = useState<any>(null);
    const [showEditProcedure, setShowEditProcedure] = useState(false);

    useEffect(() => {
        if (inspecaoParaEditar) {
            setName(inspecaoParaEditar.name || '');
            setIntervalo((inspecaoParaEditar.periodicity || '').replace(' dias', ''));
            setAviso(inspecaoParaEditar.warn || '');
            setDataProxima(inspecaoParaEditar.next || '');
            
            if (getProcedimentos) {
                setLocalProcedures(getProcedimentos(inspecaoParaEditar.id));
            }
        } else {
            setName('');
            setIntervalo('');
            setAviso('');
            setDataProxima('');
            setGrupo('');
            setLocalProcedures([]);
        }
    }, [inspecaoParaEditar, isOpen, getProcedimentos]);

    const filteredProcedures = useMemo(() => {
        if (!searchTerm.trim()) return localProcedures;
        return localProcedures.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [localProcedures, searchTerm]);

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
            onEdit(inspecaoParaEditar.id, dados, localProcedures);
        } else {
            onAdd(dados, localProcedures);
        }

        onClose();
    };

    const handleAddLocalProcedure = (proc: any) => {
        const newId = localProcedures.length > 0 ? Math.max(...localProcedures.map(p => p.id)) + 1 : 1;
        setLocalProcedures(prev => [{ ...proc, id: newId }, ...prev]);
    };

    const handleEditLocalProcedure = (id: number, data: any) => {
        setLocalProcedures(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const handleDeleteLocalProcedure = (id: number) => {
        setLocalProcedures(prev => prev.filter(p => p.id !== id));
    };

    const anySubModalOpen = showAddProcedure || showEditProcedure;

    if (!isOpen) return null;

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-in fade-in duration-200 ${anySubModalOpen ? 'hidden' : ''}`}>
                <div className="w-[717px] max-h-[95vh] bg-white rounded-[8px] outline outline-1 outline-[rgba(0,0,0,0.10)] -outline-offset-1 flex flex-col justify-start items-center relative shadow-2xl animate-in zoom-in-95 duration-200">
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
                <div className="self-stretch p-[32px] flex flex-col gap-[24px] overflow-y-auto custom-scrollbar">
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

                    {/* Procedimentos e Verificações Section */}
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex items-center justify-between">
                            <span className="text-[#848484] text-[18px] font-medium font-['Funnel_Sans']">Procedimentos e Verificações</span>
                            <button
                                onClick={() => setShowAddProcedure(true)}
                                className="h-[40px] px-[24px] border border-[#F78800] rounded-[30px] flex items-center justify-center text-[#F78800] text-[16px] font-bold font-['DM_Sans'] hover:bg-orange-50 transition-colors gap-[8px]"
                            >
                                <span className="text-[20px]">+</span> Novo
                            </button>
                        </div>

                        {/* Search Procedures */}
                        <div className="w-full h-[56px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] flex items-center gap-[12px]">
                            <img src={PesquisarIcon} alt="Pesquisar" className="w-[20px] h-[20px] opacity-50" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Pesquise aqui..."
                                className="flex-1 bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D]"
                            />
                        </div>

                        {/* Procedures List */}
                        <div className="flex flex-col gap-[12px] max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredProcedures.length === 0 ? (
                                <div className="py-[20px] text-center text-[#848484] text-[14px] font-['Funnel_Sans']">
                                    Nenhum procedimento adicionado.
                                </div>
                            ) : (
                                filteredProcedures.map((proc) => (
                                    <div key={proc.id} className="w-full flex flex-col gap-[8px]">
                                        <div className="flex justify-between items-start gap-[12px]">
                                            <div className="flex-1 flex flex-col gap-[4px]">
                                                <p className="text-[#404040] text-[15px] font-bold font-['Funnel_Sans'] leading-tight">
                                                    {proc.name}
                                                </p>
                                                <div className="flex gap-[8px] flex-wrap">
                                                    <span className="text-[#848484] text-[13px] font-normal font-['Funnel_Sans']">
                                                        Ambiente: {proc.ambiente || 'Não informado'}
                                                    </span>
                                                    <span className="text-[#848484] text-[13px] font-normal font-['Funnel_Sans']">
                                                        Categoria: {proc.categoria || 'Não informado'}
                                                    </span>
                                                    <span className="text-[#848484] text-[13px] font-normal font-['Funnel_Sans']">
                                                        Indicado: {proc.realizador || 'Não informado'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-[12px] items-center pt-[4px]">
                                                <button
                                                    onClick={() => {
                                                        setProcedureToEdit(proc);
                                                        setShowEditProcedure(true);
                                                    }}
                                                    className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors"
                                                >
                                                    <img src={EditarCadastroIcon} alt="Editar" className="w-[18px] h-[18px]" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLocalProcedure(proc.id)}
                                                    className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                                                >
                                                    <img src={ExcluirCadastroIcon} alt="Excluir" className="w-[18px] h-[18px]" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div> {/* End of Procedimentos e Verificações Section */}
                </div> {/* End of scrollable Content Area */}

                {/* Buttons Area - Fixed at bottom of modal */}
                <div className="self-stretch px-[32px] py-[24px] border-t border-[#E1E1E1] flex items-center gap-[16px] bg-white rounded-b-[8px] shrink-0">
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
            </div> {/* End of Modal Wrapper */}
        </div> {/* End of Modal Background */}

            {/* Sub-modals for Procedures - Moved outside to be visible when parent is hidden */}
            <AddProcedureModal
                isOpen={showAddProcedure}
                onClose={() => setShowAddProcedure(false)}
                onAdd={handleAddLocalProcedure}
            />
            <EditProcedureModal
                isOpen={showEditProcedure}
                onClose={() => {
                    setShowEditProcedure(false);
                    setProcedureToEdit(null);
                }}
                onSave={handleEditLocalProcedure}
                procedimento={procedureToEdit}
            />
        </>
    );
};
