<template>
  <TLoading :action="ACTIONS.AUTH">
    <template #loading>
      <TPulseBlock class="h-100vh w-100vw"/>
    </template>
    <TDashboard v-if="user" :sidebar-items="sidebarItems">
      <template #header>
        <img src="@/assets/images/logo-full.png" alt="logo-full" style="width: 120px;"/>
      </template>
      <template #sidebar-footer>
        <t-btn @click="signOut">Sign out</t-btn>
      </template>
    </TDashboard>
  </TLoading>
</template>
<script setup lang="ts">
import {inject, computed, onBeforeMount} from 'vue';
import {userAPI} from '@/api';
import {user} from '@/app-state';
import {socketConnect} from '@/socket/socket';
import Database from "@/components/Database.vue";
import Billing from "@/components/Billing.vue";
import Setting from "@/components/Setting.vue";
import {useNavigation} from '@/composables/useNavigation'

const nav = useNavigation()

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
  // already logged in from Home
  if (user.value)
    return;
  const access_token = window.localStorage.getItem('access_token')
  if (!access_token) {
    console.log('access_token is missing. go to home.')
    await nav.gotoHome()
    return
  }

  console.log('login using access_token', access_token)

  try {
    loading.begin(ACTIONS.AUTH)
    const {token} = await userAPI.auth(access_token)
    socketConnect(token)
  } catch (e) {
    console.error(e)
    await nav.gotoHome()
  } finally {
    loading.end(ACTIONS.AUTH)
  }
})

const signOut = async() => {
    await userAPI.signOut();
    await nav.gotoHome()
}

//TODO: check sign out function
</script>