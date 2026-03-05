
import { useState, useRef, useEffect } from 'react';
import Logo from '../../assets/LOGOSEMFUNDO.png';

// Importação de ícones personalizados
import DashboardIcon from '../../../imgdasboard/icones/Dashboard.png';
import AgendaIcon from '../../../imgdasboard/icones/Agenda.png';
import UsuariosIcon from '../../../imgdasboard/icones/Usuarios.png';
import PrevisaoIcon from '../../../imgdasboard/icones/Previsão orçamentaria.png';
import InspecoesIcon from '../../../imgdasboard/icones/Inspeções.png';
import FornecedoresIcon from '../../../imgdasboard/icones/Fornecedores.png';
import ConsumosIcon from '../../../imgdasboard/icones/Consumos.png';
import EquipamentosIcon from '../../../imgdasboard/icones/Equipamentos.png';
import PlanosAcaoIcon from '../../../imgdasboard/icones/Planos de ação.png';
import DadosGerenciaisIcon from '../../../imgdasboard/icones/Dados Gerenciais.png';
import HistoricoIcon from '../../../imgdasboard/icones/Historico.png';
import PlanoManutencaoIcon from '../../../imgdasboard/icones/Plano de Manutenção.png';
import PerfilIcon from '../../../imgdasboard/icones/Perfil.png';
import SairIcon from '../../../imgdasboard/icones/Sair.png';
import SinoIcon from '../../../imgdasboard/iconespagina/Sino.png';
import LapisIcon from '../../assets/Lapis.png';
import EnergiaIcon from '../../../imgdasboard/iconesconsumo/energia.png';
import AguaIcon from '../../../imgdasboard/iconesconsumo/agua.png';
import GasIcon from '../../../imgdasboard/iconesconsumo/gas.png';
import CalendarioFiltroIcon from '../../../imgdasboard/iconesconsumo/Agenda.png';
import FundoSaude from '../../../imgdasboard/FundoSaude.png';
import Fundoinspecao from '../../../imgdasboard/Fundos/Fundoinspecao.png';
import EditarCadastroIcon from '../../../imgdasboard/icones/IconeExcluirCadastro.svg';
import ExcluirCadastroIcon from '../../../imgdasboard/icones/IconeEditarcadastro.svg';
import PesquisarIcon from '../../../imgdasboard/icones/Pesquisar.png';
import SetaCimaBaixoIcon from '../../../imgdasboard/icones/SETAPRACIMAEPRABAIXO.png';
import IconeEditarFoto from '../../../imgdasboard/perfil/iconeeditarfoto.png';
import IconeExcluirFoto from '../../../imgdasboard/perfil/iconeexcluirfoto.png';
import { AddProcedureModal } from './Modais/Procedimentos/AddProcedureModal';
import { EditProcedureModal } from './Modais/Procedimentos/EditProcedureModal';
import { AddSupplierModal } from './Modais/Fornecedores/AddSupplierModal';
import { AddConsumptionModal } from './Modais/Consumo/AddConsumptionModal';


// Importação de componentes de seção
import { Overview as VisaoGeral } from './Overview/index';
import { Agenda } from './Agenda/index';
import { Usuarios } from './Cadastro/Usuarios/Usuarios';
import { Fornecedores } from './Cadastro/Fornecedores/Fornecedores';
import { Equipamentos } from './Cadastro/Equipamentos/Equipamentos';
import { RelatoriosInspecoes } from './Relatorios/Inspecoes/Inspecoes';
import { RelatoriosConsumo } from './Relatorios/Consumo/Consumo';
import { RelatoriosPlanos } from './Relatorios/Planos/Planos';
import { RelatoriosDados } from './Relatorios/DadosGerenciais/Atrasadas/Atrasadas';
import { RelatoriosDadosFuturas } from './Relatorios/DadosGerenciais/Futuras/Futuras';
import { RelatoriosDadosUsuario } from './Relatorios/DadosGerenciais/PorUsuario/PorUsuario';
import { RelatoriosDadosAtividades } from './Relatorios/DadosGerenciais/UltimasAtividades/UltimasAtividades';
import { RelatoriosHistorico } from './Relatorios/Historico/Historico';
import { Previsao } from './Cadastro/Previsao/Previsao';
import { Inspecoes } from './Cadastro/Inspecoes/Inspecoes';
import { cadastroInspecoesData } from '../../hooks/cadastroInspecoesData';
import { useCadastroFornecedoresData } from '../../hooks/cadastroFornecedoresData';
import { useConsumosData } from '../../hooks/cadastroConsumosData';
import { useEquipamentosData } from '../../hooks/cadastroEquipamentosData';
import { useRelatorioInspecoesData } from '../../hooks/relatorioInspecoesData';

// Importação de ícones da página do dashboard
import IconeSaudeGeral from '../../../imgdasboard/iconespagina/IconeSaudeGeral.png';
import IconeAgendaInspecoes from '../../../imgdasboard/iconespagina/IconeAgendaInspecoes.png';
import IconePontualidade from '../../../imgdasboard/iconespagina/IconePontualidade.png';
import IconeConformidade from '../../../imgdasboard/iconespagina/IconeConformidade.png';
import IconeResolucao from '../../../imgdasboard/iconespagina/IconeResolução.png';
import IconeBomba from '../../../imgdasboard/iconespagina/IconeBomba.png';
import IconeReservatorio from '../../../imgdasboard/iconespagina/IconeReservatório.png';
import IconeReservatorio2 from '../../../imgdasboard/iconespagina/IconeReservatório2.png';
import IconeGerador from '../../../imgdasboard/iconespagina/IconeGerador.png';
import IconeElevador from '../../../imgdasboard/iconespagina/IconeElevador.png';
import IconeCerto from '../../../imgdasboard/iconespagina/Certo.png';
import IconeErrado from '../../../imgdasboard/iconespagina/Errado.png';

