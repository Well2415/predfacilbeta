import { useState, useEffect } from 'react';

interface AddConsumptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (consumo: any) => void;
    onEdit?: (id: number, consumo: any) => void;
    consumoParaEditar?: any;
}

// ─── UTILS: MÁSCARAS ─────────────────────────────────────────────────────────

const maskCurrency = (value: string) => {
    let cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return '';

    let floatValue = parseFloat(cleanValue) / 100;
    return floatValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

const maskDate = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{4})\d+?$/, '$1');
};

export function AddConsumptionModal({
    isOpen,
    onClose,
    onAdd,
    onEdit,
    consumoParaEditar
}: AddConsumptionModalProps) {
    const [tipo, setTipo] = useState('');
    const [valor, setValor] = useState('');
    const [consumo, setConsumo] = useState('');
    const [vencimento, setVencimento] = useState('');
    const [pagamento, setPagamento] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [showTipos, setShowTipos] = useState(false);

    useEffect(() => {
        if (consumoParaEditar) {
            setTipo(consumoParaEditar.tipo || '');
            setValor(consumoParaEditar.valor || '');
            setConsumo(consumoParaEditar.consumo || '');
            setVencimento(consumoParaEditar.vencimento || '');
            setPagamento(consumoParaEditar.pagamento || '');
            setObservacoes(consumoParaEditar.observacoes || '');
        } else {
            setTipo('');
            setValor('');
            setConsumo('');
            setVencimento('');
            setPagamento('');
            setObservacoes('');
        }
    }, [consumoParaEditar, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!tipo || !valor || !vencimento) return;

        const dados = { tipo, valor, consumo, vencimento, pagamento, observacoes };
        if (consumoParaEditar && onEdit) {
            onEdit(consumoParaEditar.id, dados);
        } else {
            onAdd(dados);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-300">
            <div
                style={{
                    width: '717px',
                    background: 'white',
                    borderRadius: '8px',
                    outline: '1px rgba(0, 0, 0, 0.10) solid',
                    outlineOffset: '-1px',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    display: 'inline-flex',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)'
                }}
            >
                {/* Header */}
                <div style={{ alignSelf: 'stretch', paddingLeft: '40px', paddingRight: '40px', paddingTop: '20px', paddingBottom: '20px', background: 'white', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', borderBottom: '1px #E1E1E1 solid', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex' }}>
                    <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#414F5D', fontSize: '20px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '500', wordWrap: 'break-word' }}>
                        {consumoParaEditar ? 'Editar Consumo' : 'Adicionar Consumo'}
                    </div>
                    <div
                        onClick={onClose}
                        style={{ width: '40px', height: '40px', padding: '4px', overflow: 'hidden', borderRadius: '30px', justifyContent: 'center', alignItems: 'center', gap: '10px', display: 'flex', cursor: 'pointer' }}
                        className="hover:bg-gray-100 transition-colors"
                    >
                        <div style={{ width: '24px', height: '24px', position: 'relative', overflow: 'hidden' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="#414F5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 6L18 18" stroke="#414F5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ alignSelf: 'stretch', padding: '32px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '24px', display: 'flex' }}>

                    {/* Row 1: Tipo de Conta e Volume Consumido */}
                    <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '24px', display: 'inline-flex' }}>
                        <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px', display: 'inline-flex', position: 'relative' }}>
                            <div style={{ alignSelf: 'stretch', color: '#414F5D', fontSize: '15px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}>
                                Tipo de Conta
                            </div>
                            <div
                                onClick={() => setShowTipos(!showTipos)}
                                style={{ alignSelf: 'stretch', height: '56px', paddingLeft: '20px', paddingRight: '20px', background: 'white', borderRadius: '4px', outline: '1px #F0F0F0 solid', outlineOffset: '-1px', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex', cursor: 'pointer' }}
                            >
                                <div style={{ color: '#414F5D', fontSize: '16px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}>
                                    {tipo || 'Selecione o tipo de conta'}
                                </div>
                                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.2s', transform: showTipos ? 'rotate(180deg)' : 'none' }}>
                                    <path d="M1 1L6 6L11 1" stroke="#848484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            {showTipos && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowTipos(false)} />
                                    <div className="absolute top-[85px] left-0 w-full bg-white border border-[#E1E1E1] rounded-[4px] shadow-lg z-20 overflow-hidden">
                                        {['Energia', 'Agua', 'Gas'].map(t => (
                                            <div
                                                key={t}
                                                onClick={() => { setTipo(t); setShowTipos(false); }}
                                                className="px-[20px] py-[12px] text-[#414F5D] hover:bg-orange-50 cursor-pointer transition-colors border-b border-[#F0F0F0] last:border-0"
                                            >
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px', display: 'inline-flex' }}>
                            <div style={{ alignSelf: 'stretch', color: '#414F5D', fontSize: '15px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}>
                                Volume Consumido
                            </div>
                            <input
                                type="text"
                                value={consumo}
                                onChange={(e) => setConsumo(e.target.value)}
                                placeholder="Insira o consumo (m³, kWh, kg)"
                                style={{ alignSelf: 'stretch', height: '56px', paddingLeft: '20px', paddingRight: '20px', background: 'white', borderRadius: '4px', outline: '1px #F0F0F0 solid', outlineOffset: '-1px', color: '#414F5D', fontSize: '16px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}
                                className="focus:outline-none focus:border-[#F78800] placeholder-[#414F5D] placeholder-opacity-100"
                            />
                        </div>
                    </div>

                    {/* Row 2: Valor da Conta e Data de Vencimento */}
                    <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '24px', display: 'inline-flex' }}>
                        <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px', display: 'inline-flex' }}>
                            <div style={{ alignSelf: 'stretch', color: '#414F5D', fontSize: '15px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}>
                                Valor da Conta
                            </div>
                            <input
                                type="text"
                                value={valor}
                                onChange={(e) => setValor(maskCurrency(e.target.value))}
                                placeholder="R$ 0,00"
                                style={{ alignSelf: 'stretch', height: '56px', paddingLeft: '20px', paddingRight: '20px', background: 'white', borderRadius: '4px', outline: '1px #F0F0F0 solid', outlineOffset: '-1px', color: '#414F5D', fontSize: '16px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}
                                className="focus:outline-none focus:border-[#F78800] placeholder-[#414F5D] placeholder-opacity-100"
                            />
                        </div>
                        <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px', display: 'inline-flex' }}>
                            <div style={{ alignSelf: 'stretch', color: '#414F5D', fontSize: '15px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}>
                                Data de Vencimento
                            </div>
                            <input
                                type="text"
                                value={vencimento}
                                onChange={(e) => setVencimento(maskDate(e.target.value))}
                                placeholder="00/00/0000"
                                style={{ alignSelf: 'stretch', height: '56px', paddingLeft: '20px', paddingRight: '20px', background: 'white', borderRadius: '4px', outline: '1px #F0F0F0 solid', outlineOffset: '-1px', color: '#414F5D', fontSize: '16px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}
                                className="focus:outline-none focus:border-[#F78800] placeholder-[#414F5D] placeholder-opacity-100"
                            />
                        </div>
                    </div>

                    {/* Row 3: Data de Pagamento e Observações */}
                    <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '24px', display: 'inline-flex' }}>
                        <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px', display: 'inline-flex' }}>
                            <div style={{ alignSelf: 'stretch', color: '#414F5D', fontSize: '15px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}>
                                Data de Pagamento
                            </div>
                            <input
                                type="text"
                                value={pagamento}
                                onChange={(e) => setPagamento(maskDate(e.target.value))}
                                placeholder="00/00/0000"
                                style={{ alignSelf: 'stretch', height: '56px', paddingLeft: '20px', paddingRight: '20px', background: 'white', borderRadius: '4px', outline: '1px #F0F0F0 solid', outlineOffset: '-1px', color: '#414F5D', fontSize: '16px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}
                                className="focus:outline-none focus:border-[#F78800] placeholder-[#414F5D] placeholder-opacity-100"
                            />
                        </div>
                        <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px', display: 'inline-flex' }}>
                            <div style={{ alignSelf: 'stretch', color: '#414F5D', fontSize: '15px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}>
                                Observações
                            </div>
                            <input
                                type="text"
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                placeholder="Alguma observação a fazer?"
                                style={{ alignSelf: 'stretch', height: '56px', paddingLeft: '20px', paddingRight: '20px', background: 'white', borderRadius: '4px', outline: '1px #F0F0F0 solid', outlineOffset: '-1px', color: '#414F5D', fontSize: '16px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '400' }}
                                className="focus:outline-none focus:border-[#F78800] placeholder-[#414F5D] placeholder-opacity-100"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ alignSelf: 'stretch', height: '1px', background: 'rgba(0, 0, 0, 0.05)' }}></div>

                    {/* Actions */}
                    <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: '16px', display: 'inline-flex' }}>
                        <button
                            onClick={onClose}
                            style={{ flex: '1 1 0', height: '56px', padding: '16px', borderRadius: '4px', outline: '1px #F78800 solid', outlineOffset: '-1px', justifyContent: 'center', alignItems: 'center', gap: '10px', display: 'flex', background: 'transparent' }}
                            className="hover:bg-orange-50 transition-colors"
                        >
                            <span style={{ color: '#F78800', fontSize: '16px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '600', lineHeight: '19.20px' }}>Cancelar</span>
                        </button>
                        <button
                            onClick={handleSave}
                            style={{ flex: '1 1 0', height: '56px', padding: '16px', background: '#F78800', borderRadius: '4px', justifyContent: 'center', alignItems: 'center', gap: '10px', display: 'flex' }}
                            className="hover:bg-[#E57600] transition-colors"
                        >
                            <span style={{ color: 'white', fontSize: '16px', fontFamily: 'Funnel Sans, sans-serif', fontWeight: '600', lineHeight: '19.20px' }}>
                                {consumoParaEditar ? 'Salvar Alterações' : 'Adicionar Consumo'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
