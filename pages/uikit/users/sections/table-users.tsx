import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useEffect, useState } from "react"
import { db } from "../../../api/firebase";
import { fetchUsersData } from "../../../api/fetch-data";
import { Users } from "../../../../types/interface";



export const TableUser = () => {
    const [users, setUsers] = useState<Users[]>([])
    const [loading, setLoading] = useState(false);

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


   

    return (
        <DataTable value={users} tableStyle={{ minWidth: '70rem' }}>
            <Column sortable body={(row) => <div>users-ID-{row.id}</div>} header="ID"></Column>
            <Column field="firstName" header="ชื่อ"></Column>
            <Column field="lastName" header="นามสกุล"></Column>
            <Column field="phoneNumber" header="เบอร์โทรศัพทร์"></Column>
            <Column field="email" header="อีเมล"></Column>
            <Column
                header="#"
                body={(row) => <div>
                  
                </div>}>

            </Column>
        </DataTable>
    )
}