import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Packages } from '../formlayout/sections/packages';
import { Review } from './review-sections';

const MessagesDemo = () => {

    return (
        <div className="grid" style={{ justifyContent: 'center' }}>
            <div className="col-12  ">
                <div className="card p-fluid">
                    <h5 style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>รีวิวทั้งหมด</h5>

                    <div>
                        <Review />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesDemo;
