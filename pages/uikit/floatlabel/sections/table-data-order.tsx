import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Tag } from "primereact/tag"
import { useEffect, useState } from "react";
import { fetchOrdersData, fetchOrdersPlaceData, fetchOrdersPlaceDataFailed, fetchOrdersPlaceDataSuccess } from "../../../api/fetch-data";
import { Orders } from "../../../../types/interface";
import { Button } from "primereact/button";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../api/firebase";
import { Image } from 'primereact/image';
import { TabPanel, TabView } from "primereact/tabview";
import TableOrder from "../components/table-order";

export const TableDataOrder = () => {
    const [orders, setOrders] = useState<Orders[]>([])
    const [orderSuccess, setOrderSuccess] = useState<Orders[]>([])
    const [orderFailed, setOrderFailed] = useState<Orders[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersData = await fetchOrdersPlaceData();
                const orderDataSuccess = await fetchOrdersPlaceDataSuccess()
                const orderDataFailed = await fetchOrdersPlaceDataFailed()
                
                setOrderFailed(orderDataFailed as unknown as Orders[])

                setOrderSuccess(orderDataSuccess as unknown as Orders[])

                setOrders(ordersData as unknown as Orders[]);


            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchData();

    }, []);


    return (
        <div className="card">
            <TabView>
                <TabPanel header="คำสั่งชื้อ">
                    <TableOrder orders={orders} />
                </TabPanel>
                <TabPanel header="สำเร้จ">
                    <TableOrder orders={orderSuccess} />
                </TabPanel>
                <TabPanel header="ยกเลิกสำเร้จ">
                    <TableOrder orders={orderFailed} />
                </TabPanel>
            </TabView>
        </div>
    )
}