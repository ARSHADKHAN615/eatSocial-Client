import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createContext, useContext } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyBq1WKlTHhaox8Z9UnHA8P7LlIQDmUqQ3g",
  authDomain: "eatsocial-5d508.firebaseapp.com",
  projectId: "eatsocial-5d508",
  storageBucket: "eatsocial-5d508.appspot.com",
  messagingSenderId: "1014613772253",
  appId: "1:1014613772253:web:a5546b577ab833eae9d834",
  measurementId: "G-8ZGZGNFY5E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Analytics
const analytics = getAnalytics(app);
// Initialize Firebase Storage
const storage = getStorage(app);

// useFirebase hook for accessing firebase context
export const useFirebase = () => useContext(FirebaseContext);

// FirebaseProvider for wrapping the app with firebase context provider
export function FirebaseProvider({ children }) {
  const customUpload = (options,dis) => {
    const { onSuccess, onError, file, onProgress } = options;
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `${dis}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress({ percent: progress });
      },
      (error) => {
        onError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //   if (previousImage !== undefined && previousImage !== downloadURL) {
          //     const desertRef = ref(storage, previousImage);
          //     deleteObject(desertRef)
          //       .then(() => {
          //         console.log("deleted");
          //       })
          //       .catch((error) => {
          //         console.log(error);
          //       });
          //   }
          //   setPreviousImage(downloadURL);
          onSuccess(null, downloadURL);
        });
      }
    );
  };

  return (
    <FirebaseContext.Provider value={{ customUpload }}>
      {children}
    </FirebaseContext.Provider>
  );
}
