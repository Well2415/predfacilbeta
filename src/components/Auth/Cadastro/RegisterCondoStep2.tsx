
import Background from '../../../assets/Frame1303.png';

interface RegisterCondoStep2Props {
    data: any;
    updateField: (field: string, value: string) => void;
    onBack: () => void;
    onNext: () => void;
}

export function RegisterCondoStep2({ data, updateField, onBack, onNext }: RegisterCondoStep2Props) {
    const isStepValid = data.cep && data.endereco && data.bairro && data.cidade && data.email;

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Seção Esquerda */}
            <div className="w-full md:w-[40%] flex-shrink-0 flex flex-col px-8 md:px-16 lg:px-24 py-12 h-screen bg-white border-r border-gray-100 z-10 relative overflow-y-auto animate-fadeIn">

                {/* Botão Voltar */}
                <div
                    className="flex justify-start items-center gap-[8px] cursor-pointer w-fit hover:opacity-80 transition-opacity mb-[40px]"
                    onClick={onBack}
                >
                    <div className="w-[24px] h-[24px] relative overflow-hidden">
                        <div className="w-[20px] h-[20px] left-[2px] top-[2px] absolute opacity-40 bg-[#F78800] rounded-[4px]"></div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
                            <path d="M15 18L9 12L15 6" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="text-[#3B4141] text-[16px] font-['Inter'] font-normal leading-[22.40px]">Voltar</div>
                </div>

                {/* Conteúdo */}
                <div className="w-full flex flex-col gap-[40px]">
                    {/* Cabeçalho */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">
                        <div className="self-stretch text-[#3B4141] text-[40px] font-['Inter'] font-medium leading-[36px] break-words">Cadastrar Condomínio</div>
                        <div className="self-stretch opacity-80 text-[#3B4141] text-[20px] font-['Inter'] font-normal leading-[24px] break-words">Passo 2 de 3</div>
                    </div>

                    {/* Formulário */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-[32px]">

                        {/* Seção de Endereço */}
                        <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">
                            <div className="text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal leading-[22.40px]">Endereço</div>

                            {/* CEP */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-between items-center bg-white">
                                <input
                                    type="text"
                                    value={data.cep}
                                    onChange={(e) => updateField('cep', e.target.value)}
                                    placeholder="CEP"
                                    className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                />
                                <div className="w-[24px] h-[24px] relative overflow-hidden flex-shrink-0 cursor-pointer">
                                    <div className="w-[14px] h-[14px] left-[3px] top-[3px] absolute rounded-full border border-[#CCCCCC]"></div>
                                    <div className="w-[6px] h-0 left-[15px] top-[15px] absolute border border-[#CCCCCC] transform rotate-45 origin-top-left"></div>
                                </div>
                            </div>

                            {/* Endereço */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                <input
                                    type="text"
                                    value={data.endereco}
                                    onChange={(e) => updateField('endereco', e.target.value)}
                                    placeholder="Endereço"
                                    className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                />
                            </div>

                            {/* Complemento */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                <input
                                    type="text"
                                    value={data.complemento}
                                    onChange={(e) => updateField('complemento', e.target.value)}
                                    placeholder="Complemento"
                                    className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                />
                            </div>

                            {/* Bairro */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                <input
                                    type="text"
                                    value={data.bairro}
                                    onChange={(e) => updateField('bairro', e.target.value)}
                                    placeholder="Bairro"
                                    className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                />
                            </div>

                            {/* Linha Cidade / UF */}
                            <div className="self-stretch justify-start items-start gap-[16px] inline-flex">
                                <div className="flex-1 h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                    <input
                                        type="text"
                                        value={data.cidade}
                                        onChange={(e) => updateField('cidade', e.target.value)}
                                        placeholder="Cidade"
                                        className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                    />
                                </div>
                                <div className="flex-1 h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-between items-center bg-white">
                                    <input
                                        type="text"
                                        value={data.uf}
                                        onChange={(e) => updateField('uf', e.target.value.toUpperCase().slice(0, 2))}
                                        placeholder="UF"
                                        className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Divisor */}
                        <div className="self-stretch h-[0px] border border-[#F0F0F0]"></div>

                        {/* Seção Dados de Contato */}
                        <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">
                            <div className="text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal leading-[22.40px]">Dados de Contato</div>

                            {/* Linha Telefone / Whatsapp */}
                            <div className="self-stretch justify-start items-start gap-[16px] inline-flex">
                                <div className="flex-1 h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                    <input
                                        type="text"
                                        value={data.telefone}
                                        onChange={(e) => updateField('telefone', e.target.value)}
                                        placeholder="Telefone Fixo"
                                        className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                    />
                                </div>
                                <div className="flex-1 h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                    <input
                                        type="text"
                                        value={data.whatsapp}
                                        onChange={(e) => updateField('whatsapp', e.target.value)}
                                        placeholder="Whatsapp"
                                        className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    placeholder="E-mail"
                                    className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                />
                            </div>

                            {/* Site */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                <input
                                    type="text"
                                    value={data.site}
                                    onChange={(e) => updateField('site', e.target.value)}
                                    placeholder="Site"
                                    className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                />
                            </div>
                        </div>

                        {/* Botão Próximo */}
                        <button
                            onClick={() => isStepValid && onNext()}
                            disabled={!isStepValid}
                            className={`self-stretch h-[56px] rounded-[4px] flex justify-center items-center gap-[10px] transition-colors ${isStepValid ? 'bg-[#F78800] hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                            <div className="text-center text-[#F6F1E7] text-[16px] font-['Funnel_Sans'] font-medium">Próximo</div>
                        </button>
                    </div>
                </div>

                {/* Spacer (Bottom padding handled by container py) */}
                <div className="h-[32px]"></div>
            </div>

            {/* Seção Direita */}
            <div className="hidden md:flex w-[60%] bg-[#F9F9F9] relative overflow-hidden flex-col justify-end items-start px-[60px] py-[120px] gap-[32px]">
                <div
                    className="absolute inset-0 z-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                    }}
                ></div>
                <img
                    src={Background}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover object-left z-0"
                />

                {/* Texto de Sobreposição */}
                <div className="self-stretch flex flex-col justify-end items-start gap-[10px] z-10 w-full mb-0">
                    <div className="w-full max-w-[630px] text-[#3B4141] text-[60px] font-['Clash_Display'] font-normal leading-[60px] break-words">A forma inteligente de cuidar da saúde da sua edificação.</div>
                </div>
            </div>
        </div>
    );
}
