
import Background from '../../../assets/Frame1303.png';

interface RegisterCondoStep3Props {
    data: any;
    updateField: (field: string, value: string) => void;
    onBack: () => void;
    onNext: () => void;
}

export function RegisterCondoStep3({ data, updateField, onBack, onNext }: RegisterCondoStep3Props) {
    const isStepValid = data.usuarioNome &&
        data.usuarioEmail &&
        data.usuarioSenha &&
        data.usuarioSenha === data.usuarioConfirmSenha &&
        data.acessoNivel;

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
                        <div className="self-stretch opacity-80 text-[#3B4141] text-[20px] font-['Inter'] font-normal leading-[24px] break-words">Passo 3 de 3</div>
                    </div>

                    {/* Formulário */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-[32px]">

                        {/* Seção Dados de Acesso */}
                        <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">
                            <div className="text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal leading-[22.40px]">Dados de Acesso</div>

                            {/* Nome de usuário */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                <div className="w-[24px] h-[24px] relative overflow-hidden flex-shrink-0">
                                    <div className="w-[8px] h-[8px] left-[8px] top-[3px] absolute border-[1.33px] border-[#CCCCCC] rounded-full"></div>
                                    <div className="w-[12px] h-[6px] left-[6px] top-[15px] absolute border-[1.33px] border-[#CCCCCC] rounded-t-full"></div>
                                </div>
                                <input
                                    type="text"
                                    value={data.usuarioNome}
                                    onChange={(e) => updateField('usuarioNome', e.target.value)}
                                    placeholder="Nome de usuário"
                                    className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                />
                            </div>

                            {/* E-mail usuário */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                <div className="w-[24px] h-[24px] relative overflow-hidden flex-shrink-0">
                                    <div className="w-[8px] h-[8px] left-[8px] top-[8px] absolute border-[1.33px] border-[#CCCCCC] rounded-full"></div>
                                    <div className="w-[18px] h-[18px] left-[3px] top-[2.99px] absolute border-[1.33px] border-[#CCCCCC] rounded-full clip-path-circle"></div>
                                </div>
                                <input
                                    type="email"
                                    value={data.usuarioEmail}
                                    onChange={(e) => updateField('usuarioEmail', e.target.value)}
                                    placeholder="E-mail usuário"
                                    className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                />
                            </div>

                            {/* Senha */}
                            <div className="self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[10px]">
                                <div className="w-[24px] h-[24px] relative overflow-hidden flex-shrink-0">
                                    <div className="w-[14px] h-[10px] left-[5px] top-[11px] absolute border-[1.33px] border-[#CCCCCC] rounded-[2px]"></div>
                                    <div className="w-[8px] h-[8px] left-[8px] top-[3px] absolute border-[1.33px] border-[#CCCCCC] rounded-t-[2px]"></div>
                                </div>
                                <input
                                    type="password"
                                    value={data.usuarioSenha}
                                    onChange={(e) => updateField('usuarioSenha', e.target.value)}
                                    placeholder="Senha"
                                    className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                />
                            </div>

                            {/* Confirmar Senha */}
                            <div className={`self-stretch h-[56px] px-[20px] py-[16px] rounded-[4px] border ${data.usuarioConfirmSenha && data.usuarioSenha !== data.usuarioConfirmSenha ? 'border-red-400' : 'border-[#F0F0F0]'} flex justify-start items-center gap-[10px]`}>
                                <div className="w-[24px] h-[24px] relative overflow-hidden flex-shrink-0">
                                    <div className="w-[14px] h-[10px] left-[5px] top-[11px] absolute border-[1.33px] border-[#CCCCCC] rounded-[2px]"></div>
                                    <div className="w-[8px] h-[8px] left-[8px] top-[3px] absolute border-[1.33px] border-[#CCCCCC] rounded-t-[2px]"></div>
                                </div>
                                <input
                                    type="password"
                                    value={data.usuarioConfirmSenha}
                                    onChange={(e) => updateField('usuarioConfirmSenha', e.target.value)}
                                    placeholder="Confirmar Senha"
                                    className="w-full outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal placeholder-[#414F5D] leading-[24px]"
                                />
                            </div>

                            {/* Nível de acesso */}
                            <div className="self-stretch relative">
                                <select
                                    value={data.acessoNivel}
                                    onChange={(e) => updateField('acessoNivel', e.target.value)}
                                    className="w-full h-[56px] px-[20px] py-[16px] rounded-[4px] border border-[#F0F0F0] outline-none text-[#414F5D] text-[16px] font-['Funnel_Sans'] font-normal appearance-none bg-white"
                                >
                                    <option value="" disabled>Selecione um nível de acesso</option>
                                    <option value="admin">Administrador</option>
                                    <option value="sindico">Síndico</option>
                                    <option value="zelador">Zelador</option>
                                </select>
                                <div className="absolute right-[20px] top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#848484]"></div>
                                </div>
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
                {/* Espaçador para garantir espaço de rolagem se necessário */}
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
