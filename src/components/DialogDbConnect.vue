<script setup>
import {ref, computed, inject, onMounted} from 'vue'
import {copyToClipboard} from "@/utils/common";
import {dbAPI} from "@/api";

const props = defineProps({
  _id: String,
  name: String,
  username: String,
  password: String
})
const emit = defineEmits(['close'])

const {notification} = inject('TSystem')

const TABS = {
  CONN_STR: 1,
  API_KEY: 2
}
const tab = ref(TABS.CONN_STR)
function setTab(newVal) {
  tab.value = newVal
}

const DB_URL = 'mongodb.net'
const REPLICA_SET = 'rs0'
const connectionStr = computed(() => `mongodb://${props.username}:${props.password}@${DB_URL}/?authSource=${props.name}&retryWrites=true&w=majority&replicaSet=${REPLICA_SET}&readPreference=nearest`)

const apiKeys = ref([])
async function loadApiKeys() {
  apiKeys.value = await dbAPI.getApiKeys(props._id)
}
async function createApiKey() {
  await dbAPI.createApiKey(props._id)
  setTimeout(loadApiKeys, 500)
}
async function enableApiKey(apiKey) {
  await dbAPI.enableApiKey(props._id, apiKey)
  setTimeout(loadApiKeys, 500)
}

async function disableApiKey(apiKey) {
  await dbAPI.disableApiKey(props._id, apiKey)
  setTimeout(loadApiKeys, 500)
}


function copyConnectionStr() {
  copyToClipboard(connectionStr.value)
  notification.info('Copied')
  emit('close')
}
function copyApiKey(apiKey) {
  copyToClipboard(apiKey)
}

onMounted(loadApiKeys)
</script>

<template>
  <TBaseDialog title="DB Connect" showCloseIcon class="min-w-600px min-h-200px" @close="emit('close')">
    <template #body>
      <div class="fr ai-c fg-16px">
        <div @click="setTab(TABS.CONN_STR)">Connection String</div>
        <div @click="setTab(TABS.API_KEY)">API Key (Serverless)</div>
      </div>

      <template v-if="tab === TABS.CONN_STR">
        <TText v-model="connectionStr" multiLine :cols="80" :rows="4" class="f1"/>
      </template>
      <template v-else>
        <div v-for="apiKey in apiKeys" :key="apiKey" class="fr ai-c fg-4px">
          <TText v-model="apiKey.key" class="f1"/>
          <TBtn @click="copyApiKey(apiKey)">Copy</TBtn>
        </div>
      </template>
    </template>
    <template #footer>
      <TBtn v-if="tab === TABS.CONN_STR" @click="copyConnectionStr" primary>Copy</TBtn>
      <TBtn v-else @click="createApiKey" save>Create API Key</TBtn>
    </template>
  </TBaseDialog>
</template>

<style scoped>

</style>