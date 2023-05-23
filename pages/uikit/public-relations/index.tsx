import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { TabPanel, TabView } from 'primereact/tabview'
import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { db, storage } from '../../api/firebase'
import { fetchPublic_RelationsData } from '../../api/fetch-data'
import { DataView } from 'primereact/dataview'
import { FileUpload } from 'primereact/fileupload'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

interface Publics {
    id: number,
    image: string
}
const PublicRelations = () => {

    const [urlImagePromo, setUrlImagePromo] = useState("")
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false);
    const toast = useRef<any>(null);

    const [public_relations, setPublic_relations] = useState<Publics[]>([])

    const handleFileUpload = async (event: any) => {
        const file = event.files[0];
        const storageRef = ref(storage, `images/promotion/${Date.now()}${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURLPoster = await getDownloadURL(storageRef);
        setUrlImagePromo(downloadURLPoster)
        toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดรูปสำเร็จ', life: 3000 });
    };

    const handelUpload = async () => {

        const public_relations = {
            title: title,
            description: description,
            image: urlImagePromo
        }

        await addDoc(collection(db, "public-relations"), public_relations)

        //await setDoc(doc(db, "public-relations", `public-relations-ID-${public_relationsData.length + 1}`), public_relations)

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
            const public_relationsRef = doc(db, 'public-relations', reviewsId);
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
                    <img height={200} style={{ width: '300px', display: 'block', objectFit: 'cover', borderRadius: 15 }} src={item.image} alt={item.image} />

                    <div >
                        <div style={{ fontWeight: 'bold', fontSize: 16, }}>Title:</div>
                        <div className="line-clamp-2 w-12rem">{item.title}</div>
                    </div>
                    <div >
                        <div style={{ fontWeight: 'bold', fontSize: 16, }}>รายละเอียด:</div>
                        <div className="line-clamp-2 w-12rem">{item.description}</div>
                    </div>
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
                                <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={handleFileUpload} auto chooseLabel="Browse" />
                            </div>
                            <div className="field">
                                <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Title</label>
                                <InputText id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="field">
                                <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รายละเอียด</label>
                                <InputText id="title" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
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