<template>
  <TLoading :action="ACTIONS.AUTH">
    <template #loading>
      <TPulseBlock class="h-100vh w-100vw"/>
    </template>
    <TDashboard v-if="user" :sidebar-items="sidebarItems">
      <template #header>
        <div class="px-2">Atlast</div>
      </template>
      <template #sidebar-footer>
        <t-btn @click="signOut">Sign out</t-btn>
      </template>
    </TDashboard>
    <DialogSignIn v-else/>
  </TLoading>
</template>
<script setup lang="ts">
import {inject, computed, onBeforeMount} from 'vue';
import {userAPI} from '@/api';
import {user} from '@/app-state';
import {socketConnect} from '@/socket/socket';
import Database from "../components/Database.vue";
import Billing from "../components/Billing.vue";
import Setting from "../components/Setting.vue";
import DialogSignIn from "../components/DialogSignIn.vue"
import {useRouter} from "vue-router";

const sidebarItems = computed(() => {
  return [
    {title: 'Database', icon: 'fas fa-bar-chart@20px:#aaa', component: Database},
    {title: 'Billing', icon: 'fas fa-key@20px:#aaa', component: Billing},
    {title: 'Setting', icon: 'fas fa-folder@20px:#aaa', component: Setting}
  ]
})

const {loading, notification} = inject('TSystem')

const ACTIONS = {
  AUTH: 'authenticate'
}

onBeforeMount(async () => {
  const access_token = window.localStorage.getItem('access_token')
  if (!access_token) return
  loading.begin(ACTIONS.AUTH)
  try {
    await userAPI.auth(access_token)
    socketConnect(access_token)
  } catch (e) {
    notification.err(e, {duration: 0})
  } finally {
    loading.end(ACTIONS.AUTH)
  }
})

const router = useRouter()
const signOut = async() => {
    await userAPI.signOut();
    await router.push({path: '/'})
}

//TODO: check lại function signOut
</script>