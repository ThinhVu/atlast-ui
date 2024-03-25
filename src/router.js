import {createRouter, createWebHistory} from 'vue-router';
import Dashboard from '@/pages/Dashboard.vue';
import Home from '@/pages/Home.vue'
import Explore from '@/pages/Explore.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: Home},
    {path: '/dashboard', component: Dashboard},
    {path: '/explore/:id', component: Explore}
  ]
}, {default: '/'})

export default router;
