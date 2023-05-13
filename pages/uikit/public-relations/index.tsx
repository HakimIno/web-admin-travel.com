import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { TabPanel, TabView } from 'primereact/tabview'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../api/firebase'
import { fetchPublic_RelationsData } from '../../api/fetch-data'
import { DataView } from 'primereact/dataview'

interface Publics {
    id: number,
    image: string
}
const PublicRelations = () => {

    const [urlImagePromo, setUrlImagePromo] = useState("")
    const [loading, setLoading] = useState(false);
    const toast = useRef<any>(null);

    const [public_relations, setPublic_relations] = useState<Publics[]>([])

    const handelUpload = async () => {
        const public_relationsCollectionRef = collection(db, 'public-relations');
        const querySnapshot = await getDocs(public_relationsCollectionRef);
        const public_relationsData = querySnapshot.docs.map((doc) => doc.data());

        const public_relations = {
            id: public_relationsData.length + 1,
            image: urlImagePromo
        }

        await setDoc(doc(db, "public-relations", `public-relations-ID-${public_relationsData.length + 1}`), public_relations)

        toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดสำเร็จ', life: 3000 });
        window.location.reload()
        setUrlImagePromo("")
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const public_relation = await fetchPublic_RelationsData();

                setPublic_relations(public_relation as unknown as Publics[])
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, []);

    const removePublic_relations = async (reviewsId: any) => {
        try {
            setLoading(true);
            const public_relationsRef = doc(db, 'public-relations', `public-relations-ID-${reviewsId}`);
            await deleteDoc(public_relationsRef);
            toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบสำเร็จ', life: 3000 });
            window.location.reload();
        } catch (error) {
            console.log('Error removing public-relations:', error);
        } finally {
            setLoading(false);
        }
    };

    const itemTemplate = (item: any) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 justify-content-between align-items-center">
                    <img height={200} style={{ width: '400px', display: 'block', objectFit: 'cover', borderRadius: 15 }} src={item.image} alt={item.image} />

                    <Button
                        icon="pi pi-trash"
                        rounded
                        outlined
                        severity="danger"
                        className="p-button-rounded"
                        onClick={(e) => { e.preventDefault(); removePublic_relations(item.id); }}
                    >

                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="grid" style={{ justifyContent: 'center' }}>
            <Toast ref={toast} />
            <div className="col-12  ">
                <div className="card p-fluid">
                    <h5 style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>จัดการประชาสัมพันธ์และโปรโมชั่น</h5>

                    <TabView>
                        <TabPanel header="ประชาสัมพันธ์ทั้งหมด">
                            <DataView value={public_relations} itemTemplate={itemTemplate} />
                        </TabPanel>
                        <TabPanel header="เพิ่มประชาสัมพันธ์">
                            <div className="field">
                                <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รูปภาพประชาสัมพันธ์ (URL)</label>
                                <InputText id="title" type="text" value={urlImagePromo} onChange={(e) => setUrlImagePromo(e.target.value)} />
                            </div>
                            <div className='mt-6'>

                                <Button
                                    label="Upload"
                                    icon="pi pi-upload"
                                    iconPos="left"
                                    className='w-10rem'
                                    onClick={(e) => { e.preventDefault(); handelUpload(); }}
                                />
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    )
}

export default PublicRelations