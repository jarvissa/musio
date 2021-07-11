import { ref } from "vue";
import storage from "src/firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const useStorage = (uid) => {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const path = ref(null);

  const upload = async (payload) => {
    loading.value = true;

    path.value = `thumbnails/${uid}/${uuidv4() + payload.name}`;
    const storageRef = storage.ref(path.value);

    try {
      const res = await storageRef.put(payload);
      data.value = await res.ref.getDownloadURL();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const del = async (path) => {
    loading.value = true;

    try {
      await storage.ref().child(path).delete();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const getMetadata = async (path) => {
    loading.value = true;

    const storageRef = storage.ref();

    try {
      const res = await storageRef.child(path).getMetadata();
      data.value = res;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { data, error, loading, path, upload, del, getMetadata };
};
