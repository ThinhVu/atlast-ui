import {createRouter, createWebHistory} from 'vue-router';
import Dashboard from '@/pages/DashboardPage.vue';
import Home from '@/pages/HomePage.vue'
import Explore from '@/pages/ExplorePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: Home},
    {path: '/dashboard', component: Dashboard},
    {path: '/explore/:id', component: Explore}
  ]
}, {default: '/'})

export default router;
