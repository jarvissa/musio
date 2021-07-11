const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "Dashboard",
        component: () => import("src/pages/Dashboard.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/playlists",
        name: "Playlists",
        component: () => import("src/pages/PublicPlaylists.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("pages/Auth.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
