import { ref, watchEffect } from "vue";
import { db } from "../firebase/firestore";

export const getCollection = (collection, query) => {
  const data = ref(null);
  const error = ref(null);

  let collectionRef = db.collection(collection).orderBy("createdAt", "desc");

  if (query) {
    collectionRef = collectionRef.where(...query);
  }

  const unsubscribe = collectionRef.onSnapshot(
    (snapshot) => {
      const res = [];

      snapshot.docs.forEach((doc) => {
        doc.data().createdAt && res.push({ id: doc.id, ...doc.data() });
      });

      data.value = res;
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
