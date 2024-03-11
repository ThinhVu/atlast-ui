<template>
  <div class="bc:white pb-3 mx-a min-w-400px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <p class="px-4 py-4 f1">Sign In</p>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>
    <div class="px-3 py-3 f1">
        <div class="w-100 h-100 fr ai-c z-index-999">
          <div class="px-4 py-4 br-10px mx-a fc fg-16px"
               style="border: 1px solid rgba(255,255,255,0.2); min-width: 300px">
            <p><t-text v-model="email" class="w-100" label="Email" placeholder="enter your email"/></p>
            <p><t-password v-model="password" class="w-100" label="Password"/></p>
            <div class="fr ai-c jc-fe fg-4px">
              <t-btn @click="signIn" primary>Sign In</t-btn>
              <slot></slot>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {userAPI} from "@/api";
import {useRouter} from "vue-router";

const email = ref()
const password = ref()

const emit = defineEmits(['close'])

const router = useRouter()

const signIn = async () => {
  const token = await userAPI.signIn(email.value, password.value)
  if (token) {
    await router.push({path: '/dashboard'})
  }
  emit('close')
}


</script>