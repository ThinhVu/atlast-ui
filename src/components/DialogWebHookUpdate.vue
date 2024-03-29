<template>
  <div class="bc:white pb-3 mx-a min-w-400px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <p class="px-4 py-4 f1">Change Webhook</p>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1">
      <p class="mb-1 fs-s c:#1F2328" style="user-select: none">Collection name</p>
      <pre class = "w-100 mb-4 t-text-input br-1 fs-s bc:#d0d7de" style="user-select: none">{{props.colName}}</pre>
      <t-text v-model="toURL" class="w-100 mb-4" label="Webhook URL"/>
    </div>
    <div class="px-3 py-1 fr ai-c jc-fe fg-4px">
      <TBtn @click="emit('close')">Cancel</TBtn>
      <TBtn @click="updateDbWebHook" save>Update Webhook</TBtn>
    </div>
  </div>
</template>

<script setup>
import {isEmpty, trim} from "lodash-es";
import {inject, ref} from 'vue'
import {webhookAPI} from "@/api";

const emit = defineEmits(['close'])

const {notification} = inject('TSystem')

const props = defineProps({
  colName: String,
  to: String,
})

const toURL = ref(props.to)


const updateDbWebHook = async(_id) => {
  const webhookURL = trim(toURL.value)
  const change = {to: webhookURL}
  if (isEmpty(webhookURL)) {
    notification.err('webhook is empty')
    return
  }
  emit('close', change)
}
</script>

<style scoped>
.t-text-input {
    padding: 8px;
    border: 1px solid #d0d7de;
    box-shadow: inset 0 1px 0 rgba(208, 215, 222, 0.2);
}

</style>