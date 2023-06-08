import { DocumentData, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import { OrderList } from "primereact/orderlist"
import { useEffect, useRef, useState } from "react";
import { db, storage } from "../../../api/firebase";
import { DataView } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { numberWithCommas } from "../../manage-hotels/pricecoma";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const Packages = () => {
    const [tripsData, setTripsData] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const [productId, setProductId] = useState('');
    const toast = useRef<any>(null);
    const [loading, setLoading] = useState(false);

    const [imageURL, setImageURL] = useState("")

    const [inputValues, setInputValues] = useState(['']);
    const [inputValuesTripsDay, setInputValuesTripsDay] = useState(['']);

    const [packages, setPackages] = useState<DocumentData | null>(null);

    useEffect(() => {
        const fetchTripsData = async () => {
            try {
                // Fetch initial trips data
                const tripsCollectionRef = collection(db, 'trips');
                const querySnapshot = await getDocs(tripsCollectionRef);
                const tripsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTripsData(tripsData);

                // Fetch real-time updates for specific package
                const packagesDocRef = doc(db, 'trips', String(productId));
                const unsubscribe = onSnapshot(packagesDocRef, (documentSnapshot) => {
                    const trips = documentSnapshot.data();
                    setPackages(trips || null);
                });

                return () => {
                    // Unsubscribe from real-time updates when component unmounts
                    unsubscribe();
                };
            } catch (error) {
                console.log('Error getting trips data:', error);
            }
        };

        fetchTripsData();
    }, [productId]);

    const handleFileUpload = async (event: any) => {
        const file = event.files[0];
        const storageRef = ref(storage, `images/poster/${Date.now()}${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURLPoster = await getDownloadURL(storageRef);
        setImageURL(downloadURLPoster)
        setPackages({ ...packages, image: downloadURLPoster })
        toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดรูปสำเร็จ', life: 3000 });
    };
    const handleFileFireUpload = async (event: any) => {
        const files = event.files;
        const updatedGallery = [...packages?.gallery];

        for (const file of files) {
            const storageRef = ref(storage, `images/gallery/${Date.now()}${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            updatedGallery.push(downloadURL);
        }

        setPackages((prevPackages) => ({
            ...prevPackages,
            gallery: updatedGallery,
        }));
    };



    const setTitle = (text: string) => {
        setPackages({ ...packages, title: text });
    };

    const setLocation = (text: string) => {
        setPackages({ ...packages, location: text });
    };

    const setDescription = (text: string) => {
        setPackages({ ...packages, description: text });
    };

    const setTripsDay = (text: string) => {
        setPackages({ ...packages, tripsDay: text });
    };

    const setPrice = (text: string) => {
        setPackages({ ...packages, price: text });
    };

    const setRating = (text: number) => {
        setPackages({ ...packages, rating: text });
    };

    const setHotelsName = (text: string) => {
        setPackages({ ...packages, hotelsName: text });
    };

    const setSingleBadPrice = (text: string) => {
        setPackages({ ...packages, singleBadPrice: text });
    };

    const setDoubleBedPrice = (text: string) => {
        setPackages({ ...packages, doubleBedPrice: text });
    };

    const setThreeBedsPrice = (text: string) => {
        setPackages({ ...packages, threeBedsPrice: text });
    };

    const handleDeleteImage = async (index: any) => {
        try {
            const db = getFirestore();
            const collectionRef = doc(db, 'trips', productId);

            // Fetch the document
            const documentSnapshot = await getDoc(collectionRef);
            const documentData = documentSnapshot.data();

            if (documentData) {
                // Filter out the URLs to delete
                const updatedGallery = documentData.gallery.filter((_: any, i: any) => i !== index);

                // Update the document with the new gallery array
                await updateDoc(collectionRef, { gallery: updatedGallery });

                console.log('Image deleted successfully');
            } else {
                console.log('Document does not exist');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };



    // Function to edit a trip
    const editTrip = async () => {
        try {
            const tripRef = doc(db, 'trips', productId);

            await updateDoc(tripRef, packages);

            setVisible(false)
            window.location.reload();
        } catch (error) {
            console.log('Error editing trip:', error);
        }
    };


    // Function to remove a trip
    const removeTrip = async (tripsId: any) => {
        try {
            setLoading(true);
            const tripRef = doc(db, 'trips', tripsId);
            await deleteDoc(tripRef);
            console.log('Trip removed successfully!');
            window.location.reload();
        } catch (error) {
            console.log('Error removing trip:', error);
        } finally {
            setLoading(false);
        }
    };


    const footerContent = (
        <div>
            <Button label="ยกเลิก" icon="pi pi-times" onClick={() => { setProductId(''); setVisible(false); }} className="p-button-text" />
            <Button label="ยืนยัน" icon="pi pi-check" onClick={editTrip} autoFocus />
        </div>
    );




    const itemTemplate = (product: any) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-2 shadow-2 block xl:block mx-auto border-round" height={120} src={product.image} alt={product.title} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-lg font-bold text-900">{product.title}</div>
                            <Rating value={product.rating / 2} readOnly cancel={false}></Rating>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-map-marker"></i>
                                    <span className="font-semibold">{product.location}</span>
                                </span>

                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold text-primary-800">฿{numberWithCommas(parseFloat(product.price))}</span>
                            <div>
                                <Button
                                    icon="pi pi-file-edit"
                                    rounded
                                    outlined

                                    className="p-button-rounded mr-2 "
                                    onClick={() => {
                                        setProductId(product.id);
                                        setVisible(true)
                                    }}>

                                </Button>
                                <Button
                                    icon="pi pi-trash"
                                    rounded
                                    outlined

                                    severity="danger"
                                    className="p-button-rounded"
                                    onClick={() => removeTrip(product.id)} ></Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog header="แก้ไขแพ็คเกจ" visible={visible} style={{ width: '35vw' }} onHide={() => setVisible(false)} footer={footerContent} >
                    <div className="grid" style={{ justifyContent: 'center' }}>
                        <div className="col-12">
                            <div className="card p-fluid">
                                <div className="field">
                                    <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Title</label>
                                    <InputText id="title" type="text" value={packages?.title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="image" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รูปโปรเตอร์</label>
                                    <img className=" shadow-2 block xl:block mx-auto border-round" width={200} height={120} src={imageURL === '' ? packages?.image : imageURL} alt={product.title} />
                                    <FileUpload style={{ marginTop: 10 }} mode="basic" name="demo" url="http://localhost:3001/api/upload" accept="image/*" auto maxFileSize={2000000} onUpload={handleFileUpload} />

                                </div>

                                <div className="field">
                                    <label htmlFor="location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Location</label>
                                    <InputText id="location" type="text" value={packages?.location} onChange={(e) => setLocation(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="description" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Description</label>
                                    <InputTextarea id='description' rows={5} cols={30} value={packages?.description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <div className="field" >
                                    <label style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>เพิ่มรูปภาพแนะนำ(gallery) <span className="text-red-500 text-sm">* 5 รูป</span> </label>
                                </div>
                                {packages?.gallery && packages?.gallery.map((item: any, index: any) => (
                                    <div key={index} style={{ position: 'relative', width: 200 }}>

                                        <img
                                            className="shadow-2 mx-auto border-round"
                                            width={200}
                                            height={120}
                                            src={item}
                                            alt=""
                                        />
                                        <i
                                            onClick={() => handleDeleteImage(index)}
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
                                ))}


                                <FileUpload
                                    name="demo[]"
                                    url={'http://localhost:3001/api/upload'}
                                    multiple
                                    accept="image/*"
                                    maxFileSize={5000000}
                                    emptyTemplate={<p className="m-0">ลากและวางไฟล์ที่นี่เพื่ออัปโหลด.</p>}
                                    onUpload={handleFileFireUpload}
                                />

                                <div className="field">
                                    <label htmlFor="tripsDay" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>TripsDay</label>
                                    <InputText id="tripsDay" type="text" value={packages?.tripsDay} onChange={(e) => setTripsDay(e.target.value)} />
                                </div>
                                <div className="field" >
                                    <label htmlFor="rating" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Rating</label>
                                    <InputNumber value={packages?.rating} onValueChange={(e: any) => setRating(e.value)} min={0} max={10} minFractionDigits={1} />
                                </div>

                                <div className="field">
                                    <label htmlFor="price" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ราคาแพ็คเกจ</label>
                                    <InputText id="price" type="text" value={packages?.price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="hotelsName" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ชื่อโรงแรม/ที่พัก</label>
                                    <InputText id="hotelsName" type="text" value={packages?.hotelsName} onChange={(e) => setHotelsName(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="singleBadPrice" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ราคาเตียงเดี่ยว</label>
                                    <InputText id="singleBadPrice" type="text" value={packages?.singleBadPrice} onChange={(e) => setSingleBadPrice(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="doubleBedPrice" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ราคาเตียงคู่</label>
                                    <InputText id="doubleBedPrice" type="text" value={packages?.doubleBedPrice} onChange={(e) => setDoubleBedPrice(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="threeBedsPrice" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ราคาเตียงสาม</label>
                                    <InputText id="threeBedsPrice" type="text" value={packages?.threeBedsPrice} onChange={(e) => setThreeBedsPrice(e.target.value)} />
                                </div>

                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    };


    return (
        <div>
            <Toast ref={toast} />
            <DataView value={tripsData} itemTemplate={itemTemplate} />

        </div>
    )
}