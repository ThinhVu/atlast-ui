<template>
  <div class="bc:white pb-3 mx-a min-w-400px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <p class="px-4 py-4 f1">Create a new webhook</p>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1">
      <t-text v-model="dbName" class="w-100 mb-4" label="Database" placeholder="database name, e.g: inventory"/>
      <t-text v-model="colName" class="w-100 mb-4" label="Collection" placeholder="collection name, e.g: quantity"/>
      <t-text v-model="to" class="w-100 mb-4" label="Webhook URL" placeholder=""/>
    </div>
    <div class="px-3 py-1 fr ai-c jc-fe fg-4px">
      <TBtn @click="emit('close')">Cancel</TBtn>
      <TBtn @click="createDbWebHook" save>Create Webhook</TBtn>
    </div>
  </div>
</template>

<script setup>
import {isEmpty, trim} from "lodash-es";
import {inject, ref} from 'vue'
const emit = defineEmits(['close'])

const {notification} = inject('TSystem')

const dbName = ref('')
const colName = ref('')
const to = ref('')
const createDbWebHook = () => {
  const name = trim(dbName.value)
  const col = trim(colName.value)
  const webhookURL = trim(to.value)
  const data = {dbName: name, colName: col, to: webhookURL}
  if (isEmpty(name)) {
    notification.err('db name is empty')
    return
  }
  if (isEmpty(col)) {
    notification.err('collection name is empty')
    return
  }
  if (isEmpty(webhookURL)) {
    notification.err('collection name is empty')
    return
  }
  emit('close', data)
}
</script>
