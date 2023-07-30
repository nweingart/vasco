import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export const uploadImageToFirebase = async (uri) => {
  let blob;

  try {
    const response = await fetch(uri);
    blob = await response.blob();
  } catch (error) {
    console.error('There was an error creating the blob:', error);
    return;
  }

  const storage = getStorage();
  const imageRef = ref(storage, 'images/' + uuidv4());

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



