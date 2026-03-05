import React from 'react';
import { Sistema } from '../../../../hooks/relatorioSistemasData';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: Sistema | null;
    onAdd?: (data: Omit<Sistema, 'id'>) => void;
    onEdit?: (id: number, data: Partial<Sistema>) => void;
    onDelete?: (id: number) => void;
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

const InputField: React.FC<{
    label: string;
    placeholder: string;
    name: string;
    defaultValue?: string;
    readOnly?: boolean;
    multiline?: boolean;
}> = ({ label, placeholder, name, defaultValue, readOnly, multiline }) => (
    <div className="flex flex-col gap-[8px] w-full self-stretch">
        <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans'] leading-normal">{label}</label>
        <div className={`w-full px-[20px] py-[13px] bg-white rounded-[4px] border border-[#F0F0F0] flex items-start transition-colors ${readOnly ? 'bg-gray-50' : 'focus-within:border-[#F78800]'} self-stretch`}>
            {multiline ? (
                <textarea
                    name={name}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    readOnly={readOnly}
                    rows={4}
                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#848484] bg-transparent border-none outline-none resize-none leading-normal scrollbar-hide"
                />
            ) : (
                <input
                    type="text"
                    name={name}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    readOnly={readOnly}
                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#848484] bg-transparent border-none outline-none flex items-center h-[30px] leading-normal"
                />
            )}
        </div>
    </div>
);

const ViewField: React.FC<{
    label: string;
    defaultValue?: string;
}> = ({ label, defaultValue }) => (
    <div className="flex flex-col gap-[8px] w-full self-stretch">
        <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans'] leading-normal">{label}</label>
        <div className="w-full py-[13px] bg-white rounded-[4px] flex items-start self-stretch">
            <div className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] leading-normal whitespace-pre-wrap">
                {defaultValue || '-'}
            </div>
        </div>
    </div>
);

