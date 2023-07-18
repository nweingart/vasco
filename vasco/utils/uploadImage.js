const uploadImages = async (images) => {
  const uploadPromises = images.map(async (image, position) => { // Add 'position' parameter
    if (!image) return null;

    const response = await fetch(image);
    const blob = await response.blob();

    const storageRef = ref(storage, `images//${position}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at:', downloadURL);
          console.log(downloadURL);
          resolve(downloadURL);
        }
      );
    });
  });

  try {
    const uploadUrls = await Promise.all(uploadPromises);
    console.log('All images uploaded');
    console.log('Image URLs:', uploadUrls);
    return uploadUrls;
  } catch (error) {
    console.log('Failed to upload images:', error);
    return [];
  }
};


