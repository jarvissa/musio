<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="header">
      <q-toolbar class="bg-grey-1 text-dark">
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

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          Essential Links
        </q-item-label>

        <q-item clickable tag="a" target="_blank" :href="'/asfdf'">
          <q-item-section v-if="'logout'" avatar>
            <q-icon :name="'logout'" />
          </q-item-section>

          <q-item-section>
            <q-item-label>cixis</q-item-label>
            <q-item-label caption> sgsgfsf </q-item-label>
          </q-item-section>
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
// import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    // EssentialLink,
  },

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
      essentialLinks: linksList,
      leftDrawerOpen,
      loading,
      toggleLeftDrawer,
      signOut,
    };
  },
});
</script>

<style lang="scss">
.header {
  border-bottom: 1px solid #e0e0e0;
}
</style>
