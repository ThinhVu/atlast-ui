<template>
  <i class ='fas fa-link' @click="showWebhook"></i>
  <Webhook :isWebHookShow="isWebHookShow" @close="isWebHookShow = false"/>
  <div style="height: 50px; background-color: rgba(0,0,0,0.2); color: #fff" class="fr ai-c jc-sb px-2">
    <p>this is collection</p>
    <div class="f1"></div>
    <slot></slot>
  </div>
</template>
<script setup>
import {ref} from 'vue';
import Webhook from '@/components/Webhook.vue'

const isWebHookShow=ref(false)

function showWebhook() {
  isWebHookShow.value = true;
}
</script>