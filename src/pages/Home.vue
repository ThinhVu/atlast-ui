<template>
  <div>
    <div class="bc:#232f3e">
      <div class="fr ai-c jc-fe px-2 py-2 fg-8px">
        <span class="c:#fff">Atlast</span>
        <TSpacer/>
        <TBtn @click="signIn">Sign in</TBtn>
        <TBtn @click="createAnAccount">Create an account</TBtn>
      </div>
    </div>
  </div>
</template>

<script setup>
import {inject} from 'vue'
import {useNavigation} from '@/composables/useNavigation'
import {userAPI} from "@/api";
import {socketConnect} from "@/socket/socket";
import Auth from "@/components/Auth.vue";

const {dialog, notification} = inject('TSystem')
const nav = useNavigation()

async function signIn() {
  const access_token = window.localStorage.getItem('access_token')
  if (access_token) {
    console.log('found access_token. trying to login using access_token')
    try {
      const {token} = await userAPI.auth(access_token)
      socketConnect(token)
      await nav.gotoDashboard()
      return
    } catch (e) {
      console.log('login using access_token failed')
      notification.err(e)
    }
  }

  console.log('show sign-in dialog')
  dialog.show({
    component: Auth,
    data: {mode: 'signIn'}
  })
}

const createAnAccount = () => {
  dialog.show({
    component: Auth,
    data: {mode: 'signUp'}
  })
}
</script>

<style scoped>

</style>