<template>
  <q-dialog ref="dialogRef">
    <q-card class="q-px-sm q-pb-sm">
      <q-card-section>
        <div class="text-h6 q-mb-md">Delete Song</div>
        <div class="text-subtitle1">
          Are you sure you want to delete this song?
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
import { defineComponent, ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { useDocument } from "src/composables/useDocument";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "DeleteSong",
  props: {
    id: {
      type: String,
      required: true,
    },
    playlist: {
      type: Object,
      required: true,
    },
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    // Imports
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const { error, update } = useDocument("playlists", props.playlist.id);

    // Data
    const loading = ref(false);

    // Methods
    const onOKClick = async () => {
      loading.value = true;

      const filteredSongs = props.playlist.songs.filter(
        (song) => song.id !== props.id
      );

      await update({
        songs: filteredSongs,
      });

      if (error.value) {
        $q.notify({
          type: "negative",
          message: "An error occurred!",
        });
      } else {
        $q.notify({
          type: "positive",
          message: "Song was successfully deleted!",
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
