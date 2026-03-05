
import { useState } from 'react';
import Background from '../../../assets/Frame1303.png';
import { FileText, Check } from 'lucide-react';

interface RegisterCondoStep4Props {
    onBack: () => void;
    onRegister: () => void;
}

export function RegisterCondoStep4({ onBack, onRegister }: RegisterCondoStep4Props) {
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleRegister = () => {
        if (!termsAccepted) {
            alert('Por favor, aceite os termos para continuar.');
            return;
        }
        onRegister();
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Seção Esquerda */}
            <div className="w-full md:w-[40%] flex-shrink-0 flex flex-col px-8 md:px-16 lg:px-24 py-12 h-screen bg-white border-r border-gray-100 z-10 relative overflow-y-auto animate-fadeIn">

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

                {/* Espaçador */}
                <div className="flex-1"></div>

                {/* Conteúdo */}
                <div className="w-full max-w-md mx-auto flex flex-col gap-[40px]">
                    {/* Cabeçalho */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">
                        <div className="self-stretch text-[#3B4141] text-[40px] font-['Inter'] font-medium leading-[36px] break-words">Cadastrar Condomínio</div>
                        <div className="self-stretch opacity-80 text-[#3B4141] text-[20px] font-['Inter'] font-normal leading-[24px] break-words">Passo 3 de 3</div>
                    </div>

                    {/* Formulário */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-[32px]">

                        {/* Seção de Termos */}
                        <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">

                            {/* Caixa do Termo */}
                            <div
                                className="self-stretch p-[12px] rounded-[4px] border border-[#F0F0F0] flex justify-start items-center gap-[16px] cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => window.open('#', '_blank')}
                            >
                                <div className="w-[50px] h-[50px] relative bg-[#3B4141] overflow-hidden rounded-[4px] flex-shrink-0 flex items-center justify-center">
                                    <FileText color="white" size={24} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 flex justify-start items-center gap-[8px]">
                                    <div className="flex-1 flex flex-col justify-start items-start">
                                        <div className="self-stretch text-[#3B4141] text-[16px] font-['DM_Sans'] font-medium break-words">Termo de securitização e ciência de risco</div>
                                    </div>
                                </div>
                                <div className="w-[32px] h-[32px] relative flex items-center justify-center hover:opacity-80 transition-opacity">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M15 3H21V9" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M10 14L21 3" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            {/* Caixa de Seleção */}
                            <div
                                className="self-stretch flex justify-between items-center cursor-pointer select-none"
                                onClick={() => setTermsAccepted(!termsAccepted)}
                            >
                                <div className="text-[#3B4141] text-[16px] font-['DM_Sans'] font-normal leading-[22.40px] break-words">Declaro ter lido e aceito o(s) termo(s)</div>
                                <div className={`w-[21px] h-[21px] relative rounded-[4px] border ${termsAccepted ? 'bg-[#F78800] border-[#F78800]' : 'bg-white border-[#D3D3D3]'} flex items-center justify-center transition-colors`}>
                                    {termsAccepted && <Check color="white" size={14} strokeWidth={3} />}
                                </div>
                            </div>

                        </div>

                        {/* Botão de Cadastro */}
                        <button
                            onClick={handleRegister}
                            className={`self-stretch h-[56px] rounded-[4px] flex justify-center items-center gap-[10px] transition-colors ${termsAccepted ? 'bg-[#F78800] hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                            <div className="text-center text-[#F6F1E7] text-[16px] font-['Funnel_Sans'] font-medium">Cadastrar Condomínio</div>
                        </button>
                    </div>
                </div>

                {/* Spacer */}
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
