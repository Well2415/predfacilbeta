import { useState } from 'react';

export interface PerfilData {
    nomeCondominio: string;
    contato: string;
    cnpj: string;
    inscricaoEstadual: string;
    cep: string;
    cidade: string;
    uf: string;
    endereco: string;
    bairro: string;
    telefone: string;
    telefone2: string;
    whatsapp: string;
    email1: string;
    responsavelTecnico: string;
    email2: string;
    artCrea: string;
    email3: string;
    data: string;
    observacoes: string;
    logomarca: string;
    fachada: string;
}

const INITIAL_DATA: PerfilData = {
    nomeCondominio: "Jardins Residence",
    contato: "Maria Fernanda Rocha",
    cnpj: "28.456.789/0001-52",
    inscricaoEstadual: "104.558.223.007",
    cep: "74823-110",
    cidade: "Goiânia",
    uf: "GO",
    endereco: "Av. dos Jardins, nº 1850",
    bairro: "Setor Bela Vista",
    telefone: "(62) 3285-4412",
    telefone2: "(62) 99154-8821",
    whatsapp: "(62) 99154-8821",
    email1: "contato@jardinsresidence.com",
    responsavelTecnico: "Eng. Rodrigo Soares Martins",
    email2: "rt.manutencao@jardinsresidence.com",
    artCrea: "CREA-GO 152345/D",
    email3: "administracao@jardinsresidence.com",
    data: "20/03/2025",
    observacoes: "Condomínio residencial de alto padrão situado na região sul de Goiânia, com 2 torres, área de lazer completa, piscinas, salão gourmet, playground, quadras esportivas e estacionamento coberto. Administrado pela equipe PredFácil.",
    logomarca: "https://placehold.co/177x177",
    fachada: "https://placehold.co/202x202"
};

export function usePerfilData() {
    const [data, setData] = useState<PerfilData>(INITIAL_DATA);
    const [tempData, setTempData] = useState<PerfilData>(INITIAL_DATA);

    const startEditing = () => {
        setTempData(data);
    };

    const cancelEditing = () => {
        setTempData(data);
    };

    const saveEditing = () => {
        setData(tempData);
    };

    const handleChange = (field: keyof PerfilData, value: string) => {
        setTempData(prev => ({ ...prev, [field]: value }));
    };

    const removePhoto = (field: 'logomarca' | 'fachada') => {
        setTempData(prev => ({ ...prev, [field]: '' }));
    };

    return {
        data: tempData, // Usamos tempData durante a edição e leitura
        actualData: data,
        startEditing,
        cancelEditing,
        saveEditing,
        handleChange,
        removePhoto
    };
}
