import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect, useRef, useState } from 'react'
import { db, storage } from '../../api/firebase';
import { Toast } from 'primereact/toast';
import { fetchNotificationData } from '../../api/fetch-data';
import { DataView } from 'primereact/dataview';
import moment from 'moment';
import { FileUpload } from 'primereact/fileupload';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface Notifys {
  id: number;
  title: string;
  description: string;
  date: string;
}

const Notification = () => {
  const toast = useRef<any>(null);

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageURL, setImageURL] = useState("")

  const [notification, setNotification] = useState<Notifys[]>([])

  const handleFileUpload = async (event: any) => {
    const file = event.files[0];
    const storageRef = ref(storage, `images/notification/${Date.now()}${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURLPoster = await getDownloadURL(storageRef);
    setImageURL(downloadURLPoster)
    toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดรูปสำเร็จ', life: 3000 });
  };

  const handelUpload = async () => {

    const date = new Date()
    const formattedDate = moment(date).format('DD/MMM/YY');

    const notifys = {
      title: title,
      description: description,
      date: formattedDate,
      image: imageURL
    }

    await addDoc(collection(db, "notifys"), notifys)

    //await setDoc(doc(db, "notifys", `notifys-ID-${notifysData.length + 1}`), notifys)

    toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดสำเร็จ', life: 3000 });
    window.location.reload()
    setTitle("")
    setDescription("")
    setImageURL('')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifys = await fetchNotificationData();

        setNotification(notifys as unknown as Notifys[])
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, []);

  const removeNotification = async (reviewsId: any) => {
    try {

      const notifysRefRef = doc(db, 'notifys', `notifys-ID-${reviewsId}`);
      await deleteDoc(notifysRefRef);

      toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบสำเร็จ', life: 3000 });
      window.location.reload();

    } catch (error) {
      console.log('Error removing public-relations:', error);
    }
  };

  const itemTemplate = (item: any) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 justify-content-between align-items-center">
          <div >
            <div style={{ fontWeight: 'bold', fontSize: 16, }}>Title:</div>
            <div className="line-clamp-2 w-12rem">
              <img src={item.image} style={{ width: 150, height: 75}} alt='' />
            </div>
          </div>
          <div >
            <div style={{ fontWeight: 'bold', fontSize: 16, }}>Title:</div>
            <div className="line-clamp-2 w-12rem">{item.title}</div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 16, }}>รายละเอียด:</div>
            <div className="line-clamp-2 w-12rem">{item.description}</div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 16, }}>วันที่:</div>
            <div className="line-clamp-2 w-12rem">{item.date}</div>
          </div>

          <Button
            icon="pi pi-trash"
            rounded
            outlined
            severity="danger"
            className="p-button-rounded"
            onClick={(e) => { e.preventDefault(); removeNotification(item.id); }}
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
          <h5 style={{ fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>จัดการแจ้งเตือน</h5>

          <TabView>
            <TabPanel header="แจ้งเตือนทั้งหมด">
              <DataView value={notification} itemTemplate={itemTemplate} />
            </TabPanel>
            <TabPanel header="เพิ่มแจ้งเตือน">
              <div className="field">
                <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Title</label>
                <InputText id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รายละเอียด</label>
                <InputText id="title" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>เลือกรูปที่จะแจ้งเตือน</label>
               
              </div>



              <div className='mt-6'>

                <Button
                  label="Upload"
                  icon="pi pi-upload"
                  iconPos="left"
                  className='w-10rem'
                  onClick={handelUpload}
                />
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  )
}

export default Notification