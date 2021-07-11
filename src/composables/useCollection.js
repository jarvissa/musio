import { ref } from "vue";
import { db } from "../firebase/firestore";

export const useCollection = (collection) => {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const add = async (payload) => {
    loading.value = true;

    try {
      const res = await db.collection(collection).add(payload);
      data.value = res;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { data, error, loading, add };
};
