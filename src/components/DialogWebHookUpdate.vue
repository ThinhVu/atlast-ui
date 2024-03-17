<template>
  <div class="bc:white pb-3 mx-a min-w-400px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <p class="px-4 py-4 f1">Change Webhook</p>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1">
      <t-text v-model="databaseName" class="w-100 mb-4" label="Database"/>
      <t-text v-model="collectionName" class="w-100 mb-4" label="Collection"/>
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
  dbName: String,
  colName: String,
  to: String,
})

const databaseName = ref(props.dbName)
const collectionName = ref(props.colName)
const toURL = ref(props.to)


const updateDbWebHook = async(_id) => {
  const name = trim(databaseName.value)
  const col = trim(collectionName.value)
  const webhookURL = trim(toURL.value)
  const change = {dbName: name, colName: col, to: webhookURL}
  if (isEmpty(name)) {
    notification.err('db name is empty')
    return
  }
  if (isEmpty(col)) {
    notification.err('collection name is empty')
    return
  }
  if (isEmpty(webhookURL)) {
    notification.err('webhook is empty')
    return
  }
  emit('close', change)
}
</script>
