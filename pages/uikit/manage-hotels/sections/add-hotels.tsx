import { collection, doc, getDocs, setDoc } from "firebase/firestore"
import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { useRef, useState } from "react"
import { db } from "../../../api/firebase"
import { Toast } from "primereact/toast"

export const AddHotels = () => {
    const toast = useRef<any>(null);

    const [title, setTitle] = useState("")
    const [imageURL, setImageURL] = useState("")
    const [map_location, setMap_location] = useState("")
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")
    const [pricePeerDay, setPricePeerDay] = useState("")
    const [tripsId, setTripsId] = useState('')
    const [rating, setRating] = useState(0)
    const [inputValues, setInputValues] = useState(['']);


    const handelUpload = async () => {
        const hotelsCollectionRef = collection(db, 'hotels');
        const querySnapshot = await getDocs(hotelsCollectionRef);

        const hotelsData = querySnapshot.docs.map((doc) => doc.data());

        const newTrip = {
            id: hotelsData.length + 1,
            title: title,
            image: imageURL,
            map_location: map_location,
            tripsId: tripsId,
            location: location,
            gallery: inputValues,
            description: description,
            rating: rating,
            pricePeerDay: pricePeerDay,
            type: "HOTELS"
        };

        await setDoc(doc(db, "hotels", `hotels-ID-${hotelsData.length + 1}`), newTrip)

        toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดสำเร็จ', life: 3000 });

        // Reset the form values
        setTitle("");
        setImageURL("");
        setLocation("");
        setMap_location("");
        setDescription("");
        setRating(0);
        setPricePeerDay("");
    }


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
                    placeholder='ใส่ url รูปภาพห้องพัก'
                    value={value}
                    onChange={(e) => handleInputChange(e, index)}
                />

            </div>
        ));
    };


    return (
        <div>
            <Toast ref={toast} />
            <div className="field">
                <label htmlFor="title" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Title</label>
                <InputText id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="field">
                <label htmlFor="image" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รูปภาพโปสเตอร์ (URL)</label>
                <InputText id="image" type="text" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />
            </div>
            <div className="field">
                <label htmlFor="location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ประเทศ</label>
                <InputText id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="field">
                <label htmlFor="map_location" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>GoogleMap Url ตำแหน่งที่ตั้ง</label>
                <InputText id="map_location" type="text" value={map_location} onChange={(e) => setMap_location(e.target.value)} />
            </div>
            <div className="field">
                <label htmlFor="description" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รายละเอียด</label>
                <InputTextarea id='description' rows={5} cols={30} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="field">
                <label htmlFor="tripsDay" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ราคา</label>
                <InputText id="tripsDay" type="text" value={pricePeerDay} onChange={(e) => setPricePeerDay(e.target.value)} />
            </div>
            <div className="field">
                <label htmlFor="tripsDay" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>IDทัวร์</label>
                <InputText id="tripsDay" type="text" value={tripsId} onChange={(e) => setTripsId(e.target.value)} />
            </div>

            <div className="field" >
                <label htmlFor="rating" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Rating</label>

                <InputNumber value={rating} onValueChange={(e: any) => setRating(e.value)} min={0} max={10} minFractionDigits={1} />
            </div>
            <div className="field" >
                <label style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>เพิ่มรูปภาพแนะนำ(gallery)</label>
            </div>
            <Button icon="pi pi-plus" onClick={handleAddInput} disabled={inputValues.length >= 5} />
            {renderInputs()}


            <div className='mt-6'>

                <Button label="Upload" icon="pi pi-upload" iconPos="left" className='w-10rem' onClick={handelUpload} />
            </div>
        </div>
    )
}