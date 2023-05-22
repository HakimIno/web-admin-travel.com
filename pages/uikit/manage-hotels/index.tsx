import React, { useEffect, useState } from 'react';

import { TabPanel, TabView } from 'primereact/tabview';
import { Hotels } from './sections/hotels';
import { AddHotels } from './sections/add-hotels';


export const InputDemo = () => {


    return (
        <div className="grid" style={{ justifyContent: 'center' }}>
            <div className="col-12">
                <div className="card p-fluid">
                    <h5 style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>จัดการที่พัก</h5>
                    <TabView>
                        <TabPanel header="โรงแรมทั้งหมด">
                            <Hotels />
                        </TabPanel>
                        <TabPanel header="เพิ่มโรงแรม">
                            <AddHotels />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
};

export default InputDemo;
