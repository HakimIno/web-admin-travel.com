import { DocumentData, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
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
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'

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
    const [visible, setVisible] = useState(false);

    const [public_relations, setPublic_relations] = useState<Publics[]>([])

    const [publicRelations, setPublicRelations] = useState<DocumentData | null>(null);
    const [publicRelationsId, setPublicRelationsId] = useState('');

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

    const handleFileUploadUpdate = async (event: any) => {
        const file = event.files[0];
        const storageRef = ref(storage, `images/notification/${Date.now()}${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURLPoster = await getDownloadURL(storageRef);
        setUrlImagePromo(downloadURLPoster)
        setPublicRelations({ ...publicRelations, image: downloadURLPoster })
        toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดรูปสำเร็จ', life: 3000 });
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const public_relation = await fetchPublic_RelationsData();

                setPublic_relations(public_relation as unknown as Publics[])

                const publicRelationDocRef = doc(db, 'public-relations', String(publicRelationsId));
                const unsubscribe = onSnapshot(publicRelationDocRef, (documentSnapshot) => {
                    const publicRelation = documentSnapshot.data();
                    setPublicRelations(publicRelation || null);
                });

                return () => {
                    // Unsubscribe from real-time updates when component unmounts
                    unsubscribe();
                };
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [publicRelationsId]);

    const setTitleUpdate = (text: string) => {
        setPublicRelations({ ...publicRelations, title: text });
    };


    const setDescriptionUpdate = (text: string) => {
        setPublicRelations({ ...publicRelations, description: text });
    };

    console.log(publicRelations)


    const editPublicRelations = async () => {
        try {
            const notifysRef = doc(db, 'public-relations', publicRelationsId);

            await updateDoc(notifysRef, publicRelations);

            setVisible(false)
            window.location.reload();
        } catch (error) {
            console.log('Error editing notifys:', error);
        }
    };


    const removePublic_relations = async (public_relationsId: any) => {
        try {
            setLoading(true);
            const public_relationsRef = doc(db, 'public-relations', public_relationsId);
            await deleteDoc(public_relationsRef);
            toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบสำเร็จ', life: 3000 });
            window.location.reload();
        } catch (error) {
            console.log('Error removing public-relations:', error);
        } finally {
            setLoading(false);
        }
    };

    const footerContent = (
        <div>
            <Button label="ยกเลิก" icon="pi pi-times" onClick={() => { setVisible(false); }} className="p-button-text" />
            <Button label="ยืนยัน" icon="pi pi-check" onClick={editPublicRelations} autoFocus />
        </div>
    );


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

                    <div>
                        <Button
                            icon="pi pi-file-edit"
                            rounded
                            outlined
                            className="p-button-rounded mr-2"
                            onClick={() => {
                                setPublicRelationsId(item.id);
                                setVisible(true)
                            }}
                        >

                        </Button>
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

                    <Dialog header="แก้ไขโปรโมชั่น" visible={visible} style={{ width: '35vw' }} onHide={() => setVisible(false)} footer={footerContent} >
                        <div className="grid" style={{ justifyContent: 'center' }}>
                            <div className="col-12">
                                <div className="card p-fluid">
                                    <div className="field">
                                        <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Title</label>
                                        <InputText id="title" type="text" value={publicRelations?.title} onChange={(e) => setTitleUpdate(e.target.value)} />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="image" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รูปโปรเตอร์</label>
                                        <img className=" shadow-2 block xl:block mx-auto border-round" width={200} height={120} src={urlImagePromo === '' ? publicRelations?.image : urlImagePromo} alt="" />
                                        <FileUpload style={{ marginTop: 10 }} mode="basic" name="demo" url="http://localhost:3001/api/upload" accept="image/*" auto maxFileSize={2000000} onUpload={handleFileUploadUpdate} />

                                    </div>

                                    <div className="field">
                                        <label htmlFor="description" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Description</label>
                                        <InputTextarea id='description' rows={5} cols={30} value={publicRelations?.description} onChange={(e) => setDescriptionUpdate(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>
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