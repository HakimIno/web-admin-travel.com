import React from 'react';
import { TableHotelsOrder } from './sections/table-hotels-order';



const FloatLabelDemo = () => {


    return (
        <div className="card">
            <h5 style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>จัดการคำสั่งซื้อ</h5>
            <div className="grid p-fluid mt-3">
                <div className="field col-12">

                    <TableHotelsOrder />
                </div>

            </div>
        </div>
    );
};

export default FloatLabelDemo;
