<script setup>
import {inject, onBeforeMount} from "vue";
import {user} from "@/app-state";
import {userAPI} from "@/api";
import {socketConnect} from "@/socket/socket";
import {useNavigation} from "@/composables/useNavigation";

const {loading, notification} = inject('TSystem')
const nav = useNavigation()

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
</script>

<template>
  <TLoading :action="ACTIONS.AUTH">
    <template #loading>
      <TPulseBlock class="h-100vh w-100vw"/>
    </template>
    <slot></slot>
  </TLoading>
</template>

<style scoped>

</style>