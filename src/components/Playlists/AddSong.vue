<template>
  <q-dialog ref="dialogRef">
    <q-card class="m-card-sm q-px-sm q-pb-sm">
      <q-card-section>
        <div class="text-h6">{{ songId ? "Edit Song" : "Add Song" }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form greedy ref="form" autocomplete="off" aria-autocomplete="off">
          <q-input
            label="Title"
            v-model="title"
            color="dark"
            :rules="songRules.title"
          >
            <template v-slot:prepend>
              <q-icon name="title"></q-icon>
            </template>
          </q-input>

          <q-input
            label="Artist"
            v-model="artist"
            color="dark"
            :rules="songRules.artist"
          >
            <template v-slot:prepend>
              <q-icon name="person"></q-icon>
            </template>
          </q-input>

          <q-input
            label="Link"
            v-model="link"
            color="dark"
            :rules="songRules.link"
          >
            <template v-slot:prepend>
              <q-icon name="link"></q-icon>
            </template>
          </q-input>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-dark">
        <q-btn label="Close" flat color="red" @click="onCancelClick"></q-btn>
        <q-btn
          :label="songId ? 'Edit' : 'Add'"
          type="submit"
          unelevated
          color="dark"
          padding="xs md"
          @click="onOKClick"
          :loading="loading"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import { songRules } from "src/common/validations";
import { useDocument } from "src/composables/useDocument";
import { useQuasar } from "quasar";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  name: "AddSong",
  props: {
    id: {
      type: String,
      required: true,
    },
    playlist: {
      type: Object,
      required: true,
    },
    songId: {
      type: String,
    },
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    // Imports
    const $q = useQuasar();
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const { error, loading, update } = useDocument("playlists", props.id);

    // Data
    const form = ref(null);
    const title = ref("");
    const artist = ref("");
    const link = ref("");

    const findSong = (id) => {
      return props.playlist.songs.find((song) => song.id === id);
    };

    if (props.songId) {
      const {
        title: songTitle,
        artist: songArtist,
        link: songLink,
      } = findSong(props.songId);

      title.value = songTitle;
      artist.value = songArtist;
      link.value = songLink;
    }

    // Methods
    const onOKClick = async () => {
      const isValid = await form.value.validate();
      if (!isValid) return;

      loading.value = true;

      const newSong = {
        id: props.songId ? props.songId : `song_${uuidv4()}`,
        title: title.value,
        artist: artist.value,
        link: link.value,
      };

      let filteredSongs = [];

      if (props.songId) {
        filteredSongs = props.playlist.songs.filter(
          (song) => song.id !== props.songId
        );
      }

      await update({
        songs: props.songId
          ? [newSong, ...filteredSongs]
          : [newSong, ...props.playlist.songs],
      });

      if (error.value) {
        $q.notify({
          type: "negative",
          message: "An error occurred!",
        });
      } else {
        $q.notify({
          type: "positive",
          message: props.songId
            ? "Song was successfully updated!"
            : "Song was successfully added!",
        });
      }

      loading.value = false;
      onDialogOK();
    };

    return {
      dialogRef,
      songRules,
      form,
      title,
      artist,
      link,
      loading,
      onOKClick,
      onCancelClick: onDialogCancel,
    };
  },
});
</script>
