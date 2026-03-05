
import { Mail, Lock } from 'lucide-react';
import Logo from '../../../assets/LOGOSEMFUNDO.png';
import Background from '../../../assets/Frame1303.png';

interface LoginProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    onRecoverPassword?: () => void;
    onRegister?: () => void;
    onLogin?: () => void;
    rememberMe: boolean;
    setRememberMe: (val: boolean) => void;
}

export function Login({
    email, setEmail, password, setPassword,
    onRecoverPassword, onRegister, onLogin,
    rememberMe, setRememberMe
}: LoginProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onLogin?.();
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Seção Esquerda - Formulário */}
            <div className="w-full md:w-[40%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 animate-fadeIn">
                <div className="w-full max-w-md mx-auto">
                    {/* Logotipo */}
                    <img src={Logo} alt="Pred Fácil Logo" className="h-[106px] w-auto object-contain mb-[10px]" />

                    {/* Texto de Bem-vindo */}
                    <h1 className="text-[40px] font-medium text-[#3B4141] font-['Inter'] mb-[16px]">Bem-vindo</h1>
                    <p className="text-[20px] text-[#3B4141] opacity-80 font-['Inter'] mb-[32px]">Insira seu e-mail e senha para entrar.</p>

                    {/* Formulário */}
                    <form className="flex flex-col gap-[16px]" onSubmit={(e) => { e.preventDefault(); onLogin?.(); }}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-6 w-6 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite seu e-mail"
                                className="block w-full h-[56px] pl-10 pr-3 py-3 border border-gray-200 rounded-[4px] focus:ring-1 focus:ring-orange-500 outline-none transition-all text-[#414F5D] text-[16px] font-['Inter'] placeholder-[#414F5D]"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-6 w-6 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Digite sua senha"
                                className="block w-full h-[56px] pl-10 pr-3 py-3 border border-gray-200 rounded-[4px] focus:ring-1 focus:ring-orange-500 outline-none transition-all text-[#414F5D] text-[16px] font-['Inter'] placeholder-[#414F5D]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[56px] bg-orange-500 hover:bg-orange-600 text-[#F6F1E7] text-[16px] font-medium font-['Funnel_Sans'] rounded-[4px] transition-colors duration-200 mt-[16px]"
                        >
                            Entrar na plataforma
                        </button>

                        <div className="flex items-center justify-between mt-[16px]">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded border ${rememberMe ? 'bg-[#F78800] border-[#F78800]' : 'bg-white border-gray-300'} transition-all flex items-center justify-center`}>
                                        {rememberMe && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="animate-in zoom-in-50 duration-200">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[#414F5D] text-[16px] font-['Inter']">Lembrar meus dados</span>
                            </label>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); onRecoverPassword?.(); }}
                                className="text-orange-500 hover:text-orange-600 font-medium font-['Inter'] text-[16px]"
                            >
                                Esqueceu a senha?
                            </a>
                        </div>
                    </form>

                    {/* Rodapé */}
                    <div className="mt-[32px] text-center text-[16px] font-['Inter']">
                        <span className="text-[#3B4141]">Não tem conta? - </span>
                        <span
                            className="text-orange-500 hover:text-orange-600 font-medium cursor-pointer"
                            onClick={onRegister}
                        >
                            Cadastrar-se
                        </span>
                    </div>
                </div>
            </div>

            {/* Seção Direita - Imagem */}
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
