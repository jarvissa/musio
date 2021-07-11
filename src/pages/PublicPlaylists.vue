<template>
  <q-page>
    <q-toolbar class="m-toolbar text-dark">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Public Playlists" icon="library_music" />
      </q-breadcrumbs>
    </q-toolbar>

    <Playlists />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Playlists from "../components/Playlists/Playlists.vue";

export default defineComponent({
  name: "PublicPlaylists",
  components: {
    Playlists,
  },
});
</script>
