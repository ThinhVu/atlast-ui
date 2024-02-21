<template>
  <TLoading :action="ACTIONS.AUTH">
    <template #loading>
      <TPulseBlock class="h-100vh w-100vw"/>
    </template>
    <TDashboard v-if="user" :sidebar-items="sidebarItems">
      <template #header>
        <div class="px-2">Atlast</div>
      </template>
    </TDashboard>
    <Auth v-else/>
  </TLoading>
</template>
<script setup lang="ts">
import {inject, computed, onBeforeMount} from 'vue';
import {userAPI} from '@/api';
import {user} from '@/app-state';
import {socketConnect} from '@/socket/socket';
import Auth from "../components/Auth.vue";

const sidebarUser = [
]

const sidebarItems = computed(() => {
  return sidebarUser
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
</script>
