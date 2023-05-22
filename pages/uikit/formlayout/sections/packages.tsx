import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { OrderList } from "primereact/orderlist"
import { useEffect, useRef, useState } from "react";
import { db } from "../../../api/firebase";
import { DataView } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { numberWithCommas } from "../../manage-hotels/pricecoma";
import { InputNumber } from "primereact/inputnumber";

export const Packages = () => {
    const [tripsData, setTripsData] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const [productId, setProductId] = useState('');
    const toast = useRef<any>(null);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("")
    const [imageURL, setImageURL] = useState("")
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")
    const [tripsDay, setTripsDay] = useState("")
    const [rating, setRating] = useState(0)
    const [price, setPrice] = useState("")
    const [inputValues, setInputValues] = useState(['']);
    const [inputValuesTripsDay, setInputValuesTripsDay] = useState(['']);

    useEffect(() => {
        const fetchTripsData = async () => {
            try {
                const tripsCollectionRef = collection(db, 'trips');
                const querySnapshot = await getDocs(tripsCollectionRef);

                const tripsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setTripsData(tripsData);
            } catch (error) {
                console.log('Error getting trips data:', error);
            }
        };

        fetchTripsData();
    }, []);

    // Function to edit a trip
    const editTrip = async () => {
        try {
            const tripRef = doc(db, 'trips', `trips-ID-${productId}`);

            const tripSnapshot = await getDoc(tripRef);
            const originalTrip = tripSnapshot.data();

            const newTrip = {
                ...originalTrip,
                title: title !== "" ? title : (originalTrip?.title || ""),
                image: imageURL !== "" ? imageURL : (originalTrip?.image || ""),
                location: location !== "" ? location : (originalTrip?.location || ""),
                description: description !== "" ? description : (originalTrip?.description || ""),
                tripsDay: tripsDay !== "" ? tripsDay : (originalTrip?.tripsDay || ""),
                rating: rating !== 0 ? rating : (originalTrip?.rating || ""),
                price: price !== "" ? price : (originalTrip?.price || ""),

            };

            await updateDoc(tripRef, newTrip);

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
            <Button label="ยกเลิก" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
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
                <Dialog header="แก้ไขแพ็คเกจ" visible={visible} style={{ width: '30vw' }} onHide={() => setVisible(false)} footer={footerContent} >
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
                                    <label htmlFor="tripsDay" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>TripsDay</label>
                                    <InputText id="tripsDay" type="text" value={tripsDay} onChange={(e) => setTripsDay(e.target.value)} />
                                </div>
                                <div className="field" >
                                    <label htmlFor="rating" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Rating</label>
                                    <InputNumber value={rating} onValueChange={(e: any) => setRating(e.value)} min={0} max={10} minFractionDigits={1} />
                                </div>
                               
                                <div className="field">
                                    <label htmlFor="price" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ราคาแพ็คเกจ</label>
                                    <InputText id="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
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