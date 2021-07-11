<template>
  <q-dialog ref="dialogRef">
    <q-card
      class="m-card-sm flex justify-center items-center"
      style="min-height: 400px"
      v-if="dialogLoading"
    >
      <q-spinner color="dark" size="3em"></q-spinner>
    </q-card>
    <q-card class="m-card-sm q-px-sm q-pb-sm" v-else>
      <q-card-section>
        <div class="text-h6">
          {{ id ? "Edit Playlist" : "Create Playlist" }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form greedy ref="form" autocomplete="off" aria-autocomplete="off">
          <q-input
            label="Title"
            v-model="title"
            color="dark"
            :rules="playlistRules.title"
          >
            <template v-slot:prepend>
              <q-icon name="title"></q-icon>
            </template>
          </q-input>

          <q-input
            label="Description"
            type="textarea"
            v-model="description"
            color="dark"
            :rules="playlistRules.description"
          >
            <template v-slot:prepend>
              <q-icon name="description"></q-icon>
            </template>
          </q-input>

          <q-file
            label="Thumbnail"
            v-model="thumbnail"
            color="dark"
            accept="image/jpg, image/jpeg, image/png, image/gif, image/svg, image/bmp"
            :rules="playlistRules.thumbnail"
          >
            <template v-slot:prepend>
              <q-icon name="image"></q-icon>
            </template>
          </q-file>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-dark">
        <q-btn label="Close" flat color="red" @click="onCancelClick"></q-btn>
        <q-btn
          :label="id ? 'Edit' : 'Create'"
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
import { defineComponent, ref, computed } from "vue";
import { useDialogPluginComponent } from "quasar";
import { playlistRules } from "src/common/validations";
import { useStore } from "vuex";
import { useStorage } from "src/composables/useStorage";
import { useCollection } from "src/composables/useCollection";
import { useDocument } from "src/composables/useDocument";
import { useQuasar } from "quasar";
import { timestamp } from "src/firebase/firestore";

export default defineComponent({
  name: "CreatePlaylist",
  emits: [...useDialogPluginComponent.emits],
  props: {
    id: {
      type: String,
    },
    playlist: {
      type: Object,
    },
  },
  setup(props) {
    // Imports
    const $q = useQuasar();
    const store = useStore();
    const uid = computed(() => store.getters.getUser.uid);
    const username = computed(() => store.getters.getUser.displayName);
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const {
      data,
      error: storageError,
      path,
      upload,
      del,
      getMetadata,
    } = useStorage(uid.value);
    const { error: collectionError, add } = useCollection("playlists");
    const { error: documentError, update } = useDocument("playlists", props.id);

    // Data
    const form = ref(null);
    const title = ref("");
    const description = ref("");
    const thumbnail = ref(null);
    const loading = ref(false);
    const dialogLoading = ref(props.id ? true : false);

    const findPlaylist = () => {
      return props.playlist;
    };

    const handleImage = async (path, imageUrl) => {
      await getMetadata(path);

      if (storageError.value) {
        $q.notify({
          type: "negative",
          message: "An error occurred!",
        });

        return;
      }

      const image = new Image();
      image.src = imageUrl;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      context.drawImage(image, 0, 0);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, data.value.contentType)
      );

      const fileName = path.split("/")[2];

      blob.name = fileName;
      blob.lastModified = data.value.updated;

      const imageFile = new File([blob], blob.name, {
        type: blob.type,
      });

      return imageFile;
    };

    if (props.id) {
      title.value = findPlaylist().title;
      description.value = findPlaylist().description;

      handleImage(findPlaylist().path).then((res) => {
        thumbnail.value = res;
        dialogLoading.value = false;
      });
    }

    // Methods
    const onOKClick = async () => {
      const isValid = await form.value.validate();
      if (!isValid) return;

      loading.value = true;

      const fileName = props.playlist && props.playlist.path.split("/")[2];

      if (!props.id || (props.id && fileName !== thumbnail.value.name)) {
        await upload(thumbnail.value);
      }

      if (props.id && fileName !== thumbnail.value.name) {
        await del(props.playlist.path);
      }

      if (storageError.value) {
        $q.notify({
          type: "negative",
          message: "An error occurred!",
        });

        loading.value = false;
        return;
      }

      const newPlaylist = {
        title: title.value,
        description: description.value,
        thumbnail:
          fileName === thumbnail.value.name
            ? props.playlist.thumbnail
            : data.value,
        path:
          fileName === thumbnail.value.name ? props.playlist.path : path.value,
      };

      if (props.id) {
        await update(newPlaylist);

        if (documentError.value) {
          $q.notify({
            type: "negative",
            message: "An error occurred!",
          });
        } else {
          $q.notify({
            type: "positive",
            message: "Playlist was successfully updated!",
          });
        }
      } else {
        await add({
          title: title.value,
          description: description.value,
          thumbnail: data.value,
          path: path.value,
          songs: [],
          uid: uid.value,
          username: username.value,
          favs: 0,
          createdAt: timestamp(),
        });

        if (collectionError.value) {
          $q.notify({
            type: "negative",
            message: "An error occurred!",
          });
        } else {
          $q.notify({
            type: "positive",
            message: "Playlist was successfully added!",
          });
        }
      }

      loading.value = false;
      onDialogOK();
    };

    return {
      dialogRef,
      playlistRules,
      form,
      title,
      description,
      thumbnail,
      loading,
      dialogLoading,
      onOKClick,
      onCancelClick: onDialogCancel,
    };
  },
});
</script>

<style></style>