export const AddSistemaModal: React.FC<ModalProps> = ({ isOpen, onClose, onAdd }) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newData = {
            nome: formData.get('nome') as string,
            descricao: formData.get('descricao') as string,
            cuidadosUso: formData.get('cuidadosUso') as string,
            normasTecnicas: formData.get('normasTecnicas') as string,
            glossario: formData.get('glossario') as string,
        };
        onAdd?.(newData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-[20px] backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="w-[867px] max-h-[90vh] overflow-y-auto bg-white rounded-[8px] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200 scrollbar-hide border border-black/10">
                <ModalHeader title="Adicionar Sistema" onClose={onClose} />
                <div className="p-[32px] flex flex-col gap-[24px] self-stretch">
                    <InputField label="Nome do Sistema" name="nome" placeholder="Insira o nome do Sistema" />
                    <InputField label="Descrição" name="descricao" placeholder="Insira uma descrição do sistema" multiline />
                    <InputField label="Cuidados de Uso" name="cuidadosUso" placeholder="Insira os Cuidados de Uso" multiline />
                    <InputField label="Normas Técnicas" name="normasTecnicas" placeholder="Insira as Normas Técnicas" multiline />
                    <InputField label="Glossário" name="glossario" placeholder="Insira o Glossário" multiline />

                    <div className="self-stretch h-[1px] border-t border-black/5"></div>

                    <div className="flex gap-[16px] self-stretch items-center">
                        <button type="button" onClick={onClose} className="flex-1 h-[56px] px-[16px] border border-[#F78800] rounded-[4px] flex items-center justify-center text-[#F78800] text-[16px] font-semibold font-['Funnel_Sans'] leading-[19.2px] hover:bg-[#FFF5E5] transition-all">Cancelar</button>
                        <button type="submit" className="flex-1 h-[56px] px-[16px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-semibold font-['Funnel_Sans'] leading-[19.2px] hover:bg-[#E57600] transition-all">Adicionar</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export const EditSistemaModal: React.FC<ModalProps> = ({ isOpen, onClose, data, onEdit }) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data) return;
        const formData = new FormData(e.currentTarget);
        const updatedData = {
            nome: formData.get('nome') as string,
            descricao: formData.get('descricao') as string,
            cuidadosUso: formData.get('cuidadosUso') as string,
            normasTecnicas: formData.get('normasTecnicas') as string,
            glossario: formData.get('glossario') as string,
        };
        onEdit?.(data.id, updatedData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-[20px] backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="w-[867px] max-h-[95vh] overflow-y-auto bg-white rounded-[8px] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200 scrollbar-hide border border-black/10">
                <ModalHeader title="Editar Sistema" onClose={onClose} />
                <div className="p-[32px] flex flex-col gap-[24px] self-stretch">
                    <InputField label="Nome do Sistema" name="nome" placeholder="Insira o nome do Sistema" defaultValue={data?.nome} />
                    <InputField label="Descrição" name="descricao" placeholder="Insira uma descrição do sistema" defaultValue={data?.descricao} multiline />
                    <InputField label="Cuidados de Uso" name="cuidadosUso" placeholder="Insira os Cuidados de Uso" defaultValue={data?.cuidadosUso} multiline />
                    <InputField label="Normas Técnicas" name="normasTecnicas" placeholder="Insira as Normas Técnicas" defaultValue={data?.normasTecnicas} multiline />
                    <InputField label="Glossário" name="glossario" placeholder="Insira o Glossário" defaultValue={data?.glossario} multiline />

                    <div className="self-stretch h-[1px] border-t border-black/5"></div>

                    <div className="flex gap-[16px] self-stretch items-center">
                        <button type="button" onClick={onClose} className="flex-1 h-[56px] px-[16px] border border-[#F78800] rounded-[4px] flex items-center justify-center text-[#F78800] text-[16px] font-semibold font-['Funnel_Sans'] leading-[19.2px] hover:bg-[#FFF5E5] transition-all">Cancelar</button>
                        <button type="submit" className="flex-1 h-[56px] px-[16px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-semibold font-['Funnel_Sans'] leading-[19.2px] hover:bg-[#E57600] transition-all">Salvar</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export const ViewSistemaModal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-[20px] backdrop-blur-sm">
            <div className="w-[867px] max-h-[90vh] overflow-y-auto bg-white rounded-[8px] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200 scrollbar-hide border border-black/10">
                <ModalHeader title={data?.nome || 'Visualizar Sistema'} onClose={onClose} />
                <div className="p-[32px] flex flex-col gap-[24px] self-stretch">
                    <ViewField label="Descrição" defaultValue={data?.descricao} />
                    <ViewField label="Cuidados de Uso" defaultValue={data?.cuidadosUso} />
                    <ViewField label="Normas Técnicas" defaultValue={data?.normasTecnicas} />
                    <ViewField label="Glossário" defaultValue={data?.glossario} />
                </div>
            </div>
        </div>
    );
};

interface SistemaModalsProps {
    showAddSistemaModal: boolean;
    setShowAddSistemaModal: (show: boolean) => void;
    showEditSistemaModal: boolean;
    setShowEditSistemaModal: (show: boolean) => void;
    showViewSistemaModal: boolean;
    setShowViewSistemaModal: (show: boolean) => void;
    data?: Sistema | null;
    onAdd?: (data: Omit<Sistema, 'id'>) => void;
    onEdit?: (id: number, data: Partial<Sistema>) => void;
    onDelete?: (id: number) => void;
}

export const SistemaModals: React.FC<SistemaModalsProps> = ({
    showAddSistemaModal,
    setShowAddSistemaModal,
    showEditSistemaModal,
    setShowEditSistemaModal,
    showViewSistemaModal,
    setShowViewSistemaModal,
    data,
    onAdd,
    onEdit,
    onDelete
}) => {
    return (
        <>
            <AddSistemaModal
                isOpen={showAddSistemaModal}
                onClose={() => setShowAddSistemaModal(false)}
                onAdd={onAdd}
            />
            <EditSistemaModal
                isOpen={showEditSistemaModal}
                onClose={() => setShowEditSistemaModal(false)}
                data={data}
                onEdit={onEdit}
                onDelete={onDelete}
            />
            <ViewSistemaModal
                isOpen={showViewSistemaModal}
                onClose={() => setShowViewSistemaModal(false)}
                data={data}
            />
        </>
    );
};
