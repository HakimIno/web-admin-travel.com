/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import { useRouter } from 'next/router';
import { Dialog } from 'primereact/dialog';
import { fetchNotificationAdmin, fetchNotificationData } from '../pages/api/fetch-data';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../pages/api/firebase';

interface Notifys {
    id: string;
    userName: string;
    imageUser: string;
    description: string;
    date: string;
}

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [notification, setNotification] = useState<Notifys[]>([])


    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const handleLogout = (e: any) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        router.push('/auth/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const notifys = await fetchNotificationAdmin();

                setNotification(notifys as unknown as Notifys[])


            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    });

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>Admin travel.com</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>

                <button type="button" className="p-link layout-topbar-button relative" onClick={() => setVisible(true)}>

                    <i className="pi pi-bell" style={{ fontSize: 24 }}></i>
                    {notification && notification.length > 0 ? (
                        <div style={{ backgroundColor: 'red', position: 'absolute', right: '5px', top: '3px', borderRadius: 32, width: 15, height: 17, justifyItems: 'center', alignItems: 'center' }}>
                            <p style={{ textAlign: 'center', color: 'white', fontSize: 12 }}>{notification.length}</p>
                        </div>

                    ) : ""}
                </button>

                <button type="button" className="p-link layout-topbar-button" onClick={(e) => handleLogout(e)}>
                    <i className="pi pi-sign-out"></i>

                </button>

                <Dialog header="แจ้งเตือน" visible={visible} position="top-right" style={{ width: '30vw' }} onHide={() => setVisible(false)} draggable={false} resizable={false}>
                    <>
                        {notification && notification.length > 0 ? (
                            notification.map((item) => (
                                <>
                                    <div key={item.id} className='my-4' style={{ cursor: 'pointer' }} onClick={() => { router.push('/uikit/floatlabel'); setVisible(false) }}>
                                        <div className="flex " style={{ justifyContent: 'space-between' }}>
                                            <div className="flex ">
                                                <img src={item.imageUser} style={{ width: 50, height: 50, borderRadius: 32, objectFit: 'cover' }} alt='' />
                                                <div className="ml-5">
                                                    <h6 style={{ fontSize: 14, fontWeight: 'bold' }}>{item.userName}</h6>
                                                    <p>{item.description}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p>{item.date}</p>
                                            </div>
                                        </div>

                                    </div>
                                    <div style={{ backgroundColor: '#e5e7eb', height: 1 }}></div>
                                </>
                            ))
                        ) : <p>No notifications available.</p>}

                    </>
                </Dialog>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
