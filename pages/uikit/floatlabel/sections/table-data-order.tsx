import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Tag } from "primereact/tag"
import { useEffect, useState } from "react";
import { fetchOrdersData } from "../../../api/fetch-data";
import { Orders } from "../../../../types/interface";
import { Button } from "primereact/button";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../api/firebase";


export const TableDataOrder = () => {
    const [orders, setOrders] = useState<Orders[]>([])


    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersData = await fetchOrdersData();
                setOrders(ordersData as unknown as Orders[]);
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchData();

    }, []);


    const CancelOrder = async (ordersId: any) => {
        try {
            setLoading(true);
            const tripRef = doc(db, 'orders', `orders-ID-${ordersId}`);
            await deleteDoc(tripRef);
            console.log('Trip removed successfully!');
            window.location.reload();
        } catch (error) {
            console.log('Error removing trip:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <DataTable value={orders} tableStyle={{ minWidth: '100%' }}>
                <Column field="id" header="รหัสคำสั่งชื้อ"></Column>
                <Column field="title" header="แพ็คเกจ" body={(rowData) => <div className="line-clamp-2 w-12rem">{rowData.title}</div>}></Column>
                <Column field="category" header="หมวดหมู่"></Column>
                <Column field="price" header="ราคา"></Column>
                <Column field="fistname" header="ชื่อ"></Column>
                <Column field="lastname" header="นามสกุล"></Column>
                <Column field="phonnumber" header="เบอร์โทรศัพท์"></Column>
                <Column field="email" header="อีเมล" body={(rowData) => <div className="line-clamp-1 w-12rem">{rowData.email}</div>}></Column>
                <Column field="date" header="วันที่จอง"></Column>
                <Column field="adults" header="ผู้ใหญ่/คน"></Column>
                <Column field="children" header="เด็ก/คน"></Column>
                <Column
                    field="status"
                    header="สถานะ"
                    body={(rowData) =>
                        <div className="">
                            <Tag severity={rowData.status === 'รอชำระเงิน' ? 'warning' : rowData.status === 'ชำระเงินแล้ว' ? 'success' : "danger"} value={rowData.status}></Tag>
                        </div>}>

                </Column>
                <Column
                    field="status"
                    header="#"
                    body={(rowData) => (
                        <>
                            {rowData.status !== 'ชำระเงินแล้ว' ?
                                <Button label="ยกเลิกคำสั่งซื้อ" severity="danger"
                                    text style={{ fontSize: 14 }}
                                    onClick={() => CancelOrder(rowData.id)} /> : ''
                            }
                        </>
                    )
                    }>
                </Column>
            </DataTable>
        </>
    )
}