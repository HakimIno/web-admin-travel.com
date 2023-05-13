import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { useRef, useState } from "react"
import { db } from "../../../api/firebase"
import { InputTextarea } from "primereact/inputtextarea"
import { InputNumber } from "primereact/inputnumber"
import { Dropdown } from "primereact/dropdown"
import { Toast } from "primereact/toast"

export const AddPackages = () => {
    const toast = useRef<any>(null);
    //State Data
    const [title, setTitle] = useState("")
    const [imageURL, setImageURL] = useState("")
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [tripsDay, setTripsDay] = useState("")
    const [rating, setRating] = useState(0)
    const [price, setPrice] = useState("")
    const [inputValues, setInputValues] = useState(['']);
    const [inputValuesTripsDay, setInputValuesTripsDay] = useState(['']);


    const handleUpload = async () => {
        try {
            const tripsCollectionRef = collection(db, 'trips');
            const querySnapshot = await getDocs(tripsCollectionRef);

            const tripsData = querySnapshot.docs.map((doc) => doc.data());

            const newTrip = {
                id: tripsData.length + 1,
                title: title,
                image: imageURL,
                location: location,
                category: category,
                description: description,
                gallery: inputValues,
                tripsDay: tripsDay,
                rating: rating,
                detailsTripsDay: inputValuesTripsDay,
                price: price,
                type: "PLACE"
            };

            await setDoc(doc(db, "trips", `trips-ID-${tripsData.length + 1}`), newTrip)

            toast.current.show({ severity: 'success', summary: 'สำเร็จ', detail: 'อัปโหลดสำเร็จ', life: 3000 });
            window.location.reload()
            // Reset the form values
            setTitle("");
            setImageURL("");
            setLocation("");
            setDescription("");
            setTripsDay("");
            setRating(0);
            setPrice("");
            setInputValues([""])
            setInputValuesTripsDay([""])

            console.log("Trip data uploaded successfully!");
        } catch (error) {
            console.log('Error uploading trip data:', error);
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



    const handleInputChangeTripsDay = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedValues = [...inputValuesTripsDay];
        updatedValues[index] = e.target.value;
        setInputValuesTripsDay(updatedValues);
    };


    const handleAddInputTripsDay = () => {
        setInputValuesTripsDay([...inputValuesTripsDay, '']);
    };

    const handleRemoveInputTripsDay = (index: any) => {
        const updatedValues = [...inputValuesTripsDay];
        updatedValues.splice(index, 1);
        setInputValuesTripsDay(updatedValues);
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

    const renderInputsTripsDay = () => {
        return inputValuesTripsDay.map((value, index) => (
            <div key={index} className="field my-3 ">
                {index > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div></div>
                        <Button
                            className="p-button-danger p-button-sm p-button-text"
                            icon="pi pi-times"
                            onClick={() => handleRemoveInputTripsDay(index)}
                        />
                    </div>
                )}
                <InputText
                    id={`input-${index}`}
                    type="text"
                    value={value}
                    placeholder='ใส่รายเอียดทริปในแต่ละวัน'
                    onChange={(e) => handleInputChangeTripsDay(e, index)}
                />

            </div>
        ));
    };

    const _category = [
        'ทัวร์ในประเทศ',
        'ทัวร์ยุโรป',
        'ทัวร์แนะนำ',
        'ทัวร์เอเชีย',
        'ทัวร์ทวีปอเมริกา'
    ];


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
                <label htmlFor="category" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>หมวดหมู่</label>
                <Dropdown value={category} onChange={(e) => setCategory(e.value)} options={_category}
                    placeholder="หมวดหมู่" className="w-full md:w-14rem" />
            </div>
            <div className="field">
                <label htmlFor="description" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>รายละเอียด</label>
                <InputTextarea id='description' rows={5} cols={30} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="field" >
                <label style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>เพิ่มรูปภาพแนะนำ(gallery)</label>
            </div>
            <Button icon="pi pi-plus" onClick={handleAddInput} disabled={inputValues.length >= 5} />
            {renderInputs()}
            <div className="field">
                <label htmlFor="tripsDay" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ทัวร์กี่วันกี่คืน</label>
                <InputText id="tripsDay" type="text" value={tripsDay} onChange={(e) => setTripsDay(e.target.value)} />
            </div>
            <div className="field" >
                <label htmlFor="rating" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>Rating</label>
                <InputNumber value={rating} onValueChange={(e: any) => setRating(e.value)} min={0} max={10} minFractionDigits={1} />
            </div>
            <div className="field" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>
                <label  >รายละเอียดทัวร์ในแต่ละวัน</label>
            </div>
            <Button icon="pi pi-plus" onClick={handleAddInputTripsDay} />
            {renderInputsTripsDay()}
            <div className="field">
                <label htmlFor="price" style={{ fontWeight: 'normal', fontSize: 16, marginTop: 10 }}>ราคาแพ็คเกจ</label>
                <InputText id="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div className='mt-6'>

                <Button label="Upload" icon="pi pi-upload" iconPos="left" className='w-10rem' onClick={handleUpload} />
            </div>
        </div>
    )
}