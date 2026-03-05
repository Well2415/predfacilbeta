import { useState, useEffect } from 'react';
import { Login } from './components/Auth/Login/Login';
import { ForgotPassword } from './components/Auth/Recuperacao/ForgotPassword';
import { ChangePassword } from './components/Auth/Recuperacao/ChangePassword';
import { RegisterCondo } from './components/Auth/Cadastro/RegisterCondo';
import { RegisterCondoStep2 } from './components/Auth/Cadastro/RegisterCondoStep2';
import { RegisterCondoStep3 } from './components/Auth/Cadastro/RegisterCondoStep3';
import { RegisterCondoStep4 } from './components/Auth/Cadastro/RegisterCondoStep4';
import { RegisterCondoStep5 } from './components/Auth/Cadastro/RegisterCondoStep5';

import { Dashboard } from './components/Dashboard/Dashboard';
import { useRegisterData } from './hooks/useRegisterData';

const MOCK_CREDENTIALS = {
    email: 'pablo',
    password: '123'
};

function App() {
    const [currentScreen, setCurrentScreen] = useState<'login' | 'forgotPassword' | 'changePassword' | 'registerCondo' | 'registerCondoStep2' | 'registerCondoStep3' | 'registerCondoStep4' | 'registerCondoStep5' | 'dashboard'>('login');

    // Estados para Autenticação
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const { registerData, updateRegisterField } = useRegisterData();

    // Carregar dados salvos ao iniciar (apenas e-mail por segurança)
    useEffect(() => {
        const savedEmail = localStorage.getItem('remember_email');
        const savedRemember = localStorage.getItem('remember_me') === 'true';

        if (savedRemember && savedEmail) {
            setLoginEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = () => {
        if (loginEmail === MOCK_CREDENTIALS.email && loginPassword === MOCK_CREDENTIALS.password) {
            if (rememberMe) {
                localStorage.setItem('remember_email', loginEmail);
                localStorage.setItem('remember_me', 'true');
            } else {
                localStorage.removeItem('remember_email');
                localStorage.setItem('remember_me', 'false');
            }
            setCurrentScreen('dashboard');
        } else {
            alert('Usuário ou senha incorretos.');
        }
    };

    return (
        <>
            {currentScreen === 'login' && (
                <Login
                    email={loginEmail}
                    setEmail={setLoginEmail}
                    password={loginPassword}
                    setPassword={setLoginPassword}
                    onRecoverPassword={() => setCurrentScreen('forgotPassword')}
                    onRegister={() => setCurrentScreen('registerCondo')}
                    onLogin={handleLogin}
                    rememberMe={rememberMe}
                    setRememberMe={setRememberMe}
                />
            )}
            {currentScreen === 'dashboard' && (
                <Dashboard onLogout={() => {
                    setLoginEmail(rememberMe ? loginEmail : '');
                    setLoginPassword('');
                    setCurrentScreen('login');
                }} />
            )}
            {currentScreen === 'forgotPassword' && (
                <ForgotPassword
                    onBack={() => setCurrentScreen('login')}
                    onSubmit={() => setCurrentScreen('changePassword')}
                />
            )}
            {currentScreen === 'changePassword' && (
                <ChangePassword
                    onBack={() => setCurrentScreen('forgotPassword')}
                    onSuccess={() => setCurrentScreen('login')}
                />
            )}
            {currentScreen === 'registerCondo' && (
                <RegisterCondo
                    data={registerData}
                    updateField={updateRegisterField}
                    onBack={() => setCurrentScreen('login')}
                    onNext={() => setCurrentScreen('registerCondoStep2')}
                />
            )}
            {currentScreen === 'registerCondoStep2' && (
                <RegisterCondoStep2
                    data={registerData}
                    updateField={updateRegisterField}
                    onBack={() => setCurrentScreen('registerCondo')}
                    onNext={() => setCurrentScreen('registerCondoStep3')}
                />
            )}
            {currentScreen === 'registerCondoStep3' && (
                <RegisterCondoStep3
                    data={registerData}
                    updateField={updateRegisterField}
                    onBack={() => setCurrentScreen('registerCondoStep2')}
                    onNext={() => setCurrentScreen('registerCondoStep4')}
                />
            )}
            {currentScreen === 'registerCondoStep4' && (
                <RegisterCondoStep4
                    onBack={() => setCurrentScreen('registerCondoStep3')}
                    onRegister={() => setCurrentScreen('registerCondoStep5')}
                />
            )}
            {currentScreen === 'registerCondoStep5' && (
                <RegisterCondoStep5
                    onBack={() => setCurrentScreen('registerCondoStep4')}
                    onFinish={() => setCurrentScreen('login')}
                />
            )}
        </>
    );
}


export default App;
