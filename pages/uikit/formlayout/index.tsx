import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';

import { collection, doc, getDoc, getDocs, addDoc } from "firebase/firestore";

import { db } from '../../api/firebase';
import { TabPanel, TabView } from 'primereact/tabview';
import { AddPackages } from './sections/add-packages';
import { Packages } from './sections/packages';

const FormLayoutDemo = () => {


    return (
        <div className="grid" style={{ justifyContent: 'center' }}>


            <div className="col-12  ">

                <div className="card p-fluid">

                    <h5 style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>จัดการแพ็คเกจ</h5>
                    <TabView>

                        <TabPanel header="แพ็คเกจทั้งหมด">
                            <Packages />
                        </TabPanel>
                        <TabPanel header="เพิ่มแพ็คเกจ">
                            <AddPackages />
                        </TabPanel>

                    </TabView>


                </div>


            </div>


        </div>


    );
};

export default FormLayoutDemo;
