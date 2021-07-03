<template>
  <q-card flat bordered class="auth-card q-pa-md">
    <q-card-section>
      <div class="row justify-center">
        <q-img src="../../assets/logo.png" width="40%" class=""></q-img>
      </div>

      <q-form greedy ref="form" autocomplete="off" aria-autocomplete="off">
        <q-input
          label="Username"
          v-model="username"
          color="dark"
          :rules="userRules.username"
        >
          <template v-slot:prepend>
            <q-icon name="person"></q-icon>
          </template>
        </q-input>
        <q-input
          label="Email address"
          v-model="email"
          color="dark"
          :rules="userRules.email"
        >
          <template v-slot:prepend>
            <q-icon name="email"></q-icon>
          </template>
        </q-input>
        <q-input
          label="Password"
          type="password"
          v-model="password"
          color="dark"
          :rules="userRules.password"
        >
          <template v-slot:prepend>
            <q-icon name="lock"></q-icon>
          </template>
        </q-input>
      </q-form>
    </q-card-section>

    <q-card-actions align="center" vertical>
      <q-btn
        label="Sign up"
        type="submit"
        color="dark"
        unelevated
        padding="sm lg"
        @click="submit"
        :loading="loading"
      ></q-btn>
      <div class="text-subtitle1 q-mt-md">
        Already have an account?
        <a
          class="auth-change relative-position cursor-pointer"
          @click="changeAuthComponent('Login')"
          ><strong>Login</strong></a
        >
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { userRules } from "src/common/validations";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Login",
  setup() {
    // Imports
    const router = useRouter();
    const store = useStore();
    const $q = useQuasar();

    // Data
    const form = ref(null);
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const loading = ref(false);

    // Methods
    const changeAuthComponent = (component) => {
      store.commit("changeAuthComponent", component);
    };

    const submit = async () => {
      const isValid = await form.value.validate();
      if (!isValid) return;

      loading.value = true;

      const { error } = await store.dispatch("signUp", {
        username: username.value,
        email: email.value,
        password: password.value,
      });

      if (error) {
        $q.notify({
          type: "negative",
          message: "An error occurred!",
        });
      } else {
        router.push({ path: "/" });
      }

      loading.value = false;
    };

    return {
      form,
      username,
      email,
      password,
      loading,
      userRules,
      changeAuthComponent,
      submit,
    };
  },
});
</script>

<style></style>
