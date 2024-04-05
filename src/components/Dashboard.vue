<template>
  <TDashboard v-if="user" :sidebar-items="sidebarItems">
    <template #header>
      <img src="@/assets/images/logo-full.png" alt="logo-full" style="width: 120px;" @click="nav.gotoHome()"/>
    </template>
    <template #sidebar-footer>
      <t-btn @click="signOut">Sign out</t-btn>
    </template>
  </TDashboard>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {userAPI} from '@/api';
import {user} from '@/app-state';
import Database from "@/components/Database.vue";
import Billing from "@/components/Billing.vue";
import Setting from "@/components/Setting.vue";
import {useNavigation} from '@/composables/useNavigation'
const nav = useNavigation()
const sidebarItems = computed(() => {
  return [
    {title: 'Database', icon: 'fas fa-database@16px:#aaa', component: Database},
    {title: 'Billing', icon: 'fas fa-wallet@16px:#aaa', component: Billing},
    {title: 'Setting', icon: 'fas fa-cog@16px:#aaa', component: Setting},
  ]
})
const signOut = async() => {
  await userAPI.signOut();
  await nav.gotoHome()
}
</script>