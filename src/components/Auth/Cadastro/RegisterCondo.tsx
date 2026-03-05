
import Background from '../../../assets/Frame1303.png';

interface RegisterCondoProps {
    data: any;
    updateField: (field: string, value: string) => void;
    onBack: () => void;
    onNext: () => void;
}

export function RegisterCondo({ data, updateField, onBack, onNext }: RegisterCondoProps) {
    const isStepValid = data.nomeCondominio && data.razaoSocial && data.cnpj;

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Seção Esquerda */}
            <div className="w-full md:w-[40%] flex flex-col px-8 md:px-16 lg:px-24 py-12 h-screen animate-fadeIn">

                {/* Botão Voltar */}
                <div
                    className="flex justify-start items-center gap-[8px] cursor-pointer w-fit hover:opacity-80 transition-opacity"
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

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Conteúdo */}
                <div className="w-full max-w-md mx-auto flex flex-col gap-[40px]">
                    {/* Cabeçalho */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">
                        <div className="self-stretch text-[#3B4141] text-[40px] font-['Inter'] font-medium leading-[36px] break-words">Cadastrar Condomínio</div>
                        <div className="self-stretch opacity-80 text-[#3B4141] text-[20px] font-['Inter'] font-normal leading-[24px] break-words">Passo 1 de 3</div>
                    </div>

                    {/* Formulário */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-[32px]">
                        <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">

                            {/* Campo Nome do Condomínio */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[rgba(204,204,204,0.30)] flex justify-start items-center gap-[10px]">
                                <input
                                    type="text"
                                    value={data.nomeCondominio}
                                    onChange={(e) => updateField('nomeCondominio', e.target.value)}
                                    placeholder="Nome do condomínio"
                                    className="w-full outline-none text-[#3B4141] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#3B4141] leading-[24px]"
                                />
                            </div>

                            {/* Campo Razão Social */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[rgba(204,204,204,0.30)] flex justify-start items-center gap-[10px]">
                                <input
                                    type="text"
                                    value={data.razaoSocial}
                                    onChange={(e) => updateField('razaoSocial', e.target.value)}
                                    placeholder="Razão Social"
                                    className="w-full outline-none text-[#3B4141] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#3B4141] leading-[24px]"
                                />
                            </div>

                            {/* Campo CNPJ */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[rgba(204,204,204,0.30)] flex justify-start items-center gap-[10px]">
                                <input
                                    type="text"
                                    value={data.cnpj}
                                    onChange={(e) => updateField('cnpj', e.target.value)}
                                    placeholder="CNPJ"
                                    className="w-full outline-none text-[#3B4141] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#3B4141] leading-[24px]"
                                />
                            </div>

                            {/* Botão Próximo */}
                            <button
                                onClick={() => isStepValid && onNext()}
                                disabled={!isStepValid}
                                className={`self-stretch h-[56px] px-[20px] rounded-[4px] flex justify-center items-center gap-[10px] transition-colors ${isStepValid ? 'bg-[#F78800] hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}
                            >
                                <div className="text-center text-[#F6F1E7] text-[16px] font-['Funnel_Sans'] font-medium">Próximo</div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Espaçador */}
                <div className="flex-1"></div>
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
