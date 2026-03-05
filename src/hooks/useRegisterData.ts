
import { useState } from 'react';

export function useRegisterData() {
    const [registerData, setRegisterData] = useState({
        nomeCondominio: '',
        razaoSocial: '',
        cnpj: '',
        cep: '',
        endereco: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        telefone: '',
        whatsapp: '',
        email: '',
        site: '',
        usuarioNome: '',
        usuarioEmail: '',
        usuarioSenha: '',
        usuarioConfirmSenha: '',
        acessoNivel: ''
    });

    const updateRegisterField = (field: string, value: string) => {
        setRegisterData(prev => ({ ...prev, [field]: value }));
    };

    return { registerData, updateRegisterField };
}
