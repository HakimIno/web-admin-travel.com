import { DocumentData, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
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
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';

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
  const [visible, setVisible] = useState(false);

  const [notification, setNotification] = useState<Notifys[]>([])

  const [notifys, setNotifys] = useState<DocumentData | null>(null);
  const [notifysId, setNotifysId] = useState('');

  const handleFileUpload = async (event: any) => {
    const file = event.files[0];
    const storageRef = ref(storage, `images/notification/${Date.now()}${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURLPoster = await getDownloadURL(storageRef);
    setImageURL(downloadURLPoster)
    toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดรูปสำเร็จ', life: 3000 });
  };

  const handleFileUploadUpdate = async (event: any) => {
    const file = event.files[0];
    const storageRef = ref(storage, `images/notification/${Date.now()}${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURLPoster = await getDownloadURL(storageRef);
    setImageURL(downloadURLPoster)
    setNotifys({ ...notifys, image: downloadURLPoster })
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

  const sendNotification = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}${currentDate.getHours() < 12 ? 'AM' : 'PM'}`;

    const requestBody = {
      appId: 8562,
      appToken: "c50yB7EcbMr6VOtSVF0qNb",
      title: title,
      body: description,
      dateSent: formattedDate,
      bigPictureURL: imageURL
    };

    axios.post('https://app.nativenotify.com/api/notification', requestBody)
      .then(response => {
        console.log('Notification sent successfully:', response.data);
      })
      .catch(error => {
        console.error('Error sending notification:', error);
      });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifys = await fetchNotificationData();

        setNotification(notifys as unknown as Notifys[])

        const packagesDocRef = doc(db, 'notifys', String(notifysId));
        const unsubscribe = onSnapshot(packagesDocRef, (documentSnapshot) => {
          const notify = documentSnapshot.data();
          setNotifys(notify || null);
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
  }, [notifysId]);

  const removeNotification = async (reviewsId: any) => {
    try {

      const notifysRefRef = doc(db, 'notifys', reviewsId);
      await deleteDoc(notifysRefRef);

      toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'ลบสำเร็จ', life: 3000 });
      window.location.reload();

    } catch (error) {
      console.log('Error removing public-relations:', error);
    }
  };

  const setTitleUpdate = (text: string) => {
    setNotifys({ ...notifys, title: text });
  };


  const setDescriptionUpdate = (text: string) => {
    setNotifys({ ...notifys, description: text });
  };


  const editNotification = async () => {
    try {
      const notifysRef = doc(db, 'notifys', notifysId);

      await updateDoc(notifysRef, notifys);

      setVisible(false)
      window.location.reload();
    } catch (error) {
      console.log('Error editing notifys:', error);
    }
  };




  const footerContent = (
    <div>
      <Button label="ยกเลิก" icon="pi pi-times" onClick={() => { setVisible(false); }} className="p-button-text" />
      <Button label="ยืนยัน" icon="pi pi-check" onClick={editNotification} autoFocus />
    </div>
  );



  const itemTemplate = (item: any) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 justify-content-between align-items-center">
          <div >
            <div style={{ fontWeight: 'bold', fontSize: 16, }}>Title:</div>
            <div className="line-clamp-2 w-12rem">
              <img src={item.image} style={{ width: 150, height: 75 }} alt='' />
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

          <div>
            <Button
              icon="pi pi-file-edit"
              rounded
              outlined
              className="p-button-rounded mr-2"
              onClick={() => {
                setNotifysId(item.id);
                setVisible(true)
              }}>

            </Button>
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

          <Dialog header="แก้ไขแจ้งเตือน" visible={visible} style={{ width: '35vw' }} onHide={() => setVisible(false)} footer={footerContent} >
            <div className="grid" style={{ justifyContent: 'center' }}>
              <div className="col-12">
                <div className="card p-fluid">
                  <div className="field">
                    <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Title</label>
                    <InputText id="title" type="text" value={notifys?.title} onChange={(e) => setTitleUpdate(e.target.value)} />
                  </div>

                  <div className="field">
                    <label htmlFor="image" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รูปโปรเตอร์</label>
                    <img className=" shadow-2 block xl:block mx-auto border-round" width={200} height={120} src={imageURL === '' ? notifys?.image : imageURL} alt="" />
                    <FileUpload style={{ marginTop: 10 }} mode="basic" name="demo" url="http://localhost:3001/api/upload" accept="image/*" auto maxFileSize={2000000} onUpload={handleFileUploadUpdate} />

                  </div>

                  <div className="field">
                    <label htmlFor="description" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Description</label>
                    <InputTextarea id='description' rows={5} cols={30} value={notifys?.description} onChange={(e) => setDescriptionUpdate(e.target.value)} />
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
                <div className="block">
                  {imageURL && (
                    <div  style={{ position: 'relative', width: 200 }}>
                      <img className=" shadow-2  mx-auto border-round" width={200} height={120} src={imageURL} alt="" />
                      <i
                        onClick={() => setImageURL("")}
                        className="pi pi-times "

                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          color: 'red',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                        }}
                      ></i>
                    </div>
                  )}
                </div>

                <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={handleFileUpload} auto chooseLabel="Browse" />
              </div>

              <div className='mt-6'>
              <Button
                  label="SendDevice"
                  icon="pi pi-upload"
                  iconPos="left"
                  className='w-10rem'
                  onClick={sendNotification}
                />

                <Button
                  label="Upload"
                  icon="pi pi-upload"
                  iconPos="left"
                  className='w-10rem mx-3'
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