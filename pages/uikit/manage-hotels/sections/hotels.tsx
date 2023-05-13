import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../api/firebase";
import { Rating } from "primereact/rating";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { numberWithCommas } from "../pricecoma";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";

interface Hotels {
    id: number;
    title: string;
    image: string;
    gallery: string;
    location: string;
    description: string;
    pricePeerDay: string;
    rating: number;
}


export const Hotels = () => {

    const [hotelsData, setHotelsData] = useState<Hotels[]>([])
    const [hotelsID, setHotelsID] = useState('')
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("")
    const [imageURL, setImageURL] = useState("")
    const [location, setLocation] = useState("")
    const [map_location, setMap_location] = useState("")
    const [description, setDescription] = useState("")
    const [rating, setRating] = useState(0)
    const [pricePeerDay, setPricePeerDay] = useState("")
    const [inputValues, setInputValues] = useState(['']);


    useEffect(() => {
        const fetchTripsData = async () => {
            try {
                const tripsCollectionRef = collection(db, 'hotels');
                const querySnapshot = await getDocs(tripsCollectionRef);

                const HotelsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setHotelsData(HotelsData as unknown as Hotels[]);
            } catch (error) {
                console.log('Error getting trips data:', error);
            }
        };

        fetchTripsData();
    }, []);


    const editTrip = async () => {
        try {
            const hotelsRef = doc(db, 'hotels', `hotels-ID-${hotelsID}`);

            const hotelsSnapshot = await getDoc(hotelsRef);
            const originalHotels = hotelsSnapshot.data();

            const newHotels = {
                ...originalHotels,
                title: title !== "" ? title : (originalHotels?.title || ""),
                image: imageURL !== "" ? imageURL : (originalHotels?.image || ""),
                location: location !== "" ? location : (originalHotels?.location || ""),
                map_location: map_location !== "" ? map_location : (originalHotels?.map_location || ""),
                description: description !== "" ? description : (originalHotels?.description || ""),
                rating: rating !== 0 ? rating : (originalHotels?.rating || ""),
                pricePeerDay: pricePeerDay !== "" ? pricePeerDay : (originalHotels?.pricePeerDay || ""),

            };

            await updateDoc(hotelsRef, newHotels);

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
            const tripRef = doc(db, 'hotels', `hotels-ID-${hotelsId}`);
            await deleteDoc(tripRef);
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
            <Button label="ยกเลิก" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="ยืนยัน" icon="pi pi-check" onClick={editTrip} autoFocus />
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
                                        setHotelsID(hotels.id.toString());
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
                <Dialog header="แก้ไขรายละเอียดที่พัก" visible={visible} style={{ width: '30vw' }} onHide={() => setVisible(false)} footer={footerContent} >
                    <div className="grid" style={{ justifyContent: 'center' }}>
                        <div className="col-12">
                            <div className="card p-fluid">
                                <div className="field">
                                    <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Title</label>
                                    <InputText id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="image" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Image (URL)</label>
                                    <InputText id="image" type="text" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Location</label>
                                    <InputText id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="description" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Description</label>
                                    <InputTextarea id='description' rows={5} cols={30} value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <div className="field">
                                    <label htmlFor="map_location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>GoogleMap Url ตำแหน่งที่ตั้ง</label>
                                    <InputText id="map_location" type="text" value={map_location} onChange={(e) => setMap_location(e.target.value)} />
                                </div>
                                {/* <div className="field" >
                                    <label style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>เพิ่มรูปภาพแนะนำ(gallery)</label>
                                </div>
                                <Button icon="pi pi-plus" onClick={handleAddInput} disabled={inputValues.length >= 5} />
                                {renderInputs()} */}
                                <div className="field" >
                                    <label htmlFor="rating" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Rating</label>
                                    <InputNumber value={rating} onValueChange={(e: any) => setRating(e.value)} min={0} max={10} minFractionDigits={1} />
                                </div>

                                <div className="field">
                                    <label htmlFor="pricePeerDay" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ราคาแพ็คเกจ</label>
                                    <InputText id="pricePeerDay" type="text" value={pricePeerDay} onChange={(e) => setPricePeerDay(e.target.value)} />
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
            <DataView value={hotelsData} itemTemplate={itemTemplate} />
        </div>
    )
}