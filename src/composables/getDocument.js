import { ref, watchEffect } from "vue";
import { db } from "../firebase/firestore";

export const getDocument = (collection, id) => {
  const data = ref(null);
  const error = ref(null);

  const unsubscribe = db
    .collection(collection)
    .doc(id)
    .onSnapshot(
      (doc) => {
        if (doc.data()) {
          data.value = { id: doc.id, ...doc.data() };
        } else {
          data.value = [];
        }
      },
      (err) => {
        data.value = null;
        error.value = err.message;
      }
    );

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsubscribe());
  });

  return { data, error };
};
