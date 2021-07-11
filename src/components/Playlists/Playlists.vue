<template>
  <q-spinner
    color="dark"
    size="3em"
    class="m-spinner"
    v-if="!playlists || !favs"
  ></q-spinner>
  <q-table
    v-else
    :title="isPublic ? 'Public Playlists' : 'Your playlists'"
    :rows="filteredPlaylists"
    :columns="columns"
    :visible-columns="visibleColumns"
    no-data-label="No playlists available"
    rows-per-page-label="Playlists per page"
    :pagination="{ rowsPerPage: 10 }"
    class="q-ma-lg"
    flat
    bordered
  >
    <template v-slot:top-right>
      <q-input label="Search..." v-model="search" color="dark" dense>
        <template v-slot:prepend>
          <q-icon name="search"></q-icon>
        </template>
      </q-input>
    </template>
    <template v-slot:body-cell-thumbnail="props">
      <q-td :props="props">
        <q-img :src="props.value" class="m-img-table"></q-img>
      </q-td>
    </template>

    <template v-slot:body-cell-favs="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          color="red"
          icon="favorite"
          v-if="
            uid === props.row.uid ||
            (favs && favs.favs && favs.favs.includes(props.key))
          "
          @click="
            uid !== props.row.uid ? favPlaylist(props.key, props.row) : null
          "
        >
          <q-badge color="dark" floating>{{ props.value }}</q-badge>
        </q-btn>
        <q-btn
          flat
          round
          color="red"
          icon="favorite_outline"
          @click="favPlaylist(props.key, props.row)"
          v-else
        >
          <q-badge color="dark" floating>{{ props.value }}</q-badge>
        </q-btn>
      </q-td>
    </template>

    <template v-slot:body-cell-createdAt="props">
      <q-td :props="props">
        {{ formatDate(props.value) }}
      </q-td>
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          color="primary"
          icon="add"
          @click="addSong(props.key, props.row)"
          v-if="uid === props.row.uid"
        >
        </q-btn>
        <q-btn
          flat
          round
          color="green"
          icon="edit"
          @click="updatePlaylist(props.key, props.row)"
          v-if="uid === props.row.uid"
        ></q-btn>
        <q-btn
          flat
          round
          color="warning"
          icon="info"
          @click="showPlaylist(props.key)"
        ></q-btn>
        <q-btn
          flat
          round
          color="red"
          icon="delete"
          @click="deletePlaylist(props.key, props.row.path)"
          v-if="uid === props.row.uid"
        ></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { getCollection } from "src/composables/getCollection";
import { getDocument } from "src/composables/getDocument";
import { useDocument } from "src/composables/useDocument";
import { useStore } from "vuex";
import { format } from "date-fns";
import { useQuasar } from "quasar";
import PlaylistDetails from "src/components/Playlists/PlaylistDetails.vue";
import CreatePlaylist from "src/components/Playlists/CreatePlaylist.vue";
import DeletePlaylist from "src/components/Playlists/DeletePlaylist.vue";
import AddSong from "src/components/Playlists/AddSong.vue";

export default defineComponent({
  name: "Playlists",
  props: {
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    // Imports
    const $q = useQuasar();
    const store = useStore();
    const uid = computed(
      () => store.getters.getUser && store.getters.getUser.uid
    );

    const { data: playlists, error } = getCollection(
      "playlists",
      props.isPublic ? null : ["uid", "==", uid.value]
    );

    const { data: favs, error: favsError } = getDocument("userFavs", uid.value);

    const {
      error: favError,
      loading,
      add,
    } = useDocument("userFavs", uid.value);

    if (error.value) {
      $q.notify({
        type: "negative",
        message: "An error occurred!",
      });
    }

    // Data
    const columns = [
      { name: "thumbnail", label: "Thumbnail", field: "thumbnail" },
      { name: "title", label: "Title", field: "title", sortable: true },
      { name: "description", label: "Description", field: "description" },
      { name: "favs", label: "Favs", field: "favs", sortable: true },
      { name: "createdAt", label: "Date", field: "createdAt", sortable: true },
      { name: "actions" },
      { name: "path", label: "Path", field: "path" },
      { name: "songs", label: "Songs", field: "songs" },
      { name: "uid", label: "Uid", field: "uid" },
      { name: "username", label: "Username", field: "username" },
    ];
    const visibleColumns = [
      "thumbnail",
      "title",
      "description",
      "favs",
      "createdAt",
      "actions",
    ];
    const search = ref("");

    // Computed
    const filteredPlaylists = computed(() => {
      return playlists.value.filter((playlist) =>
        playlist.title.includes(search.value)
      );
    });

    // Methods
    const favPlaylist = async (id, playlist) => {
      const { error: playlistError, update } = useDocument("playlists", id);

      const isFav =
        favs.value && favs.value.favs && favs.value.favs.includes(id);

      if (isFav) {
        const filteredFavs = favs.value.favs.filter((item) => item !== id);
        await add({
          favs: filteredFavs,
        });
      } else {
        await add(
          !favs.value || !favs.value.favs
            ? { favs: [id] }
            : {
                favs: [id, ...favs.value.favs],
              }
        );
      }

      if (favError.value) {
        console.log(favError.value);
        $q.notify({
          type: "negative",
          message: "An error occurred!",
        });

        return;
      }

      if (isFav) {
        await update({
          favs: playlist.favs - 1,
        });
      } else {
        await update({
          favs: playlist.favs + 1,
        });
      }

      if (playlistError.value) {
        $q.notify({
          type: "negative",
          message: "An error occurred!",
        });
      }
    };

    const showPlaylist = (id) => {
      $q.dialog({
        component: PlaylistDetails,
        componentProps: {
          id,
        },
      });
    };

    const updatePlaylist = (id, playlist) => {
      $q.dialog({
        component: CreatePlaylist,
        componentProps: {
          id,
          playlist,
        },
      });
    };

    const deletePlaylist = (id, path) => {
      $q.dialog({
        component: DeletePlaylist,
        componentProps: {
          id,
          path,
        },
      });
    };

    const addSong = (id, playlist) => {
      $q.dialog({
        component: AddSong,
        componentProps: {
          id,
          playlist,
        },
      });
    };

    const formatDate = (date) => {
      return format(date.toDate(), "dd.MM.y");
    };

    return {
      uid,
      playlists,
      filteredPlaylists,
      favs,
      columns,
      visibleColumns,
      search,
      favPlaylist,
      showPlaylist,
      updatePlaylist,
      deletePlaylist,
      addSong,
      formatDate,
    };
  },
});
</script>

<style lang="scss" scoped>
.m-markup-table {
  .q-skeleton {
    margin-left: auto;
  }
}
</style>
