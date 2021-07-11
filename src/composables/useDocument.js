import { ref } from "vue";
import { db } from "../firebase/firestore";

export const useDocument = (collection, id) => {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  let documentRef = db.collection(collection).doc(id);

  const add = async (payload) => {
    loading.value = true;

    try {
      const res = await documentRef.set(payload);
      data.value = res;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const update = async (payload) => {
    loading.value = true;

    try {
      const res = await documentRef.update(payload);
      data.value = res;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const del = async () => {
    loading.value = true;

    try {
      await documentRef.delete();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { data, error, loading, add, update, del };
};
