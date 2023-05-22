/* eslint-disable @next/next/no-img-element */

import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Page } from '../../../types/types';


interface LoginCredentials {
    username: string;
    password: string;
}

const LoginPage: Page = () => {

    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: '',
        password: '',
    });

    const router = useRouter();

    const { layoutConfig } = useContext(LayoutContext);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });



    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            router.push('/');
        }

    }, [router]);


    const handleLogin = () => {

        const isValid = validateCredentials(credentials.username, credentials.password);

        if (isValid) {
            localStorage.setItem('authToken', 'your_token_here');
            router.push('/');
        } else {
            console.log("error Login")
        }
    };

    const validateCredentials = (username: string, password: string) => {

        return username === 'admin' && password === '1234';
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Admin</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Users
                            </label>
                            <InputText
                                id="email1"
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                placeholder="Users Name"
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password
                                inputId="password1"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                placeholder="Password"
                                className="w-full mb-5"
                                inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">

                            </div>
                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={(e) => { e.preventDefault(); handleLogin() }}> </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
