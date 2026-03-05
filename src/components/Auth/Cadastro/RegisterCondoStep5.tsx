
import Background from '../../../assets/Frame1303.png';

interface RegisterCondoStep5Props {
    onBack: () => void;
    onFinish: () => void;
}

export function RegisterCondoStep5({ onBack, onFinish }: RegisterCondoStep5Props) {
    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Seção Esquerda */}
            <div className="w-full md:w-[40%] flex-shrink-0 flex flex-col px-8 md:px-16 lg:px-24 py-12 h-screen bg-white border-r border-gray-100 z-10 relative overflow-y-auto animate-fadeIn">

                {/* Botão Voltar - Fixo no topo */}
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
                <div className="w-full max-w-md mx-auto flex flex-col items-center gap-[40px]">

                    {/* Ícone e Mensagem de Sucesso */}
                    <div className="self-stretch flex flex-col justify-start items-center gap-[16px]">
                        <div className="self-stretch px-[24px] flex flex-col justify-start items-center gap-[32px]">

                            {/* Ícone Personalizado (HTML) */}
                            <div className="w-[140px] h-[140px] relative">
                                <div className="w-[75px] h-[75px] left-[41px] top-[38.03px] absolute bg-[#F78800] rounded-[40px]"></div>
                                {/* Checkmark logic from HTML seems to rely on outline, simplifing to SVG checkmark for better reliability if outline fails, or trying to match style exactly. 
                                    The HTML uses outlines to create shapes. I'll translate exact styles. 
                                */}
                                <div style={{ width: 33, height: 22, left: 62, top: 64.03, position: 'absolute', outline: '5px #F6F1E7 solid', outlineOffset: -2.50 }}></div>

                                {/* Confetes */}
                                <div style={{ width: 11, height: 14, left: 116, top: 119.03, position: 'absolute', outline: '2px #F78800 solid', outlineOffset: -1 }}></div>
                                <div style={{ width: 35, height: 19, left: 0, top: 89.03, position: 'absolute', outline: '2px #F78800 solid', outlineOffset: -1 }}></div>
                                <div style={{ width: 23, height: 22, left: 105, top: 17.03, position: 'absolute', outline: '2px #F78800 solid', outlineOffset: -1 }}></div>

                                {/* Pontos */}
                                <div className="w-[11px] h-[10px] left-[17px] top-[51.03px] absolute bg-[#F78800] rounded-full"></div>
                                <div className="w-[9px] h-[9px] left-[49px] top-[11.03px] absolute bg-[#F78800] rounded-full"></div>
                                <div className="w-[5px] h-[5px] left-[64px] top-[21.03px] absolute bg-[#F78800] rounded-full"></div>
                                <div className="w-[9px] h-[9px] left-[131px] top-[68.03px] absolute bg-[#F78800] rounded-full"></div>
                                <div className="w-[9px] h-[9px] left-[35px] top-[120.03px] absolute bg-[#F78800] rounded-full"></div>
                                <div className="w-[10px] h-[9px] left-[92px] top-[134.03px] absolute bg-[#F78800] rounded-full"></div>
                                <div className="w-[5px] h-[5px] left-[80px] top-[131.03px] absolute bg-[#F78800] rounded-full"></div>

                                {/* Adicionando um checkmark adequado dentro da caixa... */}
                                <div className="absolute left-[62px] top-[64.03px] transform -translate-x-1/2 -translate-y-1/2">
                                    <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 13L11.5 21.5L31.5 2.5" stroke="#F6F1E7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                            </div>

                            <div className="self-stretch flex flex-col justify-start items-center gap-[10px]">
                                <div className="self-stretch text-center text-[#3B4141] text-[28px] font-['Inter'] font-normal break-words">Condomínio cadastrado com sucesso.</div>
                            </div>
                        </div>
                    </div>

                    {/* Botão Inferior */}
                    <div className="self-stretch flex flex-col justify-start items-start gap-[32px]">
                        <div className="self-stretch flex flex-col justify-start items-start gap-[16px]">
                            <button
                                onClick={onFinish}
                                className="self-stretch h-[56px] bg-[#F78800] rounded-[4px] flex justify-center items-center gap-[10px] hover:bg-orange-600 transition-colors"
                            >
                                <div className="text-center text-[#F6F1E7] text-[16px] font-['Funnel_Sans'] font-medium">Voltar</div>
                            </button>
                        </div>
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
