import {createRouter, createWebHistory} from 'vue-router';
import Dashboard from '@/pages/Dashboard.vue';
import Home from '@/pages/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: Home},
    {path: '/dashboard', component: Dashboard}
  ]
}, {default: '/'})

export default router;
