import React, { useState, useEffect, useRef } from 'react';

interface AddSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (fornecedor: any) => void;
    onEdit?: (id: number, fornecedor: any) => void;
    fornecedorParaEditar?: any;
}

// ─── UTILS: MÁSCARAS ─────────────────────────────────────────────────────────

const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

const maskCNPJ = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

const maskCEP = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
};

const maskPhone = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
};

export const AddSupplierModal: React.FC<AddSupplierModalProps> = ({
    isOpen,
    onClose,
    onAdd,
    onEdit,
    fornecedorParaEditar
}) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [cpf, setCpf] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [cep, setCep] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [address, setAddress] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [phone, setPhone] = useState('');
    const [cell, setCell] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [registeredAt, setRegisteredAt] = useState('');
    const [rating, setRating] = useState(3.5);
    const [loadingCEP, setLoadingCEP] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (fornecedorParaEditar) {
            setName(fornecedorParaEditar.name || '');
            setCategory(fornecedorParaEditar.category || '');
            setCpf(fornecedorParaEditar.cpf || '');
            setCnpj(fornecedorParaEditar.cnpj || '');
            setCep(fornecedorParaEditar.cep || '');
            setCity(fornecedorParaEditar.city || '');
            setState(fornecedorParaEditar.state || '');
            setAddress(fornecedorParaEditar.address || '');
            setNeighborhood(fornecedorParaEditar.neighborhood || '');
            setPhone(fornecedorParaEditar.phone || '');
            setCell(fornecedorParaEditar.cell || '');
            setEmail(fornecedorParaEditar.email || '');
            setWebsite(fornecedorParaEditar.website || '');
            setRegisteredAt(fornecedorParaEditar.registeredAt || '');
            setRating(fornecedorParaEditar.rating || 3.5);
            setPhoto(fornecedorParaEditar.photo || null);
        } else {
            setName('');
            setCategory('');
            setCpf('');
            setCnpj('');
            setCep('');
            setCity('');
            setState('');
            setAddress('');
            setNeighborhood('');
            setPhone('');
            setCell('');
            setEmail('');
            setWebsite('');
            setRegisteredAt(new Date().toLocaleDateString('pt-BR'));
            setRating(3.5);
            setPhoto(null);
        }
    }, [fornecedorParaEditar, isOpen]);

    // Busca de CEP
    useEffect(() => {
        const cleanCEP = cep.replace(/\D/g, '');
        if (cleanCEP.length === 8) {
            setLoadingCEP(true);
            fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
                .then(res => res.json())
                .then(data => {
                    if (!data.erro) {
                        setCity(data.localidade || '');
                        setState(data.uf || '');
                        setAddress(data.logradouro || '');
                        setNeighborhood(data.bairro || '');
                    }
                })
                .finally(() => setLoadingCEP(false));
        }
    }, [cep]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSave = () => {
        if (!name.trim()) return;

        const dados = {
            name,
            category,
            cpf,
            cnpj,
            cep,
            city,
            state,
            address,
            neighborhood,
            phone,
            cell,
            email,
            website,
            registeredAt,
            rating,
            photo
        };

        if (fornecedorParaEditar && onEdit) {
            onEdit(fornecedorParaEditar.id, dados);
        } else {
            onAdd(dados);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="w-[717px] max-h-[95vh] overflow-y-auto bg-white rounded-[8px] flex flex-col items-center justify-start relative shadow-2xl animate-in zoom-in-95 duration-200 scrollbar-hide"
                style={{ outline: '1px solid rgba(0, 0, 0, 0.10)', outlineOffset: '-1px' }}
            >
                {/* Header */}
                <div className="self-stretch px-[40px] py-[20px] bg-white rounded-t-[8px] border-b border-[#E1E1E1] flex justify-between items-center sticky top-0 z-10">
                    <div className="text-[#404040] text-[20px] font-medium font-['Funnel_Sans']">
                        {fornecedorParaEditar ? 'Editar Fornecedor' : 'Adicionar Fornecedor'}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="self-stretch p-[32px] flex flex-col gap-[24px]">
                    {/* Top Section: Photo + Basic Info */}
                    <div className="flex gap-[24px]">
                        {/* Photo Upload area */}
                        <div
                            onClick={triggerFileInput}
                            className="w-[191px] h-[186px] bg-[#F4F5FA] rounded-[4px] relative flex items-center justify-center border border-black/[0.05] cursor-pointer overflow-hidden group"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            {photo ? (
                                <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-[#848484] flex flex-col items-center gap-2">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <span className="text-[12px] font-['Funnel_Sans']">Adicionar Foto</span>
                                </div>
                            )}
                            <div className="w-[32px] h-[32px] absolute bottom-[14px] right-[16px] bg-white rounded-[4px] shadow-md flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                            </div>
                        </div>

                        {/* Right side inputs */}
                        <div className="flex-1 flex flex-col gap-[24px]">
                            {/* Nome */}
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Nome</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Insira o Nome do Fornecedor"
                                    className="w-full h-[56px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] focus:border-[#F78800] transition-colors"
                                />
                            </div>
                            {/* Categoria */}
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Categoría</label>
                                <div className="relative group">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="appearance-none w-full h-[56px] px-[20px] bg-white border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] cursor-pointer focus:border-[#F78800] transition-colors"
                                    >
                                        <option value="">Selecione a Categoría</option>
                                        <option value="Dedetizadora / Limpa Fossa">Dedetizadora / Limpa Fossa</option>
                                        <option value="Contabilidade">Contabilidade</option>
                                        <option value="Diversos">Diversos</option>
                                        <option value="Bombas">Bombas</option>
                                        <option value="Arquitetura">Arquitetura</option>
                                    </select>
                                    <div className="absolute right-[20px] top-1/2 -translate-y-1/2 pointer-events-none text-[#848484]">
                                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                                            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Row: CPF + CNPJ */}
                    <div className="grid grid-cols-2 gap-[24px]">
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">CPF</label>
                            <input
                                type="text"
                                value={cpf}
                                onChange={(e) => setCpf(maskCPF(e.target.value))}
                                placeholder="000.000.000-00"
                                className="h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] focus:border-[#F78800]"
                            />
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">CNPJ</label>
                            <input
                                type="text"
                                value={cnpj}
                                onChange={(e) => setCnpj(maskCNPJ(e.target.value))}
                                placeholder="00.000.000/0000-00"
                                className="h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] focus:border-[#F78800]"
                            />
                        </div>
                    </div>

                    {/* Form Row: CEP + Cidade + UF */}
                    <div className="flex gap-[24px]">
                        <div className="flex-1 flex flex-col gap-[8px] relative">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">CEP</label>
                            <input
                                type="text"
                                value={cep}
                                onChange={(e) => setCep(maskCEP(e.target.value))}
                                placeholder="00000-000"
                                className={`h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] focus:border-[#F78800] ${loadingCEP ? 'opacity-50' : ''}`}
                            />
                            {loadingCEP && (
                                <div className="absolute right-3 bottom-4 animate-spin h-5 w-5 border-2 border-[#F78800] border-t-transparent rounded-full" />
                            )}
                        </div>
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Cidade</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] focus:border-[#F78800]"
                            />
                        </div>
                        <div className="w-[65px] flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">UF</label>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value.toUpperCase())}
                                placeholder="GO"
                                className="h-[56px] px-[12px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] text-center font-normal font-['Funnel_Sans'] focus:border-[#F78800]"
                            />
                        </div>
                    </div>

                    {/* Form Row: Endereço + Bairro */}
                    <div className="grid grid-cols-2 gap-[24px]">
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Endereço</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Insira o Endereço"
                                className="h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] focus:border-[#F78800]"
                            />
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Bairro</label>
                            <input
                                type="text"
                                value={neighborhood}
                                onChange={(e) => setNeighborhood(e.target.value)}
                                placeholder="Insira o Bairro"
                                className="h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] focus:border-[#F78800]"
                            />
                        </div>
                    </div>

                    {/* Form Row: Telefone + Celular */}
                    <div className="grid grid-cols-2 gap-[24px]">
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Telefone</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(maskPhone(e.target.value))}
                                placeholder="(00) 0000-0000"
                                className="h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] focus:border-[#F78800]"
                            />
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Celular</label>
                            <input
                                type="text"
                                value={cell}
                                onChange={(e) => setCell(maskPhone(e.target.value))}
                                placeholder="(00) 00000-0000"
                                className="h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] focus:border-[#F78800]"
                            />
                        </div>
                    </div>

                    {/* Form Row: E-mail + Site */}
                    <div className="grid grid-cols-2 gap-[24px]">
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">E-mail</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Insira o E-mail"
                                className="h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] focus:border-[#F78800]"
                            />
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Site</label>
                            <input
                                type="text"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="Insira o Site"
                                className="h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] placeholder:text-[#414F5D] focus:border-[#F78800]"
                            />
                        </div>
                    </div>

                    {/* Form Row: Data de Cadastro + Pontuação */}
                    <div className="grid grid-cols-2 gap-[24px]">
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Data de Cadastro</label>
                            <input
                                type="text"
                                value={fornecedorParaEditar ? registeredAt : new Date().toLocaleDateString('pt-BR')}
                                disabled
                                className="h-[56px] px-[20px] border border-[#F0F0F0] rounded-[4px] outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] bg-gray-50 cursor-not-allowed opacity-70"
                            />
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Pontuação</label>
                            <div className="flex items-center gap-[4px] pt-[12px]">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div key={s} className="relative w-[28px] h-[28px] cursor-pointer" onClick={() => setRating(s)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill={s <= Math.floor(rating) ? "#FFCB45" : "none"} stroke="#FFCB45" strokeWidth="1.5">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                        {s === Math.ceil(rating) && rating % 1 !== 0 && (
                                            <div className="absolute inset-0 overflow-hidden w-1/2">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFCB45" stroke="#FFCB45" strokeWidth="1.5">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Consultas Button */}
                    <button className="w-full h-[56px] bg-[#F78800] rounded-[4px] text-white text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors shadow-sm mt-[8px]">
                        Consultas
                    </button>

                    {/* Divider */}
                    <div className="h-[1px] bg-black/[0.05] w-full"></div>

                    {/* Footer Buttons */}
                    <div className="flex gap-[16px] w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 h-[56px] border border-[#F78800] rounded-[4px] text-[#F78800] text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-orange-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 h-[56px] bg-[#F78800] rounded-[4px] text-white text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors shadow-sm"
                        >
                            {fornecedorParaEditar ? 'Salvar Alterações' : 'Adicionar Fornecedor'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