import { Perfil } from './Perfil/Perfil';
import { Consumos } from './Cadastro/Consumos/Consumos';
import { Responsabilidades } from './Relatorios/PlanoManutencao/Responsabilidades/Responsabilidades';
import { Emergencias } from './Relatorios/PlanoManutencao/Emergencias/Emergencias';
import { Sistemas } from './Relatorios/PlanoManutencao/Sistemas/Sistemas';
import { EditEquipmentModal } from './Modais/Equipamentos/EditEquipmentModal';
import { ViewEquipmentModal } from './Modais/Equipamentos/ViewEquipmentModal';
import { AddEquipmentModal } from './Modais/Equipamentos/AddEquipmentModal';
import { ImportFormulariosModal } from './Modais/Importacao/ImportFormulariosModal';
import { AnexosCondominioModal } from './Modais/Anexos/AnexosCondominioModal';
import { RelatoriosOpcoesModal } from './Modais/Relatorios/RelatoriosOpcoesModal';
import { AddUsuarioModal } from './Modais/Usuarios/AddUsuarioModal';
import { AddPrevisaoModal } from './Modais/Previsao/AddPrevisaoModal';
import { AddInspecaoModal } from './Modais/Inspecoes/AddInspecaoModal';
import { SistemaModals } from './Modais/Sistemas/SistemaModal';
import { ViewRelatorioInspecaoModal } from './Modais/Relatorios/ViewRelatorioInspecaoModal';
import { useRelatorioSistemasData, Sistema } from '../../hooks/relatorioSistemasData';
import RelatCalendarioIcon from '../../../imgdasboard/iconesrelatorio/calendario.png';
import IconeTotalPrevisto from '../../../imgdasboard/iconesrelatorio/Iconetotalprevisto.png';
import IconePerfilInspecoes from '../../../imgdasboard/iconesrelatorio/IconePerfilDasInspeções.png';

interface DashboardProps {
    onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
    const [showAttachModal, setShowAttachModal] = useState(false);
    const [view, setView] = useState<'dashboard' | 'inspecoes' | 'agenda' | 'usuarios' | 'previsao' | 'fornecedores' | 'consumos' | 'equipamentos' | 'relat_inspecoes' | 'relat_consumo' | 'relat_planos' | 'relat_dados' | 'relat_dados_futuras' | 'relat_dados_usuario' | 'relat_dados_atividades' | 'relat_historico' | 'relat_manutencao' | 'relat_manutencao_resp' | 'relat_manutencao_emerg' | 'relat_manutencao_sist' | 'perfil' | 'inspecoes_detalhe'>('dashboard');
    const [selectedInspecao, setSelectedInspecao] = useState<{ id: number; name: string } | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [reportType, setReportType] = useState<'simplificado' | 'completo' | null>(null);
    const [selectedAgendaDay, setSelectedAgendaDay] = useState('14');
    const [agendaSubView, setAgendaSubView] = useState<'calendario' | 'previsao'>('calendario');
    const [selectedBudgetYear, setSelectedBudgetYear] = useState<string | null>(null);
    const [selectedBudgetMonth, setSelectedBudgetMonth] = useState<string | null>(null);
    const [showAddPrevisaoModal, setShowAddPrevisaoModal] = useState(false);

    const [showImportModal, setShowImportModal] = useState(false);
    const [showAddInspecaoModal, setShowAddInspecaoModal] = useState(false);
    const [showAddProcedimentoModal, setShowAddProcedimentoModal] = useState(false);
    const [showEditProcedureModal, setShowEditProcedureModal] = useState(false);
    const [procedimentoParaEditar, setProcedimentoParaEditar] = useState<any>(null);
    const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
    const [showAddConsumptionModal, setShowAddConsumptionModal] = useState(false);
    const [inspecaoParaEditar, setInspecaoParaEditar] = useState<any>(null);
    const [inspecaoConferida, setInspecaoConferida] = useState(false);
    const [selectedImportForms, setSelectedImportForms] = useState<string[]>([]);
    const [equipmentSubView, setEquipmentSubView] = useState<'lista' | 'detalhes'>('lista');
    const [selectedEquipmentGroup, setSelectedEquipmentGroup] = useState<string | null>(null);
    const [showEditEquipmentModal, setShowEditEquipmentModal] = useState(false);
    const [showViewEquipmentModal, setShowViewEquipmentModal] = useState(false);
    const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
    const [showAddSistemaModal, setShowAddSistemaModal] = useState(false);
    const [showEditSistemaModal, setShowEditSistemaModal] = useState(false);
    const [showViewSistemaModal, setShowViewSistemaModal] = useState(false);
    const [sistemaParaEditar, setSistemaParaEditar] = useState<Sistema | null>(null);
    const [historicoTab, setHistoricoTab] = useState<'manutencoes' | 'relatorios'>('manutencoes');
    const [isEditingPerfil, setIsEditingPerfil] = useState(false);
    const [showViewRelatorioModal, setShowViewRelatorioModal] = useState(false);
    const fornecedoresHook = useCadastroFornecedoresData();
    const consumosHook = useConsumosData();
    const equipamentosHook = useEquipamentosData();
    const relatorioInspecoesHook = useRelatorioInspecoesData();
    const cadastroInspecoesHook = cadastroInspecoesData();
    const sistemasHook = useRelatorioSistemasData();
    const [fornecedorParaEditar, setFornecedorParaEditar] = useState<any>(null);
    const [consumoParaEditar, setConsumoParaEditar] = useState<any>(null);
    const [equipamentoParaEditar, setEquipamentoParaEditar] = useState<any>(null);

    const mainContentRef = useRef<HTMLElement>(null);

