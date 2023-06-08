import { DocumentData, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db, storage } from "../../../api/firebase";
import { Rating } from "primereact/rating";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { numberWithCommas } from "../pricecoma";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";

interface Hotels {
    id: string;
    title: string;
    image: string;
    gallery: string;
    location: string;
    description: string;
    map_location: string;
    pricePeerDay: string;
    rating: number;
}


export const Hotels = () => {

    const [hotelsData, setHotelsData] = useState<Hotels[]>([])
    const [hotelsID, setHotelsID] = useState('')
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef<any>(null);

    const [imageURL, setImageURL] = useState("")


    const [inputValues, setInputValues] = useState(['']);


    const [hotel, setHotel] = useState<DocumentData | null>(null);


    useEffect(() => {
        const fetchTripsData = async () => {
            try {
                // Fetch initial trips data
                const tripsCollectionRef = collection(db, 'hotels');
                const querySnapshot = await getDocs(tripsCollectionRef);

                const HotelsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setHotelsData(HotelsData as unknown as Hotels[]);

                // Fetch real-time updates for specific package
                const packagesDocRef = doc(db, 'hotels', String(hotelsID));
                const unsubscribe = onSnapshot(packagesDocRef, (documentSnapshot) => {
                    const hotel = documentSnapshot.data();
                    setHotel(hotel || null);
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
    }, [hotelsID]);


    const handleFileUpload = async (event: any) => {
        const file = event.files[0];
        const storageRef = ref(storage, `images/poster_hotels/${Date.now()}${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURLPoster = await getDownloadURL(storageRef);
        setImageURL(downloadURLPoster)
        setHotel({ ...hotel, image: downloadURLPoster })
        toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดรูปสำเร็จ', life: 3000 });
    };

    const setTitle = (text: string) => {
        setHotel({ ...hotel, title: text });
    };

    const setLocation = (text: string) => {
        setHotel({ ...hotel, location: text });
    };

    const setDescription = (text: string) => {
        setHotel({ ...hotel, description: text });
    };

    const setMap_location = (text: string) => {
        setHotel({ ...hotel, map_location: text });
    };

    const setPricePeerDay = (text: string) => {
        setHotel({ ...hotel, pricePeerDay: text });
    };

    const setRating = (text: number) => {
        setHotel({ ...hotel, rating: text });
    };


    const editTrip = async () => {
        try {
            const tripRef = doc(db, 'hotels', hotelsID);

            await updateDoc(tripRef, hotel);

            setVisible(false)
            window.location.reload();
        } catch (error) {
            console.log('Error editing trip:', error);
        }
    };

    // Function to remove a hotels
    const removeHotels = async (hotelsId: any) => {
        try {
            setLoading(true);
            const hotelsRef = doc(db, 'hotels', hotelsId);
            await deleteDoc(hotelsRef);
            console.log('Trip removed successfully!');
            window.location.reload();
        } catch (error) {
            console.log('Error removing trip:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedValues = [...inputValues];
        updatedValues[index] = e.target.value;
        setInputValues(updatedValues);
    };


    const handleAddInput = () => {
        if (inputValues.length < 5) {
            setInputValues([...inputValues, '']);
        }
    };

    const handleRemoveInput = (index: any) => {
        const updatedValues = [...inputValues];
        updatedValues.splice(index, 1);
        setInputValues(updatedValues);
    };

    const renderInputs = () => {
        return inputValues.map((value, index) => (
            <div key={index} className="field my-3 ">
                {index > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div></div>
                        <Button
                            className="p-button-danger p-button-sm p-button-text"
                            icon="pi pi-times"
                            onClick={() => handleRemoveInput(index)}
                        />
                    </div>
                )}
                <InputText
                    id={`input-${index}`}
                    type="text"
                    placeholder='ใส่ url รูปภาพสถานที่ท่องเที่ยว'
                    value={value}
                    onChange={(e) => handleInputChange(e, index)}
                />

            </div>
        ));
    };

    const footerContent = (
        <div>
            <Button label="ยกเลิก" icon="pi pi-times" onClick={() => { setHotelsID('') ; setVisible(false)}} className="p-button-text" />
            <Button label="ยืนยัน" icon="pi pi-check" onClick={() => editTrip()} autoFocus />
        </div>
    );


    const itemTemplate = (hotels: Hotels) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-2 shadow-2 block xl:block mx-auto border-round" height={120} src={hotels.image} alt={hotels.title} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-lg font-bold text-900">{hotels.title}</div>
                            <div className="flex item-center">

                                <Rating value={hotels.rating} readOnly cancel={false} ></Rating>
                            </div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-map-marker"></i>
                                    <span className="font-semibold">{hotels.location}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold text-primary-800">฿{numberWithCommas(parseFloat(hotels.pricePeerDay))}</span>
                            <div className="flex">
                                <Button
                                    icon="pi pi-file-edit"
                                    rounded
                                    outlined
                                    onClick={() => {
                                        setHotelsID(hotels.id);
                                        setVisible(true)
                                    }}
                                    className="p-button-rounded mr-2 "
                                >

                                </Button>
                                <Button
                                    icon="pi pi-trash"
                                    rounded
                                    outlined
                                    onClick={() => removeHotels(hotels.id)}
                                    severity="danger"
                                    className="p-button-rounded"
                                ></Button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Dialog header="แก้ไขรายละเอียดที่พัก" visible={visible} style={{ width: '35vw' }} onHide={() => setVisible(false)} footer={footerContent} >
                    <div className="grid" style={{ justifyContent: 'center' }}>
                        <div className="col-12">
                            <div className="card p-fluid">
                                <div className="field">
                                    <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Title</label>
                                    <InputText id="title" type="text" value={hotel?.title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="image" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รูปโปรเตอร์</label>
                                    <img className=" shadow-2 block xl:block mx-auto border-round" width={200} height={120} src={imageURL === '' ? hotel?.image : imageURL} alt="" />
                                    <FileUpload style={{ marginTop: 10 }} mode="basic" name="demo" url="http://localhost:3001/api/upload" accept="image/*" auto maxFileSize={2000000} onUpload={handleFileUpload} />
                                </div>
                                <div className="field">
                                    <label htmlFor="location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Location</label>
                                    <InputText id="location" type="text" value={hotel?.location} onChange={(e) => setLocation(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="description" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Description</label>
                                    <InputTextarea id='description' rows={5} cols={30} value={hotel?.description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="map_location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>GoogleMap Url ตำแหน่งที่ตั้ง</label>
                                    <InputText id="map_location" type="text" value={hotel?.map_location} onChange={(e) => setMap_location(e.target.value)} />
                                </div>
                               
                                <div className="field" >
                                    <label htmlFor="rating" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Rating</label>
                                    <InputNumber value={hotel?.rating} onValueChange={(e: any) => setRating(e.value)} min={0} max={10} minFractionDigits={1} />
                                </div>

                                <div className="field">
                                    <label htmlFor="pricePeerDay" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ราคาแพ็คเกจ</label>
                                    <InputText id="pricePeerDay" type="text" value={hotel?.pricePeerDay} onChange={(e) => setPricePeerDay(e.target.value)} />
                                </div>

                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    };


    return (
        <div >
            <Toast ref={toast} />
            <DataView value={hotelsData} itemTemplate={itemTemplate} />
        </div>
    )
}