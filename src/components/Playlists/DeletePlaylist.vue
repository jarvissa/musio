<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-px-sm q-pb-sm">
      <q-card-section>
        <div class="text-h6 q-mb-md">Delete Playlist</div>
        <div class="text-subtitle1">
          Are you sure you want to delete this playlist?
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-dark">
        <q-btn label="Close" flat color="red" @click="onCancelClick"></q-btn>
        <q-btn
          label="Delete"
          unelevated
          color="dark"
          padding="xs md"
          :loading="loading"
          @click="onOKClick"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useStore } from "vuex";
import { useStorage } from "src/composables/useStorage";
import { useDocument } from "src/composables/useDocument";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "DeletePlaylist",
  props: {
    id: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    // Imports
    const $q = useQuasar();
    const store = useStore();
    const uid = computed(() => store.getters.getUser.uid);
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const { error: storageError, del: storageDel } = useStorage(uid.value);
    const { error: documentError, del: documentDel } = useDocument(
      "playlists",
      props.id
    );

    // Data
    const loading = ref(false);

    // Methods
    const onOKClick = async () => {
      loading.value = true;

      await storageDel(props.path);

      if (storageError.value) {
        $q.notify({
          type: "negative",
          message: "An error occurred!",
        });
        console.log(storageError.value);

        loading.value = false;
        return;
      }

      await documentDel();

      if (documentError.value) {
        $q.notify({
          type: "negative",
          message: "An error occurred!",
        });
      } else {
        $q.notify({
          type: "positive",
          message: "Playlist was successfully deleted!",
        });
      }

      loading.value = false;

      onDialogOK();
    };

    return {
      dialogRef,
      loading,
      onOKClick,
      onCancelClick: onDialogCancel,
    };
  },
});
</script>

<style></style>
