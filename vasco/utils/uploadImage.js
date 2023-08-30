import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const uploadImageToFirebase = async (uri) => {
  let blob;

  console.log("URI being uploaded:", uri); // Logging the URI

  try {
    const response = await fetch(uri);
    blob = await response.blob();
    console.log("Blob created:", blob); // Logging the blob
  } catch (error) {
    console.error('There was an error creating the blob:', error);
    return;
  }

  const generateUniqueID = () => {
    return Date.now() + '-' + Math.round(Math.random() * 1000000);
  };

  const storage = getStorage();
  const imageRef = ref(storage, 'images/' + generateUniqueID());

  const uploadTask = uploadBytesResumable(imageRef, blob);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error('There was an error uploading a file to Cloud Storage:', error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}




