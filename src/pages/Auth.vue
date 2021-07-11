<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
          appear
        >
          <keep-alive>
            <component :is="currentAuthComponent"></component>
          </keep-alive>
        </transition>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import Login from "../components/Auth/Login.vue";
import Signup from "../components/Auth/Signup.vue";

export default defineComponent({
  name: "PageAuth",
  components: {
    Login,
    Signup,
  },
  setup() {
    // Imports
    const store = useStore();

    const currentAuthComponent = computed(
      () => store.getters.currentAuthComponent
    );

    return { currentAuthComponent };
  },
});
</script>
