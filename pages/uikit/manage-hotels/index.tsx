import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import { Slider } from 'primereact/slider';
import { Knob } from 'primereact/knob';
import { Rating } from 'primereact/rating';
import { ColorPicker } from 'primereact/colorpicker';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { MultiSelect } from 'primereact/multiselect';
import { TreeSelect, TreeSelectSelectionKeysType } from 'primereact/treeselect';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { CountryService } from '../../../demo/service/CountryService';
import { NodeService } from '../../../demo/service/NodeService';
import { Demo } from '../../../types/types';
import TreeNode from 'primereact/treenode';
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
