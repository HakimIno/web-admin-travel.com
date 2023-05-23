import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore"
import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { useRef, useState } from "react"
import { db, storage } from "../../../api/firebase"
import { Toast } from "primereact/toast"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { FileUpload } from "primereact/fileupload"

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

    const [gallery, setGallery] = useState<string[]>([]);

    const handleFileUpload = async (event: any) => {
        const file = event.files[0];
        const storageRef = ref(storage, `images/poster_hotels/${Date.now()}${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURLPoster = await getDownloadURL(storageRef);
        setImageURL(downloadURLPoster)
        toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดรูปสำเร็จ', life: 3000 });
    };

    const handleFileFireUpload = async (event: any) => {
        const files = event.files;
        for (const file of files) {
            const storageRef = ref(storage, `images/gallery_hotels/${Date.now()}${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setGallery((prevGallery: string[]) => [...prevGallery, downloadURL]);
        }
    };

    const handelUpload = async () => {

        const newHotels = {
            title: title,
            image: imageURL,
            map_location: map_location,
            tripsId: tripsId,
            location: location,
            gallery: gallery,
            description: description,
            rating: rating,
            option_room: inputValues,
            pricePeerDay: pricePeerDay,
            type: "HOTELS"
        };

        await addDoc(collection(db, "hotels"), newHotels)

        //await setDoc(doc(db, "hotels", `hotels-ID-${hotelsData.length + 1}`), newTrip)

        toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดสำเร็จ', life: 3000 });

        // Reset the form values
        setTitle("");
        setImageURL("");
        setLocation("");
        setMap_location("");
        setDescription("");
        setRating(0);
        setPricePeerDay("");
        setInputValues([""])

        window.location.reload()
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
                    placeholder='ใส่ตัวเลือกห้อง เช่น ห้องพิเศษ'
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
                <label htmlFor="image" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รูปภาพโปสเตอร์ <span className="text-red-500 text-sm">*เลือกรูปแล้วจะอัปโหลดอัตโนมัติ</span></label>
                <FileUpload mode="basic" name="demo" url="http://localhost:3001/api/upload" accept="image/*" auto maxFileSize={2000000} chooseLabel="เลือกรูป" onUpload={handleFileUpload} />
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
                <label style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>เพิ่มรูปภาพแนะนำ(gallery) <span className="text-red-500 text-sm">* 5 รูป</span></label>
            </div>
            <FileUpload
                name="demo[]"
                url={'http://localhost:3001/api/upload'}
                multiple
                accept="image/*"
                maxFileSize={2000000}
                emptyTemplate={<p className="m-0">ลากและวางไฟล์ที่นี่เพื่ออัปโหลด.</p>}
                onUpload={handleFileFireUpload}
            />

            <div className="field" >
                <label style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>เพิ่มตัวเลือกห้อง</label>
            </div>
            <Button icon="pi pi-plus" aria-label="add" onClick={handleAddInput} />

            {renderInputs()}

            <div className='mt-6'>

                <Button label="Upload" icon="pi pi-upload" iconPos="left" className='w-10rem' onClick={handelUpload} />
            </div>
        </div>
    )
}