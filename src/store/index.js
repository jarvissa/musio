import { store } from "quasar/wrappers";
import { createStore } from "vuex";
import auth from "src/firebase/auth";

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    state: {
      currentAuthComponent: "Login",
      user: null,
    },
    mutations: {
      changeAuthComponent(state, payload) {
        state.currentAuthComponent = payload;
      },

      setUser(state, payload) {
        state.user = payload;
      },
    },
    actions: {
      async signUp({ commit }, payload) {
        const { username, email, password } = payload;

        try {
          await auth.createUserWithEmailAndPassword(email, password);
          const user = auth.currentUser;
          await user.updateProfile({ displayName: username });

          commit("setUser", user);

          return { user, error: null };
        } catch (err) {
          return { user: null, error: err.message };
        }
      },

      async login({ commit }, payload) {
        const { email, password } = payload;

        try {
          const { user } = await auth.signInWithEmailAndPassword(
            email,
            password
          );
          commit("setUser", user);

          return { user, error: null };
        } catch (err) {
          return { user: null, error: err.message };
        }
      },

      async signOut({ commit }) {
        try {
          await auth.signOut();
          commit("setUser", null);

          return { error: null };
        } catch (err) {
          return { error: err.message };
        }
      },
    },
    getters: {
      currentAuthComponent(state) {
        return state.currentAuthComponent;
      },
      
      getUser(state) {
        return state.user;
      },
    },
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
