import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { CountryService } from '../../../demo/service/CountryService';
import { Demo } from '../../../types/types';
import { TableDataOrder } from './sections/table-data-order';

const FloatLabelDemo = () => {


    return (
        <div className="card">
            <h5 style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>จัดการคำสั่งซื้อ</h5>
            <div className="grid p-fluid mt-3">
                <div className="field col-12">

                    <TableDataOrder />
                </div>

            </div>
        </div>
    );
};

export default FloatLabelDemo;
