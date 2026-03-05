import React from 'react';

interface AddUsuarioModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddUsuarioModal: React.FC<AddUsuarioModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div style={{ width: 717, backgroundColor: 'white', borderRadius: 8, outline: '1px rgba(0, 0, 0, 0.10) solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }} className="animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div style={{ alignSelf: 'stretch', paddingLeft: 40, paddingRight: 40, paddingTop: 20, paddingBottom: 20, background: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, borderBottom: '1px #E1E1E1 solid', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex' }}>
                    <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#404040', fontSize: 20, fontFamily: 'Funnel Sans', fontWeight: 500, wordWrap: 'break-word' }}>Adicionar Usuário</div>
                    <div onClick={onClose} className="cursor-pointer hover:bg-gray-100 transition-colors" style={{ width: 40, height: 40, padding: 4, overflow: 'hidden', borderRadius: 30, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex' }}>
                        <div style={{ width: 24, height: 24, position: 'relative', overflow: 'hidden' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ alignSelf: 'stretch', padding: 32, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 24, display: 'flex' }}>
                    {/* Row 1 */}
                    <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 24, display: 'inline-flex' }}>
                        {/* Nome de Usuário */}
                        <div style={{ flex: '1 1 0', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 24, display: 'flex' }}>
                            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
                                <div style={{ alignSelf: 'stretch', height: 18, position: 'relative' }}>
                                    <div style={{ left: 0, top: 0, position: 'absolute', color: '#404040', fontSize: 15, fontFamily: 'Funnel Sans', fontWeight: 400, wordWrap: 'break-word' }}>Nome de Usuário</div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Insira o nome completo"
                                    style={{ alignSelf: 'stretch', height: 56, paddingLeft: 20, paddingRight: 20, paddingTop: 13, paddingBottom: 13, background: 'white', borderRadius: 4, outline: '1px #F0F0F0 solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex', color: '#414F5D', fontSize: 16, fontFamily: 'Funnel Sans', fontWeight: 400 }}
                                    className="placeholder:text-[#414F5D] focus:outline-none focus:ring-1 focus:ring-[#F78800]"
                                />
                            </div>
                        </div>
                        {/* Tipo de Usuário */}
                        <div style={{ flex: '1 1 0', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 24, display: 'flex' }}>
                            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
                                <div style={{ alignSelf: 'stretch', height: 18, position: 'relative' }}>
                                    <div style={{ left: 0, top: 0, position: 'absolute', color: '#404040', fontSize: 15, fontFamily: 'Funnel Sans', fontWeight: 400, wordWrap: 'break-word' }}>Tipo de Usuário</div>
                                </div>
                                <div className="relative w-full">
                                    <select
                                        style={{ alignSelf: 'stretch', height: 56, width: '100%', paddingLeft: 20, paddingRight: 40, paddingTop: 13, paddingBottom: 13, background: 'white', borderRadius: 4, outline: '1px #F0F0F0 solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex', color: '#414F5D', fontSize: 16, fontFamily: 'Funnel Sans', fontWeight: 400, appearance: 'none' }}
                                        className="focus:outline-none focus:ring-1 focus:ring-[#F78800] cursor-pointer"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Selecione o tipo de usuário</option>
                                        <option value="admin">Administrador</option>
                                        <option value="tecnico">Técnico</option>
                                        <option value="engenheiro">Engenheiro</option>
                                        <option value="zelador">Zelador</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 6L8 10L12 6" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 24, display: 'inline-flex' }}>
                        {/* E-mail */}
                        <div style={{ flex: '1 1 0', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 24, display: 'flex' }}>
                            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
                                <div style={{ alignSelf: 'stretch', height: 18, position: 'relative' }}>
                                    <div style={{ left: 0, top: 0, position: 'absolute', color: '#404040', fontSize: 15, fontFamily: 'Funnel Sans', fontWeight: 400, wordWrap: 'break-word' }}>E-mail</div>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Insira o E-mail"
                                    style={{ alignSelf: 'stretch', height: 56, paddingLeft: 20, paddingRight: 20, paddingTop: 13, paddingBottom: 13, background: 'white', borderRadius: 4, outline: '1px #F0F0F0 solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex', color: '#414F5D', fontSize: 16, fontFamily: 'Funnel Sans', fontWeight: 400 }}
                                    className="placeholder:text-[#414F5D] focus:outline-none focus:ring-1 focus:ring-[#F78800]"
                                />
                            </div>
                        </div>
                        {/* Senha */}
                        <div style={{ flex: '1 1 0', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 24, display: 'flex' }}>
                            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
                                <div style={{ alignSelf: 'stretch', height: 18, position: 'relative' }}>
                                    <div style={{ left: 0, top: 0, position: 'absolute', color: '#404040', fontSize: 15, fontFamily: 'Funnel Sans', fontWeight: 400, wordWrap: 'break-word' }}>Senha</div>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Insira a senha"
                                    style={{ alignSelf: 'stretch', height: 56, paddingLeft: 20, paddingRight: 20, paddingTop: 13, paddingBottom: 13, background: 'white', borderRadius: 4, outline: '1px #F0F0F0 solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex', color: '#414F5D', fontSize: 16, fontFamily: 'Funnel Sans', fontWeight: 400 }}
                                    className="placeholder:text-[#414F5D] focus:outline-none focus:ring-1 focus:ring-[#F78800]"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Divider */}
                    <div style={{ alignSelf: 'stretch', height: 0, outline: '1px rgba(0, 0, 0, 0.05) solid', outlineOffset: '-0.50px' }}></div>

                    {/* Footer */}
                    <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 16, display: 'inline-flex' }}>
                        <button
                            onClick={onClose}
                            style={{ flex: '1 1 0', height: 56, padding: 16, borderRadius: 4, outline: '1px #F78800 solid', outlineOffset: '-1px', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex' }}
                            className="hover:bg-orange-50 transition-colors"
                        >
                            <div style={{ color: '#F78800', fontSize: 16, fontFamily: 'Funnel Sans', fontWeight: 600, lineHeight: '19.20px', wordWrap: 'break-word' }}>Cancelar</div>
                        </button>
                        <button
                            onClick={() => {
                                // Add logic here
                                onClose();
                            }}
                            style={{ flex: '1 1 0', height: 56, padding: 16, background: '#F78800', borderRadius: 4, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex' }}
                            className="hover:bg-[#E57600] transition-colors"
                        >
                            <div style={{ color: 'white', fontSize: 16, fontFamily: 'Funnel Sans', fontWeight: 600, lineHeight: '19.20px', wordWrap: 'break-word' }}>Adicionar Usuário</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
