import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";


export const fetchUsersData = async () => {
    try {
        const tripsCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(tripsCollectionRef);

        const usersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return usersData;
    } catch (error) {
        console.log('Error getting users data:', error);
    }
};

export const fetchOrdersData = async () => {
    try {
        const ordersCollectionRef = collection(db, 'orders');
        const querySnapshot = await getDocs(ordersCollectionRef);

        const ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return ordersData;
    } catch (error) {
        console.log('Error getting users data:', error);
    }
};

export const fetchOrdersPlaceData = async () => {
    try {
        const ordersCollectionRef = collection(db, 'orders');
        const q = query(ordersCollectionRef, where('type', '==' ,'PLACE'));
        const querySnapshot = await getDocs(q);

        const ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return ordersData;
    } catch (error) {
        console.log('Error getting users data:', error);
    }
};

export const fetchOrdersHotelsData = async () => {
    try {
        const ordersCollectionRef = collection(db, 'orders');
        const q = query(ordersCollectionRef, where('type', '==' ,'HOTELS'));
        const querySnapshot = await getDocs(q);

        const ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return ordersData;
    } catch (error) {
        console.log('Error getting users data:', error);
    }
};


export const fetchReviewsData = async () => {
    try {
        const reviewsCollectionRef = collection(db, 'reviews');
        const querySnapshot = await getDocs(reviewsCollectionRef);

        const reviewsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return reviewsData;
    } catch (error) {
        console.log('Error getting trips data:', error);
    }
};


export const fetchPublic_RelationsData = async () => {
    try {
        const public_relationsCollectionRef = collection(db, 'public-relations');
        const querySnapshot = await getDocs(public_relationsCollectionRef);

        const public_relationsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return public_relationsData;
    } catch (error) {
        console.log('Error getting trips data:', error);
    }
};

export const fetchNotificationData = async () => {
    try {
        const notificationCollectionRef = collection(db, 'notifys');
        const querySnapshot = await getDocs(notificationCollectionRef);

        const notification = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return notification;
    } catch (error) {
        console.log('Error getting trips data:', error);
    }
};

export const fetchNotificationAdmin = async () => {
    try {
        const notificationCollectionRef = collection(db, 'notification');
        const querySnapshot = await getDocs(notificationCollectionRef);

        const notification = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        return notification;
    } catch (error) {
        console.log('Error getting trips data:', error);
    }
};


export const fetchRecommendedTrips = async () => {
    try {
      const tripsCollectionRef = collection(db, 'trips');
      const querySnapshot = await getDocs(tripsCollectionRef);
  
      const trips = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
  
      const ordersCollectionRef = collection(db, 'orders');
      const querySnapshotOrder = await getDocs(ordersCollectionRef);
  
      // Count the number of orders for each trip
      const tripOrdersCount: { [key: string]: number } = {};
      querySnapshotOrder.forEach((doc) => {
        const tripId = doc.data().tripsId;
        tripOrdersCount[tripId] = (tripOrdersCount[tripId] || 0) + 1;
      });
  
      const sortedTrips = trips.sort((a, b) => {
        const ordersA = tripOrdersCount[a.id] || 0;
        const ordersB = tripOrdersCount[b.id] || 0;
      
        
        if (ordersA > ordersB) {
          return -1;
        } else if (ordersA < ordersB) {
          return 1;
        } else {
          
          return a.id.localeCompare(b.id);
        }
      })

      const recommendedTrips = sortedTrips.slice(0, 5);
  
      return recommendedTrips;
  
    } catch (error) {
      console.log('Error getting trips data:', error);
      return [];
    }
  };