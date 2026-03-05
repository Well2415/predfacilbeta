import React, { useState, useRef, useEffect } from 'react';
import { useDashboardData } from '../../../hooks/dashboardData';

interface OverviewProps {
  setShowAttachModal: (show: boolean) => void;
  setView: (view: any) => void;
  setShowReportModal: (show: boolean) => void;
  LapisIcon: string;
  IconeSaudeGeral: string;
  FundoSaude: string;
  IconePontualidade: string;
  IconeConformidade: string;
  IconeResolucao: string;
  IconeBomba: string;
  IconeReservatorio: string;
  IconeReservatorio2: string;
  IconeGerador: string;
  IconeElevador: string;
  IconeCerto: string;
  IconeErrado: string;
}

const SkeletonCard = () => (
  <div className="p-[24px] border border-[#F0F0F0] rounded-[8px] bg-white flex flex-col gap-[24px] animate-pulse">
    <div className="w-full h-[24px] bg-gray-100 rounded" />
    <div className="w-[100px] h-[100px] bg-gray-100 rounded-full mx-auto" />
    <div className="w-[80px] h-[20px] bg-gray-100 rounded mx-auto" />
  </div>
);

export const Overview: React.FC<OverviewProps> = ({
  setShowAttachModal,
  setView,
  setShowReportModal,
  LapisIcon,
  IconeSaudeGeral,
  FundoSaude,
  IconePontualidade,
  IconeConformidade,
  IconeResolucao,
  IconeBomba,
  IconeReservatorio,
  IconeReservatorio2,
  IconeGerador,
  IconeElevador,
  IconeCerto,
  IconeErrado,
}) => {
  const { data, loading } = useDashboardData();

  const [isEditing, setIsEditing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterPeriodo, setFilterPeriodo] = useState('');
  const [filterCondominio, setFilterCondominio] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setActiveFilter(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const periodos = data?.filtros_equipamentos?.periodos ?? ['Última semana', 'Último mês', 'Último trimestre', 'Último ano'];
  const condominios = ['Todos', ...(data?.filtros_equipamentos?.condominios ?? [data?.condominio?.nome ?? 'Jardins Residence'])];
  const tipos = data?.filtros_equipamentos?.tipos_equipamento ?? ['Todos', 'Bombas', 'Reservatórios', 'Gerador', 'Elevador'];

  const hasActiveFilters = filterPeriodo || filterCondominio || (filterTipo && filterTipo !== 'Todos');

  const showBombas = !filterTipo || filterTipo === 'Todos' || filterTipo === 'Bombas';
  const showReservatorios = !filterTipo || filterTipo === 'Todos' || filterTipo === 'Reservatórios';
  const showGerador = !filterTipo || filterTipo === 'Todos' || filterTipo === 'Gerador';
  const showElevador = !filterTipo || filterTipo === 'Todos' || filterTipo === 'Elevador';
  const showOutros = showGerador || showElevador;

  const clearFilters = () => {
    setFilterPeriodo('');
    setFilterCondominio('');
    setFilterTipo('');
    setActiveFilter(null);
  };

  const filterConfigs = [
    {
      key: 'periodo',
      display: filterPeriodo || 'Período',
      isActive: !!filterPeriodo,
      options: ['Todos os períodos', ...periodos],
      onSelect: (v: string) => { setFilterPeriodo(v === 'Todos os períodos' ? '' : v); setActiveFilter(null); },
    },
    {
      key: 'condominio',
      display: filterCondominio || 'Condomínio',
      isActive: !!filterCondominio && filterCondominio !== 'Todos',
      options: condominios,
      onSelect: (v: string) => { setFilterCondominio(v === 'Todos' ? '' : v); setActiveFilter(null); },
    },
    {
      key: 'tipo',
      display: filterTipo && filterTipo !== 'Todos' ? filterTipo : 'Tipo de equipamento',
      isActive: !!filterTipo && filterTipo !== 'Todos',
      options: tipos,
      onSelect: (v: string) => { setFilterTipo(v === 'Todos' ? '' : v); setActiveFilter(null); },
    },
  ];

  return (
    <>
      {/* Seção de Visão Geral */}
      <section className="flex flex-col gap-[32px]">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[#3B4141] text-[24px] font-bold font-['Inter'] leading-[24px] tracking-[0px]">Visão geral</h2>
            <p className="text-[#414F5D] text-[20px] font-normal font-['DM_Sans'] leading-[22px]">Acompanhe o panorama completo do condomínio em um só lugar.</p>
          </div>
          <div className="flex items-center gap-[12px]">
            <button
              onClick={() => setShowAttachModal(true)}
              className="h-[48px] px-[24px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-medium font-['DM_Sans'] shadow-sm hover:bg-[#E57600] transition-colors"
            >
              Anexo de Documentos
            </button>
            <button
              onClick={() => setView('inspecoes')}
              className="h-[48px] px-[24px] bg-[#F78800] rounded-[4px] flex items-center justify-center text-white text-[16px] font-medium font-['DM_Sans'] shadow-sm hover:bg-[#E57600] transition-colors"
            >
              Últimas Inspeções
            </button>

            {/* Ícone Lápis — modo edição */}
            <div
              onClick={() => setIsEditing((prev) => !prev)}
              title={isEditing ? 'Concluir edição' : 'Editar dashboard'}
              className={`cursor-pointer transition-all p-[4px] rounded-[4px] flex items-center justify-center ${isEditing ? 'bg-[#FFEAD0] ring-1 ring-[#F78800]' : 'hover:bg-gray-100'
                }`}
            >
              {isEditing ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F78800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <img src={LapisIcon} alt="Editar" className="w-[24px] h-[24px]" />
              )}
            </div>
          </div>
        </div>

        {/* Banner de modo edição */}
        {isEditing && (
          <div className="w-full px-[20px] py-[12px] bg-[#FFEAD0] border border-[#F78800] rounded-[4px] flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F78800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="text-[#F78800] text-[14px] font-medium font-['DM_Sans']">
                Modo edição ativo — clique no ✓ para confirmar as alterações.
              </span>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="text-[#F78800] text-[14px] font-semibold font-['DM_Sans'] underline cursor-pointer hover:opacity-70"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Card de Próximas Manutenções */}
        <div className={`w-full bg-white border rounded-[4px] p-[24px] flex flex-col gap-[24px] ${isEditing ? 'border-[#F78800] border-dashed' : 'border-[#F0F0F0]'}`}>
          <h3 className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans'] leading-[20px]">Próximas Manutenções</h3>
          <div className="flex flex-col gap-[10px]">
            {loading ? (
              [0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-[20px] pb-[10px] border-b border-[#F0F0F0] last:border-0 last:pb-0 animate-pulse">
                  <div className="w-[64px] h-[64px] bg-gray-100 rounded-[8px] shrink-0" />
                  <div className="flex flex-col gap-[8px] flex-1">
                    <div className="w-3/4 h-[16px] bg-gray-100 rounded" />
                    <div className="w-1/2 h-[14px] bg-gray-100 rounded" />
                  </div>
                </div>
              ))
            ) : (
              data?.proximas_manutencoes.map((item) => (
                <div key={item.id} className="flex items-center gap-[20px] pb-[10px] border-b border-[#F0F0F0] last:border-0 last:pb-0">
                  <div className="w-[64px] h-[64px] bg-[#EEF0FA] rounded-[8px] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[#3B4141] text-[12px] font-bold font-['DM_Sans']">{item.dia_semana}</span>
                    <span className="text-[#3B4141] text-[24px] font-extrabold font-['DM_Sans']">{item.dia}</span>
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <h4 className="text-[#3B4141] text-[16px] font-semibold font-['DM_Sans'] leading-[28px] tracking-[-0.5px] uppercase">
                      {item.codigo} – {item.titulo}
                    </h4>
                    <p className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans'] leading-[16px] tracking-[-0.2px]">{item.descricao}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Seção Saúde do Condomínio */}
      <section className="flex flex-col gap-[32px]">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-[12px]">
            <h2 className="text-[#3B4141] text-[24px] font-bold font-['Inter'] leading-[24px] tracking-[0px]">Saúde do condomínio</h2>
            <p className="text-[#414F5D] text-[20px] font-normal font-['DM_Sans'] leading-[22px]">Acompanhe o panorama completo do condomínio em um só lugar.</p>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="h-[56px] px-[24px] bg-[#F78800] rounded-[4px] flex items-center justify-center gap-[10px] text-white text-[16px] font-semibold font-['Inter'] shadow-sm"
          >
            Baixar Relatório
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-[20px]">
          {loading ? (
            [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
          ) : (
            <>
              {data && (() => {
                const sg = data.saude_condominio.saude_geral;
                const dash = (sg.percentual / 100) * 283;
                return (
                  <div className={`p-[24px] border rounded-[8px] bg-white flex flex-col gap-[24px] ${isEditing ? 'border-[#F78800] border-dashed' : 'border-[#F0F0F0]'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-[8px]">
                        <img src={IconeSaudeGeral} alt="Saúde Geral" className="w-[24px] h-[24px] object-contain" />
                        <span className="text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Saúde Geral</span>
                      </div>
                      <div className="px-[8px] py-[4px] rounded-[4px]" style={{ backgroundColor: sg.status_cor_fundo }}>
                        <span className="text-[11px] font-semibold" style={{ color: sg.status_cor_texto }}>{sg.status_label}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-[120px] h-[120px] relative flex items-center justify-center">
                        <img src={FundoSaude} alt="" className="absolute inset-0 w-full h-full object-contain" />
                        <svg width="120" height="120" viewBox="0 0 120 120" className="absolute inset-0 w-full h-full transform -rotate-90 z-10 drop-shadow-sm">
                          <circle cx="60" cy="60" r="45" fill="none" stroke={sg.cor_grafico} strokeWidth="11.5" strokeDasharray={`${dash} 283`} strokeLinecap="round" />
                        </svg>
                        <span className="relative text-[#3B4141] text-[24px] font-bold font-['DM_Sans'] z-20">{sg.percentual}%</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {data && (() => {
                const p = data.saude_condominio.pontualidade;
                const dash = (p.percentual / 100) * 240;
                return (
                  <div className={`p-[24px] border rounded-[8px] bg-white flex flex-col gap-[24px] ${isEditing ? 'border-[#F78800] border-dashed' : 'border-[#F0F0F0]'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-[8px]">
                        <img src={IconePontualidade} alt="Pontualidade" className="w-[24px] h-[24px] object-contain" />
                        <span className="text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Pontualidade</span>
                      </div>
                      <div className="px-[8px] py-[4px] rounded-[4px]" style={{ backgroundColor: p.status_cor_fundo }}>
                        <span className="text-[11px] font-semibold" style={{ color: p.status_cor_texto }}>{p.status_label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[16px]">
                      <div className="w-[100px] h-[100px] relative shrink-0 flex items-center justify-center">
                        <img src={FundoSaude} alt="" className="absolute inset-0 w-full h-full object-contain" />
                        <svg width="100" height="100" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90 z-10 drop-shadow-sm">
                          <circle cx="50" cy="50" r="38" fill="none" stroke={p.cor_grafico} strokeWidth="10" strokeDasharray={`${dash} 240`} strokeLinecap="round" />
                        </svg>
                        <span className="relative text-[#3B4141] text-[20px] font-bold font-['DM_Sans'] z-20">{p.percentual}%</span>
                      </div>
                      <div className="flex flex-col w-full divide-y divide-[#F0F0F0]">
                        <div className="flex justify-between items-center w-full py-[8px]">
                          <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">Totalização:</span>
                          <span className="text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">{p.totalizacao}</span>
                        </div>
                        <div className="flex justify-between items-center w-full py-[8px]">
                          <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">Em dias:</span>
                          <span className="text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">{p.em_dias}</span>
                        </div>
                        <div className="flex justify-between items-center w-full py-[8px]">
                          <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">Atrasadas:</span>
                          <span className="text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">{p.atrasadas}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {data && (() => {
                const c = data.saude_condominio.conformidade;
                const dash = (c.percentual / 100) * 240;
                return (
                  <div className={`p-[24px] border rounded-[8px] bg-white flex flex-col gap-[24px] ${isEditing ? 'border-[#F78800] border-dashed' : 'border-[#F0F0F0]'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-[8px]">
                        <img src={IconeConformidade} alt="Conformidade" className="w-[24px] h-[24px] object-contain" />
                        <span className="text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Conformidade</span>
                      </div>
                      <div className="px-[8px] py-[4px] rounded-[4px]" style={{ backgroundColor: c.status_cor_fundo }}>
                        <span className="text-[11px] font-semibold" style={{ color: c.status_cor_texto }}>{c.status_label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[16px]">
                      <div className="w-[100px] h-[100px] relative shrink-0 flex items-center justify-center">
                        <img src={FundoSaude} alt="" className="absolute inset-0 w-full h-full object-contain" />
                        <svg width="100" height="100" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90 z-10 drop-shadow-sm">
                          <circle cx="50" cy="50" r="38" fill="none" stroke={c.cor_grafico} strokeWidth="10" strokeDasharray={`${dash} 240`} strokeLinecap="round" />
                        </svg>
                        <span className="relative text-[#3B4141] text-[20px] font-bold font-['DM_Sans'] z-20">{c.percentual}%</span>
                      </div>
                      <div className="flex flex-col w-full divide-y divide-[#F0F0F0]">
                        <div className="flex justify-between items-center w-full py-[8px]">
                          <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">Concluidas:</span>
                          <span className="text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">{c.concluidas}</span>
                        </div>
                        <div className="flex justify-between items-center w-full py-[8px]">
                          <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">Conformes:</span>
                          <span className="text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">{c.conformes}</span>
                        </div>
                        <div className="flex justify-between items-center w-full py-[8px]">
                          <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">Não Conformes:</span>
                          <span className="text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">{c.nao_conformes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {data && (() => {
                const r = data.saude_condominio.resolucao;
                const dash = (r.percentual / 100) * 240;
                return (
                  <div className={`p-[24px] border rounded-[8px] bg-white flex flex-col gap-[24px] ${isEditing ? 'border-[#F78800] border-dashed' : 'border-[#F0F0F0]'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-[8px]">
                        <img src={IconeResolucao} alt="Resolução" className="w-[24px] h-[24px] object-contain" />
                        <span className="text-[#3B4141] text-[18px] font-semibold font-['DM_Sans']">Resolução</span>
                      </div>
                      <div className="px-[8px] py-[4px] rounded-[4px]" style={{ backgroundColor: r.status_cor_fundo }}>
                        <span className="text-[11px] font-semibold" style={{ color: r.status_cor_texto }}>{r.status_label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[16px]">
                      <div className="w-[100px] h-[100px] relative shrink-0 flex items-center justify-center">
                        <img src={FundoSaude} alt="" className="absolute inset-0 w-full h-full object-contain" />
                        <svg width="100" height="100" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90 z-10 drop-shadow-sm">
                          <circle cx="50" cy="50" r="38" fill="none" stroke={r.cor_grafico} strokeWidth="10" strokeDasharray={`${dash} 240`} strokeLinecap="round" />
                        </svg>
                        <span className="relative text-[#3B4141] text-[20px] font-bold font-['DM_Sans'] z-20">{r.percentual}%</span>
                      </div>
                      <div className="flex flex-col w-full divide-y divide-[#F0F0F0]">
                        <div className="flex justify-between items-center w-full py-[8px]">
                          <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">Totais:</span>
                          <span className="text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">{r.totais}</span>
                        </div>
                        <div className="flex justify-between items-center w-full py-[8px]">
                          <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">Resolvidas:</span>
                          <span className="text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">{r.resolvidas}</span>
                        </div>
                        <div className="flex justify-between items-center w-full py-[8px]">
                          <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">Pendentes:</span>
                          <span className="text-[#3B4141] text-[16px] font-bold font-['DM_Sans'] leading-[20px] tracking-[-0.24px]">{r.pendentes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </section>

      {/* Seção de Equipamentos */}
      <section className="flex flex-col gap-[32px]">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-[12px]">
            <h2 className="text-[#3B4141] text-[24px] font-bold font-['Inter'] leading-[24px] tracking-[0px]">Equipamentos</h2>
            <p className="text-[#414F5D] text-[20px] font-normal font-['DM_Sans'] leading-[22px]">Acompanhe o panorama completo do condomínio em um só lugar.</p>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="h-[56px] px-[24px] bg-[#F78800] rounded-[4px] flex items-center justify-center gap-[10px] text-white text-[16px] font-semibold font-['Inter'] shadow-sm"
          >
            Baixar Relatório
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>

        {/* Filtros com dropdown */}
        <div ref={filterRef} className="flex flex-col gap-[12px]">
          <div className="grid grid-cols-3 gap-[20px]">
            {filterConfigs.map((f) => (
              <div key={f.key} className="relative">
                <div
                  onClick={() => setActiveFilter(activeFilter === f.key ? null : f.key)}
                  className={`h-[48px] px-[16px] bg-white border rounded-[8px] flex items-center justify-between cursor-pointer transition-colors ${activeFilter === f.key || f.isActive ? 'border-[#F78800]' : 'border-[#E1E1E1] hover:border-[#F78800]'
                    }`}
                >
                  <span className={`text-[15px] font-['DM_Sans'] ${f.isActive ? 'text-[#3B4141] font-medium' : 'text-[#898D8D]'}`}>
                    {f.display}
                  </span>
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke={activeFilter === f.key || f.isActive ? '#F78800' : '#898D8D'}
                    strokeWidth="2"
                    className={`transition-transform duration-200 ${activeFilter === f.key ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {activeFilter === f.key && (
                  <div className="absolute top-[52px] left-0 w-full bg-white border border-[#E1E1E1] rounded-[8px] shadow-lg z-50 overflow-hidden">
                    {f.options.map((opt) => {
                      const selected =
                        (f.key === 'periodo' && filterPeriodo === opt) ||
                        (f.key === 'condominio' && filterCondominio === opt) ||
                        (f.key === 'tipo' && filterTipo === opt);
                      return (
                        <div
                          key={opt}
                          onClick={() => f.onSelect(opt)}
                          className={`px-[16px] py-[12px] cursor-pointer text-[15px] font-['DM_Sans'] transition-colors ${selected ? 'bg-[#FFEAD0] text-[#F78800] font-medium' : 'text-[#3B4141] hover:bg-[#FFEAD0]'
                            }`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Badge de filtros ativos + limpar */}
          {hasActiveFilters && (
            <div className="flex items-center gap-[12px] flex-wrap">
              {filterPeriodo && (
                <span className="flex items-center gap-[6px] px-[10px] py-[4px] bg-[#FFEAD0] text-[#F78800] text-[13px] font-medium font-['DM_Sans'] rounded-[4px]">
                  {filterPeriodo}
                  <button onClick={() => setFilterPeriodo('')} className="hover:opacity-70 leading-none">×</button>
                </span>
              )}
              {filterCondominio && filterCondominio !== 'Todos' && (
                <span className="flex items-center gap-[6px] px-[10px] py-[4px] bg-[#FFEAD0] text-[#F78800] text-[13px] font-medium font-['DM_Sans'] rounded-[4px]">
                  {filterCondominio}
                  <button onClick={() => setFilterCondominio('')} className="hover:opacity-70 leading-none">×</button>
                </span>
              )}
              {filterTipo && filterTipo !== 'Todos' && (
                <span className="flex items-center gap-[6px] px-[10px] py-[4px] bg-[#FFEAD0] text-[#F78800] text-[13px] font-medium font-['DM_Sans'] rounded-[4px]">
                  {filterTipo}
                  <button onClick={() => setFilterTipo('')} className="hover:opacity-70 leading-none">×</button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-[#898D8D] text-[13px] font-['DM_Sans'] underline hover:text-[#3B4141] transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* Bombas */}
        {showBombas && (
          <div className="flex flex-col gap-[24px]">
            <h3 className="text-[#414F5D] text-[20px] font-normal font-['DM_Sans']">Bombas</h3>
            <div className="grid grid-cols-4 gap-[32px]">
              {loading ? (
                [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
              ) : (
                data?.equipamentos.bombas.map((b) => {
                  const dash = (b.percentual / 100) * 240;
                  return (
                    <div key={b.id} className={`p-[20px] bg-white border rounded-[4px] flex flex-col items-center gap-[24px] ${isEditing ? 'border-[#F78800] border-dashed' : 'border-[#F0F0F0]'}`}>
                      <div className="w-full flex items-center gap-[10px]">
                        <img src={IconeBomba} alt="Bomba" className="w-[32px] h-[32px] object-contain" />
                        <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">{b.nome}</span>
                      </div>
                      <div className="w-[100px] h-[100px] relative flex items-center justify-center">
                        <img src={FundoSaude} alt="" className="absolute inset-0 w-full h-full object-contain" />
                        <svg width="100" height="100" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90 z-10 drop-shadow-sm">
                          <circle cx="50" cy="50" r="38" fill="none" stroke={b.cor_grafico} strokeWidth="10" strokeDasharray={`${dash} 240`} strokeLinecap="round" />
                        </svg>
                        <span className="relative text-[#3B4141] text-[20px] font-extrabold font-['DM_Sans'] z-20">{b.percentual}%</span>
                      </div>
                      <div className="px-[12px] py-[4px] rounded-[4px]" style={{ backgroundColor: b.status_cor_fundo }}>
                        <span className="text-[#3B4141] text-[14px] font-medium font-['DM_Sans']">{b.status_label}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </section>

      {/* Seção Reservatórios */}
      {showReservatorios && (
        <section className="flex flex-col gap-[24px]">
          <h3 className="text-[#414F5D] text-[20px] font-normal font-['DM_Sans']">Reservatórios</h3>
          <div className="grid grid-cols-2 gap-[32px]">
            {loading ? (
              [0, 1].map((i) => (
                <div key={i} className="p-[20px] bg-white border border-[#F0F0F0] rounded-[4px] flex flex-col items-center gap-[24px] animate-pulse">
                  <div className="w-full h-[28px] bg-gray-100 rounded" />
                  <div className="w-[80px] h-[80px] bg-gray-100 rounded-full" />
                  <div className="w-[60px] h-[36px] bg-gray-100 rounded" />
                  <div className="w-[100px] h-[24px] bg-gray-100 rounded" />
                </div>
              ))
            ) : (
              data?.equipamentos.reservatorios.map((r) => {
                const icon = r.percentual < 50 ? IconeReservatorio2 : IconeReservatorio;
                return (
                  <div key={r.id} className={`p-[20px] bg-white border rounded-[4px] flex flex-col items-center gap-[24px] ${isEditing ? 'border-[#F78800] border-dashed' : 'border-[#F0F0F0]'}`}>
                    <div className="w-full text-left text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">{r.nome}</div>
                    <div className="flex flex-col items-center gap-[16px]">
                      <div className="w-[80px] h-[80px] relative">
                        <img src={icon} alt="Reservatório" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[#3B4141] text-[28px] font-extrabold font-['DM_Sans']">{r.percentual}%</span>
                    </div>
                    <div className="px-[12px] py-[4px] rounded-[4px]" style={{ backgroundColor: r.status_cor_fundo }}>
                      <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{r.status_label}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Seção Outros */}
      {showOutros && (
        <section className="flex flex-col gap-[24px]">
          <h3 className="text-[#414F5D] text-[20px] font-normal font-['DM_Sans']">Outros</h3>
          <div className="grid grid-cols-2 gap-[32px]">
            {loading ? (
              [0, 1].map((i) => <SkeletonCard key={i} />)
            ) : (
              <>
                {showGerador && data && (() => {
                  const g = data.equipamentos.gerador;
                  return (
                    <div className={`p-[20px] bg-white border rounded-[4px] flex flex-col gap-[24px] ${isEditing ? 'border-[#F78800] border-dashed' : 'border-[#F0F0F0]'}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">{g.nome}</span>
                        <div className="px-[11px] py-[4px] rounded-[4px]" style={{ backgroundColor: g.status_cor_fundo }}>
                          <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{g.status_label}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-[32px]">
                        <div className="w-[80px] h-[80px] flex items-center justify-center shrink-0">
                          <img src={IconeGerador} alt="Gerador" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 flex flex-col gap-[12px]">
                          <div className="flex justify-between items-center">
                            <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Nível de combustível:</span>
                            <img src={g.nivel_combustivel ? IconeCerto : IconeErrado} alt={g.nivel_combustivel ? 'OK' : 'Alerta'} className="w-[16px] h-[16px] object-contain" />
                          </div>
                          <div className="h-[0px] border-t border-[#F0F0F0]" />
                          <div className="flex justify-between items-center">
                            <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Nível de óleo:</span>
                            <img src={g.nivel_oleo ? IconeCerto : IconeErrado} alt={g.nivel_oleo ? 'OK' : 'Alerta'} className="w-[16px] h-[16px] object-contain" />
                          </div>
                          <div className="h-[0px] border-t border-[#F0F0F0]" />
                          <div className="flex justify-between items-center">
                            <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Última manutenção:</span>
                            <img src={g.ultima_manutencao ? IconeCerto : IconeErrado} alt={g.ultima_manutencao ? 'OK' : 'Alerta'} className="w-[16px] h-[16px] object-contain" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {showElevador && data && (() => {
                  const e = data.equipamentos.elevador;
                  return (
                    <div className={`p-[20px] bg-white border rounded-[4px] flex flex-col gap-[24px] ${isEditing ? 'border-[#F78800] border-dashed' : 'border-[#F0F0F0]'}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[#3B4141] text-[20px] font-semibold font-['DM_Sans']">{e.nome}</span>
                        <div className="px-[11px] py-[4px] rounded-[4px]" style={{ backgroundColor: e.status_cor_fundo }}>
                          <span className="text-[#3B4141] text-[14px] font-normal font-['DM_Sans']">{e.status_label}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-[32px]">
                        <div className="w-[80px] h-[80px] flex items-center justify-center shrink-0">
                          <img src={IconeElevador} alt="Elevador" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 flex flex-col gap-[12px]">
                          <div className="flex justify-between items-center">
                            <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Tempo de resposta:</span>
                            <img src={e.tempo_resposta ? IconeCerto : IconeErrado} alt={e.tempo_resposta ? 'OK' : 'Alerta'} className="w-[16px] h-[16px] object-contain" />
                          </div>
                          <div className="h-[0px] border-t border-[#F0F0F0]" />
                          <div className="flex justify-between items-center">
                            <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Ruído no motor:</span>
                            <img src={e.ruido_motor ? IconeCerto : IconeErrado} alt={e.ruido_motor ? 'OK' : 'Alerta'} className="w-[16px] h-[16px] object-contain" />
                          </div>
                          <div className="h-[0px] border-t border-[#F0F0F0]" />
                          <div className="flex justify-between items-center">
                            <span className="text-[#3B4141] text-[16px] font-medium font-['DM_Sans']">Última manutenção:</span>
                            <img src={e.ultima_manutencao ? IconeCerto : IconeErrado} alt={e.ultima_manutencao ? 'OK' : 'Alerta'} className="w-[16px] h-[16px] object-contain" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
};
