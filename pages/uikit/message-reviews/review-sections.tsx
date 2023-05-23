import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../api/firebase";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { DataView } from "primereact/dataview";
import { Galleria } from "primereact/galleria";
import { fetchReviewsData } from "../../api/fetch-data";

export const Review = () => {

    const [reviewsAll, setReviewsAll] = useState<any>(null)
    const [inside, setInside] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reviewsData = await fetchReviewsData();

                setReviewsAll(reviewsData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, []);


    const removeReviews = async (reviewsId: any) => {
        try {
            setLoading(true);
            const tripRef = doc(db, 'reviews', reviewsId);
            await deleteDoc(tripRef);
            console.log('reviews removed successfully!');
            window.location.reload();
        } catch (error) {
            console.log('Error removing trip:', error);
        } finally {
            setLoading(false);
        }
    };


    const itemTemplate = (reviews: any) => {

        const itemTemplate = (item: any) => {
            return <img src={item} alt={item.alt} height={170} style={{ width: '250px', display: 'block', objectFit: "cover" }} />;
        };

        const thumbnailTemplate = (item: any) => {
            return <img src={item} alt={item.alt} />
        }
        return (

            <div className="col-12" >
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">

                    <Galleria
                        value={reviews.imageReview}
                        showThumbnails={false}
                        showIndicators
                        thumbnail={thumbnailTemplate}
                        showIndicatorsOnItem={true}
                        indicatorsPosition={"bottom"}
                        
                        item={itemTemplate} 
                        />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="flex">
                                <img height={60} width={60} style={{ display: 'block', objectFit: 'cover', borderRadius: 30 }} alt="" src="https://firebasestorage.googleapis.com/v0/b/travelapp12-2eddc.appspot.com/o/images%2F1683718244233.jpg?alt=media&token=be4480bf-59d0-4bcc-90d6-06b1fe418771" />
                                <div className="mx-3">

                                    <div className="text-lg font-bold text-900 ">{reviews.author}</div>
                                    <div className="text-md font-medium text-gray-600 ">{reviews.date}</div>

                                    <Rating value={reviews.rating / 2} readOnly cancel={false} className="mt-1"></Rating>

                                    <div className="flex align-items-center gap-3 mt-3 " style={{ minWidth: '600px' }} >
                                        <p className="text-md line-clamp-2">{reviews.text}</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                            <div>
                                <Button
                                    icon="pi pi-trash"
                                    rounded
                                    outlined
                                    severity="danger"
                                    className="p-button-rounded"
                                    onClick={() => removeReviews(reviews.id)}
                                >
                                </Button>
                            </div>
                       
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <DataView value={reviewsAll} itemTemplate={itemTemplate} />
        </div>

    )
}