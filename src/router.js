import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/Login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/Stories",
      name: "stories",
      component: () => import("./views/Stories.vue"),
    },
    {
      path: "/Story/:id",
      name: "storyById",
      component: () => import("./views/StoryById.vue"),
    },
  ],
});

export default router;
