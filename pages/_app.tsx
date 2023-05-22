import type { AppProps } from 'next/app';
import type { Page } from '../types/types';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

import { useRouter } from 'next/router';

type Props = AppProps & {
    Component: Page;
};

export default function MyApp({ Component, pageProps }: Props) {

    const router = useRouter();
    const isLoginPage = router.pathname === '/auth/login';
    //const { isAuthenticated, logout } = useContext(AuthContext);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        const timeout = setTimeout(() => {
            setIsAuthenticated(true);
        }, 2000);

        return () => clearTimeout(timeout)
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!isAuthenticated && !isLoginPage && !token) {
            router.push('/auth/login');
        }

    }, [isAuthenticated, isLoginPage, router]);

    if (!isAuthenticated && !isLoginPage) {
        return null;
    }


    if (Component.getLayout) {
        return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
    } else {
        return (
            <LayoutProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </LayoutProvider>
        );
    }
}
