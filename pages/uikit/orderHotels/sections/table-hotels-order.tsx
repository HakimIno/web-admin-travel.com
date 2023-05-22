import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Tag } from "primereact/tag"
import { useEffect, useState } from "react";
import { fetchOrdersData, fetchOrdersHotelsData } from "../../../api/fetch-data";
import { Orders } from "../../../../types/interface";
import { Button } from "primereact/button";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../api/firebase";
import { Image } from 'primereact/image';

export const TableHotelsOrder = () => {
    const [orders, setOrders] = useState<Orders[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersData = await fetchOrdersHotelsData();
                setOrders(ordersData as unknown as Orders[]);
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchData();

    }, []);
    


    const CancelOrder = async (orderId: any) => {
        try {
            setLoading(true);
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { status: "Failed" });
            console.log('Trip removed successfully!');
            window.location.reload();
        } catch (error) {
            console.log('Error removing trip:', error);
        } finally {
            setLoading(false);
        }
    };

    const DeleteOrder = async (orderId: any) => {
        try {
            setLoading(true);
            const orderRef = doc(db, 'orders', orderId);
            await deleteDoc(orderRef);
            console.log('Trip removed successfully!');
            window.location.reload();
        } catch (error) {
            console.log('Error removing trip:', error);
        } finally {
            setLoading(false);
        }
    };

    const enterOrder = async (orderId: string) => {
        try {
            setLoading(true);
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { status: "Success" });
            window.location.reload();
        } catch (error) {
            console.log('Error trip:', error);
        }
    }

    return (
        <>
            <DataTable value={orders}  showGridlines dataKey="id"  >
                <Column field="orderID" header="รหัสคำสั่งชื้อ" style={{ minWidth: '12rem', textAlign: 'center' }} body={(rowData) => <div className="line-clamp-1" >{rowData.orderID}</div>}></Column>
                <Column field="title" header="แพ็คเกจ" style={{ minWidth: '12rem', textAlign: 'center' }} body={(rowData) => <div className="line-clamp-2 w-12rem">{rowData.title}</div>} ></Column>
                <Column field="type" header="หมวดหมู่" style={{ minWidth: '8rem', textAlign: 'center' }} body={(rowData) => <div className="line-clamp-2 w-8rem">{rowData.type === 'PLACE' ? ('ทัวร์') : ('โรงแรม')}</div>}></Column>
                <Column field="price" header="ราคา" style={{ minWidth: '10rem', textAlign: 'center' }}></Column>
                <Column field="fistname" header="ชื่อ" style={{ minWidth: '10rem', textAlign: 'center' }}></Column>
                <Column field="lastname" header="นามสกุล" style={{ minWidth: '10rem', textAlign: 'center' }}></Column>
                <Column field="phonnumber" header="เบอร์โทรศัพท์" style={{ minWidth: '10rem', textAlign: 'center' }}></Column>
                <Column field="email" header="อีเมล" style={{ minWidth: '10rem', textAlign: 'center' }}></Column>
                <Column field="checkInDate" header="วันที่เช็คอิน" style={{ minWidth: '6rem', textAlign: 'center' }}></Column>
                <Column field="checkOutDate" header="วันที่เช็คเอาท์" style={{ minWidth: '6rem', textAlign: 'center' }}></Column>
                <Column field="selectRoom" header="ประเภทห้อง" style={{  textAlign: 'center' }} body={(rowData) => <div className="line-clamp-2 w-8rem">{rowData.selectRoom}</div>}></Column>
                <Column
                    field=""
                    header="สลีป"
                    style={{ minWidth: '10rem', textAlign: 'center' }}
                    body={(rowData) => <div className="">
                        <Image
                            src={rowData.sleep_checkout} alt="Image"
                            width="60"
                            preview />
                    </div>}
                >
                </Column>
                <Column
                    field="status"
                    header="สถานะ"

                    style={{ minWidth: '6rem', textAlign: 'center' }}
                    body={(rowData) =>
                        <div className="w-6rem">
                            <Tag severity={rowData.status === 'InProgress' ? 'warning' : rowData.status === 'Success' ? 'success' : "danger"} value={rowData.status}></Tag>
                        </div>}>

                </Column>
                <Column
                    field="status"
                    header="#"
                    style={{ minWidth: '6rem', textAlign: 'center' }}
                    body={(rowData) => (
                        <div className="">
                            {rowData.status !== 'Success' && rowData.status !== 'Failed' ?
                                <Button
                                    label="ยืนยัน"
                                    severity="success"
                                    size="small"
                                    style={{ fontSize: 12, padding: 3 }}
                                    onClick={() => enterOrder(rowData.id)}
                                /> : ''
                            }
                        </div>
                    )
                    }>
                </Column>
                <Column
                    field="status"
                    header="#"
                    style={{ minWidth: '6rem', textAlign: 'center' }}
                    body={(rowData) => (
                        <div className="">
                            {rowData.status !== 'Success' && rowData.status !== 'Failed' ?
                                <Button
                                    label="ยกเลิก"
                                    severity="danger"
                                    size="small"
                                    style={{ fontSize: 12, padding: 3 }}
                                    onClick={(e) => { e.preventDefault; CancelOrder(rowData.id) }} /> : <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    rounded
                                    onClick={(e) => { e.preventDefault; DeleteOrder(rowData.id) }} />
                            }
                        </div>
                    )
                    }>
                </Column>
            </DataTable>
        </>
    )
}