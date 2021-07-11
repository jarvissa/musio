<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-grey-1 text-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-avatar class="q-ml-sm">
          <img src="../assets/logo.png" alt="Musio logo" />
        </q-avatar>

        <q-toolbar-title class="self-center"> Musio </q-toolbar-title>

        <q-btn flat round :loading="loading" icon="logout" @click="signOut">
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above mini bordered class="bg-grey-1">
      <q-list>
        <q-item clickable tag="a" to="/" exact exact-active-class="link">
          <q-item-section avatar>
            <q-icon name="dashboard"></q-icon>
          </q-item-section>

          <q-item-section> Dashboard </q-item-section>
        </q-item>

        <q-item clickable tag="a" to="/playlists" exact exact-active-class="link">
          <q-item-section avatar>
            <q-icon name="library_music"></q-icon>
          </q-item-section>

          <q-item-section> Public Playlists </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",
  setup() {
    // Imports
    const router = useRouter();
    const store = useStore();
    const $q = useQuasar();

    // Data
    const leftDrawerOpen = ref(false);
    const loading = ref(false);

    // Methods
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const signOut = async () => {
      loading.value = true;

      const { error } = await store.dispatch("signOut");

      loading.value = false;

      if (error) {
        $q.notify({
          type: "negative",
          message: "An error occurred!",
        });
      } else {
        router.push({ path: "/auth" });
      }
    };

    return {
      leftDrawerOpen,
      loading,
      toggleLeftDrawer,
      signOut,
    };
  },
});
</script>

<style lang="scss">
.link {
  color: $dark !important;
  background-color: rgba($dark, 0.15) !important;
}
</style>
