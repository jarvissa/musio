<template>
  <q-page>
    <q-toolbar class="m-toolbar text-dark">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Dashboard" icon="dashboard" />
      </q-breadcrumbs>

      <q-btn
        flat
        color="dark"
        icon="playlist_add"
        label="Create playlist"
        class="q-ml-auto"
        @click="createPlaylist"
      ></q-btn>
    </q-toolbar>

    <Playlists :isPublic="false" />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Playlists from "../components/Playlists/Playlists.vue";
import CreatePlaylist from "src/components/Playlists/CreatePlaylist.vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "Dashboard",
  components: {
    Playlists,
  },
  setup() {
    // Imports
    const $q = useQuasar();

    // Methods
    const createPlaylist = () => {
      $q.dialog({
        component: CreatePlaylist,
      });
    };

    return {
      createPlaylist,
    };
  },
});
</script>
