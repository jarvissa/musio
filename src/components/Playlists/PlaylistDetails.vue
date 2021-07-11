<template>
  <q-dialog ref="dialogRef">
    <q-card
      class="m-card-md flex justify-center items-center"
      style="min-height: 600px"
      v-if="!playlist"
    >
      <q-spinner color="dark" size="3em"></q-spinner>
    </q-card>
    <q-card class="m-card-md q-px-lg q-pt-lg q-pb-xs" v-else>
      <div class="row">
        <div class="col col-xs-12 col-sm-4">
          <q-img :src="playlist.thumbnail" class="rounded-borders"></q-img>
          <div class="text-subtitle1 text-grey text-center q-my-sm">
            Created by
            <strong>{{
              playlist.username === username ? "You" : playlist.username
            }}</strong>
          </div>
        </div>

        <q-card-section class="col col-xs-12 col-sm-8 q-py-none">
          <div class="text-h6 m-text-h6 q-mb-xs">{{ playlist.title }}</div>
          <div class="text-caption text-grey">{{ playlist.description }}</div>

          <div
            class="text-caption text-grey q-mt-md q-mb-xs"
            v-if="uid === playlist.uid && playlist.songs.length"
          >
            Hint: Right-click on the song to modify
          </div>
          <div :class="{ 'q-mt-md': uid !== playlist.uid || !playlist.songs.length }">
            <q-list bordered padding class="rounded-borders">
              <q-item-label
                header
                class="m-item-label"
                :class="{ 'q-mb-sm': playlist.songs.length }"
              >
                <span v-if="!playlist.songs.length">No songs available</span>
                <div class="row items-center" v-else>
                  <span>Songs</span>
                  <q-btn
                    round
                    flat
                    color="primary"
                    icon="search"
                    class="q-ml-sm"
                  >
                    <q-popup-edit buttons v-model="search" v-slot="scope">
                      <q-input
                        v-model="scope.value"
                        dense
                        autofocus
                        @keyup.enter="scope.set"
                      >
                        <template v-slot:prepend>
                          <q-icon name="search"></q-icon>
                        </template>
                      </q-input>
                    </q-popup-edit>
                  </q-btn>
                </div>
                <div>
                  <q-btn
                    round
                    flat
                    color="primary"
                    icon="add"
                    @click="updatePlaylist(playlist.id, playlist)"
                    v-if="uid === playlist.uid"
                  >
                  </q-btn>
                </div>
              </q-item-label>

              <q-virtual-scroll style="max-height: 300px" :items="filteredSongs">
                <template v-slot="{ item }">
                  <q-item
                    clickable
                    v-ripple
                    :key="item.id"
                    @click="showSong(item.link)"
                  >
                    <q-item-section>
                      <q-item-label lines="1">{{ item.title }}</q-item-label>
                      <q-item-label caption>{{ item.artist }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-icon name="open_in_new" color="primary"></q-icon>
                    </q-item-section>

                    <q-menu touch-position context-menu v-if="uid === playlist.uid">
                      <q-list dense style="min-width: 100px">
                        <q-item clickable v-close-popup>
                          <q-item-section
                            @click="
                              updatePlaylist(playlist.id, playlist, item.id)
                            "
                            >Edit</q-item-section
                          >
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section @click="deleteSong(item.id, playlist)"
                            >Delete</q-item-section
                          >
                        </q-item>
                        <q-separator></q-separator>
                        <q-item clickable v-close-popup>
                          <q-item-section>Quit</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                </template>
              </q-virtual-scroll>
            </q-list>
          </div>
        </q-card-section>
      </div>

      <q-card-actions align="right" class="text-dark">
        <q-btn label="Close" flat color="red" @click="onCancelClick"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useDialogPluginComponent } from "quasar";
import { getDocument } from "src/composables/getDocument";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import AddSong from "src/components/Playlists/AddSong.vue";
import DeleteSong from "src/components/Playlists/DeleteSong.vue";

export default defineComponent({
  name: "PlaylistDetails",
  props: {
    id: {
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
    const username = computed(() => store.getters.getUser.displayName);
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();

    const { data: playlist } = getDocument("playlists", props.id);

    // Data
    const search = ref("");

    // Computed
    const filteredSongs = computed(() => {
      return playlist.value.songs.filter(
        (song) =>
          song.title.includes(search.value) ||
          song.artist.includes(search.value)
      );
    });

    // Methods
    const updatePlaylist = (id, playlist, songId) => {
      $q.dialog({
        component: AddSong,
        componentProps: {
          id,
          playlist,
          songId,
        },
      });
    };

    const showSong = (link) => {
      window.open(link, "_blank");
    };

    const deleteSong = (id, playlist) => {
      $q.dialog({
        component: DeleteSong,
        componentProps: {
          id,
          playlist,
        },
      });
    };

    return {
      uid,
      username,
      dialogRef,
      playlist,
      search,
      filteredSongs,
      updatePlaylist,
      showSong,
      deleteSong,
      onCancelClick: onDialogCancel,
    };
  },
});
</script>

<style lang="scss" scoped>
.m-item-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
