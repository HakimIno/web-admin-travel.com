import { DocumentData, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
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
    const [userData, setUserData] = useState<DocumentData | null>(null);
    const toast = useRef<any>(null);
    const [userId, setUserId] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await fetchUsersData();
                setUsers(user as unknown as Users[]);

                const userDocRef = doc(db, 'users', String(userId));
                const documentSnapshot = await getDoc(userDocRef);

                const userDataD = documentSnapshot.data();
                setUserData(userDataD || null);

            } catch (error) {
                console.log('Error:', error);
            }
        };

        fetchData();

    }, [userId]);

 

    const [visible, setVisible] = useState(false);




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


    const editUsers = async () => {
        try {

            const usersCollectionRef = collection(db, 'users');
            const userDocRef = doc(usersCollectionRef, userId);


            await updateDoc(userDocRef, userData);

            setVisible(false)
            window.location.reload();

            console.log('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };



    const footerContent = (
        <div>
            <Button label="ยกเลิก" icon="pi pi-times" onClick={() => { setUserId(''); setVisible(false) }} className="p-button-text" />
            <Button label="ยืนยัน" icon="pi pi-check" onClick={editUsers} autoFocus />
        </div>
    );

    const setFirstName = (text: string) => {
        setUserData({ ...userData, firstName: text });
    };

    const setLastName = (text: string) => {
        setUserData({ ...userData, lastName: text });
    };

    const setEmail = (text: string) => {
        setUserData({ ...userData, email: text });
    };

    const setPhoneNumber = (text: string) => {
        setUserData({ ...userData, phoneNumber: text });
    };


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
                                setUserId(row.id);
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

            <Dialog header="แก้ไขผู้ใช้" visible={visible} style={{ width: '30vw' }} onHide={() => { setUserId(''); setVisible(false) }} footer={footerContent} >
                <div className="grid" style={{ justifyContent: 'center' }}>
                    <div className="col-12">
                        <div className="card p-fluid">
                            
                            <div className="field">
                                <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ชื่อ</label>
                                <InputText id="title" type="text" value={userData?.firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="image" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>นามสกุล</label>
                                <InputText id="image" type="text" value={userData?.lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>อีเมล</label>
                                <InputText id="location" type="text" value={userData?.email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="map_location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>เบอร์โทรศัพท์</label>
                                <InputText id="map_location" type="text" value={userData?.phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>

                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}