import { DocumentData, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useEffect, useRef, useState } from "react"
import { db } from "../../../api/firebase";
import { fetchUsersData } from "../../../api/fetch-data";
import { Users } from "../../../../types/interface";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";



export const TableUser = () => {
    const [users, setUsers] = useState<Users[]>([])
    const [loading, setLoading] = useState(false);
    const toast = useRef<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUsersData();
                setUsers(userData as unknown as Users[]);
            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchData();

    }, []);

    const [visible, setVisible] = useState(false);

    const [userId, setUserId] = useState('')


    const noneProfile = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Firisvision.com%2Fwp-content%2Fuploads%2F2019%2F01%2Fno-profile-1-1200x1200.png&f=1&nofb=1&ipt=95197b1aa84b770971834137a81070d957678eca65716165a0d1527f3472ba22&ipo=images"


    const removeUsers = async (UsersId: any) => {
        try {

            const usersRefRef = doc(db, 'users', UsersId);
            await deleteDoc(usersRefRef);

            toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบสำเร็จ', life: 3000 });
            window.location.reload();

        } catch (error) {
            console.log('Error removing public-relations:', error);
        }
    };


    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')


    const editTrip = async () => {
        try {
            const userRef = doc(db, 'users', userId);

            const userSnapshot = await getDoc(userRef);
            const original = userSnapshot.data();

            const newUser = {
                ...original,
                firstName: firstName !== "" ? firstName : (original?.firstName || ""),
                lastName: lastName !== "" ? lastName : (original?.lastName || ""),
                email: email !== "" ? email : (original?.email || ""),
                phoneNumber: phoneNumber !== "" ? phoneNumber : (original?.phoneNumber || ""),


            };

            await updateDoc(userRef, newUser);

            setVisible(false)
            window.location.reload();
        } catch (error) {
            console.log('Error editing trip:', error);
        }
    };



    const footerContent = (
        <div>
            <Button label="ยกเลิก" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="ยืนยัน" icon="pi pi-check" onClick={editTrip} autoFocus />
        </div>
    );


    return (
        <>
            <Toast ref={toast} />

            <DataTable value={users}>
                <Column field="id" header="UserID"></Column>
                <Column field="profileUrl" header="รูปโปรไฟล์" body={(row) => <Image src={row.profileUrl ? row.profileUrl : noneProfile} alt="" width="60" />}></Column>
                <Column field="firstName" header="ชื่อ"></Column>
                <Column field="lastName" header="นามสกุล"></Column>
                <Column field="phoneNumber" header="เบอร์โทรศัพทร์"></Column>
                <Column field="email" header="อีเมล"></Column>
                <Column
                    header="#"
                    body={(row) => <div>
                        <Button
                            icon="pi pi-pencil"
                            rounded
                            outlined
                            severity="warning"
                            className="p-button-rounded"
                            onClick={(e) => {
                                setUserId(row.id)
                                setVisible(true)
                            }}
                        >

                        </Button>
                    </div>}>

                </Column>
                <Column
                    header="#"
                    body={(row) => <div>
                        <Button
                            icon="pi pi-trash"
                            rounded
                            outlined
                            severity="danger"
                            className="p-button-rounded"
                            onClick={(e) => { e.preventDefault(); removeUsers(row.id); }}
                        >

                        </Button>
                    </div>}>

                </Column>
            </DataTable>

            <Dialog header="แก้ไขผู้ใช้" visible={visible} style={{ width: '30vw' }} onHide={() => setVisible(false)} footer={footerContent} >
                <div className="grid" style={{ justifyContent: 'center' }}>
                    <div className="col-12">
                        <div className="card p-fluid">
                            <div className="field">
                                <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ชื่อ</label>
                                <InputText id="title" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="image" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>นามสกุล</label>
                                <InputText id="image" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>อีเมล</label>
                                <InputText id="location" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="map_location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>เบอร์โทรศัพท์</label>
                                <InputText id="map_location" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>

                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}