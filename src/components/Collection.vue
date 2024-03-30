<template>
  <div v-if="!isWebHookShow" class="as-fe ac-fe mb-2 mt-2 ml-2" style="border-bottom: 1px solid #ccc">
    <i class ='fas fa-link as-fe ml-280 fs-20px mr-10 ai-c mb-2' @click="showWebhook"></i>
  </div>
  <p v-if="!isWebHookShow" class ='mt-2 ml-2'>We haven't implemented this feature yet</p>
  <Webhook :isWebHookShow="isWebHookShow" @close="isWebHookShow = false" class="mb-2 mt-2"/>
</template>
<script setup>
import {ref} from 'vue';
import Webhook from '@/components/Webhook.vue'

const isWebHookShow=ref(false)

function showWebhook() {
  isWebHookShow.value = true;
}
</script>

<style scoped>

</style>