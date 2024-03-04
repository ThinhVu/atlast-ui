<script setup>
import {ref, computed, inject, onMounted} from 'vue'
import {copyToClipboard} from "@/utils/common";
import {dbAPI} from "@/api";
import TabHeader from "@/components/TabHeader.vue";

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
const tabs = [
  {text: 'Connection string', value: TABS.CONN_STR},
  {text: 'API Key', value: TABS.API_KEY}
]
const tab = ref(TABS.CONN_STR)

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
  <div class="bc:white pb-3 mx-a min-w-600px min-h-300px fc br-2 ovf-h">
    <div class="fr ai-c" style="border-bottom: 1px solid #ddd">
      <TabHeader :tabs="tabs" v-model="tab" class="f1"/>
      <TIcon class="mr-3 clickable" @click="emit('close')">fa fa-times</TIcon>
    </div>

    <div class="px-3 py-3 f1">
      <template v-if="tab === TABS.CONN_STR">
        <TText v-model="connectionStr" multiLine :cols="80" :rows="4" class="f1"/>
      </template>
      <template v-else>
        <div class="fc fg-4px">
          <div v-for="apiKey in apiKeys" :key="apiKey" class="fr ai-c fg-4px">
            <TText v-model="apiKey.key" class="f1"/>
            <TBtn @click="copyApiKey(apiKey)">Copy</TBtn>
          </div>
        </div>
      </template>
    </div>

    <div class="px-3 py-1 fr ai-c jc-fe">
      <TBtn v-if="tab === TABS.CONN_STR" @click="copyConnectionStr" primary>Copy</TBtn>
      <TBtn v-else @click="createApiKey" save>Create API Key</TBtn>
    </div>
  </div>
</template>

<style scoped>

</style>