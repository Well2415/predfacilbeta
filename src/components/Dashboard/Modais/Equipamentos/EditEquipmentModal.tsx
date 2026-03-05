import { useState, useEffect, useRef } from 'react';
import IconeFotoEdit from '../../../../../imgdasboard/icones/Adicionarimagemequipamento.png';
import IconeExcluirFoto from '../../../../../imgdasboard/icones/Iconeexcluirfotocadastro.png';
import { EquipamentoItem } from '../../../../hooks/cadastroEquipamentosData';

interface EditEquipmentModalProps {
    onClose: () => void;
    onSave: (id: number, data: Partial<EquipamentoItem>) => void;
    data: EquipamentoItem;
}

export function EditEquipmentModal({ onClose, onSave, data }: EditEquipmentModalProps) {
    const [nome, setNome] = useState(data?.nome || '');
    const [marca, setMarca] = useState(data?.marca || '');
    const [modelo, setModelo] = useState(data?.modelo || '');
    const [serial, setSerial] = useState(data?.serial || '');
    const [categoria, setCategoria] = useState(data?.categoria || '');
    const [voltagem, setVoltagem] = useState(data?.voltagem || '');
    const [btuh, setBtuh] = useState(data?.btuh || '');
    const [frequencia, setFrequencia] = useState(data?.frequencia || '');
    const [capacidade, setCapacidade] = useState(data?.capacidade || '');
    const [potenciaKW, setPotenciaKW] = useState(data?.potenciaKW || '');
    const [potenciaCV, setPotenciaCV] = useState(data?.potenciaCV || '');
    const [potenciaBTU, setPotenciaBTU] = useState(data?.potenciaBTU || '');
    const [tensaoV, setTensaoV] = useState(data?.tensaoV || '');
    const [corrente, setCorrente] = useState(data?.corrente || '');
    const [maxMCA, setMaxMCA] = useState(data?.maxMCA || '');
    const [vazaoMax, setVazaoMax] = useState(data?.vazaoMax || '');
    const [vazaoMin, setVazaoMin] = useState(data?.vazaoMin || '');
    const [vazaoLS, setVazaoLS] = useState(data?.vazaoLS || '');
    const [imagem, setImagem] = useState(data?.imagem || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showCategoriaDropdown, setShowCategoriaDropdown] = useState(false);
    const [showVoltagemDropdown, setShowVoltagemDropdown] = useState(false);

    const categorias = ['Aparelhos de Ar Condicionado', 'Diversos', 'Máquinas', 'Ferramentas'];
    const voltagens = ['110v', '220v', '380v', 'Bivolt'];

    // Sincronizar se o dado mudar externamente
    useEffect(() => {
        if (data) {
            setNome(data.nome);
            setMarca(data.marca);
            setModelo(data.modelo);
            setSerial(data.serial);
            setCategoria(data.categoria);
            setVoltagem(data.voltagem);
            setBtuh(data.btuh);
            setFrequencia(data.frequencia);
            setCapacidade(data.capacidade);
            setPotenciaKW(data.potenciaKW);
            setPotenciaCV(data.potenciaCV);
            setPotenciaBTU(data.potenciaBTU);
            setTensaoV(data.tensaoV);
            setCorrente(data.corrente);
            setMaxMCA(data.maxMCA);
            setVazaoMax(data.vazaoMax);
            setVazaoMin(data.vazaoMin);
            setVazaoLS(data.vazaoLS);
            setImagem(data.imagem);
        }
    }, [data]);

    const handleSave = () => {
        if (!nome || !categoria) {
            alert('Por favor, preencha o nome e selecione uma categoria.');
            return;
        }

        onSave(data.id, {
            nome,
            marca,
            modelo,
            serial,
            categoria,
            voltagem,
            btuh,
            frequencia,
            capacidade,
            potenciaKW,
            potenciaCV,
            potenciaBTU,
            tensaoV,
            corrente,
            maxMCA,
            vazaoMax,
            vazaoMin,
            vazaoLS,
            imagem
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagem(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImagem('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="w-[717px] bg-white rounded-[8px] outline outline-1 outline-[rgba(0,0,0,0.10)] -outline-offset-1 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="h-[80px] px-[40px] py-[20px] border-b border-[#E1E1E1] flex justify-between items-center shrink-0 rounded-t-[16px]">
                    <div className="text-[#404040] text-[20px] font-medium font-['Funnel_Sans']">{data?.nome || 'Editar Equipamento'}</div>
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
                        {/* Image Upload Area */}
                        <div
                            onClick={triggerFileInput}
                            className="w-[191px] h-[186px] relative bg-white rounded-[4px] outline outline-1 outline-[rgba(0,0,0,0.10)] -outline-offset-1 overflow-hidden shrink-0 group cursor-pointer">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            {imagem ? (
                                <img
                                    src={imagem}
                                    alt="Equipment"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={IconeFotoEdit}
                                    alt="Equipment"
                                    className="w-[32px] h-[32px] absolute right-[16px] bottom-[16px] object-contain cursor-pointer"
                                />
                            )}

                            {/* Action Buttons Overlay */}
                            {imagem && (
                                <div className="absolute bottom-[16px] right-[16px] flex gap-[8px]">
                                    {/* Edit/Change Photo */}
                                    <div
                                        onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                                        className="w-[32px] h-[32px] bg-white rounded-[4px] shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <img src={IconeFotoEdit} alt="Editar Foto" className="w-[24px] h-[24px] object-contain" />
                                    </div>
                                    {/* Delete Photo */}
                                    <div
                                        onClick={handleDeleteImage}
                                        className="w-[32px] h-[32px] bg-white rounded-[4px] shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <img src={IconeExcluirFoto} alt="Excluir Foto" className="w-[32px] h-[32px] object-contain" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Basic Info Fields */}
                        <div className="flex-1 flex flex-col gap-[24px]">
                            {/* Categoria */}
                            <div className="flex flex-col gap-[8px] relative">
                                <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Categoria</label>
                                <div
                                    onClick={() => setShowCategoriaDropdown(!showCategoriaDropdown)}
                                    className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center justify-between cursor-pointer">
                                    <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{categoria}</span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${showCategoriaDropdown ? 'rotate-180' : ''}`}>
                                        <path d="M1 1L5 5L9 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {showCategoriaDropdown && (
                                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#F0F0F0] rounded-[4px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                                        {categorias.map(cat => (
                                            <div
                                                key={cat}
                                                onClick={() => { setCategoria(cat); setShowCategoriaDropdown(false); }}
                                                className="px-[20px] py-[12px] hover:bg-orange-50 text-[#414F5D] text-[15px] cursor-pointer"
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Nome */}
                            <div className="flex flex-col gap-[8px]">
                                <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Nome</label>
                                <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row: Serial and Marca */}
                    <div className="flex gap-[24px]">
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">№ de Série:</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={serial}
                                    onChange={(e) => setSerial(e.target.value)}
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Marca</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={marca}
                                    onChange={(e) => setMarca(e.target.value)}
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modelo */}
                    <div className="flex flex-col gap-[8px]">
                        <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Modelo</label>
                        <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                            <input
                                type="text"
                                value={modelo}
                                onChange={(e) => setModelo(e.target.value)}
                                className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="h-[1px] bg-[rgba(0,0,0,0.05)] w-full"></div>

                    <div className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] leading-[22.40px]">Dados Técnicos</div>

                    {/* Voltagem */}
                    <div className="flex flex-col gap-[8px] relative">
                        <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Voltagem</label>
                        <div
                            onClick={() => setShowVoltagemDropdown(!showVoltagemDropdown)}
                            className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center justify-between cursor-pointer">
                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{voltagem}</span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform ${showVoltagemDropdown ? 'rotate-180' : ''}`}>
                                <path d="M1 1L5 5L9 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {showVoltagemDropdown && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#F0F0F0] rounded-[4px] shadow-lg z-10">
                                {voltagens.map(volt => (
                                    <div
                                        key={volt}
                                        onClick={() => { setVoltagem(volt); setShowVoltagemDropdown(false); }}
                                        className="px-[20px] py-[12px] hover:bg-orange-50 text-[#414F5D] text-[15px] cursor-pointer"
                                    >
                                        {volt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Technical Grid 1 */}
                    <div className="grid grid-cols-4 gap-[12px]">
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">BTU/h</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={btuh}
                                    onChange={(e) => setBtuh(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Frequencia HZ</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={frequencia}
                                    onChange={(e) => setFrequencia(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Capacidade KG</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={capacidade}
                                    onChange={(e) => setCapacidade(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Potência KW</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={potenciaKW}
                                    onChange={(e) => setPotenciaKW(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Technical Grid 2 */}
                    <div className="grid grid-cols-4 gap-[12px]">
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Potência CV</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={potenciaCV}
                                    onChange={(e) => setPotenciaCV(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Potência BTU</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={potenciaBTU}
                                    onChange={(e) => setPotenciaBTU(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Tensão V</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={tensaoV}
                                    onChange={(e) => setTensaoV(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Corrente</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={corrente}
                                    onChange={(e) => setCorrente(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Technical Grid 3 */}
                    <div className="grid grid-cols-4 gap-[12px]">
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Max. M.C.A.</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={maxMCA}
                                    onChange={(e) => setMaxMCA(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Vazão Max. M³/h</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={vazaoMax}
                                    onChange={(e) => setVazaoMax(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Vazão Min. M³/h</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={vazaoMin}
                                    onChange={(e) => setVazaoMin(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Vazão L/S</label>
                            <div className="h-[56px] px-[20px] bg-white rounded-[4px] outline outline-1 outline-[#F0F0F0] -outline-offset-1 flex items-center">
                                <input
                                    type="text"
                                    value={vazaoLS}
                                    onChange={(e) => setVazaoLS(e.target.value)}
                                    placeholder="-"
                                    className="w-full text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] outline-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-[16px] pt-[8px]">
                        <button
                            onClick={onClose}
                            className="flex-1 h-[56px] rounded-[4px] border border-[#F78800] text-[#F78800] text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-orange-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 h-[56px] rounded-[4px] bg-[#F78800] text-white text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
