<template>
  <div class="w-100 h-100 fr ai-c fix z-index-999">
    <div class="px-4 py-4 br-10px mx-a fc fg-16px bc:#fff"
         style="border: 1px solid rgba(255,255,255,0.2); min-width: 300px">
      <div class="ta-c">
        <img src="@/assets/images/logo-full.png" alt="logo-full" style="width: 200px;"/>
      </div>
      <p><t-text v-model="email" class="w-100" label="Email" placeholder="enter your email"/></p>
      <p><t-password v-model="password" class="w-100" label="Password"/></p>
      <div class="fr ai-c fg-4px">
        <t-btn @click="$emit('close')">Cancel</t-btn>
        <TSpacer/>
        <t-btn v-if="mode === 'signUp'" save @click="signUp">Sign Up</t-btn>
        <t-btn v-else primary @click="signIn">Sign In</t-btn>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, inject} from 'vue'
import {userAPI} from '@/api';
import {useNavigation} from "@/composables/useNavigation";
import {socketConnect} from "@/socket/socket";

defineProps({mode: String})
const emit = defineEmits(['close'])

const {notification} = inject('TSystem')
const nav = useNavigation()

const email = ref()
const password = ref()

const signIn = async () => {
  try {
    const {token} = await userAPI.signIn(email.value, password.value)
    socketConnect(token)
    await nav.gotoDashboard()
    emit('close')
  } catch (e) {
    const errMsg = e?.response?.data?.error || e?.message || e
    notification.err(errMsg)
  }
}

const signUp = async () => {
  try {
    const {token} = await userAPI.signUp(email.value, password.value)
    socketConnect(token)
    await nav.gotoDashboard()
    emit('close')
  } catch (e) {
    notification.err(e)
  }
}
</script>