    // Reset scroll to top when view changes
    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo(0, 0);
        }
    }, [view]);


    // Layout padrão para outras visualizações
    return (
        <div className="flex w-full bg-white font-['DM_Sans'] min-h-screen">
            {/* Barra lateral */}
            <aside className="w-[380px] bg-white border-r-[0.5px] border-[#E1E1E1] flex flex-col py-[60px] px-[40px] shrink-0 gap-[60px] h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {/* Logotipo */}
                <div className="flex justify-start shrink-0">
                    <img
                        src={Logo}
                        alt="Pred Fácil"
                        className="h-[106px] w-auto object-contain"
                    />
                </div>

                {/* Navegação */}
                <nav className="flex flex-col w-full shrink-0 gap-[8px]">
                    {/* Dashboard */}
                    <div
                        onClick={() => {
                            setView('dashboard');
                            setAgendaSubView('calendario');
                            setSelectedBudgetYear(null);
                            setSelectedBudgetMonth(null);
                        }}
                        className={`flex items-center gap-[16px] h-[60px] px-[20px] py-[10px] rounded-[4px] cursor-pointer shrink-0 transition-colors ${view === 'dashboard' ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                    >
                        <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                            <img src={DashboardIcon} alt="Dashboard" className="w-[24px] h-[24px] object-contain" />
                        </div>
                        <span className={`${view === 'dashboard' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>Dashboard</span>
                    </div>

                    {/* Agenda */}
                    <div className="flex flex-col gap-[8px]">
                        <div
                            onClick={() => setView('agenda')}
                            className={`flex items-center justify-between h-[60px] px-[20px] py-[10px] rounded-[4px] cursor-pointer shrink-0 transition-colors ${view === 'agenda' ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-[16px]">
                                <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                    <img src={AgendaIcon} alt="Agenda" className="w-[24px] h-[24px] object-contain" />
                                </div>
                                <span className={`${view === 'agenda' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>Agenda</span>
                            </div>
                            <svg
                                width="12" height="7" viewBox="0 0 12 7" fill="none"
                                className={`transition-transform duration-300 ${view === 'agenda' ? 'rotate-180' : ''}`}
                            >
                                <path d="M1 1L6 6L11 1" stroke={view === 'agenda' ? '#F78800' : '#3B4141'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {view === 'agenda' && (
                            <div className="flex flex-col">
                                <div
                                    onClick={() => {
                                        setAgendaSubView('calendario');
                                        setSelectedBudgetYear(null);
                                        setSelectedBudgetMonth(null);
                                    }}
                                    className="flex items-center h-[40px] pl-[60px] pr-[20px] cursor-pointer hover:bg-gray-50 rounded-[8px]"
                                >
                                    <span className={`${agendaSubView === 'calendario' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[16px] font-normal font-['DM_Sans']`}>Calendário</span>
                                </div>
                                <div
                                    onClick={() => {
                                        setAgendaSubView('previsao');
                                        setSelectedBudgetYear(null);
                                        setSelectedBudgetMonth(null);
                                    }}
                                    className="flex items-center h-[40px] pl-[60px] pr-[20px] cursor-pointer hover:bg-gray-50 rounded-[8px]"
                                >
                                    <span className={`${agendaSubView === 'previsao' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[16px] font-normal font-['DM_Sans']`}>Previsão Orçamentária</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CADASTROS Separator */}
                    <div className="flex items-center gap-[12px] py-[40px] shrink-0">
                        <div className="w-[16px] h-[1px] bg-[#3B4141] opacity-20"></div>
                        <span className="text-[#3B4141] text-[14px] font-medium font-['DM_Sans'] tracking-[0.05em] uppercase">CADASTROS</span>
                        <div className="flex-1 h-[1px] bg-[#3B4141] opacity-20"></div>
                    </div>

                    {/* Seção de Itens de Cadastro */}
                    <div className="flex flex-col">
                        {/* Usuários */}
                        <div
                            onClick={() => setView('usuarios')}
                            className={`flex items-center gap-[16px] h-[60px] px-[20px] py-[10px] rounded-[4px] cursor-pointer shrink-0 transition-colors ${view === 'usuarios' ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                        >
                            <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                {view === 'usuarios' ? (
                                    <div style={{ width: 24, height: 24, position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ width: 8, height: 8, left: 5, top: 3, position: 'absolute', outline: '1.33px #F78801 solid', outlineOffset: '-0.67px' }}></div>
                                        <div style={{ width: 12, height: 6, left: 3, top: 15, position: 'absolute', outline: '1.33px #F78801 solid', outlineOffset: '-0.67px' }}></div>
                                        <div style={{ width: 3.01, height: 7.75, left: 16, top: 3.13, position: 'absolute', outline: '1.33px #F78801 solid', outlineOffset: '-0.67px' }}></div>
                                        <div style={{ width: 3, height: 5.85, left: 18, top: 15.15, position: 'absolute', outline: '1.33px #F78801 solid', outlineOffset: '-0.67px' }}></div>
                                    </div>
                                ) : (
                                    <img src={UsuariosIcon} alt="Usuários" className="w-[24px] h-[24px] object-contain" />
                                )}
                            </div>
                            <span className={`${view === 'usuarios' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>Usuários</span>
                        </div>

                        {/* Previsão Orçamentária */}
                        <div
                            onClick={() => setView('previsao')}
                            className={`flex items-center gap-[16px] h-[60px] px-[20px] py-[10px] rounded-[4px] cursor-pointer shrink-0 transition-colors ${view === 'previsao' ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                        >
                            <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                {view === 'previsao' ? (
                                    <div style={{ width: 24, height: 24, position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ width: 12, height: 6, left: 9, top: 11, position: 'absolute', outline: '1.33px #F78800 solid', outlineOffset: '-0.67px' }}></div>
                                        <div style={{ width: 12, height: 7, left: 9, top: 14, position: 'absolute', outline: '1.33px #F78800 solid', outlineOffset: '-0.67px' }}></div>
                                        <div style={{ width: 12, height: 6, left: 3, top: 3, position: 'absolute', outline: '1.33px #F78800 solid', outlineOffset: '-0.67px' }}></div>
                                        <div style={{ width: 2, height: 12, left: 3, top: 6, position: 'absolute', outline: '1.33px #F78800 solid', outlineOffset: '-0.67px' }}></div>
                                        <div style={{ width: 2, height: 2, left: 3, top: 11, position: 'absolute', outline: '1.33px #F78800 solid', outlineOffset: '-0.67px' }}></div>
                                    </div>
                                ) : (
                                    <img src={PrevisaoIcon} alt="Previsão Orçamentária" className="w-[24px] h-[24px] object-contain" />
                                )}
                            </div>
                            <span className={`${view === 'previsao' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>Previsão Orçamentária</span>
                        </div>

                        {/* Inspeções */}
                        <div
                            onClick={() => setView('inspecoes')}
                            className={`flex items-center gap-[16px] h-[60px] px-[20px] py-[10px] rounded-[4px] cursor-pointer shrink-0 transition-colors ${view === 'inspecoes' ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                        >
                            <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                <img src={InspecoesIcon} alt="Inspeções" className="w-[24px] h-[24px] object-contain" />
                            </div>
                            <span className={`${view === 'inspecoes' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>Inspeções</span>
                        </div>

                        {[
                            { label: 'Fornecedores', icon: FornecedoresIcon, key: 'fornecedores' },
                            { label: 'Consumos', icon: ConsumosIcon, key: 'consumos' },
                            { label: 'Equipamentos', icon: EquipamentosIcon, key: 'equipamentos' }
                        ].map((item, i) => (
                            <div
                                key={i}
                                onClick={() => setView(item.key as any)}
                                className={`flex items-center gap-[16px] h-[60px] px-[20px] py-[10px] rounded-[4px] cursor-pointer shrink-0 transition-colors ${view === item.key ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                            >
                                <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                    <img src={item.icon} alt={item.label} className="w-[24px] h-[24px] object-contain" />
                                </div>
                                <span className={`${view === item.key ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* RELATÓRIOS Separator */}
                    <div className="flex items-center gap-[12px] py-[40px] shrink-0">
                        <div className="w-[16px] h-[1px] bg-[#3B4141] opacity-20"></div>
                        <span className="text-[#3B4141] text-[14px] font-medium font-['DM_Sans'] tracking-[0.05em] uppercase">RELATÓRIOS</span>
                        <div className="flex-1 h-[1px] bg-[#3B4141] opacity-20"></div>
                    </div>

                    {/* RELATÓRIOS */}
                    <div className="flex flex-col">
                        {[
                            { label: 'Inspeções', icon: InspecoesIcon, key: 'relat_inspecoes' },
                            { label: 'Consumo', icon: ConsumosIcon, key: 'relat_consumo' },
                            { label: 'Planos de Ação', icon: PlanosAcaoIcon, key: 'relat_planos' }
                        ].map((item, i) => (
                            <div
                                key={i}
                                onClick={() => setView(item.key as any)}
                                className={`flex items-center justify-between h-[60px] px-[20px] py-[10px] rounded-[8px] cursor-pointer shrink-0 transition-colors ${view === item.key ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-[16px]">
                                    <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                        <img src={item.icon} alt={item.label} className="w-[24px] h-[24px] object-contain" />
                                    </div>
                                    <span className={`${view === item.key ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>{item.label}</span>
                                </div>
                            </div>
                        ))}

                        {/* Dados Gerenciais (Expanded) */}
                        <div className="flex flex-col">
                            <div
                                onClick={() => setView('relat_dados')}
                                className={`flex items-center justify-between h-[60px] px-[20px] py-[10px] rounded-[4px] cursor-pointer shrink-0 transition-colors ${['relat_dados', 'relat_dados_futuras', 'relat_dados_usuario', 'relat_dados_atividades'].includes(view) ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-[16px]">
                                    <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                        <img src={DadosGerenciaisIcon} alt="Dados Gerenciais" className="w-[24px] h-[24px] object-contain" />
                                    </div>
                                    <span className={`${['relat_dados', 'relat_dados_futuras', 'relat_dados_usuario', 'relat_dados_atividades'].includes(view) ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>Dados Gerenciais</span>
                                </div>
                                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={`transition-transform duration-300 ${['relat_dados', 'relat_dados_futuras', 'relat_dados_usuario', 'relat_dados_atividades'].includes(view) ? 'rotate-180' : ''}`}>
                                    <path d="M1 1L6 6L11 1" stroke={['relat_dados', 'relat_dados_futuras', 'relat_dados_usuario', 'relat_dados_atividades'].includes(view) ? '#3B4141' : '#3B4141'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Submenu */}
                            {['relat_dados', 'relat_dados_futuras', 'relat_dados_usuario', 'relat_dados_atividades'].includes(view) && (
                                <div className="flex flex-col">
                                    <div className={`flex items-center h-[40px] pl-[60px] pr-[20px] cursor-pointer rounded-[8px] ${view === 'relat_dados' ? 'bg-gray-50' : 'hover:bg-gray-50'}`} onClick={() => setView('relat_dados')}>
                                        <span className={`${view === 'relat_dados' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[16px] font-normal font-['DM_Sans']`}>Inspeções Atrasadas</span>
                                    </div>
                                    <div className={`flex items-center h-[40px] pl-[60px] pr-[20px] cursor-pointer rounded-[8px] ${view === 'relat_dados_futuras' ? 'bg-gray-50' : 'hover:bg-gray-50'}`} onClick={() => setView('relat_dados_futuras')}>
                                        <span className={`${view === 'relat_dados_futuras' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[16px] font-normal font-['DM_Sans']`}>Inspeções Futuras</span>
                                    </div>
                                    <div className={`flex items-center h-[40px] pl-[60px] pr-[20px] cursor-pointer rounded-[8px] ${view === 'relat_dados_usuario' ? 'bg-gray-50' : 'hover:bg-gray-50'}`} onClick={() => setView('relat_dados_usuario')}>
                                        <span className={`${view === 'relat_dados_usuario' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[16px] font-normal font-['DM_Sans']`}>Dados por Usuário</span>
                                    </div>
                                    <div className={`flex items-center h-[40px] pl-[60px] pr-[20px] cursor-pointer rounded-[8px] ${view === 'relat_dados_atividades' ? 'bg-gray-50' : 'hover:bg-gray-50'}`} onClick={() => setView('relat_dados_atividades')}>
                                        <span className={`${view === 'relat_dados_atividades' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[16px] font-normal font-['DM_Sans']`}>Últimas Atividades</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Histórico */}
                        <div
                            onClick={() => setView('relat_historico')}
                            className={`flex items-center justify-between h-[60px] px-[20px] py-[10px] rounded-[8px] cursor-pointer shrink-0 transition-colors ${view === 'relat_historico' ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-[16px]">
                                <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                    <img src={HistoricoIcon} alt="Histórico" className="w-[24px] h-[24px] object-contain" />
                                </div>
                                <span className={`${view === 'relat_historico' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>Histórico</span>
                            </div>
                        </div>

                        {/* Plano de Manutenção (Expanded) */}
                        <div className="flex flex-col">
                            <div
                                onClick={() => setView('relat_manutencao_resp')}
                                className={`flex items-center justify-between h-[60px] px-[20px] py-[10px] rounded-[4px] cursor-pointer shrink-0 transition-colors ${['relat_manutencao', 'relat_manutencao_resp', 'relat_manutencao_emerg', 'relat_manutencao_sist'].includes(view) ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-[16px]">
                                    <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                        <img src={PlanoManutencaoIcon} alt="Plano de Manutenção" className="w-[24px] h-[24px] object-contain" />
                                    </div>
                                    <span className={`${['relat_manutencao', 'relat_manutencao_resp', 'relat_manutencao_emerg', 'relat_manutencao_sist'].includes(view) ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>Plano de Manutenção</span>
                                </div>
                                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={`transition-transform duration-300 ${['relat_manutencao', 'relat_manutencao_resp', 'relat_manutencao_emerg', 'relat_manutencao_sist'].includes(view) ? 'rotate-180' : ''}`}>
                                    <path d="M1 1L6 6L11 1" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Submenu */}
                            {['relat_manutencao', 'relat_manutencao_resp', 'relat_manutencao_emerg', 'relat_manutencao_sist'].includes(view) && (
                                <div className="flex flex-col">
                                    <div className={`flex items-center h-[40px] pl-[60px] pr-[20px] cursor-pointer rounded-[8px] ${view === 'relat_manutencao_resp' ? 'bg-gray-50' : 'hover:bg-gray-50'}`} onClick={() => setView('relat_manutencao_resp')}>
                                        <span className={`${view === 'relat_manutencao_resp' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[16px] font-normal font-['DM_Sans']`}>Responsabilidades</span>
                                    </div>
                                    <div className={`flex items-center h-[40px] pl-[60px] pr-[20px] cursor-pointer rounded-[8px] ${view === 'relat_manutencao_emerg' ? 'bg-gray-50' : 'hover:bg-gray-50'}`} onClick={() => setView('relat_manutencao_emerg')}>
                                        <span className={`${view === 'relat_manutencao_emerg' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[16px] font-normal font-['DM_Sans']`}>Emergências</span>
                                    </div>
                                    <div className={`flex items-center h-[40px] pl-[60px] pr-[20px] cursor-pointer rounded-[8px] ${view === 'relat_manutencao_sist' ? 'bg-gray-50' : 'hover:bg-gray-50'}`} onClick={() => setView('relat_manutencao_sist')}>
                                        <span className={`${view === 'relat_manutencao_sist' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[16px] font-normal font-['DM_Sans']`}>Sistemas</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PERFIL E CONFIGURAÇÕES Separator */}
                    <div className="flex items-center gap-[12px] py-[40px] shrink-0">
                        <div className="w-[16px] h-[1px] bg-[#3B4141] opacity-20"></div>
                        <span className="text-[#3B4141] text-[14px] font-medium font-['DM_Sans'] tracking-[0.05em] uppercase">PERFIL E CONFIGURAÇÕES</span>
                        <div className="flex-1 h-[1px] bg-[#3B4141] opacity-20"></div>
                    </div>

                    {/* PERFIL E CONFIGURAÇÕES */}
                    <div className="flex flex-col">
                        <div
                            onClick={() => {
                                setView('perfil');
                                setIsEditingPerfil(false);
                            }}
                            className={`flex items-center gap-[16px] h-[60px] px-[20px] py-[10px] rounded-[4px] cursor-pointer shrink-0 transition-colors ${view === 'perfil' ? 'bg-[#FFEAD0]' : 'hover:bg-gray-50'}`}
                        >
                            <div className="w-[24px] h-[24px] relative overflow-hidden flex items-center justify-center">
                                <img src={PerfilIcon} alt="Perfil" className="w-[24px] h-[24px] object-contain" />
                            </div>
                            <span className={`${view === 'perfil' ? 'text-[#F78800]' : 'text-[#3B4141]'} text-[18px] font-medium font-['DM_Sans']`}>Perfil</span>
                        </div>
                    </div>
                </nav>

                {/* Botão Sair */}
                <div className="mt-auto">
                    <div
                        onClick={onLogout}
                        className="p-[11px] rounded-[16px] flex items-center gap-[8px] cursor-pointer hover:bg-red-50 transition-all w-fit group"
                    >
                        <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                            <img src={SairIcon} alt="Sair" className="w-[24px] h-[24px] object-contain" />
                        </div>
                        <span className="text-[#E63939] text-[14px] font-normal font-['Inter']">Sair</span>
                    </div>
                </div>
            </aside>

            {/* Conteúdo Principal */}
            <main
                ref={mainContentRef}
                className="flex-1 overflow-y-auto flex flex-col bg-white h-screen custom-scrollbar"
            >
                {/* Cabeçalho */}
                {![''].includes(view) && (
                    <header className="h-[80px] bg-white border-b-[0.5px] border-[#E1E1E1] flex items-center justify-between px-[40px] py-[20px] shrink-0">
                        <div className="flex flex-col justify-center">
                            <h1 className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans']">
                                {view === 'inspecoes_detalhe' ? (
                                    <div className="flex items-center gap-[16px]">
                                        <button
                                            onClick={() => setView('inspecoes')}
                                            className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B4141" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </button>
                                        <span className="text-[#3B4141] text-[20px] font-medium font-['DM_Sans']">
                                            {selectedInspecao?.name || 'Inspeção'}
                                        </span>
                                    </div>
                                ) : (
                                    view === 'usuarios' ? 'Usuários' :
                                        view === 'inspecoes' ? 'Inspeções - Cadastros' :
                                            view === 'previsao' ? 'Previsão Orçamentária' :
                                                view === 'agenda' ? (agendaSubView === 'previsao' ? 'Agenda - Previsão Orçamentária' : 'Agenda - Calendário') :
                                                    view === 'fornecedores' ? 'Fornecedores' :
                                                        view === 'consumos' ? 'Consumos' :
                                                            view === 'equipamentos' ? 'Grupo de Equipamentos' :
                                                                view === 'relat_inspecoes' ? 'Relatório de Inspeções' :
                                                                    view === 'relat_consumo' ? 'Relatórios - Consumo' :
                                                                        view === 'relat_planos' ? 'Relatórios - Planos de Ação' :
                                                                            view === 'relat_dados' ? 'Dados Gerenciais - Inspeções Atrasadas' :
                                                                                view === 'relat_dados_futuras' ? 'Dados Gerenciais - Inspeções Futuras' :
                                                                                    view === 'relat_dados_usuario' ? 'Dados Gerenciais - Dados por Usuário' :
                                                                                        view === 'relat_dados_atividades' ? 'Dados Gerenciais - Últimas Atividades' :
                                                                                            view === 'relat_historico' ? (historicoTab === 'manutencoes' ? 'Histórico' : 'Histórico de Relatórios Gerados') :
                                                                                                view === 'relat_manutencao' || view === 'relat_manutencao_resp' ? 'Plano de Manutenção - Responsabilidades' :
                                                                                                    view === 'relat_manutencao_emerg' ? 'Plano de Manutenção - Emergências' :
                                                                                                        view === 'relat_manutencao_sist' ? 'Plano de Manutenção - Sistemas' :
                                                                                                            view === 'perfil' ? 'Perfil do Usuário' :
                                                                                                                'Dashboard'
                                )}
                            </h1>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            {/* Sino de Notificação */}
                            <div className="w-[40px] h-[40px] bg-[#F78800] rounded-[4px] flex flex-col items-center justify-center cursor-pointer">
                                <img src={SinoIcon} alt="Notificações" />
                            </div>
                            {/* Identificador do Condomínio */}
                            <div className="h-[40px] px-[20px] py-[10px] bg-[#F3F4F6] rounded-[4px] flex items-center justify-center gap-[10px]">
                                <span className="text-[#3B4141] text-[18px] font-medium font-['DM_Sans'] leading-[18px]">Jardins Residence</span>
                            </div>
                            {/* Perfil do Usuário */}
                            <div className="flex items-center gap-[8px] cursor-pointer">
                                <div className="w-[40px] h-[40px] bg-[#3F4836] rounded-[4px] flex items-center justify-center text-white font-medium text-[14px]">
                                    {/* Espaço para logo ou iniciais */}
                                    JR
                                </div>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#3B4141" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 1L5 5L9 1" />
                                </svg>
                            </div>
                        </div>
                    </header>
                )}

                {/* Área de Conteúdo */}
                <div className="p-[40px] flex flex-col gap-[60px]">
                    {view === 'dashboard' && (
                        <VisaoGeral
                            setShowAttachModal={setShowAttachModal}
                            setShowReportModal={setShowReportModal}
                            setView={setView}
                            LapisIcon={LapisIcon}
                            IconeSaudeGeral={IconeSaudeGeral}
                            IconePontualidade={IconePontualidade}
                            IconeConformidade={IconeConformidade}
                            IconeResolucao={IconeResolucao}
                            FundoSaude={FundoSaude}
                            IconeBomba={IconeBomba}
                            IconeReservatorio={IconeReservatorio}
                            IconeReservatorio2={IconeReservatorio2}
                            IconeGerador={IconeGerador}
                            IconeElevador={IconeElevador}
                            IconeCerto={IconeCerto}
                            IconeErrado={IconeErrado}
                        />
                    )}



                    {view === 'fornecedores' && (
                        <Fornecedores
                            hook={fornecedoresHook}
                            setShowAddSupplierModal={setShowAddSupplierModal}
                            setFornecedorParaEditar={setFornecedorParaEditar}
                            PesquisarIcon={PesquisarIcon}
                        />
                    )}

                    {view === 'consumos' && (
                        <Consumos
                            hook={consumosHook}
                            setShowAddConsumptionModal={setShowAddConsumptionModal}
                            setConsumoParaEditar={setConsumoParaEditar}
                            EnergiaIcon={EnergiaIcon}
                            AguaIcon={AguaIcon}
                            GasIcon={GasIcon}
                            CalendarioFiltroIcon={CalendarioFiltroIcon}
                            ExcluirIcon={ExcluirCadastroIcon}
                            SetaCimaBaixoIcon={SetaCimaBaixoIcon}
                            IconeLapis={EditarCadastroIcon}
                        />
                    )}

                    {view === 'equipamentos' && (
                        <Equipamentos
                            hook={equipamentosHook}
                            equipmentSubView={equipmentSubView}
                            setEquipmentSubView={setEquipmentSubView}
                            setSelectedEquipmentGroup={setSelectedEquipmentGroup}
                            selectedEquipmentGroup={selectedEquipmentGroup}
                            setShowAddEquipmentModal={setShowAddEquipmentModal}
                            setShowViewEquipmentModal={setShowViewEquipmentModal}
                            setShowEditEquipmentModal={setShowEditEquipmentModal}
                            setEquipamentoParaEditar={setEquipamentoParaEditar}
                            IconeLapis={EditarCadastroIcon}
                            ExcluirIcon={ExcluirCadastroIcon}
                        />
                    )}

                    {view === 'agenda' && (
                        <Agenda
                            agendaSubView={agendaSubView}
                            setSelectedAgendaDay={setSelectedAgendaDay}
                            selectedAgendaDay={selectedAgendaDay}
                            selectedBudgetYear={selectedBudgetYear}
                            setSelectedBudgetYear={setSelectedBudgetYear}
                            selectedBudgetMonth={selectedBudgetMonth}
                            setSelectedBudgetMonth={setSelectedBudgetMonth}
                            setShowReportModal={setShowReportModal}
                            setShowAddPrevisaoModal={setShowAddPrevisaoModal}
                            AgendaIcon={AgendaIcon}
                            SemaAtividades={Fundoinspecao}
                            IconeAgendaInspecoes={IconeAgendaInspecoes}
                        />
                    )}
                    {view === 'previsao' && (
                        <Previsao
                            PesquisarIcon={PesquisarIcon}
                            AgendaIcon={AgendaIcon}
                            setShowAddPrevisaoModal={setShowAddPrevisaoModal}
                        />
                    )}

                    {view === 'usuarios' && (
                        <Usuarios
                            setShowAddUserModal={setShowAddUserModal}
                            PesquisarIcon={PesquisarIcon}
                            SetaCimaBaixoIcon={SetaCimaBaixoIcon}
                            ExcluirCadastroIcon={ExcluirCadastroIcon}
                            EditarCadastroIcon={EditarCadastroIcon}
                        />
                    )}



                    {view === 'relat_inspecoes' && (
                        <RelatoriosInspecoes
                            hook={relatorioInspecoesHook}
                            setShowReportModal={setShowReportModal}
                            setShowViewRelatorioModal={setShowViewRelatorioModal}
                            AgendaIcon={AgendaIcon}
                            SetaCimaBaixoIcon={SetaCimaBaixoIcon}
                        />
                    )}

                    {(view === 'inspecoes' || view === 'inspecoes_detalhe') && (
                        <Inspecoes
                            view={view}
                            setView={setView}
                            selectedInspecao={selectedInspecao}
                            setSelectedInspecao={setSelectedInspecao}
                            inspecoesHook={cadastroInspecoesHook}
                            setShowAddInspecaoModal={setShowAddInspecaoModal}
                            setShowImportModal={setShowImportModal}
                            setShowAddProcedimentoModal={setShowAddProcedimentoModal}
                            setInspecaoParaEditar={setInspecaoParaEditar}
                            PesquisarIcon={PesquisarIcon}
                            AgendaIcon={AgendaIcon}
                            ExcluirCadastroIcon={ExcluirCadastroIcon}
                            EditarCadastroIcon={EditarCadastroIcon}
                            setShowEditProcedureModal={setShowEditProcedureModal}
                            setProcedimentoParaEditar={setProcedimentoParaEditar}
                        />
                    )}

                    {view === 'relat_consumo' && (
                        <RelatoriosConsumo
                            RelatCalendarioIcon={RelatCalendarioIcon}
                            RelatAguaIcon={AguaIcon}
                            RelatEnergiaIcon={EnergiaIcon}
                            RelatGasIcon={GasIcon}
                        />
                    )}

                    {view === 'relat_planos' && (
                        <RelatoriosPlanos
                            RelatCalendarioIcon={RelatCalendarioIcon}
                        />
                    )}

                    {['relat_dados', 'relat_dados_atrasadas'].includes(view) && (
                        <RelatoriosDados
                            view={view}
                            RelatInspecoesIcon={InspecoesIcon}
                            PesquisarIcon={PesquisarIcon}
                            RelatCalendarioIcon={RelatCalendarioIcon}
                            CalendarioFiltroIcon={CalendarioFiltroIcon}
                        />
                    )}

                    {view === 'relat_dados_futuras' && (
                        <RelatoriosDadosFuturas
                            PesquisarIcon={PesquisarIcon}
                            CalendarioFiltroIcon={CalendarioFiltroIcon}
                            IconeTotalPrevisto={IconeTotalPrevisto}
                            IconePerfilInspecoes={IconePerfilInspecoes}
                        />
                    )}

                    {view === 'relat_dados_usuario' && (
                        <RelatoriosDadosUsuario
                            PesquisarIcon={PesquisarIcon}
                            RelatCalendarioIcon={RelatCalendarioIcon}
                        />
                    )}

                    {view === 'relat_dados_atividades' && (
                        <RelatoriosDadosAtividades
                            PesquisarIcon={PesquisarIcon}
                            RelatCalendarioIcon={RelatCalendarioIcon}
                        />
                    )}

                    {view === 'relat_historico' && (
                        <RelatoriosHistorico
                            historicoTab={historicoTab}
                            setHistoricoTab={setHistoricoTab}
                            PesquisarIcon={PesquisarIcon}
                            CalendarioFiltroIcon={CalendarioFiltroIcon}
                            IconeTotalPrevisto={IconeTotalPrevisto}
                        />
                    )}



                    {/* Plano de Manutenção */}
                    {
                        (view === 'relat_manutencao' || view === 'relat_manutencao_resp' || view === 'relat_manutencao_emerg' || view === 'relat_manutencao_sist') && (
                            <div className="w-full flex flex-col bg-white">
                                {/* Aba de Responsabilidades */}
                                {(view === 'relat_manutencao' || view === 'relat_manutencao_resp') && (
                                    <Responsabilidades />
                                )}

                                {/* Aba de Emergências */}
                                {view === 'relat_manutencao_emerg' && (
                                    <Emergencias />
                                )}

                                {/* Aba de Sistemas */}
                                {view === 'relat_manutencao_sist' && (
                                    <Sistemas
                                        hook={sistemasHook}
                                        setShowAddSistemaModal={setShowAddSistemaModal}
                                        setShowViewSistemaModal={setShowViewSistemaModal}
                                        setShowEditSistemaModal={setShowEditSistemaModal}
                                        setSistemaParaEditar={setSistemaParaEditar}
                                        ExcluirIcon={ExcluirCadastroIcon}
                                        EditarIcon={EditarCadastroIcon}
                                    />
                                )}
                            </div>
                        )
                    }

                    {/* Modais de Importação e Anexos */}
                    <ImportFormulariosModal
                        isOpen={showImportModal}
                        onClose={() => setShowImportModal(false)}
                        onImport={cadastroInspecoesHook.importarFormularios}
                        PesquisarIcon={PesquisarIcon}
                        selectedImportForms={selectedImportForms}
                        setSelectedImportForms={setSelectedImportForms}
                    />

                    <AnexosCondominioModal
                        isOpen={showAttachModal}
                        onClose={() => setShowAttachModal(false)}
                    />
                    <RelatoriosOpcoesModal
                        isOpen={showReportModal}
                        onClose={() => setShowReportModal(false)}
                        reportType={reportType}
                        setReportType={setReportType}
                    />

                    <AddUsuarioModal
                        isOpen={showAddUserModal}
                        onClose={() => setShowAddUserModal(false)}
                    />
                    <ViewRelatorioInspecaoModal
                        isOpen={showViewRelatorioModal}
                        onClose={() => setShowViewRelatorioModal(false)}
                        data={relatorioInspecoesHook.selectedRelatorio}
                    />

                    {/* Modal de Adicionar Previsão Orçamentária */}
                    <AddPrevisaoModal
                        isOpen={showAddPrevisaoModal}
                        onClose={() => setShowAddPrevisaoModal(false)}
                        AgendaIcon={AgendaIcon}
                    />

                    {/* Modal: Adicionar Inspeção */}
                    <AddInspecaoModal
                        isOpen={showAddInspecaoModal}
                        onClose={() => {
                            setShowAddInspecaoModal(false);
                            setInspecaoParaEditar(null);
                        }}
                        onAdd={cadastroInspecoesHook.adicionarInspecao}
                        onEdit={cadastroInspecoesHook.editarInspecao}
                        inspecaoParaEditar={inspecaoParaEditar}
                        inspecaoConferida={inspecaoConferida}
                        setInspecaoConferida={setInspecaoConferida}
                    />

                    {/* Modal: Adicionar Procedimento */}
                    <AddProcedureModal
                        isOpen={showAddProcedimentoModal}
                        onClose={() => setShowAddProcedimentoModal(false)}
                        onAdd={(proc) => {
                            if (selectedInspecao) {
                                cadastroInspecoesHook.adicionarProcedimento(selectedInspecao.id, proc);
                            }
                        }}
                    />

                    <EditProcedureModal
                        isOpen={showEditProcedureModal}
                        onClose={() => {
                            setShowEditProcedureModal(false);
                            setProcedimentoParaEditar(null);
                        }}
                        onSave={(id, data) => {
                            if (selectedInspecao) {
                                cadastroInspecoesHook.editarProcedimento(selectedInspecao.id, id, data);
                            }
                        }}
                        procedimento={procedimentoParaEditar}
                    />

                    {/* Modal: Adicionar Fornecedor */}
                    <AddSupplierModal
                        isOpen={showAddSupplierModal}
                        onClose={() => setShowAddSupplierModal(false)}
                        onAdd={fornecedoresHook.adicionarFornecedor}
                        onEdit={fornecedoresHook.editarFornecedor}
                        fornecedorParaEditar={fornecedorParaEditar}
                    />

                    {/* Modal: Adicionar Consumo */}
                    <AddConsumptionModal
                        isOpen={showAddConsumptionModal}
                        onClose={() => setShowAddConsumptionModal(false)}
                        onAdd={consumosHook.adicionar}
                        onEdit={consumosHook.editar}
                        consumoParaEditar={consumoParaEditar}
                    />

                    {/* Modal: Editar Equipamento */}
                    {
                        showEditEquipmentModal && (
                            <EditEquipmentModal
                                onClose={() => setShowEditEquipmentModal(false)}
                                onSave={(id, data) => {
                                    equipamentosHook.editar(id, data);
                                    setShowEditEquipmentModal(false);
                                }}
                                data={equipamentoParaEditar}
                            />
                        )
                    }

                    {/* Modal: Visualizar Equipamento */}
                    {
                        showViewEquipmentModal && (
                            <ViewEquipmentModal
                                onClose={() => setShowViewEquipmentModal(false)}
                                data={equipamentoParaEditar}
                            />
                        )
                    }

                    {/* Modal: Adicionar Equipamento */}
                    {
                        showAddEquipmentModal && (
                            <AddEquipmentModal
                                onClose={() => setShowAddEquipmentModal(false)}
                                onAdd={(data) => {
                                    equipamentosHook.adicionar(data);
                                    setShowAddEquipmentModal(false);
                                }}
                            />
                        )
                    }

                    <SistemaModals
                        showAddSistemaModal={showAddSistemaModal}
                        setShowAddSistemaModal={setShowAddSistemaModal}
                        showEditSistemaModal={showEditSistemaModal}
                        setShowEditSistemaModal={setShowEditSistemaModal}
                        showViewSistemaModal={showViewSistemaModal}
                        setShowViewSistemaModal={setShowViewSistemaModal}
                        data={sistemaParaEditar}
                        onAdd={sistemasHook.adicionar}
                        onEdit={sistemasHook.editar}
                        onDelete={sistemasHook.excluir}
                    />
                    {
                        view === 'perfil' && (
                            <Perfil
                                isEditingPerfil={isEditingPerfil}
                                setIsEditingPerfil={setIsEditingPerfil}
                                IconeEditarFoto={IconeEditarFoto}
                                IconeExcluirFoto={IconeExcluirFoto}
                            />
                        )
                    }
                </div >
            </main >
        </div >
    );
}

export default Dashboard;
