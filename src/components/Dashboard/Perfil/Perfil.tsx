import { usePerfilData } from '../../../hooks/usePerfilData';

interface PerfilProps {
    isEditingPerfil: boolean;
    setIsEditingPerfil: (isEditing: boolean) => void;
    IconeEditarFoto: string;
    IconeExcluirFoto: string;
}

export function Perfil({
    isEditingPerfil,
    setIsEditingPerfil,
    IconeEditarFoto,
    IconeExcluirFoto
}: PerfilProps) {
    const { data, startEditing, cancelEditing, saveEditing, handleChange, removePhoto } = usePerfilData();

    const handleEditClick = () => {
        startEditing();
        setIsEditingPerfil(true);
    };

    const handleCancelClick = () => {
        cancelEditing();
        setIsEditingPerfil(false);
    };

    const handleSaveClick = () => {
        saveEditing();
        setIsEditingPerfil(false);
    };
    return (
        <div className="flex flex-col w-full h-full bg-[#F3F4F6] animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-[40px] flex flex-col gap-[60px]">
                <div className="p-[32px] bg-white rounded-[4px] border border-[#E1E1E1] flex flex-col items-end gap-[32px]">
                    <div className="w-full flex items-start gap-[32px]">
                        {/* Images */}
                        <div className="flex flex-col items-start gap-[24px]">
                            <div className="flex flex-col gap-[12px]">
                                <div className="w-[172px] h-[167px] relative bg-[#F4F5FA] overflow-hidden rounded-[4px] border border-[#E1E1E1]">
                                    <img className="w-full h-full object-cover" src={data.logomarca || "https://placehold.co/177x177"} alt="Logomarca" />
                                    {isEditingPerfil && (
                                        <>
                                            <div className="w-[32px] h-[32px] absolute right-[45px] bottom-[12px] bg-white rounded-[4px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    id="upload-logo"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            handleChange('logomarca', url);
                                                        }
                                                    }}
                                                />
                                                <label htmlFor="upload-logo" className="cursor-pointer">
                                                    <img src={IconeEditarFoto} alt="Editar" className="w-[20px] h-[20px] object-contain" />
                                                </label>
                                            </div>
                                            <div
                                                onClick={() => removePhoto('logomarca')}
                                                className="w-[32px] h-[32px] absolute right-[9px] bottom-[12px] bg-white rounded-[4px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                                            >
                                                <img src={IconeExcluirFoto} alt="Excluir" className="w-[20px] h-[20px] object-contain" />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">Logomarca</div>
                            </div>
                            <div className="flex flex-col gap-[12px]">
                                <div className="w-[172px] h-[167px] relative bg-[#F4F5FA] overflow-hidden rounded-[4px] border border-[#E1E1E1]">
                                    <img className="w-full h-full object-cover" src={data.fachada || "https://placehold.co/202x202"} alt="Fachada" />
                                    {isEditingPerfil && (
                                        <>
                                            <div className="w-[32px] h-[32px] absolute right-[45px] bottom-[12px] bg-white rounded-[4px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    id="upload-fachada"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            handleChange('fachada', url);
                                                        }
                                                    }}
                                                />
                                                <label htmlFor="upload-fachada" className="cursor-pointer">
                                                    <img src={IconeEditarFoto} alt="Editar" className="w-[20px] h-[20px] object-contain" />
                                                </label>
                                            </div>
                                            <div
                                                onClick={() => removePhoto('fachada')}
                                                className="w-[32px] h-[32px] absolute right-[9px] bottom-[12px] bg-white rounded-[4px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                                            >
                                                <img src={IconeExcluirFoto} alt="Excluir" className="w-[20px] h-[20px] object-contain" />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="text-[#3B4141] text-[16px] font-normal font-['Funnel_Sans']">Fachada</div>
                            </div>
                        </div>

                        {/* Form Data */}
                        <div className="flex-1 flex flex-col gap-[24px]">
                            {/* Row 1 */}
                            <div className="w-full flex gap-[24px]">
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Nome do Condomínio</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.nomeCondominio}
                                                onChange={(e) => handleChange('nomeCondominio', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.nomeCondominio}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Contato</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.contato}
                                                onChange={(e) => handleChange('contato', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.contato}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">CNPJ</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.cnpj}
                                                onChange={(e) => handleChange('cnpj', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.cnpj}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="w-full flex gap-[24px]">
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Inscrição Estadual</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.inscricaoEstadual}
                                                onChange={(e) => handleChange('inscricaoEstadual', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.inscricaoEstadual}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">CEP</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.cep}
                                                onChange={(e) => handleChange('cep', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.cep}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Cidade</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.cidade}
                                                onChange={(e) => handleChange('cidade', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.cidade}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="w-full flex gap-[24px]">
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">UF</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.uf}
                                                onChange={(e) => handleChange('uf', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.uf}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Endereço</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.endereco}
                                                onChange={(e) => handleChange('endereco', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.endereco}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Bairro</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.bairro}
                                                onChange={(e) => handleChange('bairro', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.bairro}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div className="w-full flex gap-[24px]">
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Telefone</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.telefone}
                                                onChange={(e) => handleChange('telefone', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.telefone}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Telefone 2</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.telefone2}
                                                onChange={(e) => handleChange('telefone2', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.telefone2}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Whatsapp</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.whatsapp}
                                                onChange={(e) => handleChange('whatsapp', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.whatsapp}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Row 5 */}
                            <div className="w-full flex gap-[24px]">
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">E-mail 1</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.email1}
                                                onChange={(e) => handleChange('email1', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.email1}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Responsável Técnico</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.responsavelTecnico}
                                                onChange={(e) => handleChange('responsavelTecnico', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.responsavelTecnico}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px] invisible">
                                </div>
                            </div>

                            {/* Row 6 */}
                            <div className="w-full flex gap-[24px]">
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">E-mail 2</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.email2}
                                                onChange={(e) => handleChange('email2', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.email2}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">ART/CREA</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.artCrea}
                                                onChange={(e) => handleChange('artCrea', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.artCrea}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px] invisible">
                                </div>
                            </div>

                            {/* Row 7 */}
                            <div className="w-full flex gap-[24px]">
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">E-mail 3</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.email3}
                                                onChange={(e) => handleChange('email3', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.email3}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Data</label>
                                    <div className={`w-full ${isEditingPerfil ? 'h-[56px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-center transition-all`}>
                                        {isEditingPerfil ? (
                                            <input
                                                type="text"
                                                value={data.data}
                                                onChange={(e) => handleChange('data', e.target.value)}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']"
                                            />
                                        ) : (
                                            <span className="text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans']">{data.data}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-[8px] invisible">
                                </div>
                            </div>

                            {/* Row 8 */}
                            <div className="w-full flex gap-[24px]">
                                <div className="w-full flex flex-col gap-[8px]">
                                    <label className="text-[#404040] text-[15px] font-normal font-['Funnel_Sans']">Observações</label>
                                    <div className={`w-full ${isEditingPerfil ? 'py-[13px] px-[20px] border-[#F0F0F0]' : 'py-[4px] border-transparent'} bg-white rounded-[4px] border flex items-start transition-all`}>
                                        {isEditingPerfil ? (
                                            <textarea
                                                value={data.observacoes}
                                                onChange={(e) => handleChange('observacoes', e.target.value)}
                                                rows={4}
                                                className="w-full bg-transparent border-none outline-none text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] resize-none leading-[24px]"
                                            />
                                        ) : (
                                            <span className={`text-[#414F5D] text-[16px] font-normal font-['Funnel_Sans'] ${isEditingPerfil ? 'leading-[24px]' : ''}`}>{data.observacoes}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {isEditingPerfil && (
                                <div className="w-full flex items-center justify-between gap-[16px] pt-[8px]">
                                    <button
                                        onClick={handleCancelClick}
                                        className="flex-1 h-[56px] border border-[#F78800] rounded-[4px] flex items-center justify-center text-[#F78800] text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#FFF5E5] transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveClick}
                                        className="flex-1 h-[56px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            )}

                            {!isEditingPerfil && (
                                <button
                                    onClick={handleEditClick}
                                    className="w-[200px] h-[56px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-semibold font-['Funnel_Sans'] hover:bg-[#E57600] transition-colors self-end"
                                >
                                    Editar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
